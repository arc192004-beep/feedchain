<?php

namespace App\Http\Controllers;

use App\Models\FeedFormulation;
use App\Models\FeedFormulationItem;
use App\Models\FeedProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedFormulationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $items = FeedFormulation::with('feedProduct')->paginate(15);
        return view('feed_formulations.index', compact('items'));
    }

    public function create()
    {
        $products = FeedProduct::all();
        return view('feed_formulations.create', compact('products'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'feed_product_id' => 'required|exists:feed_products,id',
            'formula_name' => 'required|string',
            'batch_size_kg' => 'required|numeric',
            'items' => 'required|array',
        ]);

        DB::transaction(function () use ($data, $request) {
            $form = FeedFormulation::create([
                'feed_product_id' => $data['feed_product_id'],
                'formula_name' => $data['formula_name'],
                'batch_size_kg' => $data['batch_size_kg'],
                'notes' => $request->get('notes'),
            ]);

            foreach ($request->get('items') as $item) {
                FeedFormulationItem::create([
                    'feed_formulation_id' => $form->id,
                    'raw_material_id' => $item['raw_material_id'],
                    'quantity_required' => $item['quantity_required'],
                    'unit' => $item['unit'] ?? 'kg',
                ]);
            }
        });

        return redirect()->route('feed_formulations.index')->with('success','Formulation saved');
    }

    public function show(FeedFormulation $feed_formulation)
    {
        $feed_formulation->load('items.rawMaterial','feedProduct');
        return view('feed_formulations.show', ['form'=>$feed_formulation]);
    }

    public function edit(FeedFormulation $feed_formulation)
    {
        $products = FeedProduct::all();
        $feed_formulation->load('items');
        return view('feed_formulations.edit', compact('feed_formulation','products'));
    }

    public function update(Request $request, FeedFormulation $feed_formulation)
    {
        $data = $request->validate([
            'feed_product_id' => 'required|exists:feed_products,id',
            'formula_name' => 'required|string',
            'batch_size_kg' => 'required|numeric',
            'items' => 'nullable|array',
        ]);

        DB::transaction(function () use ($data, $request, $feed_formulation) {
            $feed_formulation->update([
                'feed_product_id' => $data['feed_product_id'],
                'formula_name' => $data['formula_name'],
                'batch_size_kg' => $data['batch_size_kg'],
                'notes' => $request->get('notes'),
            ]);

            if ($request->has('items')) {
                $feed_formulation->items()->delete();
                foreach ($request->get('items') as $item) {
                    FeedFormulationItem::create([
                        'feed_formulation_id' => $feed_formulation->id,
                        'raw_material_id' => $item['raw_material_id'],
                        'quantity_required' => $item['quantity_required'],
                        'unit' => $item['unit'] ?? 'kg',
                    ]);
                }
            }
        });

        return redirect()->route('feed_formulations.index')->with('success','Updated');
    }

    public function destroy(FeedFormulation $feed_formulation)
    {
        $feed_formulation->delete();
        return redirect()->route('feed_formulations.index')->with('success','Deleted');
    }
}
