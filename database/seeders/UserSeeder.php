<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Only keep the essential admin account
        User::updateOrCreate(
            ['email' => 'admin@edu.cegeptr.qc.ca'],
            [
                'name' => 'Admin Pulse',
                'prenom' => 'Admin',
                'nom' => 'Pulse',
                'password' => 'admin123',
                'is_admin' => true,
                'programme' => "Administration",
                'bio' => "Compte administrateur de la plateforme Pulse.",
                'visibility' => true,
                'profile_completed' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}