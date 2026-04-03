<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['income', 'expense']);
            $table->decimal('amount', 12, 2);
            $table->string('label');
            $table->enum('category', [
                'salary',
                'freelance',
                'bonus',
                'investment',   // income
                'groceries',
                'utilities',
                'rent',
                'transport',  // expense
                'health',
                'entertainment',
                'shopping',
                'other'
            ])->default('other');
            $table->date('date');
            $table->text('notes')->nullable();
            $table->foreignId('event_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'date']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_entries');
    }
};
