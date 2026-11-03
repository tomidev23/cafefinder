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
        Schema::create('cafes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('area')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 11, 8);
            $table->decimal('longitude', 11, 8);
            $table->text('maps_url')->nullable();
            $table->decimal('rating', 3, 1)->default(4.8);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedSmallInteger('wifi_speed')->nullable();
            $table->unsignedTinyInteger('wifi_rating')->nullable()->default(4);
            $table->unsignedInteger('price_min')->nullable();
            $table->unsignedInteger('price_max')->nullable();
            $table->boolean('coworking')->default(false);
            $table->boolean('long_table')->default(false);
            $table->boolean('smoking')->default(false);
            $table->boolean('mushola')->default(false);
            $table->boolean('is_open')->default(true);
            $table->text('note')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();

            $table->index(['latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cafes');
    }
};
