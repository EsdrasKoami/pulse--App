<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with(['creator', 'participants'])
            ->where('event_date', '>=', now())
            ->orderBy('event_date', 'asc')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'location' => $event->location,
                    'event_date' => $event->event_date->format('Y-m-d H:i'),
                    'max_participants' => $event->max_participants,
                    'creator' => [
                        'id' => $event->creator->id,
                        'name' => $event->creator->full_name,
                        'avatar' => $event->creator->avatar,
                    ],
                    'participants_count' => $event->participants->count(),
                    'is_joined' => $event->isJoinedBy(Auth::user()),
                    'is_full' => $event->isFull(),
                    'is_creator' => $event->creator_id === Auth::id(),
                ];
            });

        // Fetch connections for the Invite modal
        $user = Auth::user();
        $connections = \App\Models\User::whereIn('id', function($query) use ($user) {
            $query->select('sender_id')->from('contact_requests')->where('receiver_id', $user->id)->where('status', 'accepted')
            ->union(
                $query->newQuery()->select('receiver_id')->from('contact_requests')->where('sender_id', $user->id)->where('status', 'accepted')
            );
        })->get(['id', 'prenom', 'nom', 'avatar'])->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->full_name,
                'avatar' => $u->avatar
            ];
        });

        return Inertia::render('Events/Index', [
            'events' => $events,
            'connections' => $connections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'event_date' => 'required|date|after:now',
            'max_participants' => 'nullable|integer|min:1',
        ]);

        $event = Auth::user()->events()->create($validated);

        // Auto-join the creator
        $event->participants()->attach(Auth::id(), ['status' => 'joined']);

        return back()->with('success', 'Événement créé avec succès !');
    }

    public function join(Event $event)
    {
        if ($event->isJoinedBy(Auth::user())) {
            $event->participants()->detach(Auth::id());
            return back()->with('success', 'Vous avez quitté l\'événement.');
        }

        if ($event->isFull()) {
            return back()->with('error', 'L\'événement est complet.');
        }

        $event->participants()->attach(Auth::id(), ['status' => 'joined']);

        return back()->with('success', 'Vous avez rejoint l\'événement !');
    }

    public function invite(Request $request, Event $event, \App\Models\User $user)
    {
        // Prevent inviting if already joined
        if ($event->isJoinedBy($user)) {
            return back()->with('error', 'Cet utilisateur participe déjà.');
        }

        // Send Notification (the bell)
        $user->notify(new \App\Notifications\EventInvitationNotification($event, Auth::user()));

        // Create a direct message with the event info
        \App\Models\Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'content' => "👋 Salut ! Je t'invite à mon événement : **{$event->title}** le {$event->event_date->format('d M à H:i')}. Rejoins-nous dans l'onglet Événements !",
            'is_read' => false,
        ]);

        return back()->with('success', 'Invitation envoyée avec succès !');
    }

    public function destroy(Event $event)
    {
        if ($event->creator_id !== Auth::id()) {
            abort(403);
        }

        $event->delete();

        return back()->with('success', 'Événement supprimé.');
    }
}
