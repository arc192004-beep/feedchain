<?php

namespace App\Http\Controllers;

use App\Models\FeedProduct;
use App\Models\Inventory;
use App\Models\RawMaterial;
use App\Models\StockAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $rawMaterials = RawMaterial::orderBy('material_name')->get();
        $feedProducts = FeedProduct::orderBy('product_name')->get();

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'raw_materials' => $rawMaterials,
                'feed_products' => $feedProducts,
            ]);
        }

        return view('inventory.index', compact('rawMaterials', 'feedProducts'));
    }

    public function movements(Request $request)
    {
        $query = Inventory::with(['rawMaterial', 'feedProduct'])->orderByDesc('id');

        if ($type = $request->get('type')) {
            $query->where('inventory_type', $type);
        }

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('rawMaterial', function ($rq) use ($search) {
                    $rq->where('material_name', 'like', "%{$search}%")
                       ->orWhere('material_code', 'like', "%{$search}%");
                })->orWhereHas('feedProduct', function ($fq) use ($search) {
                    $fq->where('product_name', 'like', "%{$search}%")
                       ->orWhere('product_code', 'like', "%{$search}%");
                });
            });
        }

        $movements = $query->paginate(20);

        return response()->json($movements);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'item_type' => 'required|in:raw_material,finished_product',
            'item_id' => 'required|integer',
            'adjustment_type' => 'nullable|string|in:Stock In,Stock Out,Adjustment',
            'quantity' => 'required|numeric|not_in:0',
            'remarks' => 'nullable|string|max:1000',
        ]);

        $result = DB::transaction(function () use ($data) {
            if ($data['item_type'] === 'raw_material') {
                $item = RawMaterial::lockForUpdate()->findOrFail($data['item_id']);
                $current = (float) $item->quantity_on_hand;
                $delta = (float) $data['quantity'];
                $next = $current + $delta;

                abort_if(
                    $next < 0,
                    422,
                    "Raw material physical stock cannot drop below zero. Current stock is {$current} {$item->unit}, adjustment requested was {$delta} {$item->unit}."
                );

                $item->quantity_on_hand = $next;
                $item->quantity = $next;
                $item->save();

                $inventory = Inventory::create([
                    'inventory_type' => 'raw_material',
                    'raw_material_id' => $item->id,
                    'quantity' => $delta,
                    'quantity_available' => $next,
                    'unit' => $item->unit ?: 'kg',
                    'last_updated' => now(),
                ]);

                if ($next <= (float) $item->reorder_level) {
                    StockAlert::updateOrCreate(
                        ['raw_material_id' => $item->id, 'status' => 'active'],
                        [
                            'inventory_type' => 'raw_material',
                            'current_quantity' => $next,
                            'threshold_quantity' => $item->reorder_level,
                            'alert_level' => 'low_stock',
                            'alert_message' => "Low stock: {$item->material_name} is at {$next} {$item->unit}",
                        ]
                    );
                }

                return [
                    'item' => $item->fresh(),
                    'inventory' => $inventory,
                    'item_type' => 'raw_material'
                ];
            } else {
                $item = FeedProduct::lockForUpdate()->findOrFail($data['item_id']);
                $current = (float) $item->quantity_bags;
                $delta = (float) $data['quantity'];
                $next = $current + $delta;

                abort_if(
                    $next < 0,
                    422,
                    "Finished product stock cannot drop below zero. Current stock is {$current} bags, adjustment requested was {$delta} bags."
                );

                $item->quantity_bags = $next;
                $item->save();

                $inventory = Inventory::create([
                    'inventory_type' => 'finished_product',
                    'feed_product_id' => $item->id,
                    'quantity' => $delta,
                    'quantity_available' => $next,
                    'unit' => 'bag',
                    'last_updated' => now(),
                ]);

                if ($next <= (float) $item->min_stock_bags) {
                    StockAlert::updateOrCreate(
                        ['feed_product_id' => $item->id, 'status' => 'active'],
                        [
                            'inventory_type' => 'finished_product',
                            'current_quantity' => $next,
                            'threshold_quantity' => $item->min_stock_bags,
                            'alert_level' => 'low_stock',
                            'alert_message' => "Low stock: {$item->product_name} is at {$next} bags",
                        ]
                    );
                }

                return [
                    'item' => $item->fresh(),
                    'inventory' => $inventory,
                    'item_type' => 'finished_product'
                ];
            }
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($result, 201);
        }

        return redirect()->route('inventory.index')->with('success', 'Inventory adjustment logged successfully.');
    }
}
