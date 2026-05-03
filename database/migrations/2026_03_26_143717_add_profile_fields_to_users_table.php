<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('prenom')->nullable()->after('name');
            $table->string('nom')->nullable()->after('prenom');
            $table->string('programme')->nullable()->after('nom');
            $table->text('bio')->nullable()->after('programme');
            $table->string('avatar')->nullable()->after('bio');
            $table->string('visibility')->default('public')->after('avatar'); // 'public' | 'anonyme'
            $table->boolean('profile_completed')->default(false)->after('visibility');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['prenom', 'nom', 'programme', 'bio', 'avatar', 'visibility', 'profile_completed']);
        });
    }
};