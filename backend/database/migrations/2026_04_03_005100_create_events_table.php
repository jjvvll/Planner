<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->enum('type', ['grocery', 'bill', 'income', 'task'])->default('task');
            $table->date('date');
            $table->time('time')->nullable();
            $table->boolean('all_day')->default(true);
            $table->enum('repeat', ['none', 'daily', 'weekly', 'monthly', 'yearly'])->default('none');
            $table->date('repeat_until')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedTinyInteger('remind_days_before')->default(1);
            $table->string('color', 7)->nullable(); // hex color override
            $table->boolean('is_completed')->default(false);
            $table->foreignId('bill_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'date']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
