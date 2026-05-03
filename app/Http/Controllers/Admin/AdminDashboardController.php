<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;
use App\Models\Interest;
use App\Models\Group;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'new_users_week' => User::where('created_at', '>=', now()->subWeek())->count(),
                'total_posts' => Post::count(),
                'total_groups' => Group::count(),
                'total_interests' => Interest::count(),
                'total_reports' => Report::count(),
            ],
            'recent_users' => User::latest()->take(5)->get(),
            'pending_reports' => Report::with(['reporter', 'reported'])->latest()->take(5)->get(),
        ]);
    }
}
