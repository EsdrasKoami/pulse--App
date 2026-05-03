<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications.
     */
    public function index()
    {
        $user = Auth::user();
        $notifications = [
            'recent' => $user->notifications()->take(50)->get(),
            'unread_count' => $user->unreadNotifications()->count(),
        ];

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
        return back();
    }
}
