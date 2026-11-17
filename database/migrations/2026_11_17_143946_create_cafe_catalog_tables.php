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
        Schema::create('menu_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cafe_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->timestamps();

            $table->unique(['cafe_id', 'slug']);
        });

        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cafe_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('menu_categories')->nullOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->decimal('promo_price', 12, 2)->nullable();
            $table->decimal('hpp', 12, 2)->nullable();
            $table->string('image')->nullable();
            $table->boolean('in_stock')->default(true);
            $table->boolean('barista_recommendation')->default(false);
            $table->string('serving_temperature')->nullable();
            $table->timestamps();

            $table->index(['cafe_id', 'in_stock']);
        });

        Schema::create('menu_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained()->cascadeOnDelete();
            $table->string('option_type');
            $table->string('name');
            $table->decimal('extra_price', 12, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('table_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cafe_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('cafe_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('table_zones')->cascadeOnDelete();
            $table->string('table_number');
            $table->unsignedSmallInteger('capacity');
            $table->string('status')->default('available');
            $table->boolean('qr_active')->default(true);
            $table->timestamps();

            $table->unique(['zone_id', 'table_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cafe_tables');
        Schema::dropIfExists('table_zones');
        Schema::dropIfExists('menu_options');
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menu_categories');
    }
};
