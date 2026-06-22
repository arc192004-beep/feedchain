<?php

namespace App\Http\Controllers;

use App\Models\ProductionBatch;
use App\Models\FeedFormulation;
use App\Models\FeedFormulationItem;
use App\Models\ProductionMaterialUsage;
use App\Models\RawMaterial;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductionBatchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $batches = ProductionBatch::with('feedProduct','formulation')->paginate(15);
        return view('production_batches.index', compact('batches'));
    }

    public function create()
    {
        return view('production_batches.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'batch_no' => 'required|unique:production_batches,batch_no',
            'feed_product_id' => 'required|exists:feed_products,id',
            'feed_formulation_id' => 'required|exists:feed_formulations,id',
            'batch_setting_id' => 'nullable|exists:batch_settings,id',
            'production_date' => 'required|date',
            'quantity_kg' => 'required|numeric',
            'sacks_produced' => 'nullable|integer',
        ]);

        DB::transaction(function () use ($data, $request) {
            $userId = $request->user()->id;
            $batch = ProductionBatch::create([
                'batch_no' => $data['batch_no'],
                'feed_product_id' => $data['feed_product_id'],
                'feed_formulation_id' => $data['feed_formulation_id'],
                'batch_setting_id' => $data['batch_setting_id'] ?? null,
                'production_date' => $data['production_date'],
                'quantity_kg' => $data['quantity_kg'],
                'sacks_produced' => $data['sacks_produced'] ?? 0,
                'status' => 'completed',
                'notes' => $request->get('notes'),
                'created_by' => $userId,
            ]);

            $formulation = FeedFormulation::findOrFail($data['feed_formulation_id']);
            $items = FeedFormulationItem::where('feed_formulation_id', $formulation->id)->get();

            $ratio = $data['quantity_kg'] / max(1, $formulation->batch_size_kg);

            foreach ($items as $item) {
                $qtyUsed = round($item->quantity_required * $ratio, 3);
                ProductionMaterialUsage::create([
                    'production_batch_id' => $batch->id,
                    'raw_material_id' => $item->raw_material_id,
                    'quantity_used' => $qtyUsed,
                    'unit' => $item->unit,
                ]);

                // Deduct raw material stock
                $rm = RawMaterial::find($item->raw_material_id);
                if ($rm) {
                    $rm->current_stock = max(0, $rm->current_stock - $qtyUsed);
                    $rm->save();

                    // inventory out
                    Inventory::create([
                        'item_type' => 'raw_material',
                        'raw_material_id' => $rm->id,
                        'movement_type' => 'out',
                        'quantity' => $qtyUsed,
                        'balance_after' => $rm->current_stock,
                        'transaction_date' => now(),
                        'remarks' => 'Used in production batch ' . $batch->batch_no,
                    ]);

                    // stock alerts
                    if ($rm->current_stock <= $rm->critical_level) {
                        \App\Models\StockAlert::create([
                            'raw_material_id' => $rm->id,
                            'alert_type' => 'critical_stock',
                            'message' => "Critical stock: {$rm->material_name}",
                            'status' => 'active',
                        ]);
                    } elseif ($rm->current_stock <= $rm->reorder_level) {
                        \App\Models\StockAlert::create([
                            'raw_material_id' => $rm->id,
                            'alert_type' => 'low_stock',
                            'message' => "Low stock: {$rm->material_name}",
                            'status' => 'active',
                        ]);
                    }
                }
            }

            // Add finished product inventory
            Inventory::create([
                'item_type' => 'finished_product',
                'feed_product_id' => $data['feed_product_id'],
                'movement_type' => 'in',
                'quantity' => $data['quantity_kg'],
                'balance_after' => null,
                'transaction_date' => now(),
                'remarks' => 'Produced in batch ' . $batch->batch_no,
            ]);
        });

        return redirect()->route('production_batches.index')->with('success','Production batch recorded');
    }

    public function show(ProductionBatch $production_batch)
    {
        $production_batch->load('usages.rawMaterial','feedProduct','formulation');
        return view('production_batches.show', ['batch'=>$production_batch]);
    }
}
