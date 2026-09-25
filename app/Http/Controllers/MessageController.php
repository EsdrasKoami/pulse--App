<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(?User $user = null)
    {
        $authUserId = Auth::id();
        $blockedUserIds = Auth::user()->blockedUsers()->pluck('blocked_id')
            ->merge(Auth::user()->blockedBy()->pluck('blocker_id'))
            ->toArray();

        // Get all accepted connections (sent or received)
        $connections = Auth::user()->sentContactRequests()
            ->where('status', 'accepted')
            ->whereNotIn('receiver_id', $blockedUserIds)
            ->with(['receiver'])
            ->get()
            ->map(fn($req) => $req->receiver)
            ->merge(
                Auth::user()->receivedContactRequests()
                    ->where('status', 'accepted')
                    ->whereNotIn('sender_id', $blockedUserIds)
                    ->with(['sender'])
                    ->get()
                    ->map(fn($req) => $req->sender)
            )
            ->unique('id')
            ->map(function ($connection) use ($authUserId) {
                // Get last message for this connection
                $lastMsg = Message::where(
                    function ($q) use ($authUserId, $connection) {
                    $q->where('sender_id', $authUserId)->where('receiver_id', $connection->id);
                }
                )->orWhere(
                        function ($q) use ($authUserId, $connection) {
                        $q->where('sender_id', $connection->id)->where('receiver_id', $authUserId);
                    }
                    )
                    ->latest()
                    ->first();

                // Count unread messages from this connection
                $unreadCount = Message::where('sender_id', $connection->id)
                    ->where('receiver_id', $authUserId)
                    ->where('is_read', false)
                    ->count();

                return [
                    'id' => $connection->id,
                    'name' => $connection->full_name,
                    'avatar' => $connection->avatar,
                    'role' => $connection->programme,
                    'last_message' => $lastMsg ? $lastMsg->content : null,
                    'last_message_time' => $lastMsg ? $lastMsg->created_at->format('H:i') : null,
                    'unread_count' => $unreadCount,
                    'is_online' => false, // Placeholder for future real-time status
                ];
            });

        $messages = [];
        if ($user && $user->id) {
            // Verify connected
            $isConnected = ContactRequest::where(function ($q) use ($user, $authUserId) {
                $q->where('sender_id', $authUserId)->where('receiver_id', $user->id);
            })->orWhere(function ($q) use ($user, $authUserId) {
                $q->where('sender_id', $user->id)->where('receiver_id', $authUserId);
            })->where('status', 'accepted')->exists();

            // Check if blocked
            if (Auth::user()->hasBlocked($user->id) || $user->hasBlocked(Auth::id())) {
                abort(403, 'Vous ne pouvez pas communiquer avec cet utilisateur.');
            }

            if (!$isConnected) {
                abort(403, 'Vous devez être connecté pour envoyer un message.');
            }

            // Mark incoming messages as read
            Message::where('sender_id', $user->id)
                ->where('receiver_id', $authUserId)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            // Get chat history
            $messages = Message::where(function ($q) use ($user, $authUserId) {
                $q->where('sender_id', $authUserId)->where('receiver_id', $user->id);
            })->orWhere(function ($q) use ($user, $authUserId) {
                $q->where('sender_id', $user->id)->where('receiver_id', $authUserId);
            })->orderBy('created_at', 'asc')->get();
        }

        // Fetch the user's groups
        $groups = Auth::user()->groups()->where('type', 'private')->get()->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name,
                'avatar' => $group->avatar,
                'type' => 'group',
                'member_count' => $group->users()->count(),
            ];
        });

        return Inertia::render('Messages/Index', [
            'messages' => $messages,
            'chatUser' => $user ? [
                'id' => $user->id,
                'name' => $user->full_name,
                'avatar' => $user->avatar,
                'programme' => $user->programme
            ] : null,
            'connections' => $connections,
            'groups' => $groups
        ]);
    }

    public function store(Request $request, User $user)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:2000'
        ]);

        $authUserId = Auth::id();

        if (Auth::user()->hasBlocked($user->id) || $user->hasBlocked($authUserId)) {
            abort(403, 'Communication impossible.');
        }

        // Security check: ensure an accepted connection exists
        $isConnected = ContactRequest::where(function ($q) use ($user, $authUserId) {
            $q->where('sender_id', $authUserId)->where('receiver_id', $user->id);
        })->orWhere(function ($q) use ($user, $authUserId) {
            $q->where('sender_id', $user->id)->where('receiver_id', $authUserId);
        })->where('status', 'accepted')->exists();

        if (!$isConnected) {
            abort(403, 'Vous devez être connecté avec cet utilisateur pour lui envoyer un message.');
        }

        Message::create([
            'sender_id' => $authUserId,
            'receiver_id' => $user->id,
            'content' => $validated['content'],
            'is_read' => false
        ]);

        $user->notify(new \App\Notifications\NewMessageNotification(Auth::user(), $validated['content']));

        return back();
    }
}