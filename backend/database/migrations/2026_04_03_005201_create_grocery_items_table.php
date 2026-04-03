<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grocery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grocery_list_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('quantity', 8, 2)->default(1);
            $table->enum('unit', ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'can', 'bottle', 'box', 'dozen'])->default('pcs');
            $table->decimal('estimated_price', 10, 2)->nullable();
            $table->boolean('is_checked')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['grocery_list_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grocery_items');
    }
};
