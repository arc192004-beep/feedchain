<?php

namespace App\Http\Controllers;

use App\Models\ProductionBatch;
use App\Models\FeedFormula;
use App\Models\FormulaItem;
use App\Models\ProductionBatchMaterial;
use App\Models\RawMaterial;
use App\Models\Inventory;
use App\Models\FeedProduct;
use App\Models\StockAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductionBatchController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $query = ProductionBatch::with(['feedProduct', 'formula', 'materials.rawMaterial']);

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('batch_number', 'like', "%{$search}%")
                    ->orWhereHas('feedProduct', function ($pq) use ($search) {
                        $pq->where('product_name', 'like', "%{$search}%")
                           ->orWhere('product_code', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', strtolower($status));
        }

        $batches = $query->orderByDesc('id')->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($batches);
        }

        return view('production_batches.index', compact('batches'));
    }

    public function create()
    {
        return view('production_batches.create');
    }

    public function store(Request $request)
    {
        if ($request->has('batch_no') && ! $request->has('batch_number')) {
            $request->merge(['batch_number' => $request->input('batch_no')]);
        }
        if ($request->has('feed_formulation_id') && ! $request->has('feed_formula_id')) {
            $request->merge(['feed_formula_id' => $request->input('feed_formulation_id')]);
        }
        if (! $request->has('status')) {
            $request->merge(['status' => 'completed']);
        }

        $data = $request->validate([
            'batch_number' => 'required|string|max:50|unique:production_batches,batch_number',
            'feed_product_id' => ['required', $this->workspaceExists('feed_products')],
            'feed_formula_id' => ['required', $this->workspaceExists('feed_formulas')],
            'production_date' => 'required|date',
            'quantity_kg' => 'nullable|numeric|min:0',
            'sacks_produced' => 'required|integer|min:1',
            'status' => 'required|in:planned,in_progress,completed,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        $batch = DB::transaction(function () use ($data, $request) {
            $product = FeedProduct::findOrFail($data['feed_product_id']);
            $formula = FeedFormula::with('items.rawMaterial')->findOrFail($data['feed_formula_id']);
            $bagWeight = (float) ($product->bag_weight_kg ?? 25);
            $totalOutputKg = !empty($data['quantity_kg']) && $data['quantity_kg'] > 0
                ? (float) $data['quantity_kg']
                : (float) ($data['sacks_produced'] * $bagWeight);

            $batch = ProductionBatch::create([
                'batch_number' => strtoupper($data['batch_number']),
                'feed_product_id' => $data['feed_product_id'],
                'feed_formula_id' => $data['feed_formula_id'],
                'production_date' => $data['production_date'],
                'quantity_kg' => $totalOutputKg,
                'quantity_produced' => $totalOutputKg,
                'sacks_produced' => $data['sacks_produced'],
                'total_sacks' => $data['sacks_produced'],
                'status' => strtolower($data['status']),
                'notes' => $data['notes'] ?? null,
                'encoded_by' => $request->user()?->id,
                'started_at' => in_array($data['status'], ['in_progress', 'completed']) ? now() : null,
                'completed_at' => $data['status'] === 'completed' ? now() : null,
            ]);

            if ($data['status'] === 'completed') {
                $this->completeProductionBatch($batch, $formula, $product, $totalOutputKg, $data['sacks_produced']);
            }

            return $batch->fresh(['feedProduct', 'formula', 'materials.rawMaterial']);
        });

        if ($request->wantsJson() || $request->isJson() || $request->expectsJson()) {
            return response()->json([
                'created' => true,
                'batch' => $batch,
            ], 201);
        }

        return redirect()->route('production_batches.index')->with('success', 'Production batch recorded successfully.');
    }

    public function show(ProductionBatch $production_batch)
    {
        $production_batch->load('materials.rawMaterial', 'feedProduct', 'formula');
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($production_batch);
        }
        return view('production_batches.show', ['batch' => $production_batch]);
    }

    public function edit(ProductionBatch $production_batch)
    {
        $production_batch->load('materials.rawMaterial', 'feedProduct', 'formula');
        return view('production_batches.edit', ['batch' => $production_batch]);
    }

    public function update(Request $request, ProductionBatch $production_batch)
    {
        if ($request->has('batch_no') && ! $request->has('batch_number')) {
            $request->merge(['batch_number' => $request->input('batch_no')]);
        }
        if ($request->has('feed_formulation_id') && ! $request->has('feed_formula_id')) {
            $request->merge(['feed_formula_id' => $request->input('feed_formulation_id')]);
        }

        $data = $request->validate([
            'batch_number' => 'required|string|max:50|unique:production_batches,batch_number,' . $production_batch->id,
            'feed_product_id' => ['required', $this->workspaceExists('feed_products')],
            'feed_formula_id' => ['required', $this->workspaceExists('feed_formulas')],
            'production_date' => 'required|date',
            'quantity_kg' => 'nullable|numeric|min:0',
            'sacks_produced' => 'required|integer|min:1',
            'status' => 'required|in:planned,in_progress,completed,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($data, $production_batch) {
            // Lock the batch itself so two completion requests cannot both add stock.
            $production_batch = ProductionBatch::lockForUpdate()->findOrFail($production_batch->id);
            $prevStatus = strtolower($production_batch->status ?? 'planned');
            $newStatus = strtolower($data['status']);

            $product = FeedProduct::findOrFail($data['feed_product_id']);
            $formula = FeedFormula::with('items.rawMaterial')->findOrFail($data['feed_formula_id']);
            $bagWeight = (float) ($product->bag_weight_kg ?? 25);
            $totalOutputKg = !empty($data['quantity_kg']) && $data['quantity_kg'] > 0
                ? (float) $data['quantity_kg']
                : (float) ($data['sacks_produced'] * $bagWeight);

            $inventoryChanged = (int) $production_batch->feed_product_id !== (int) $data['feed_product_id']
                || (int) $production_batch->feed_formula_id !== (int) $data['feed_formula_id']
                || (int) $production_batch->sacks_produced !== (int) $data['sacks_produced']
                || (float) $production_batch->quantity_kg !== $totalOutputKg;

            // Reverse only a batch that has actually been applied. Saving an unchanged
            // completed batch is intentionally a no-op for stock and movements.
            if ($prevStatus === 'completed' && $production_batch->inventory_applied_at && ($newStatus !== 'completed' || $inventoryChanged)) {
                $this->reverseBatchInventory($production_batch);
                $production_batch->total_raw_material_used = 0;
                $production_batch->production_yield = null;
                $production_batch->completed_at = null;
                $production_batch->inventory_applied_at = null;
            }

            if ($newStatus === 'in_progress' && !$production_batch->started_at) {
                $production_batch->started_at = now();
            }

            $production_batch->update([
                'batch_number' => strtoupper($data['batch_number']),
                'feed_product_id' => $data['feed_product_id'],
                'feed_formula_id' => $data['feed_formula_id'],
                'production_date' => $data['production_date'],
                'quantity_kg' => $totalOutputKg,
                'quantity_produced' => $totalOutputKg,
                'sacks_produced' => $data['sacks_produced'],
                'total_sacks' => $data['sacks_produced'],
                'status' => $newStatus,
                'notes' => $data['notes'] ?? null,
                'completed_at' => $newStatus === 'completed' ? ($production_batch->completed_at ?? now()) : null,
            ]);

            // Apply only once after the current batch values have been saved. A retry,
            // page refresh, or an edit that changes only notes cannot duplicate stock.
            if ($newStatus === 'completed' && ! $production_batch->fresh()->inventory_applied_at) {
                $current = $production_batch->fresh();
                $this->completeProductionBatch($current, $formula, $product, $totalOutputKg, $data['sacks_produced']);
            }
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'updated' => true,
                'batch' => $production_batch->fresh(['feedProduct', 'formula', 'materials.rawMaterial'])
            ], 200);
        }

        return redirect()->route('production_batches.index')->with('success', 'Production batch updated successfully.');
    }

    public function destroy(ProductionBatch $production_batch)
    {
        DB::transaction(function () use ($production_batch) {
            if (strtolower($production_batch->status) === 'completed') {
                $this->reverseBatchInventory($production_batch);
            }
            $production_batch->materials()->delete();
            $production_batch->delete();
        });

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('production_batches.index')->with('success', 'Production batch deleted and inventory updated.');
    }

    /**
     * Executes completion of a production batch:
     * - Computes raw material requirements from formula
     * - Locks and verifies stock
     * - Deducts raw materials
     * - Increments finished product stock
     * - Records inventory movements
     * - Computes production yield
     */
    private function completeProductionBatch(
        ProductionBatch $batch,
        FeedFormula $formula,
        FeedProduct $product,
        float $totalOutputKg,
        int $sacksProduced
    ): void {
        abort_if($batch->inventory_applied_at, 422, "Inventory has already been applied for batch {$batch->batch_number}.");
        $items = FormulaItem::where('feed_formula_id', $formula->id)->get();
        abort_if($items->isEmpty(), 422, 'The linked formulation has no ingredient lines.');

        $formulaBatchSize = max(1.0, (float) ($formula->batch_size_kg ?: $formula->batch_size ?: 1000));
        $ratio = $totalOutputKg / $formulaBatchSize;

        $requirements = [];
        $totalRawUsed = 0.0;

        // 1. Verify all raw materials have sufficient stock before making any deductions
        foreach ($items as $item) {
            $qtyNeeded = round((float) $item->quantity_required * $ratio, 3);
            $rm = RawMaterial::lockForUpdate()->find($item->raw_material_id);
            abort_if(!$rm, 422, "Raw material ID {$item->raw_material_id} could not be located.");

            if ((float) $rm->quantity_on_hand < $qtyNeeded) {
                $name = $rm->material_name ?? $rm->name;
                $avail = number_format((float) $rm->quantity_on_hand, 2);
                $need = number_format($qtyNeeded, 2);
                abort(422, "Insufficient physical stock for {$name}: requires {$need} {$rm->unit}, but only {$avail} {$rm->unit} is available in the silo.");
            }

            $requirements[] = [
                'rawMaterial' => $rm,
                'qtyNeeded' => $qtyNeeded,
                'unit' => $item->unit ?: $rm->unit ?: 'kg',
            ];
            $totalRawUsed += $qtyNeeded;
        }

        // 2. Perform deductions and log usage and inventory movements
        $batch->materials()->delete();

        foreach ($requirements as $req) {
            $rm = $req['rawMaterial'];
            $qtyUsed = $req['qtyNeeded'];

            $newOnHand = max(0.0, (float) $rm->quantity_on_hand - $qtyUsed);
            $rm->quantity_on_hand = $newOnHand;
            $rm->quantity = $newOnHand;
            $rm->save();

            ProductionBatchMaterial::create([
                'production_batch_id' => $batch->id,
                'raw_material_id' => $rm->id,
                'quantity_used' => $qtyUsed,
                'unit' => $req['unit'],
                'unit_cost' => $rm->cost_per_unit ?? $rm->unit_cost ?? 0,
            ]);

            Inventory::create([
                'inventory_type' => 'raw_material',
                'movement_type' => 'Production',
                'raw_material_id' => $rm->id,
                'reference_batch_id' => $batch->id,
                'reference_number' => $batch->batch_number,
                'user_id' => $batch->encoded_by,
                'quantity' => -$qtyUsed,
                'quantity_kg' => -$qtyUsed,
                'quantity_available' => $newOnHand,
                'unit' => $rm->unit ?: 'kg',
                'last_updated' => now(),
            ]);

            // Low stock alert check
            if ($newOnHand <= (float) $rm->reorder_level) {
                StockAlert::updateOrCreate(
                    ['raw_material_id' => $rm->id, 'status' => 'active'],
                    [
                        'inventory_type' => 'raw_material',
                        'current_quantity' => $newOnHand,
                        'threshold_quantity' => $rm->reorder_level,
                        'alert_level' => 'low_stock',
                        'alert_message' => "Low stock alert: {$rm->material_name} is at {$newOnHand} {$rm->unit} (Reorder level: {$rm->reorder_level})",
                    ]
                );
            }
        }

        // 3. Increment finished product bags
        $lockedProduct = FeedProduct::lockForUpdate()->findOrFail($product->id);
        $newProductBags = (float) $lockedProduct->quantity_bags + (float) $sacksProduced;
        $lockedProduct->quantity_bags = $newProductBags;
        $lockedProduct->save();

        Inventory::create([
            'inventory_type' => 'finished_product',
            'movement_type' => 'Production',
            'feed_product_id' => $lockedProduct->id,
            'reference_batch_id' => $batch->id,
            'reference_number' => $batch->batch_number,
            'user_id' => $batch->encoded_by,
            'quantity' => $sacksProduced,
            'quantity_kg' => $totalOutputKg,
            'quantity_available' => $newProductBags,
            'unit' => 'bag',
            'last_updated' => now(),
        ]);

        // 4. Record yield and totals
        $batch->update([
            'total_raw_material_used' => $totalRawUsed,
            'production_yield' => $totalRawUsed > 0 ? round(($totalOutputKg / $totalRawUsed) * 100, 2) : 100.00,
            'inventory_applied_at' => now(),
        ]);
    }

    /**
     * Reverses all inventory changes made by a completed batch:
     * - Restores raw materials
     * - Checks finished product stock (cannot drop below 0)
     * - Deducts finished bags
     * - Records reversing inventory movements
     */
    private function reverseBatchInventory(ProductionBatch $batch): void
    {
        $batch->load('materials.rawMaterial', 'feedProduct');

        // Restore raw materials
        foreach ($batch->materials as $material) {
            $rm = $material->rawMaterial;
            if ($rm) {
                $qty = (float) $material->quantity_used;
                $newOnHand = (float) $rm->quantity_on_hand + $qty;
                $rm->quantity_on_hand = $newOnHand;
                $rm->quantity = $newOnHand;
                $rm->save();

                Inventory::create([
                    'inventory_type' => 'raw_material',
                    'movement_type' => 'Production Reversal',
                    'raw_material_id' => $rm->id,
                    'reference_batch_id' => $batch->id,
                    'reference_number' => $batch->batch_number,
                    'user_id' => $batch->encoded_by,
                    'quantity' => $qty,
                    'quantity_kg' => $qty,
                    'quantity_available' => $newOnHand,
                    'unit' => $material->unit ?: $rm->unit ?: 'kg',
                    'last_updated' => now(),
                ]);
            }
        }

        // Deduct finished product
        $product = $batch->feedProduct;
        if ($product) {
            $lockedProduct = FeedProduct::lockForUpdate()->find($product->id);
            if ($lockedProduct) {
                $bags = (float) ($batch->sacks_produced ?? 0);
                abort_if(
                    (float) $lockedProduct->quantity_bags < $bags,
                    422,
                    "Cannot cancel/reverse batch: Only {$lockedProduct->quantity_bags} bags of {$lockedProduct->product_name} remain in stock, but {$bags} bags were produced."
                );

                $newProductBags = max(0.0, (float) $lockedProduct->quantity_bags - $bags);
                $lockedProduct->quantity_bags = $newProductBags;
                $lockedProduct->save();

                Inventory::create([
                    'inventory_type' => 'finished_product',
                    'movement_type' => 'Production Reversal',
                    'feed_product_id' => $lockedProduct->id,
                    'reference_batch_id' => $batch->id,
                    'reference_number' => $batch->batch_number,
                    'user_id' => $batch->encoded_by,
                    'quantity' => -$bags,
                    'quantity_kg' => -(float) ($batch->quantity_kg ?? 0),
                    'quantity_available' => $newProductBags,
                    'unit' => 'bag',
                    'last_updated' => now(),
                ]);
            }
        }

        $batch->materials()->delete();
        $batch->update(['inventory_applied_at' => null]);
    }
}
