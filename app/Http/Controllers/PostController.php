<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use App\Notifications\PostLikedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'image' => 'nullable|image|max:10240' // 10MB max
        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            try {
                // Professional optimization (same as stories)
                $filename = uniqid('post_') . '.webp';
                $path = 'posts/' . $filename;

                $manager = new ImageManager(new Driver());
                $image = $manager->read($file);
                
                // Resize to max 1200px width for feed, keeping aspect ratio
                $image->scale(width: 1200);
                $encoded = $image->toWebp(80);

                Storage::disk('public')->put($path, (string) $encoded);
                $imageUrl = '/storage/' . $path;
            } catch (\Exception $e) {
                // Fallback to raw storage if GD is missing
                $path = $file->store('posts', 'public');
                $imageUrl = '/storage/' . $path;
            }
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'image_url' => $imageUrl,
        ]);

        // Broadcast to connections
        $user = Auth::user();
        $sentRequests = \App\Models\ContactRequest::where('sender_id', $user->id)->pluck('receiver_id')->toArray();
        $receivedRequests = \App\Models\ContactRequest::where('receiver_id', $user->id)->pluck('sender_id')->toArray();
        $myConnectionsIds = array_unique(array_merge($sentRequests, $receivedRequests));

        if (!empty($myConnectionsIds)) {
            $connections = \App\Models\User::whereIn('id', $myConnectionsIds)->get();
            /** @var \App\Models\User $connection */
            foreach ($connections as $connection) {
                $connection->notify(new \App\Notifications\NewPostNotification($post));
            }
        }

        return back()->with('success', 'Post publié !');
    }

    public function storeComment(Request $request, Post $post)
    {
        if (Auth::user()->hasBlocked($post->user_id) || $post->user->hasBlocked(Auth::id())) {
            abort(403, 'Action non autorisée.');
        }

        $request->validate([
            'content' => 'required|string|max:500'
        ]);

        $comment = $post->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content
        ]);

        if ($post->user_id !== Auth::id()) {
            $post->user->notify(new \App\Notifications\NewCommentNotification($comment));
        }

        return back()->with('success', 'Commentaire ajouté !');
    }

    public function toggleLike(Post $post)
    {
        if (Auth::user()->hasBlocked($post->user_id) || $post->user->hasBlocked(Auth::id())) {
            abort(403, 'Action non autorisée.');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $like = $post->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
        } else {
            $post->likes()->create(['user_id' => $user->id]);

            // Notify post owner (but not oneself)
            if ($post->user_id !== $user->id) {
                $post->user->notify(new PostLikedNotification($user, $post));
            }
        }

        return back();
    }
}