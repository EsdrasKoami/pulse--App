<?php

namespace App\Notifications;

use App\Models\Story;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StoryLiked extends Notification
{
    use Queueable;

    public function __construct(
        public User $liker,
        public Story $story
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'story_liked',
            'sender_id' => $this->liker->id,
            'sender_name' => $this->liker->full_name,
            'sender_avatar' => $this->liker->avatar,
            'story_id' => $this->story->id,
            'message' => "{$this->liker->full_name} a aimé votre story.",
            'link' => route('dashboard'), // Stories are on dashboard
        ];
    }
}
