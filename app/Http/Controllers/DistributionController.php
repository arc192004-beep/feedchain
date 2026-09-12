<?php

namespace App\Http\Controllers;

use App\Models\Buyer;
use App\Models\Distribution;
use App\Models\DistributionItem;
use App\Models\FeedProduct;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DistributionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $query = Distribution::with(['buyer', 'items.feedProduct'])->orderByDesc('id');

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('distribution_number', 'like', "%{$search}%")
                    ->orWhere('buyer_name', 'like', "%{$search}%")
                    ->orWhereHas('buyer', function ($bq) use ($search) {
                        $bq->where('buyer_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('items.feedProduct', function ($pq) use ($search) {
                        $pq->where('product_name', 'like', "%{$search}%")
                           ->orWhere('product_code', 'like', "%{$search}%");
                    });
            });
        }

        $items = $query->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($items);
        }

        return view('distributions.index', compact('items'));
    }

    public function create()
    {
        return view('distributions.create', ['buyers' => Buyer::all(), 'products' => FeedProduct::all()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'buyer_id' => 'required|exists:buyers,id',
            'distribution_date' => 'required|date',
            'feed_product_id' => 'required|exists:feed_products,id',
            'quantity' => 'required|numeric|min:1',
            'remarks' => 'nullable|string|max:1000',
        ]);

        $distribution = DB::transaction(function () use ($data, $request) {
            $buyer = Buyer::findOrFail($data['buyer_id']);
            $product = FeedProduct::lockForUpdate()->findOrFail($data['feed_product_id']);
            $requestedQty = (float) $data['quantity'];

            abort_if(
                (float) $product->quantity_bags < $requestedQty,
                422,
                "Insufficient finished feed stock: only {$product->quantity_bags} bags of '{$product->product_name}' available in the warehouse, but {$requestedQty} bags requested."
            );

            $number = 'DIST-' . now()->format('Ymd') . '-' . str_pad((string) (Distribution::max('id') + 1), 4, '0', STR_PAD_LEFT);
            $amount = (float) $product->price * $requestedQty;

            $distribution = Distribution::create([
                'distribution_number' => $number,
                'transaction_number' => $number,
                'buyer_id' => $buyer->id,
                'buyer_name' => $buyer->buyer_name ?? $buyer->name,
                'address' => $buyer->address,
                'contact_number' => $buyer->contact_number,
                'distribution_date' => $data['distribution_date'],
                'delivery_date' => $data['distribution_date'],
                'total_quantity' => $requestedQty,
                'total_amount' => $amount,
                'remarks' => $data['remarks'] ?? null,
                'status' => 'completed',
                'encoded_by' => $request->user()->id,
                'user_id' => $request->user()->id,
            ]);

            DistributionItem::create([
                'distribution_id' => $distribution->id,
                'feed_product_id' => $product->id,
                'quantity' => $requestedQty,
                'unit_price' => $product->price,
                'line_total' => $amount,
            ]);

            $newOnHand = max(0.0, (float) $product->quantity_bags - $requestedQty);
            $product->quantity_bags = $newOnHand;
            $product->save();

            Inventory::create([
                'inventory_type' => 'finished_product',
                'feed_product_id' => $product->id,
                'quantity' => -$requestedQty,
                'quantity_available' => $newOnHand,
                'unit' => 'bag',
                'last_updated' => now(),
            ]);

            return $distribution->load('buyer', 'items.feedProduct');
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($distribution, 201);
        }

        return redirect()->route('distributions.index')->with('success', 'Distribution recorded successfully.');
    }

    public function show(Distribution $distribution)
    {
        $distribution->load('buyer', 'items.feedProduct');
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($distribution);
        }
        return view('distributions.show', compact('distribution'));
    }

    public function edit(Distribution $distribution)
    {
        $distribution->load('items', 'buyer');
        return view('distributions.edit', [
            'distribution' => $distribution,
            'buyers' => Buyer::all(),
            'products' => FeedProduct::all(),
        ]);
    }

    public function update(Request $request, Distribution $distribution)
    {
        $data = $request->validate([
            'buyer_id' => 'required|exists:buyers,id',
            'distribution_date' => 'required|date',
            'feed_product_id' => 'required|exists:feed_products,id',
            'quantity' => 'required|numeric|min:1',
            'remarks' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($data, $distribution) {
            // Reverse old distribution inventory
            $this->reverseDistribution($distribution);

            $buyer = Buyer::findOrFail($data['buyer_id']);
            $product = FeedProduct::lockForUpdate()->findOrFail($data['feed_product_id']);
            $requestedQty = (float) $data['quantity'];

            abort_if(
                (float) $product->quantity_bags < $requestedQty,
                422,
                "Insufficient finished feed stock: only {$product->quantity_bags} bags of '{$product->product_name}' available in the warehouse, but {$requestedQty} bags requested."
            );

            $amount = (float) $product->price * $requestedQty;

            $distribution->update([
                'buyer_id' => $buyer->id,
                'buyer_name' => $buyer->buyer_name ?? $buyer->name,
                'address' => $buyer->address,
                'contact_number' => $buyer->contact_number,
                'distribution_date' => $data['distribution_date'],
                'delivery_date' => $data['distribution_date'],
                'total_quantity' => $requestedQty,
                'total_amount' => $amount,
                'remarks' => $data['remarks'] ?? null,
            ]);

            $distribution->items()->delete();
            DistributionItem::create([
                'distribution_id' => $distribution->id,
                'feed_product_id' => $product->id,
                'quantity' => $requestedQty,
                'unit_price' => $product->price,
                'line_total' => $amount,
            ]);

            $newOnHand = max(0.0, (float) $product->quantity_bags - $requestedQty);
            $product->quantity_bags = $newOnHand;
            $product->save();

            Inventory::create([
                'inventory_type' => 'finished_product',
                'feed_product_id' => $product->id,
                'quantity' => -$requestedQty,
                'quantity_available' => $newOnHand,
                'unit' => 'bag',
                'last_updated' => now(),
            ]);
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($distribution->fresh(['buyer', 'items.feedProduct']), 200);
        }

        return redirect()->route('distributions.index')->with('success', 'Distribution updated successfully.');
    }

    public function destroy(Distribution $distribution)
    {
        DB::transaction(function () use ($distribution) {
            $this->reverseDistribution($distribution);
            $distribution->items()->delete();
            $distribution->delete();
        });

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('distributions.index')->with('success', 'Distribution deleted and inventory restored.');
    }

    private function reverseDistribution(Distribution $distribution): void
    {
        $distribution->load('items.feedProduct');

        foreach ($distribution->items as $item) {
            $product = $item->feedProduct;
            if ($product) {
                $lockedProduct = FeedProduct::lockForUpdate()->find($product->id);
                if ($lockedProduct) {
                    $qty = (float) $item->quantity;
                    $newOnHand = (float) $lockedProduct->quantity_bags + $qty;
                    $lockedProduct->quantity_bags = $newOnHand;
                    $lockedProduct->save();

                    Inventory::create([
                        'inventory_type' => 'finished_product',
                        'feed_product_id' => $lockedProduct->id,
                        'quantity' => $qty,
                        'quantity_available' => $newOnHand,
                        'unit' => 'bag',
                        'last_updated' => now(),
                    ]);
                }
            }
        }
    }
}
