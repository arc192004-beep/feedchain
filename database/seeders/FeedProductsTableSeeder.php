<?php

namespace Database\Seeders;

use App\Models\FeedProduct;
use Illuminate\Database\Seeder;

class FeedProductsTableSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['FP-001', 'Tilapia Starter Feed', 'Starter', 'High-protein starter feed for juvenile tilapia.', 850.00],
            ['FP-002', 'Tilapia Grower Feed', 'Grower', 'Balanced grower feed for mid-stage tilapia.', 780.00],
            ['FP-003', 'Milkfish Finisher Feed', 'Finisher', 'Finisher feed for milkfish grow-out.', 720.00],
            ['FP-004', 'Shrimp Nursery Feed', 'Starter', 'Fine pellet feed for shrimp nursery phase.', 920.00],
        ];

        foreach ($products as [$code, $name, $type, $description, $price]) {
            FeedProduct::updateOrCreate(
                ['product_code' => $code],
                [
                    'product_name' => $name,
                    'feed_type' => $type,
                    'description' => $description,
                    'unit' => 'kg',
                    'price' => $price,
                    'status' => 'active',
                ]
            );
        }
    }
}
