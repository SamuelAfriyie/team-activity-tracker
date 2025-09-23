<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'metrics',
        'is_active'
    ];

    protected $casts = [
        'metrics' => 'array',
        'is_active' => 'boolean'
    ];

    public function updates(): HasMany
    {
        return $this->hasMany(ActivityUpdate::class);
    }

    public function latestUpdate()
    {
        return $this->hasOne(ActivityUpdate::class)->latestOfMany();
    }
}
