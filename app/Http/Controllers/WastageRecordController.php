<?php

namespace App\Http\Controllers;

use App\Models\WastageRecord;
use App\Models\RawMaterial;
use Illuminate\Http\Request;

class WastageRecordController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $items = WastageRecord::with('rawMaterial')->paginate(15);
        return view('wastage_records.index', compact('items'));
    }

    public function create()
    {
        $materials = RawMaterial::all();
        return view('wastage_records.create', compact('materials'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'raw_material_id' => 'nullable|exists:raw_materials,id',
            'wastage_type' => 'required',
            'quantity' => 'required|numeric',
            'date_recorded' => 'required|date',
        ]);

        WastageRecord::create($data);
        return redirect()->route('wastage_records.index')->with('success','Saved');
    }
}
