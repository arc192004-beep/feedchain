<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use App\Models\DistributionItem;
use App\Models\Buyer;
use App\Models\FeedProduct;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DistributionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $items = Distribution::with('buyer')->paginate(15);
        return view('distributions.index', compact('items'));
    }

    public function create()
    {
        $buyers = Buyer::all();
        $products = FeedProduct::all();
        return view('distributions.create', compact('buyers','products'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'distribution_no' => 'required|unique:distributions,distribution_no',
            'buyer_id' => 'required|exists:buyers,id',
            'distribution_date' => 'required|date',
            'items' => 'required|array',
        ]);

        DB::transaction(function () use ($data, $request) {
            $userId = $request->user()->id;
            $totalQty = 0;
            $dist = Distribution::create([
                'distribution_no' => $data['distribution_no'],
                'buyer_id' => $data['buyer_id'],
                'distribution_date' => $data['distribution_date'],
                'remarks' => $request->get('remarks'),
                'created_by' => $userId,
            ]);

            foreach ($data['items'] as $it) {
                $product = FeedProduct::find($it['feed_product_id']);
                $qty = $it['quantity'];
                $subtotal = isset($it['unit_price']) ? ($it['unit_price'] * $qty) : null;
                DistributionItem::create([
                    'distribution_id' => $dist->id,
                    'feed_product_id' => $it['feed_product_id'],
                    'quantity' => $qty,
                    'unit_price' => $it['unit_price'] ?? null,
                    'subtotal' => $subtotal,
                ]);

                // inventory out for finished product
                Inventory::create([
                    'item_type' => 'finished_product',
                    'feed_product_id' => $product->id,
                    'movement_type' => 'out',
                    'quantity' => $qty,
                    'balance_after' => null,
                    'transaction_date' => now(),
                    'remarks' => 'Distribution ' . $dist->distribution_no,
                ]);

                $totalQty += $qty;
            }

            $dist->total_quantity = $totalQty;
            $dist->save();
        });

        return redirect()->route('distributions.index')->with('success','Distribution recorded');
    }
}
