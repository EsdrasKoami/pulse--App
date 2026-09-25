<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::select('id', 'name', 'prenom', 'nom', 'email', 'is_admin', 'is_banned', 'ban_reason', 'programme', 'avatar', 'created_at')
                ->latest()
                ->paginate(20)
        ]);
    }

    public function toggleBan(Request $request, User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Vous ne pouvez pas vous bloquer vous-même.');
        }

        $user->update([
            'is_banned' => !$user->is_banned,
            'ban_reason' => $request->reason ?? ($user->is_banned ? null : 'Violation des conditions d\'utilisation')
        ]);

        $status = $user->is_banned ? 'bloqué' : 'débloqué';
        return back()->with('success', "Utilisateur $status avec succès.");
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'is_admin' => 'boolean',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Automatically hashed
            'is_admin' => $request->is_admin ?? false,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Utilisateur créé avec succès.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'is_admin' => 'boolean',
            'is_banned' => 'boolean',
            'ban_reason' => 'nullable|string|max:255',
        ]);

        $user->update($request->only(['name', 'email', 'is_admin', 'is_banned', 'ban_reason']));

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $user->update(['password' => $request->password]); // Automatically hashed
        }

        return redirect()->route('admin.users.index')->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }
        
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Utilisateur supprimé avec succès.');
    }
}
