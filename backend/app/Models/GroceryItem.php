<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroceryItem extends Model
{
    protected $fillable = ['grocery_list_id', 'name', 'quantity', 'unit', 'estimated_price', 'is_checked', 'sort_order', 'notes'];
}
