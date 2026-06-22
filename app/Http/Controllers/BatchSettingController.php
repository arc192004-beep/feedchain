<?php

namespace App\Http\Controllers;

use App\Models\BatchSetting;
use App\Models\FeedProduct;
use Illuminate\Http\Request;

class BatchSettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $items = BatchSetting::with('feedProduct')->paginate(15);
        return view('batch_settings.index', compact('items'));
    }

    public function create()
    {
        $products = FeedProduct::all();
        return view('batch_settings.create', compact('products'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'setting_name' => 'required',
            'feed_product_id' => 'nullable|exists:feed_products,id',
            'standard_batch_kg' => 'required|numeric',
            'sacks_per_batch' => 'nullable|integer',
        ]);

        BatchSetting::create($data);
        return redirect()->route('batch_settings.index')->with('success','Saved');
    }

    public function edit(BatchSetting $batch_setting)
    {
        $products = FeedProduct::all();
        return view('batch_settings.edit', compact('batch_setting','products'));
    }

    public function update(Request $request, BatchSetting $batch_setting)
    {
        $data = $request->validate([
            'setting_name' => 'required',
            'feed_product_id' => 'nullable|exists:feed_products,id',
            'standard_batch_kg' => 'required|numeric',
            'sacks_per_batch' => 'nullable|integer',
        ]);

        $batch_setting->update($data);
        return redirect()->route('batch_settings.index')->with('success','Updated');
    }

    public function destroy(BatchSetting $batch_setting)
    {
        $batch_setting->delete();
        return redirect()->route('batch_settings.index')->with('success','Deleted');
    }
}
