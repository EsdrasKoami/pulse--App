<?php

namespace App\Http\Controllers;

use App\Models\ContactRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ContactRequestController extends Controller
{
    public function index()
    {
        // View pending received requests and accepted connections
        $pendingRequests = Auth::user()->receivedContactRequests()->with('sender')->where('status', 'pending')->get();

        $connections = Auth::user()->sentContactRequests()->where('status', 'accepted')->with('receiver')->get()->map(function ($req) {
            return $req->receiver;
        })
            ->merge(Auth::user()->receivedContactRequests()->where('status', 'accepted')->with('sender')->get()->map(function ($req) {
                return $req->sender;
            }));

        $myInterests = Auth::user()->interests;
        $myCategories = $myInterests->pluck('category')->filter();
        $myDominantCategory = $myCategories->countBy()->sortDesc()->keys()->first();

        $blockedUserIds = Auth::user()->blockedUsers()->pluck('blocked_id')
            ->merge(Auth::user()->blockedBy()->pluck('blocker_id'));

        $excludedUserIds = Auth::user()->sentContactRequests()->pluck('receiver_id')
            ->merge(Auth::user()->receivedContactRequests()->pluck('sender_id'))
            ->merge($blockedUserIds)
            ->merge([Auth::id()]);

        $suggestions = User::whereNotIn('id', $excludedUserIds)
            ->with('interests')
            ->get()
            ->map(function ($user) use ($myInterests, $myDominantCategory) {
                $userInterests = $user->interests;
                $commonInterests = $userInterests->pluck('id')->intersect($myInterests->pluck('id'));
                $score = $commonInterests->count();

                $userCategories = $userInterests->pluck('category')->filter();
                $userDominantCategory = $userCategories->countBy()->sortDesc()->keys()->first();

                $user->match_details = [
                    'common_interests_count' => $commonInterests->count(),
                    'dominant_category_match' => ($userDominantCategory && $userDominantCategory === $myDominantCategory),
                    'score' => $score + (($userDominantCategory && $userDominantCategory === $myDominantCategory) ? 5 : 0)
                ];

                return $user;
            })
            ->sortByDesc('match_details.score')
            ->values()
            ->take(5);

        return Inertia::render('Connections/Index', [
            'pendingRequests' => $pendingRequests,
            'connections' => $connections,
            'suggestions' => $suggestions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        // Prevent self-request
        if ($validated['receiver_id'] == Auth::id()) {
            return back()->with('error', 'Vous ne pouvez pas vous envoyer une demande à vous-même.');
        }

        // Prevent duplicate
        $existing = ContactRequest::where(function ($q) use ($validated) {
            $q->where('sender_id', Auth::id())->where('receiver_id', $validated['receiver_id']);
        })->orWhere(function ($q) use ($validated) {
            $q->where('sender_id', $validated['receiver_id'])->where('receiver_id', Auth::id());
        })->first();

        if ($existing) {
            return back()->with('error', 'Une demande ou connexion existe déjà.');
        }

        ContactRequest::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $validated['receiver_id'],
            'status' => 'pending'
        ]);

        $receiver = User::findOrFail($validated['receiver_id']);
        $receiver->notify(new \App\Notifications\NewContactRequestNotification(Auth::user(), 'received'));

        return back()->with('success', 'Demande envoyée avec succès.');
    }

    public function update(Request $request, ContactRequest $contactRequest)
    {
        // Ensure user is the receiver
        if ($contactRequest->receiver_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);

        $contactRequest->update([
            'status' => $validated['status']
        ]);

        if ($validated['status'] === 'accepted') {
            $contactRequest->sender->notify(new \App\Notifications\NewContactRequestNotification(Auth::user(), 'accepted'));
        }

        return back()->with('success', 'Demande mise à jour.');
    }
}