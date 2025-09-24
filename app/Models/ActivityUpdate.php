<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityUpdate extends Model
{
    use HasFactory;

    protected $fillable =
    [
        'daily_activity_id',
        'user_id',
        'status',
        'remark'
    ];

    public function dailyActivity()
    {
        return $this->belongsTo(DailyActivity::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
