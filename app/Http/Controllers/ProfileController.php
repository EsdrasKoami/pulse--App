<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request): Response
    {
        $user = clone $request->user();
        $user->load('interests');

        return Inertia::render('Profile/Show', [
            'user' => $user,
            'isOwnProfile' => true,
        ]);
    }
    public function showUser(User $user): Response
    {
        $user->load('interests');

        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        return Inertia::render('Profile/Show', [
            'user' => $user,
            'isOwnProfile' => $user->id === $currentUser->id,
            'isBlocked' => $currentUser->hasBlocked($user->id),
            'hasBlockedMe' => $user->hasBlocked($currentUser->id),
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function editBio(Request $request): Response
    {
        return Inertia::render('Profile/EditBio', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'allInterests' => \App\Models\Interest::all()->groupBy('category'),
        ]);
    }

    public function editSecurity(Request $request): Response
    {
        return Inertia::render('Profile/EditSecurity', [
            'status' => session('status'),
        ]);
    }

    public function editDanger(Request $request): Response
    {
        return Inertia::render('Profile/EditDanger', [
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'prenom' => $validated['prenom'],
            'nom' => $validated['nom'],
            'name' => trim($validated['prenom'] . ' ' . $validated['nom']),
            'email' => $validated['email'],
            'programme' => $validated['programme'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'visibility' => $validated['visibility'] ?? true,
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path;
        }

        $user->save();

        if (array_key_exists('interests', $validated) && is_array($validated['interests'])) {
            $user->interests()->sync($validated['interests']);
        } else {
            $user->interests()->detach();
        }

        return Redirect::route('profile.edit')->with('success', 'Profil mis à jour avec succès ✓');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}