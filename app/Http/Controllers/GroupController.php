<?php

namespace App\Http\Controllers;

use App\Models\Interest;
use App\Models\User;
use App\Models\Group;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    public function index()
    {
        // Get all unique categories
        $categories = Interest::select('category')->distinct()->pluck('category');

        // Count users in each category
        $interestGroups = $categories->map(function ($category) {
            $memberCount = User::whereHas(
                'interests',
                function ($query) use ($category) {
                    $query->where('category', $category);
                }
            )->whereIn('visibility', [true, 1, 'public'])->count();

            $hash = crc32($category);
            $hue = $hash % 360;

            return [
                'id' => strtolower(str_replace(' ', '-', $category)),
                'name' => $category,
                'member_count' => $memberCount,
                'hue' => $hue,
                'type' => 'category'
            ];
        })->filter(fn($g) => $g['member_count'] > 0);

        // Get user-created groups
        $userGroups = Auth::user()->groups()->withCount('members')->get()->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name,
                'member_count' => $group->members_count,
                'type' => 'private',
                'avatar' => $group->avatar
            ];
        });

        $allGroups = $userGroups->concat($interestGroups)->sortByDesc('member_count')->values()->all();

        return Inertia::render('Groups/Index', [
            'groups' => $allGroups
        ]);
    }

    public function show($id)
    {
        // Check if it's a private group (numeric ID)
        if (is_numeric($id)) {
            $group = Group::with(['members', 'creator'])->findOrFail($id);

            // Check membership
            if (!$group->members->contains(Auth::id())) {
                return redirect()->route('groups.index')->with('error', 'Vous n\'êtes pas membre de ce groupe.');
            }

            // If admin, get connections to allow adding new members
            $connections = [];
            if ($group->creator_id === Auth::id()) {
                $connections = Auth::user()->sentContactRequests()
                    ->where('status', '=', 'accepted')
                    ->with(['receiver'])
                    ->get()
                    ->map(fn($req) => $req->receiver)
                    ->merge(
                        Auth::user()->receivedContactRequests()
                            ->where('status', '=', 'accepted')
                            ->with(['sender'])
                            ->get()
                            ->map(fn($req) => $req->sender)
                    )
                    ->unique('id')
                    ->map(fn($u) => [
                        'id' => $u->id,
                        'name' => $u->full_name,
                        'avatar' => $u->avatar,
                        'role' => $u->programme ?? 'Étudiant'
                    ])->values();
            }

            return Inertia::render('Groups/Show', [
                'group' => [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'creator' => $group->creator->full_name,
                    'is_admin' => $group->creator_id === Auth::id()
                ],
                'profiles' => $group->members->map(fn($u) => [
                    'id' => $u->id,
                    'name' => $u->full_name,
                    'role' => $u->programme ?? 'Étudiant',
                    'avatar' => $u->avatar
                ]),
                'messages' => $group->messages()->with('user')->orderBy('created_at', 'asc')->get()->map(fn($m) => [
                    'id' => $m->id,
                    'user_id' => $m->user_id,
                    'content' => $m->content,
                    'time' => $m->created_at->format('H:i'),
                    'user_name' => $m->user->name,
                    'user_avatar' => $m->user->avatar
                ]),
                'connections' => $connections,
                'is_private' => true
            ]);
        }

        // Category logic
        $categoryName = str_replace('-', ' ', $id);
        $currentUser = Auth::user()->load('interests');
        $users = User::where('id', '!=', $currentUser->id)
            ->whereIn('visibility', [true, 1, 'public'])
            ->whereHas('interests', function ($query) use ($categoryName) {
                $query->where('category', 'LIKE', $categoryName);
            })
            ->with('interests')
            ->get();

        $defaultAvatars = [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1492562080023-ab3b95cb1ce4?auto=format&fit=crop&q=80&w=200&h=200'
        ];

        $myInterests = $currentUser->interests->pluck('id')->toArray();
        $sentRequests = \App\Models\ContactRequest::where('sender_id', $currentUser->id)->pluck('receiver_id')->toArray();
        $receivedRequests = \App\Models\ContactRequest::where('receiver_id', $currentUser->id)->pluck('sender_id')->toArray();
        $myConnections = array_unique(array_merge($sentRequests, $receivedRequests));

        $profiles = $users->map(function ($user) use ($currentUser, $myInterests, $defaultAvatars, $myConnections) {
            $theirInterests = $user->interests->pluck('id')->toArray();
            $exactMatches = array_intersect($myInterests, $theirInterests);
            $matchScore = 50;
            if ($currentUser->programme && $user->programme && strtolower(trim($currentUser->programme)) === strtolower(trim($user->programme))) {
                $matchScore += 20;
            }
            $matchScore += count($exactMatches) * 15;
            $matchScore = min($matchScore, 99);

            return [
                'id' => $user->id,
                'name' => $user->full_name,
                'role' => strpos(strtolower($user->email), '@cegeptr.qc.ca') !== false ? 'Professeur' : 'Étudiant',
                'program' => $user->programme ?? 'Non spécifié',
                'matchPercentage' => $matchScore,
                'interests' => $user->interests->pluck('name')->toArray(),
                'avatar' => $user->avatar ?? $defaultAvatars[$user->id % count($defaultAvatars)],
                'is_connection' => in_array($user->id, $myConnections)
            ];
        });

        return Inertia::render('Groups/Show', [
            'category' => [
                'id' => $id,
                'name' => ucwords($categoryName)
            ],
            'profiles' => $profiles->sortByDesc('matchPercentage')->values()->all(),
            'is_private' => false
        ]);
    }

    public function create()
    {
        // Get all accepted connections
        $connections = Auth::user()->sentContactRequests()
            ->where('status', '=', 'accepted')
            ->with(['receiver'])
            ->get()
            ->map(fn($req) => $req->receiver)
            ->merge(
                Auth::user()->receivedContactRequests()
                    ->where('status', '=', 'accepted')
                    ->with(['sender'])
                    ->get()
                    ->map(fn($req) => $req->sender)
            )
            ->unique('id')
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->full_name,
                'avatar' => $u->avatar,
                'role' => $u->programme ?? 'Étudiant'
            ])->values();

        return Inertia::render('Groups/Create', [
            'friends' => $connections
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'members' => 'required|array|min:1',
            'members.*' => 'exists:users,id'
        ]);

        // Security check: must be a connection
        $connectionIds = Auth::user()->sentContactRequests()
            ->where('status', '=', 'accepted')
            ->pluck('receiver_id')
            ->merge(
                Auth::user()->receivedContactRequests()
                    ->where('status', '=', 'accepted')
                    ->pluck('sender_id')
            )
            ->toArray();

        foreach ($validated['members'] as $memberId) {
            if (!in_array($memberId, $connectionIds)) {
                return back()->withErrors(['members' => "Un ou plusieurs membres ne font pas partie de vos connexions."]);
            }
        }

        $group = Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'creator_id' => Auth::id(),
        ]);

        // Attach members
        $group->members()->attach($validated['members'], ['role' => 'member']);
        // Attach creator as admin
        $group->members()->attach(Auth::id(), ['role' => 'admin']);

        return redirect()->route('groups.index')->with('success', 'Groupe créé avec succès !');
    }

    public function storeMessage(Request $request, $id)
    {
        $group = Group::findOrFail($id);

        if (!$group->members->contains(Auth::id())) {
            return redirect()->route('groups.index')->with('error', 'Vous n\'êtes pas membre de ce groupe.');
        }

        $validated = $request->validate([
            'content' => 'required|string|max:2000'
        ]);

        $group->messages()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content']
        ]);

        return back();
    }

    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);

        if ($group->creator_id !== Auth::id()) {
            return back()->with('error', 'Seul le créateur peut modifier ce groupe.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'members' => 'nullable|array',
            'members.*' => 'exists:users,id'
        ]);

        $group->update([
            'name' => $validated['name'],
            'description' => $validated['description']
        ]);

        if (isset($validated['members'])) {
            // Re-attach members while keeping roles or just sync
            // For simplicity, we sync and ensure creator is always admin
            $membersToSync = collect($validated['members'])->mapWithKeys(function($id) {
                return [$id => ['role' => 'member']];
            })->toArray();
            
            $membersToSync[Auth::id()] = ['role' => 'admin'];
            
            $group->members()->sync($membersToSync);
        }

        return back()->with('success', 'Groupe mis à jour !');
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);

        if ($group->creator_id !== Auth::id()) {
            return back()->with('error', 'Seul le créateur peut supprimer ce groupe.');
        }

        $group->delete();

        return redirect()->route('groups.index')->with('success', 'Groupe supprimé.');
    }
}