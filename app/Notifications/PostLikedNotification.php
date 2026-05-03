<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\User;
use App\Models\Post;

class PostLikedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $liker,
        private Post $post
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'post_liked',
            'sender_id' => $this->liker->id,
            'sender_name' => $this->liker->full_name,
            'sender_avatar' => $this->liker->avatar,
            'post_id' => $this->post->id,
            'message' => __(":name a aimé votre publication.", ['name' => $this->liker->full_name]),
            'link' => route('dashboard'),
        ];
    }
}