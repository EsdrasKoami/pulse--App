<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'event_date',
        'max_participants',
        'creator_id',
        'avatar'
    ];

    protected $casts = [
        'event_date' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('status')
            ->withTimestamps();
    }

    public function isFull(): bool
    {
        if (!$this->max_participants) {
            return false;
        }

        return $this->participants()->where('status', 'joined')->count() >= $this->max_participants;
    }

    public function isJoinedBy(User $user): bool
    {
        return $this->participants()->where('user_id', $user->id)->exists();
    }
}
