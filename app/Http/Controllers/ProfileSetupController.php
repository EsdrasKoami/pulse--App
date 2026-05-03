<?php

namespace App\Http\Controllers;

use App\Models\Interest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileSetupController extends Controller
{
    /** Show the setup wizard (redirect if already completed). */
    public function show(Request $request): Response|RedirectResponse
    {
        if ($request->user()->profile_completed) {
            return redirect()->route('dashboard');
        }

        $interests = Interest::where('active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get(['id', 'name', 'category', 'icon']);

        $user = $request->user();
        
        // Attempt to pre-fill prenom/nom from the 'name' field if they are empty
        $prenom = $user->prenom;
        $nom = $user->nom;
        
        if (empty($prenom) && empty($nom) && !empty($user->name)) {
            $parts = explode(' ', trim($user->name));
            $prenom = $parts[0] ?? '';
            $nom = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : '';
        }

        return Inertia::render('Profile/Setup', [
            'interests' => $interests,
            'initialData' => [
                'prenom' => $prenom,
                'nom' => $nom,
                'phone' => $user->phone ?? '',
            ]
        ]);
    }

    /** Save all profile data at once and mark as completed. */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'prenom' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:20'],
            'programme' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:200'],
            'interests' => ['required', 'array', 'min:3'],
            'interests.*' => ['integer', 'exists:interests,id'],
            'avatar' => ['nullable', 'image', 'max:2048'], // 2 MB max
            'visibility' => ['required', 'in:public,anonyme'],
        ]);

        $user = $request->user();

        // Handle avatar upload — prefix with /storage/ so URLs resolve correctly
        $avatarPath = $user->avatar;
        if ($request->hasFile('avatar')) {
            if ($avatarPath) {
                // Strip /storage/ prefix to get the disk-relative path before deleting
                Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $avatarPath), '/'));
            }
            $avatarPath = '/storage/' . $request->file('avatar')->store('avatars', 'public');
        }

        $user->update([
            'prenom' => $validated['prenom'],
            'nom' => $validated['nom'],
            'phone' => $validated['phone'] ?? $user->phone,
            'programme' => $validated['programme'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'avatar' => $avatarPath,
            'visibility' => $validated['visibility'] === 'public', // convert string → boolean
            'profile_completed' => true,
        ]);

        // Sync interests (pivot)
        $user->interests()->sync($validated['interests']);

        return redirect()->route('dashboard');
    }
}