<?php

namespace App\Services;

class RecommendationService
{
    /**
     * Mapping of related interest names.
     * Keys are the source interest, values are arrays of related interests.
     */
    protected static $relatedMap = [
        'Hockey sur glace' => ['Deck hockey', 'Patinage', 'Sports de glace'],
        'Deck hockey' => ['Hockey sur glace', 'Street hockey', 'Floorball'],
        'Soccer' => ['Futsal', 'Football', 'Sport d\'équipe'],
        'Gaming PC' => ['Gaming Console', 'Esports', 'Streaming'],
        'Gaming Console' => ['Gaming PC', 'Rétrogaming'],
        'Photographie' => ['Vidéo', 'Arts visuels', 'Design'],
        'Cuisine' => ['Pâtisserie', 'Oenologie', 'Gastronomie'],
        'Vélo' => ['VTT', 'Triathlon', 'Cyclisme'],
        'Peinture' => ['Dessin', 'Sculpture', 'Arts'],
    ];

    /**
     * Calculate a match score between two users based on their interests.
     */
    public function calculateMatchScore($myInterests, $theirInterests, $myCategories, $theirCategories)
    {
        $score = 0;

        // 1. Exact Matches (20 points each)
        $exactMatches = array_intersect($myInterests, $theirInterests);
        $score += count($exactMatches) * 20;

        // 2. Related Matches (15 points each)
        $relatedScore = 0;
        foreach ($myInterests as $myIntName) {
            if (isset(self::$relatedMap[$myIntName])) {
                foreach (self::$relatedMap[$myIntName] as $related) {
                    if (in_array($related, $theirInterests) && !in_array($related, $myInterests)) {
                        $relatedScore += 15;
                    }
                }
            }
        }
        $score += $relatedScore;

        // 3. Category Matches (10 points each)
        $categoryMatches = array_intersect($myCategories, $theirCategories);
        $score += count($categoryMatches) * 10;

        return $score;
    }
}
