<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterActivity extends Model
{
    use HasFactory;

    protected $fillable =
    [
        'title',
        'description',
        'created_by'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function dailyInstances()
    {
        return $this->hasMany(DailyActivity::class);
    }
}
