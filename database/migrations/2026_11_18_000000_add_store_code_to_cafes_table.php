<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cafes', function (Blueprint $table): void {
            $table->string('store_code', 30)->nullable()->after('slug');
        });

        DB::table('cafes')
            ->orderBy('id')
            ->get(['id'])
            ->each(function (object $cafe, int $index): void {
                DB::table('cafes')
                    ->where('id', $cafe->id)
                    ->update([
                        'store_code' => $index === 0
                            ? config('pos.store.code', 'ART-88')
                            : 'CF-'.str_pad((string) $cafe->id, 3, '0', STR_PAD_LEFT),
                    ]);
            });

        Schema::table('cafes', function (Blueprint $table): void {
            $table->unique('store_code');
        });
    }

    public function down(): void
    {
        Schema::table('cafes', function (Blueprint $table): void {
            $table->dropUnique(['store_code']);
            $table->dropColumn('store_code');
        });
    }
};
