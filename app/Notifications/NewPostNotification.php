<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewPostNotification extends Notification
{
    use Queueable;

    public $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'received',
            'message' => __("Nouvelle publication de :name", ['name' => $this->post->user->name]),
            'sender_name' => $this->post->user->name,
            'sender_avatar' => $this->post->user->avatar,
            'link' => '/dashboard',
        ];
    }
}
