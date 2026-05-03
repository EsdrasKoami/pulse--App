<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsCompleted
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // If user is logged in but profile is not completed
        if ($user && !$user->profile_completed) {
            // Exclude setup routes, logout, and verification routes to avoid infinite loops
            $excludedRoutes = [
                'profile.setup',
                'profile.setup.store',
                'logout',
                'verification.notice',
                'verification.verify',
                'verification.send',
                'language.store'
            ];

            if (!$request->routeIs($excludedRoutes)) {
                return redirect()->route('profile.setup');
            }
        }

        return $next($request);
    }
}
