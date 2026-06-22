<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\FeedProduct;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $items = Sale::with('customer')->paginate(15);
        return view('sales.index', compact('items'));
    }

    public function create()
    {
        $customers = Customer::all();
        $products = FeedProduct::all();
        return view('sales.create', compact('customers','products'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sale_no' => 'required|unique:sales,sale_no',
            'customer_id' => 'required|exists:customers,id',
            'sale_date' => 'required|date',
            'items' => 'required|array',
        ]);

        DB::transaction(function () use ($data, $request) {
            $userId = $request->user()->id;
            $totalAmount = 0;
            $sale = Sale::create([
                'sale_no' => $data['sale_no'],
                'customer_id' => $data['customer_id'],
                'sale_date' => $data['sale_date'],
                'remarks' => $request->get('remarks'),
                'created_by' => $userId,
            ]);

            foreach ($data['items'] as $it) {
                $product = FeedProduct::find($it['feed_product_id']);
                $qty = $it['quantity'];
                $subtotal = $it['unit_price'] * $qty;
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'feed_product_id' => $it['feed_product_id'],
                    'quantity' => $qty,
                    'unit_price' => $it['unit_price'],
                    'subtotal' => $subtotal,
                ]);

                Inventory::create([
                    'item_type' => 'finished_product',
                    'feed_product_id' => $product->id,
                    'movement_type' => 'out',
                    'quantity' => $qty,
                    'balance_after' => null,
                    'transaction_date' => now(),
                    'remarks' => 'Sale ' . $sale->sale_no,
                ]);

                $totalAmount += $subtotal;
            }

            $sale->total_amount = $totalAmount;
            $sale->save();
        });

        return redirect()->route('sales.index')->with('success','Sale recorded');
    }
}
