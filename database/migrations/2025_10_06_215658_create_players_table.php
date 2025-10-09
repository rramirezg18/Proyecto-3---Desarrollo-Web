<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->string('position', 50)->nullable()->after('team');
            $table->unsignedSmallInteger('number')->nullable()->after('position');
            $table->string('nationality', 50)->nullable()->after('number');
        });
    }

    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn(['position', 'number', 'nationality']);
        });
    }
};
