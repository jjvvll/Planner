<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashEntry extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'label',
        'category',
        'date',
        'notes',
        'event_id'
    ];
}
