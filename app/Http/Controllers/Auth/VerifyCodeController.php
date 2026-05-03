<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Providers\RouteServiceProvider;

class VerifyCodeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if ($user->verification_code !== $request->code) {
            throw ValidationException::withMessages([
                'code' => ['Le code de validation est incorrect.'],
            ]);
        }

        $user->markEmailAsVerified();
        $user->phone_verified_at = now();
        $user->save();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
