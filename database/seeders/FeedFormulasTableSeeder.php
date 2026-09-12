<?php

namespace Database\Seeders;

use App\Models\FeedFormula;
use App\Models\FeedProduct;
use App\Models\FormulaItem;
use App\Models\RawMaterial;
use Illuminate\Database\Seeder;

class FeedFormulasTableSeeder extends Seeder
{
    public function run(): void
    {
        $product = FeedProduct::where('product_code', 'FP-002')->first();

        if (! $product) {
            return;
        }

        $formula = FeedFormula::updateOrCreate(
            ['formula_code' => 'FF-001'],
            [
                'formula_name' => 'Standard Tilapia Grower Formula',
                'feed_product_id' => $product->id,
                'batch_size_kg' => 1000,
                'status' => 'active',
            ]
        );

        $items = [
            'RM-001' => 350,
            'RM-002' => 280,
            'RM-003' => 180,
            'RM-004' => 120,
            'RM-005' => 40,
            'RM-006' => 15,
            'RM-007' => 15,
        ];

        $formula->items()->delete();

        foreach ($items as $materialCode => $quantity) {
            $material = RawMaterial::where('material_code', $materialCode)->first();

            if ($material) {
                FormulaItem::create([
                    'feed_formula_id' => $formula->id,
                    'raw_material_id' => $material->id,
                    'quantity_required' => $quantity,
                    'unit' => 'kg',
                ]);
            }
        }
    }
}
