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
        Schema::create('daily_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_activity_id')->constrained('master_activities')->onDelete('cascade');
            $table->date('activity_date');
            $table->enum('status', ['todo', 'in_progress', 'done'])->default('todo');
            $table->unsignedInteger('position')->default(0);
            $table->text('remark')->nullable();
            $table->timestamps();
            $table->unique(['master_activity_id', 'activity_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_activities');
    }
};
