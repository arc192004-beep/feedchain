<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "APP_URL: " . var_export(config('app.url'), true) . "\n";
echo "SESSION_DRIVER: " . var_export(config('session.driver'), true) . "\n";
echo "SESSION_DOMAIN: " . var_export(config('session.domain'), true) . "\n";
echo "SESSION_COOKIE: " . var_export(config('session.cookie'), true) . "\n";
echo "SESSION_SECURE: " . var_export(config('session.secure'), true) . "\n";
echo "SESSION_SAME_SITE: " . var_export(config('session.same_site'), true) . "\n";
echo "SESSION_HTTP_ONLY: " . var_export(config('session.http_only'), true) . "\n";
