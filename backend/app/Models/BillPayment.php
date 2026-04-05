<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillPayment extends Model
{
    protected $fillable = ['bill_id', 'amount_paid', 'paid_at', 'notes'];
}
