<?php

namespace App\Http\Controllers;

use App\Models\FeedFormula;
use App\Models\FeedProduct;
use App\Models\FormulaItem;
use App\Models\ProductionBatch;
use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedFormulaController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $query = FeedFormula::with(['feedProduct', 'items.rawMaterial']);

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('formula_name', 'like', "%{$search}%")
                    ->orWhere('formula_code', 'like', "%{$search}%");
            });
        }

        $formulas = $query->orderByDesc('id')->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($formulas);
        }

        return view('feed_formulas.index', compact('formulas'));
    }

    public function create()
    {
        $products = FeedProduct::where('status', 'active')->orderBy('product_name')->get();
        $materials = RawMaterial::where('status', 'active')->orderBy('material_name')->get();

        return view('feed_formulas.create', compact('products', 'materials'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'formula_code' => 'required|string|max:50|unique:feed_formulas,formula_code',
            'formula_name' => 'required|string|max:255',
            'feed_product_id' => ['required', $this->workspaceExists('feed_products')],
            'batch_size_kg' => 'nullable|numeric|min:0.001',
            'status' => 'required|in:active,inactive',
            'items' => 'required|array|min:1',
            'items.*.raw_material_id' => ['required', $this->workspaceExists('raw_materials')],
            'items.*.quantity_required' => 'required|numeric|min:0.001',
            'items.*.unit' => 'nullable|string|max:20',
        ]);

        $batchSize = !empty($data['batch_size_kg']) ? (float) $data['batch_size_kg'] : 1000.0;
        $items = $data['items'];

        // Validate 100% total inclusion rate
        $totalInput = array_sum(array_column($items, 'quantity_required'));

        // If user entered percentages (summing around 100), scale to batchSize (1000kg)
        if (abs($totalInput - 100.0) <= 0.5) {
            foreach ($items as &$it) {
                $it['percentage'] = $it['quantity_required'];
                $it['quantity_required'] = round(($it['quantity_required'] / 100.0) * $batchSize, 3);
            }
            unset($it);
        } else {
            // Check if entered as weights summing to batchSize (e.g. 1000kg)
            $computedPercentage = round(($totalInput / $batchSize) * 100, 2);
            if (abs($computedPercentage - 100.0) > 0.5) {
                abort(422, "Total formulation inclusion must equal exactly 100% (currently {$computedPercentage}% = {$totalInput} kg / {$batchSize} kg).");
            }
        }

        $formula = DB::transaction(function () use ($data, $batchSize, $items) {
            $formula = FeedFormula::create([
                'formula_code' => strtoupper($data['formula_code']),
                'name' => $data['formula_name'],
                'formula_name' => $data['formula_name'],
                'feed_product_id' => $data['feed_product_id'],
                'batch_size' => $batchSize,
                'batch_size_kg' => $batchSize,
                'status' => $data['status'],
            ]);

            foreach ($items as $item) {
                FormulaItem::create([
                    'feed_formula_id' => $formula->id,
                    'raw_material_id' => $item['raw_material_id'],
                    'quantity_required' => $item['quantity_required'],
                    'unit' => $item['unit'] ?? 'kg',
                ]);
            }

            return $formula->fresh(['feedProduct', 'items.rawMaterial']);
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'created' => true,
                'formula' => $formula
            ], 201);
        }

        return redirect()->route('feed_formulas.index')->with('success', 'Feed formula created successfully.');
    }

    public function show(FeedFormula $feed_formula)
    {
        $feed_formula->load(['feedProduct', 'items.rawMaterial']);
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($feed_formula);
        }
        return view('feed_formulas.show', ['formula' => $feed_formula]);
    }

    public function edit(FeedFormula $feed_formula)
    {
        $feed_formula->load('items');
        $products = FeedProduct::where('status', 'active')->orderBy('product_name')->get();
        $materials = RawMaterial::where('status', 'active')->orderBy('material_name')->get();

        return view('feed_formulas.edit', compact('feed_formula', 'products', 'materials'));
    }

    public function update(Request $request, FeedFormula $feed_formula)
    {
        $data = $request->validate([
            'formula_code' => 'required|string|max:50|unique:feed_formulas,formula_code,' . $feed_formula->id,
            'formula_name' => 'required|string|max:255',
            'feed_product_id' => ['required', $this->workspaceExists('feed_products')],
            'batch_size_kg' => 'nullable|numeric|min:0.001',
            'status' => 'required|in:active,inactive',
            'items' => 'required|array|min:1',
            'items.*.raw_material_id' => ['required', $this->workspaceExists('raw_materials')],
            'items.*.quantity_required' => 'required|numeric|min:0.001',
            'items.*.unit' => 'nullable|string|max:20',
        ]);

        $batchSize = !empty($data['batch_size_kg']) ? (float) $data['batch_size_kg'] : 1000.0;
        $items = $data['items'];

        // Validate 100% total inclusion rate
        $totalInput = array_sum(array_column($items, 'quantity_required'));

        if (abs($totalInput - 100.0) <= 0.5) {
            foreach ($items as &$it) {
                $it['percentage'] = $it['quantity_required'];
                $it['quantity_required'] = round(($it['quantity_required'] / 100.0) * $batchSize, 3);
            }
            unset($it);
        } else {
            $computedPercentage = round(($totalInput / $batchSize) * 100, 2);
            if (abs($computedPercentage - 100.0) > 0.5) {
                abort(422, "Total formulation inclusion must equal exactly 100% (currently {$computedPercentage}% = {$totalInput} kg / {$batchSize} kg).");
            }
        }

        DB::transaction(function () use ($data, $batchSize, $items, $feed_formula) {
            $feed_formula->update([
                'formula_code' => strtoupper($data['formula_code']),
                'name' => $data['formula_name'],
                'formula_name' => $data['formula_name'],
                'feed_product_id' => $data['feed_product_id'],
                'batch_size' => $batchSize,
                'batch_size_kg' => $batchSize,
                'status' => $data['status'],
            ]);

            $feed_formula->items()->delete();

            foreach ($items as $item) {
                FormulaItem::create([
                    'feed_formula_id' => $feed_formula->id,
                    'raw_material_id' => $item['raw_material_id'],
                    'quantity_required' => $item['quantity_required'],
                    'unit' => $item['unit'] ?? 'kg',
                ]);
            }
        });

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'updated' => true,
                'formula' => $feed_formula->fresh(['feedProduct', 'items.rawMaterial'])
            ], 200);
        }

        return redirect()->route('feed_formulas.index')->with('success', 'Feed formula updated successfully.');
    }

    public function destroy(FeedFormula $feed_formula)
    {
        if (ProductionBatch::where('feed_formula_id', $feed_formula->id)->exists()) {
            abort(422, 'Cannot delete formulation because it is referenced in production batch records.');
        }

        $feed_formula->items()->delete();
        $feed_formula->delete();

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('feed_formulas.index')->with('success', 'Feed formula deleted successfully.');
    }
}
