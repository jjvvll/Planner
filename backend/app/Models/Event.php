<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'type',
        'date',
        'time',
        'all_day',
        'repeat',
        'repeat_until',
        'notes',
        'remind_days_before',
        'color',
        'is_completed',
        'bill_id'
    ];
}
