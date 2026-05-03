<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewCommentNotification extends Notification
{
    use Queueable;

    public $comment;

    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'received',
            'message' => __(":name a commenté votre publication.", ['name' => $this->comment->user->name]),
            'sender_name' => $this->comment->user->name,
            'sender_avatar' => $this->comment->user->avatar,
            'link' => '/dashboard',
        ];
    }
}
