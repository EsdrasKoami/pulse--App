<?php

namespace App\Notifications;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventInvitationNotification extends Notification
{
    use Queueable;

    public $event;
    public $inviter;

    /**
     * Create a new notification instance.
     */
    public function __construct(Event $event, User $inviter)
    {
        $this->event = $event;
        $this->inviter = $inviter;
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
            'type' => 'event_invitation',
            'event_id' => $this->event->id,
            'event_title' => $this->event->title,
            'user_id' => $this->inviter->id,
            'user_name' => $this->inviter->full_name,
            'avatar' => $this->inviter->avatar,
            'message' => 'vous a invité à l\'événement ' . $this->event->title,
        ];
    }
}
