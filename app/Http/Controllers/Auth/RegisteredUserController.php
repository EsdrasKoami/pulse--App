<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\CegeEmailRule;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $email = Str::lower(trim($request->email));
        if (!empty($email) && !str_contains($email, '@')) {
            $email .= '@edu.cegeptr.qc.ca';
            $request->merge(['email' => $email]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class , new CegeEmailRule],
            'phone' => ['nullable', 'string', 'max:20'],
            'security_question' => ['required', 'string', 'max:255'],
            'security_answer' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $verificationCode = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // In Laravel 11, we pass the plain strings if 'hashed' cast is present in the model
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'security_question' => $request->security_question,
            'security_answer' => Str::lower(trim($request->security_answer)), // Hashed by model cast
            'password' => $request->password, // Hashed by model cast
            'verification_code' => $verificationCode,
        ]);

        event(new Registered($user));

        // We DON'T login automatically as requested by the user
        // Auth::login($user);
        
        // Redirect to login page with a success status
        return redirect()->route('login')->with('status', 'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.');
    }
}