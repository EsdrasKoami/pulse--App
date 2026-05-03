<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerificationCodeNotification;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'is_admin',
        'is_banned',
        'ban_reason',
        'prenom',
        'nom',
        'programme',
        'bio',
        'avatar',
        'visibility',
        'profile_completed',
        'verification_code',
        'security_question',
        'security_answer',
    ];

    public function getAvatarAttribute($value)
    {
        if (!$value) {
            return null;
        }
        if (str_starts_with($value, 'http') || str_starts_with($value, '/storage/')) {
            return $value;
        }
        return '/storage/' . ltrim($value, '/');
    }

    protected $hidden = ['password', 'remember_token', 'verification_code', 'security_answer'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'security_answer' => 'hashed',
            'profile_completed' => 'boolean',
            'is_admin' => 'boolean',
            'is_banned' => 'boolean',
        ];
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerificationCodeNotification($this->verification_code));
    }

    public function interests(): BelongsToMany
    {
        return $this->belongsToMany(Interest::class);
    }

    /** Display-friendly full name */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->prenom} {$this->nom}") ?: ($this->name ?? 'Utilisateur Inconnu');
    }

    public function sentContactRequests()
    {
        return $this->hasMany(ContactRequest::class, 'sender_id');
    }

    public function receivedContactRequests()
    {
        return $this->hasMany(ContactRequest::class, 'receiver_id');
    }

    public function messagesSent()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messagesReceived()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function createdGroups()
    {
        return $this->hasMany(Group::class, 'creator_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class)->latest();
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function blockedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_blocks', 'blocker_id', 'blocked_id')->withTimestamps();
    }

    public function blockedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_blocks', 'blocked_id', 'blocker_id')->withTimestamps();
    }

    public function reportsSent()
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    public function reportsReceived()
    {
        return $this->hasMany(Report::class, 'reported_id');
    }

    public function hasBlocked($userId): bool
    {
        return $this->blockedUsers()->where('blocked_id', $userId)->exists();
    }

    public function isBlockedBy($userId): bool
    {
        return $this->blockedBy()->where('blocker_id', $userId)->exists();
    }

    public function events()
    {
        return $this->hasMany(Event::class, 'creator_id')->latest();
    }

    public function joinedEvents(): BelongsToMany
    {
        return $this->belongsToMany(Event::class)
            ->withPivot('status')
            ->withTimestamps();
    }
}