<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use App\Models\UserBlock;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModerationController extends Controller
{
    /**
     * Block a user.
     */
    public function block(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', "Vous ne pouvez pas vous bloquer vous-même.");
        }

        // Add to blocks
        UserBlock::firstOrCreate([
            'blocker_id' => Auth::id(),
            'blocked_id' => $user->id,
        ]);

        // Delete any existing contact requests between them
        ContactRequest::where(function ($q) use ($user) {
            $q->where('sender_id', Auth::id())->where('receiver_id', $user->id);
        })->orWhere(function ($q) use ($user) {
            $q->where('sender_id', $user->id)->where('receiver_id', Auth::id());
        })->delete();

        return back()->with('success', "Utilisateur bloqué avec succès.");
    }

    /**
     * Unblock a user.
     */
    public function unblock(User $user)
    {
        UserBlock::where('blocker_id', Auth::id())
            ->where('blocked_id', $user->id)
            ->delete();

        return back()->with('success', "Utilisateur débloqué.");
    }

    /**
     * Report a user or content.
     */
    public function report(Request $request)
    {
        $validated = $request->validate([
            'reported_id' => 'nullable|exists:users,id',
            'reportable_id' => 'required',
            'reportable_type' => 'required|string',
            'reason' => 'required|string|max:500',
        ]);

        Report::create([
            'reporter_id' => Auth::id(),
            'reported_id' => $validated['reported_id'],
            'reportable_id' => $validated['reportable_id'],
            'reportable_type' => $validated['reportable_type'],
            'reason' => $validated['reason'],
        ]);

        return back()->with('success', "Signalement envoyé. Merci de nous aider à garder la plateforme sûre.");
    }
}
