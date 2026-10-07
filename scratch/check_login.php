<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('/login', 'GET');
$res = $kernel->handle($req);
$content = $res->getContent();

// If Inertia page, data-page attribute is present
if (preg_match('/data-page="([^"]+)"/', $content, $matches)) {
    echo json_encode(json_decode(htmlspecialchars_decode($matches[1]), true), JSON_PRETTY_PRINT);
} else {
    echo $content;
}
