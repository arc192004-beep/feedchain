<?php

namespace App\Http\Controllers;

use App\Models\RawMaterial;
use Illuminate\Http\Request;

class RawMaterialController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $q = $request->get('q');
        $query = RawMaterial::query();
        if ($q) $query->where('material_name', 'like', "%{$q}%")->orWhere('material_code', 'like', "%{$q}%");
        $materials = $query->paginate(15);
        return view('raw_materials.index', compact('materials'));
    }

    public function create()
    {
        return view('raw_materials.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'material_code' => 'required|unique:raw_materials,material_code',
            'material_name' => 'required',
            'material_type' => 'required',
            'unit' => 'required',
            'current_stock' => 'nullable|numeric',
        ]);

        RawMaterial::create($data);
        return redirect()->route('raw_materials.index')->with('success','Raw material created');
    }

    public function show(RawMaterial $raw_material)
    {
        return view('raw_materials.show', ['material'=>$raw_material]);
    }

    public function edit(RawMaterial $raw_material)
    {
        return view('raw_materials.edit', ['material'=>$raw_material]);
    }

    public function update(Request $request, RawMaterial $raw_material)
    {
        $data = $request->validate([
            'material_code' => 'required|unique:raw_materials,material_code,' . $raw_material->id,
            'material_name' => 'required',
            'material_type' => 'required',
            'unit' => 'required',
            'current_stock' => 'nullable|numeric',
        ]);

        $raw_material->update($data);
        return redirect()->route('raw_materials.index')->with('success','Updated');
    }

    public function destroy(RawMaterial $raw_material)
    {
        $raw_material->delete();
        return redirect()->route('raw_materials.index')->with('success','Deleted');
    }
}
