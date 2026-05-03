<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            // Optimized: Cache these counts to avoid DB hits on every request
            'notifications' => $user ? fn() => Cache::remember("user_{$user->id}_notifications_meta", 60, function () use ($user) {
                return [
                    'unread_count' => $user->unreadNotifications()->count(),
                    'recent' => $user->notifications()->limit(8)->get()
                ];
            }) : null,

            'personalStats' => $user ? fn() => Cache::remember("user_{$user->id}_sidebar_stats", 60, function () use ($user) {
                return [
                    'pending_requests' => $user->receivedContactRequests()->where('status', 'pending')->count(),
                    'unread_messages' => \App\Models\Message::where('receiver_id', $user->id)->where('is_read', false)->count(),
                    'total_connections' => $user->sentContactRequests()->where('status', 'accepted')->count() +
                        $user->receivedContactRequests()->where('status', 'accepted')->count()
                ];
            }) : null,

            'locale' => app()->getLocale(),
            'translations' => function () {
                $locale = app()->getLocale();
                return Cache::remember("translations_{$locale}", 3600, function () use ($locale) {
                    $path = base_path("lang/{$locale}.json");
                    return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
                });
            },
            'all_translations' => fn() => Cache::remember('global_translations', 3600, function () {
                return [
                    'fr' => (file_exists(base_path('lang/fr.json')) ? json_decode(file_get_contents(base_path('lang/fr.json')), true) : []) ?? [],
                    'en' => (file_exists(base_path('lang/en.json')) ? json_decode(file_get_contents(base_path('lang/en.json')), true) : []) ?? [],
                ];
            }),
        ];
    }
}