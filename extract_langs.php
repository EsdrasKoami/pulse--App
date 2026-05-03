<?php

$dir = new RecursiveDirectoryIterator(__DIR__ . '/resources/js');
$ite = new RecursiveIteratorIterator($dir);
$files = new RegexIterator($ite, '/^.+\.jsx?$/i', RecursiveRegexIterator::GET_MATCH);

$keys = [];

foreach ($files as $file) {
    $content = file_get_contents($file[0]);
    // Match t('Something') or t("Something")
    preg_match_all("/t\(['\"](.*?)['\"]\)/", $content, $matches);
    if (!empty($matches[1])) {
        foreach ($matches[1] as $key) {
            $keys[$key] = $key;
        }
    }
}

$fr_path = __DIR__ . '/lang/fr.json';
$en_path = __DIR__ . '/lang/en.json';

$fr = file_exists($fr_path) ? json_decode(file_get_contents($fr_path), true) : [];
$en = file_exists($en_path) ? json_decode(file_get_contents($en_path), true) : [];

foreach ($keys as $key => $val) {
    if (!isset($fr[$key])) {
        $fr[$key] = $key; // Default to key
    }
    if (!isset($en[$key])) {
        $en[$key] = $key; // Default to key
    }
}

file_put_contents($fr_path, json_encode($fr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
file_put_contents($en_path, json_encode($en, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "Extracted " . count($keys) . " keys.\n";
