<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('amount', 12, 2);
            $table->unsignedTinyInteger('due_day');  // 1–31
            $table->enum('repeat', ['none', 'monthly', 'yearly'])->default('monthly');
            $table->enum('category', ['rent', 'utilities', 'subscription', 'loan', 'insurance', 'other'])->default('other');
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedTinyInteger('remind_days_before')->default(3);
            $table->boolean('auto_generate_events')->default(true);
            $table->date('last_paid_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
