<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $row) {
            $row->id();
            $row->string('title');
            $row->text('description')->nullable();
            $row->string('location')->nullable();
            $row->dateTime('event_date');
            $row->integer('max_participants')->nullable();
            $row->foreignId('creator_id')->constrained('users')->onDelete('cascade');
            $row->string('avatar')->nullable(); // Optional cover image
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
