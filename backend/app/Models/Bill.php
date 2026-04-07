<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{


    use HasFactory;
    protected $fillable = [
        'user_id',
        'name',
        'amount',
        'due_day',
        'repeat',
        'category',
        'notes',
        'is_active',
        'remind_days_before',
        'auto_generate_events',
        'last_paid_at',
    ];
}
