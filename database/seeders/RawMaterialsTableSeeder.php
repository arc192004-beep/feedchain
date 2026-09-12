<?php

namespace Database\Seeders;

use App\Models\RawMaterial;
use Illuminate\Database\Seeder;

class RawMaterialsTableSeeder extends Seeder
{
    public function run(): void
    {
        $materials = [
            ['RM-001', 'Fish Meal', 'Protein Source', 2500, 500, 45.00],
            ['RM-002', 'Soybean Meal', 'Protein Source', 1800, 400, 38.50],
            ['RM-003', 'Corn Gluten', 'Binder', 1200, 300, 28.00],
            ['RM-004', 'Wheat Flour', 'Binder', 900, 250, 22.00],
            ['RM-005', 'Fish Oil', 'Lipid Source', 600, 150, 55.00],
            ['RM-006', 'Vitamin Premix', 'Additive', 200, 50, 120.00],
            ['RM-007', 'Mineral Premix', 'Additive', 180, 40, 95.00],
        ];

        foreach ($materials as [$code, $name, $type, $qty, $reorder, $cost]) {
            RawMaterial::updateOrCreate(
                ['material_code' => $code],
                [
                    'material_name' => $name,
                    'material_type' => $type,
                    'unit' => 'kg',
                    'quantity_on_hand' => $qty,
                    'reorder_level' => $reorder,
                    'cost_per_unit' => $cost,
                    'status' => 'active',
                ]
            );
        }
    }
}
