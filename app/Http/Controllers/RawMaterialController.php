<?php

namespace App\Http\Controllers;

use App\Models\FormulaItem;
use App\Models\Inventory;
use App\Models\ProductionBatchMaterial;
use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RawMaterialController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $query = RawMaterial::query();

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('material_name', 'like', "%{$search}%")
                    ->orWhere('material_code', 'like', "%{$search}%")
                    ->orWhere('material_type', 'like', "%{$search}%");
            });
        }

        if ($request->get('low_stock')) {
            $query->whereColumn('quantity_on_hand', '<=', 'reorder_level');
        }

        if ($status = $request->get('status')) {
            $query->where('status', strtolower($status));
        }

        $materials = $query->orderBy('material_name')->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($materials);
        }

        return view('raw_materials.index', compact('materials'));
    }

    public function create()
    {
        return view('raw_materials.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'material_code' => 'required|string|max:50|unique:raw_materials,material_code',
            'material_name' => 'required|string|max:255',
            'material_type' => 'required|string|max:100',
            'unit' => 'required|string|max:20',
            'quantity_on_hand' => 'required|numeric|min:0',
            'reorder_level' => 'required|numeric|min:0',
            'cost_per_unit' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        $material = DB::transaction(function () use ($data) {
            $mat = RawMaterial::create($this->withLegacyFields($data));

            if ((float) $mat->quantity_on_hand > 0) {
                Inventory::create([
                    'inventory_type' => 'raw_material',
                    'raw_material_id' => $mat->id,
                    'quantity' => (float) $mat->quantity_on_hand,
                    'quantity_available' => (float) $mat->quantity_on_hand,
                    'unit' => $mat->unit,
                    'last_updated' => now(),
                ]);
            }

            return $mat;
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($material, 201);
        }

        return redirect()->route('raw_materials.index')->with('success', 'Raw material created successfully.');
    }

    public function show(RawMaterial $raw_material)
    {
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($raw_material);
        }
        return view('raw_materials.show', ['material' => $raw_material]);
    }

    public function edit(RawMaterial $raw_material)
    {
        return view('raw_materials.edit', ['material' => $raw_material]);
    }

    public function update(Request $request, RawMaterial $raw_material)
    {
        $data = $request->validate([
            'material_code' => 'required|string|max:50|unique:raw_materials,material_code,' . $raw_material->id,
            'material_name' => 'required|string|max:255',
            'material_type' => 'required|string|max:100',
            'unit' => 'required|string|max:20',
            'quantity_on_hand' => 'required|numeric|min:0',
            'reorder_level' => 'required|numeric|min:0',
            'cost_per_unit' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        $raw_material->update($this->withLegacyFields($data));

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($raw_material, 200);
        }

        return redirect()->route('raw_materials.index')->with('success', 'Raw material updated successfully.');
    }

    public function destroy(RawMaterial $raw_material)
    {
        if (FormulaItem::where('raw_material_id', $raw_material->id)->exists()) {
            abort(422, 'Cannot delete raw material because it is referenced in formulations.');
        }

        if (ProductionBatchMaterial::where('raw_material_id', $raw_material->id)->exists()) {
            abort(422, 'Cannot delete raw material because it is referenced in production batch history.');
        }

        $raw_material->delete();

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('raw_materials.index')->with('success', 'Raw material deleted successfully.');
    }

    private function withLegacyFields(array $data): array
    {
        $data['name'] = $data['material_name'];
        $data['category'] = $data['material_type'];
        $data['quantity'] = $data['quantity_on_hand'] ?? 0;
        $data['unit_cost'] = $data['cost_per_unit'] ?? 0;

        return $data;
    }
}
