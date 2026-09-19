<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\FeedProduct;
use App\Models\Inventory;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'items.feedProduct'])->latest('sale_date');

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('customer', function ($cq) use ($search) {
                    $cq->where('name', 'like', "%{$search}%");
                })->orWhereHas('items.feedProduct', function ($pq) use ($search) {
                    $pq->where('product_name', 'like', "%{$search}%")
                       ->orWhere('product_code', 'like', "%{$search}%");
                });
            });
        }

        $sales = $query->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($sales);
        }

        return view('sales.index', compact('sales'));
    }

    public function store(Request $request)
    {
        $sale = DB::transaction(fn () => $this->saveSale($request, null));

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($sale, 201);
        }

        return redirect()->route('sales.index')->with('success', 'Customer sale recorded successfully.');
    }

    public function show(Sale $sale)
    {
        $sale->load(['customer', 'items.feedProduct']);
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($sale);
        }
        return view('sales.show', compact('sale'));
    }

    public function update(Request $request, Sale $sale)
    {
        $updatedSale = DB::transaction(fn () => $this->saveSale($request, $sale));

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($updatedSale, 200);
        }

        return redirect()->route('sales.index')->with('success', 'Customer sale updated successfully.');
    }

    public function destroy(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            $sale->load('items.feedProduct');

            foreach ($sale->items as $item) {
                $this->restoreStock($item->feed_product_id, (float) $item->quantity, "Sale #{$sale->id} deletion reversal");
            }

            $sale->items()->delete();
            $sale->delete();
        });

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('sales.index')->with('success', 'Sale deleted and stock restored.');
    }

    private function saveSale(Request $request, ?Sale $sale): Sale
    {
        $data = $request->validate([
            'customer_id' => ['required', $this->workspaceExists('customers')],
            'sale_date' => 'required|date',
            'status' => 'nullable|in:completed,pending,cancelled',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.feed_product_id' => ['required', $this->workspaceExists('feed_products')],
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        Customer::findOrFail($data['customer_id']);

        // If editing existing sale, restore previous items stock first
        if ($sale) {
            $sale->load('items');
            foreach ($sale->items as $oldItem) {
                $this->restoreStock($oldItem->feed_product_id, (float) $oldItem->quantity, "Sale #{$sale->id} update reversal");
            }
            $sale->items()->delete();
        } else {
            $sale = new Sale();
        }

        // Validate stock for all new items before applying deductions
        foreach ($data['items'] as $itemData) {
            $product = FeedProduct::lockForUpdate()->findOrFail($itemData['feed_product_id']);
            $qty = (float) $itemData['quantity'];
            abort_if(
                (float) $product->quantity_bags < $qty,
                422,
                "Insufficient stock for '{$product->product_name}': only {$product->quantity_bags} bags in stock, but {$qty} requested."
            );
        }

        // Calculate automatic totals
        $totalAmount = 0.0;
        $totalQuantity = 0.0;

        foreach ($data['items'] as $itemData) {
            $subtotal = (float) $itemData['quantity'] * (float) $itemData['unit_price'];
            $totalAmount += $subtotal;
            $totalQuantity += (float) $itemData['quantity'];
        }

        $sale->fill([
            'customer_id' => $data['customer_id'],
            'sale_date' => $data['sale_date'],
            'sales_date' => $data['sale_date'],
            'total_amount' => $totalAmount,
            'status' => $data['status'] ?? 'completed',
            'notes' => $data['notes'] ?? null,
            'feed_product_id' => $data['items'][0]['feed_product_id'],
            'quantity' => $totalQuantity,
        ]);

        if (! $sale->exists) {
            // `sales_number` is uniquely indexed, so include the workspace to
            // keep two workspaces from generating the same value.
            $sale->sales_number = 'SALE-'.auth()->user()?->workspace_id.'-' . str_pad((string) (Sale::max('id') + 1), 4, '0', STR_PAD_LEFT);
        }

        $sale->save();

        // Apply deductions and record items
        foreach ($data['items'] as $itemData) {
            $qty = (float) $itemData['quantity'];
            $unitPrice = (float) $itemData['unit_price'];
            $subtotal = $qty * $unitPrice;

            $this->deductStock($itemData['feed_product_id'], $qty, "Sale #{$sale->id}");

            $sale->items()->create([
                'feed_product_id' => $itemData['feed_product_id'],
                'quantity' => $qty,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
            ]);
        }

        return $sale->fresh(['customer', 'items.feedProduct']);
    }

    private function deductStock(int $productId, float $quantity, string $reason): void
    {
        $product = FeedProduct::lockForUpdate()->findOrFail($productId);
        $next = max(0.0, (float) $product->quantity_bags - $quantity);
        $product->update(['quantity_bags' => $next]);

        Inventory::create([
            'inventory_type' => 'finished_product',
            'feed_product_id' => $product->id,
            'quantity' => -$quantity,
            'quantity_available' => $next,
            'unit' => 'bag',
            'last_updated' => now(),
        ]);
    }

    private function restoreStock(int $productId, float $quantity, string $reason): void
    {
        $product = FeedProduct::lockForUpdate()->find($productId);
        if ($product) {
            $next = (float) $product->quantity_bags + $quantity;
            $product->update(['quantity_bags' => $next]);

            Inventory::create([
                'inventory_type' => 'finished_product',
                'feed_product_id' => $product->id,
                'quantity' => $quantity,
                'quantity_available' => $next,
                'unit' => 'bag',
                'last_updated' => now(),
            ]);
        }
    }
}
