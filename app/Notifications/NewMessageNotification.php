<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\User;

class NewMessageNotification extends Notification
{
    use Queueable;

    private $sender;
    private $messageContent;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $sender, string $messageContent)
    {
        $this->sender = $sender;
        $this->messageContent = $messageContent;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_message',
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->full_name,
            'sender_avatar' => $this->sender->avatar,
            'message' => __('Nouveau message de :name', ['name' => $this->sender->full_name]),
            'link' => route('messages.index')
        ];
    }
}