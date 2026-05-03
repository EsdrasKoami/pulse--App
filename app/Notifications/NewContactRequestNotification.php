<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\User;

class NewContactRequestNotification extends Notification
{
    use Queueable;

    private $sender;
    private $type;

    /**
     * Create a new notification instance.
     * $type can be 'received' or 'accepted'
     */
    public function __construct(User $sender, string $type = 'received')
    {
        $this->sender = $sender;
        $this->type = $type;
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
        $message = $this->type === 'accepted'
            ? __(":name a accepté votre demande de connexion.", ['name' => $this->sender->full_name])
            : __(":name souhaite se connecter avec vous.", ['name' => $this->sender->full_name]);

        return [
            'type' => $this->type,
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->full_name,
            'sender_avatar' => $this->sender->avatar,
            'message' => $message,
            'link' => route('connections.index')
        ];
    }
}