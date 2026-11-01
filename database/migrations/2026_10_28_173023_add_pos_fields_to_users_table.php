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
        Schema::table('users', function (Blueprint $table) {
            $table->string('staff_code')->nullable()->unique()->after('role');
            $table->string('store_code')->nullable()->index()->after('staff_code');
            $table->string('cashier_pin')->nullable()->after('store_code');
            $table->string('phone')->nullable()->after('cashier_pin');
            $table->string('shift')->nullable()->after('phone');
            $table->json('pos_permissions')->nullable()->after('shift');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['staff_code']);
            $table->dropIndex(['store_code']);
            $table->dropColumn([
                'staff_code',
                'store_code',
                'cashier_pin',
                'phone',
                'shift',
                'pos_permissions',
            ]);
        });
    }
};
