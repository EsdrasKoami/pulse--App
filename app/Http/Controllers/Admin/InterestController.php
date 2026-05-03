<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Interest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class InterestController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Interests/Index', [
            'interests' => Interest::orderBy('category')->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:interests',
            'category' => 'required|string|max:100',
            'icon' => 'nullable|string|max:50',
            'active' => 'boolean'
        ]);

        Interest::create($validated);

        return back()->with('success', 'Intérêt ajouté avec succès.');
    }

    public function update(Request $request, Interest $interest)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:interests,name,' . $interest->id,
            'category' => 'required|string|max:100',
            'icon' => 'nullable|string|max:50',
            'active' => 'boolean'
        ]);

        $interest->update($validated);

        return back()->with('success', 'Intérêt mis à jour.');
    }

    public function destroy(Interest $interest)
    {
        Log::info('Deleting interest ID: ' . $interest->id);
        $interest->delete();
        return back()->with('success', 'Intérêt supprimé.');
    }
}
