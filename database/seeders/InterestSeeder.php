<?php

namespace Database\Seeders;

use App\Models\Interest;
use Illuminate\Database\Seeder;

class InterestSeeder extends Seeder
{
    public function run(): void
    {
        $interests = [
            // Arts
            ['name' => 'Musique', 'category' => 'arts', 'icon' => '🎵'],
            ['name' => 'Peinture', 'category' => 'arts', 'icon' => '🎨'],
            ['name' => 'Photographie', 'category' => 'arts', 'icon' => '📷'],
            ['name' => 'Cuisine', 'category' => 'arts', 'icon' => '🍳'],
            ['name' => 'Danse', 'category' => 'arts', 'icon' => '💃'],
            ['name' => 'Cinéma', 'category' => 'arts', 'icon' => '🎬'],
            // Sports
            ['name' => 'Course à pied', 'category' => 'sports', 'icon' => '🏃'],
            ['name' => 'Soccer', 'category' => 'sports', 'icon' => '⚽'],
            ['name' => 'Vélo', 'category' => 'sports', 'icon' => '🚴'],
            ['name' => 'Natation', 'category' => 'sports', 'icon' => '🏊'],
            ['name' => 'Yoga', 'category' => 'sports', 'icon' => '🧘'],
            // Jeux
            ['name' => 'Jeux de société', 'category' => 'jeux', 'icon' => '🎲'],
            ['name' => 'Échecs', 'category' => 'jeux', 'icon' => '♟️'],
            ['name' => 'Jeux de cartes', 'category' => 'jeux', 'icon' => '🃏'],
            // Gaming
            ['name' => 'Gaming PC', 'category' => 'gaming', 'icon' => '🖥️'],
            ['name' => 'Gaming Console', 'category' => 'gaming', 'icon' => '🎮'],
            ['name' => 'Jeux mobiles', 'category' => 'gaming', 'icon' => '📱'],
            // Autres
            ['name' => 'Lecture', 'category' => 'autres', 'icon' => '📚'],
            ['name' => 'Voyage', 'category' => 'autres', 'icon' => '✈️'],
            ['name' => 'Bénévolat', 'category' => 'autres', 'icon' => '🤝'],
        ];

        foreach ($interests as $interest) {
            Interest::firstOrCreate(
            ['name' => $interest['name']],
            ['category' => $interest['category'], 'icon' => $interest['icon']]
            );
        }
    }
}