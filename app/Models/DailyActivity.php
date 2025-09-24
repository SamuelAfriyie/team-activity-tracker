<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'master_activity_id',
        'activity_date',
        'status',
        'remark',
        'position'
    ];

    protected $dates = [
        'activity_date'
    ];

    public function master()
    {
        return $this->belongsTo(MasterActivity::class, 'master_activity_id');
    }

    public function updates()
    {
        return $this->hasMany(ActivityUpdate::class);
    }

    public function latestUpdate()
    {
        return $this->hasOne(ActivityUpdate::class)->latestOfMany();
    }

    public function scopeForDate($query, $date)
    {
        return $query->where('activity_date', $date);
    }

    public function scopeOrderedInColumn($query, $status)
    {
        return $query->where('status', $status)->orderBy('position');
    }
}
