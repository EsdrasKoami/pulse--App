<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['locale' => 'required|in:fr,en']);
        session()->put('locale', $request->locale);

        return back();
    }
}
