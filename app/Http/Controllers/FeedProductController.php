<?php

namespace App\Http\Controllers;

use App\Models\FeedProduct;
use Illuminate\Http\Request;

class FeedProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $q = $request->get('q');
        $query = FeedProduct::query();
        if ($q) $query->where('feed_name','like',"%{$q}%")->orWhere('product_code','like',"%{$q}%");
        $items = $query->paginate(15);
        return view('feed_products.index', compact('items'));
    }

    public function create()
    {
        return view('feed_products.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_code' => 'required|unique:feed_products,product_code',
            'feed_name' => 'required',
            'feed_type' => 'required',
            'unit_weight_kg' => 'required|numeric',
        ]);

        FeedProduct::create($data);
        return redirect()->route('feed_products.index')->with('success','Feed product created');
    }

    public function show(FeedProduct $feed_product)
    {
        return view('feed_products.show', ['product'=>$feed_product]);
    }

    public function edit(FeedProduct $feed_product)
    {
        return view('feed_products.edit', ['product'=>$feed_product]);
    }

    public function update(Request $request, FeedProduct $feed_product)
    {
        $data = $request->validate([
            'product_code' => 'required|unique:feed_products,product_code,' . $feed_product->id,
            'feed_name' => 'required',
            'feed_type' => 'required',
            'unit_weight_kg' => 'required|numeric',
        ]);

        $feed_product->update($data);
        return redirect()->route('feed_products.index')->with('success','Updated');
    }

    public function destroy(FeedProduct $feed_product)
    {
        $feed_product->delete();
        return redirect()->route('feed_products.index')->with('success','Deleted');
    }
}
