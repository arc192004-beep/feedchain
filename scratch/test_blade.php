<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$blade = view('app', [
    'page' => [
        'component' => 'auth/login',
        'props' => [],
        'url' => '/login',
        'version' => '',
    ],
])->render();

if (preg_match_all('/<script\b[^>]*>(.*?)<\/script>/is', $blade, $matches)) {
    foreach ($matches[0] as $i => $s) {
        echo "Script $i:\n" . substr($s, 0, 300) . "\n...\n" . substr($s, -200) . "\n\n";
    }
} else {
    echo "No scripts\n";
}
