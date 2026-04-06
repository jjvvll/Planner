<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroceryList extends Model
{
    protected $fillable = ['user_id', 'event_id', 'name', 'notes', 'is_completed'];
}
