<?php

namespace App\Http\Controllers;

use App\Models\DistributionItem;
use App\Models\FeedFormula;
use App\Models\FeedProduct;
use App\Models\Inventory;
use App\Models\ProductionBatch;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedProductController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $query = FeedProduct::query();

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%")
                    ->orWhere('feed_type', 'like', "%{$search}%");
            });
        }

        if ($type = $request->get('feed_type')) {
            $query->where('feed_type', $type);
        }

        if ($status = $request->get('status')) {
            $query->where('status', strtolower($status));
        }

        $products = $query->orderBy('product_name')->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($products);
        }

        return view('feed_products.index', compact('products'));
    }

    public function create()
    {
        return view('feed_products.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_code' => ['required', 'string', 'max:50', $this->workspaceUnique('feed_products', 'product_code')],
            'product_name' => 'required|string|max:255',
            'feed_type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'unit' => 'nullable|string|max:20',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'quantity_bags' => 'required|numeric|min:0',
            'min_stock_bags' => 'required|numeric|min:0',
            'bag_weight_kg' => 'required|numeric|min:0.001',
        ]);

        $data['name'] = $data['product_name'];
        $data['unit'] = $data['unit'] ?? 'bag';

        $product = DB::transaction(function () use ($data) {
            $prod = FeedProduct::create($data);

            if ((float) $prod->quantity_bags > 0) {
                Inventory::create([
                    'inventory_type' => 'finished_product',
                    'feed_product_id' => $prod->id,
                    'quantity' => (float) $prod->quantity_bags,
                    'quantity_available' => (float) $prod->quantity_bags,
                    'unit' => 'bag',
                    'last_updated' => now(),
                ]);
            }

            return $prod;
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($product, 201);
        }

        return redirect()->route('feed_products.index')->with('success', 'Feed product created successfully.');
    }

    public function show(FeedProduct $feed_product)
    {
        $feed_product->load('formulas');
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($feed_product);
        }
        return view('feed_products.show', ['product' => $feed_product]);
    }

    public function edit(FeedProduct $feed_product)
    {
        return view('feed_products.edit', ['product' => $feed_product]);
    }

    public function update(Request $request, FeedProduct $feed_product)
    {
        $data = $request->validate([
            'product_code' => ['required', 'string', 'max:50', $this->workspaceUnique('feed_products', 'product_code', $feed_product->id)],
            'product_name' => 'required|string|max:255',
            'feed_type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'unit' => 'nullable|string|max:20',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'quantity_bags' => 'required|numeric|min:0',
            'min_stock_bags' => 'required|numeric|min:0',
            'bag_weight_kg' => 'required|numeric|min:0.001',
        ]);

        $data['name'] = $data['product_name'];
        $feed_product->update($data);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($feed_product, 200);
        }

        return redirect()->route('feed_products.index')->with('success', 'Feed product updated successfully.');
    }

    public function destroy(FeedProduct $feed_product)
    {
        if (FeedFormula::where('feed_product_id', $feed_product->id)->exists()) {
            abort(422, 'Cannot delete feed product because it is referenced in formulations.');
        }

        if (ProductionBatch::where('feed_product_id', $feed_product->id)->exists()) {
            abort(422, 'Cannot delete feed product because it is referenced in production batch records.');
        }

        if (DistributionItem::where('feed_product_id', $feed_product->id)->exists()) {
            abort(422, 'Cannot delete feed product because it is referenced in distribution delivery history.');
        }

        if (SaleItem::where('feed_product_id', $feed_product->id)->exists()) {
            abort(422, 'Cannot delete feed product because it is referenced in customer sales history.');
        }

        $feed_product->delete();

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('feed_products.index')->with('success', 'Feed product deleted successfully.');
    }
}
