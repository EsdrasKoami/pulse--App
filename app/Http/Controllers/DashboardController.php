<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\ContactRequest;
use App\Models\Story;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user()->load('interests');
        $userId = $currentUser->id;

        // 1. Get blocked users (always fresh as it's small)
        $blockedUserIds = $currentUser->blockedUsers()->pluck('blocked_id')
            ->merge($currentUser->blockedBy()->pluck('blocker_id'))
            ->toArray();

        // 2. Cache Friend IDs (O(1) retrieval after first hit)
        $friendIds = Cache::remember("user_{$userId}_friend_ids", 300, function () use ($currentUser) {
            return ContactRequest::where('status', 'accepted')
                ->where(function ($q) use ($currentUser) {
                    $q->where('sender_id', $currentUser->id)
                        ->orWhere('receiver_id', $currentUser->id);
                })
                ->get()
                ->map(fn($req) => $req->sender_id === $currentUser->id ? $req->receiver_id : $req->sender_id)
                ->unique()
                ->toArray();
        });

        // 3. Cache Recommendations (Most expensive part)
        $sortedProfiles = Cache::remember("user_{$userId}_recommendations", 600, function () use ($currentUser, $blockedUserIds) {
            $users = User::where('id', '!=', $currentUser->id)
                ->whereNotIn('id', $blockedUserIds)
                ->whereIn('visibility', [true, 1, 'public'])
                ->with('interests')
                ->get();

            $myInterests = $currentUser->interests->pluck('id')->toArray();
            $myCategories = $currentUser->interests->pluck('category')->unique()->toArray();
            $myInterestNames = $currentUser->interests->pluck('name')->toArray();
            
            $recommendationService = new \App\Services\RecommendationService();
            $defaultAvatars = [
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
                'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
            ];

            return $users->map(function ($user) use ($currentUser, $myInterestNames, $myCategories, $defaultAvatars, $recommendationService) {
                $matchScore = $recommendationService->calculateMatchScore(
                    $myInterestNames,
                    $user->interests->pluck('name')->toArray(),
                    $myCategories,
                    $user->interests->pluck('category')->unique()->toArray()
                );

                if ($currentUser->programme && $user->programme && strtolower(trim($currentUser->programme)) === strtolower(trim($user->programme))) {
                    $matchScore += 30;
                }

                $matchScore = min(max($matchScore, mt_rand(10, 25)), 99);

                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'role' => strpos(strtolower($user->email), '@cegeptr.qc.ca') !== false ? 'Professeur' : 'Étudiant',
                    'program' => $user->programme ?? 'Non spécifié',
                    'matchPercentage' => $matchScore,
                    'interests' => $user->interests->pluck('name')->toArray(),
                    'avatar' => $user->avatar ?? $defaultAvatars[$user->id % count($defaultAvatars)],
                ];
            })->sortByDesc('matchPercentage')->values()->all();
        });

        // 4. Enrich profiles with connection status (Always fresh)
        $sentRequests = ContactRequest::where('sender_id', $userId)->get(['receiver_id', 'status'])->keyBy('receiver_id');
        $receivedRequests = ContactRequest::where('receiver_id', $userId)->get(['sender_id', 'status'])->keyBy('sender_id');

        foreach ($sortedProfiles as &$profile) {
            $status = 'none';
            $isFriend = false;
            if (isset($sentRequests[$profile['id']])) {
                $status = $sentRequests[$profile['id']]->status === 'accepted' ? 'accepted' : 'sent_pending';
                $isFriend = $status === 'accepted';
            } elseif (isset($receivedRequests[$profile['id']])) {
                $status = $receivedRequests[$profile['id']]->status === 'accepted' ? 'accepted' : 'received_pending';
                $isFriend = $status === 'accepted';
            }
            $profile['connection_status'] = $status;
            $profile['is_connection'] = $isFriend;
        }

        // 5. Feed logic: Only show posts from self and friends (Latest posts should be fresh)
        $feedUserIds = array_merge([$userId], $friendIds);
        $posts = Post::whereIn('user_id', $feedUserIds)
            ->whereNotIn('user_id', $blockedUserIds)
            ->with(['user', 'likes', 'comments.user'])
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn($post) => [
                'id' => $post->id,
                'content' => $post->content,
                'image_url' => $post->image_url,
                'created_at' => $post->created_at->diffForHumans(),
                'user' => ['id' => $post->user->id, 'name' => $post->user->full_name, 'avatar' => $post->user->avatar],
                'comments' => $post->comments->map(fn($c) => [
                    'id' => $c->id, 'content' => $c->content, 'created_at' => $c->created_at->diffForHumans(),
                    'user' => ['id' => $c->user->id, 'name' => $c->user->full_name, 'avatar' => $c->user->avatar]
                ]),
                'likes_count' => $post->likes->count(),
                'is_liked' => $post->isLikedBy($currentUser),
            ]);

        // 6. Active Stories
        $activeStories = Story::active()
            ->whereIn('user_id', $feedUserIds)
            ->with(['user', 'likes'])
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id' => $s->id, 'image_url' => $s->image_url,
                'user' => ['id' => $s->user->id, 'name' => $s->user->full_name, 'avatar' => $s->user->avatar],
                'likes_count' => $s->likes->count(),
                'is_liked' => $s->isLikedBy($currentUser),
                'created_at' => $s->created_at->toIso8601String(),
            ]);

        // 7. Personal Stats (Cached for 1 min)
        $stats = Cache::remember("user_{$userId}_dashboard_stats", 60, function () use ($currentUser, $userId, $friendIds) {
            return [
                'matches' => count($friendIds),
                'pendingRequests' => ContactRequest::where('receiver_id', $userId)->where('status', 'pending')->count(),
                'interests' => $currentUser->interests()->count(),
                'posts' => $currentUser->posts()->count(),
                'comments' => \App\Models\Comment::where('user_id', $userId)->count(),
                'likesReceived' => \App\Models\Like::whereHas('post', fn($q) => $q->where('user_id', $userId))->count(),
            ];
        });

        // 8. Recent Interactions
        $interactions = Cache::remember("user_{$userId}_recent_interactions", 60, function () use ($userId) {
            $likes = \App\Models\Like::whereHas('post', fn($q) => $q->where('user_id', $userId))
                ->with(['user', 'post'])->latest()->limit(5)->get()->map(fn($l) => [
                    'id' => 'like_' . $l->id, 'type' => 'like', 'user_name' => $l->user->full_name,
                    'user_avatar' => $l->user->avatar, 'post_id' => $l->post_id, 'time' => $l->created_at->diffForHumans(),
                ]);

            $comments = \App\Models\Comment::whereHas('post', fn($q) => $q->where('user_id', $userId))
                ->where('user_id', '!=', $userId)
                ->with(['user', 'post'])->latest()->limit(5)->get()->map(fn($c) => [
                    'id' => 'comment_' . $c->id, 'type' => 'comment', 'user_name' => $c->user->full_name,
                    'user_avatar' => $c->user->avatar, 'post_id' => $c->post_id, 'time' => $c->created_at->diffForHumans(),
                    'preview' => \Illuminate\Support\Str::limit($c->content, 50),
                ]);

            return $likes->concat($comments)->sortByDesc('time')->values()->all();
        });

        return Inertia::render('Dashboard', [
            'stories' => $activeStories,
            'posts' => $posts,
            'profiles' => $sortedProfiles,
            'personalStats' => array_merge($stats, ['interactions' => $interactions])
        ]);
    }
}