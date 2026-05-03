<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\StoryLike;
use App\Notifications\StoryLiked;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class StoryController extends Controller
{
    /** Store a new story with optimization and fallback. */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:10240'], // 10MB max upload
        ]);

        $file = $request->file('image');
        
        try {
            // Attempt professional optimization
            $filename = uniqid('story_') . '.webp';
            $path = 'stories/' . $filename;

            // Initialize ImageManager with GD driver
            $manager = new ImageManager(new Driver());
            
            // Read image, resize it to 1080x1920, and encode to WebP
            $image = $manager->read($file);
            $image->cover(1080, 1920);
            $encoded = $image->toWebp(80);

            // Store the optimized image
            Storage::disk('public')->put($path, (string) $encoded);
            $imageUrl = '/storage/' . $path;

        } catch (\Exception $e) {
            // FALLBACK: If GD is missing or optimization fails, just store the raw image
            // This prevents the "Intervention\Image\Exceptions\NotSupportedException" error
            $path = $file->store('stories', 'public');
            $imageUrl = '/storage/' . $path;
        }

        Story::create([
            'user_id' => Auth::id(),
            'image_url' => $imageUrl,
            'expires_at' => now()->addHours(24),
        ]);

        return back()->with('success', 'Story publiée !');
    }

    /** Remove a story. */
    public function destroy(Story $story): RedirectResponse
    {
        if ($story->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete file from storage
        $relativePath = str_replace('/storage/', '', $story->image_url);
        Storage::disk('public')->delete($relativePath);

        $story->delete();

        return back()->with('success', 'Story supprimée.');
    }

    /** Toggle like on a story. */
    public function toggleLike(Story $story): RedirectResponse
    {
        $like = StoryLike::where('user_id', Auth::id())
            ->where('story_id', $story->id)
            ->first();

        if ($like) {
            $like->delete();
        } else {
            StoryLike::create([
                'user_id' => Auth::id(),
                'story_id' => $story->id,
            ]);

            // Notify the owner
            if ($story->user_id !== Auth::id()) {
                $story->user->notify(new StoryLiked(Auth::user(), $story));
            }
        }

        return back();
    }
}
