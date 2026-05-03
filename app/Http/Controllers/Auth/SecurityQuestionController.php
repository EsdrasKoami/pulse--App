<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SecurityQuestionController extends Controller
{
    /** Show the page to enter email and find the security question. */
    public function create()
    {
        return Inertia::render('Auth/ResetPasswordSecurity');
    }

    /** Find the user by email and return their security question. */
    public function getQuestion(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user || !$user->security_question) {
            throw ValidationException::withMessages([
                'email' => ["Aucune question de secours n'est configurée pour ce compte."],
            ]);
        }

        return response()->json([
            'question' => $user->security_question,
        ]);
    }

    /** Verify the answer and reset the password. */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'security_answer' => 'required|string',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::where('email', $request->email)->firstOrFail();

        if (!Hash::check(Str::lower(trim($request->security_answer)), $user->security_answer)) {
            throw ValidationException::withMessages([
                'security_answer' => ['La réponse est incorrecte.'],
            ]);
        }

        $user->forceFill([
            'password' => $request->password, // Automatically hashed by model cast
            'remember_token' => Str::random(60),
        ])->save();

        return redirect()->route('login')->with('status', 'Votre mot de passe a été réinitialisé avec succès.');
    }
}
