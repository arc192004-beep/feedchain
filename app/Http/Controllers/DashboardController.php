<?php

namespace App\Http\Controllers;

use App\Models\Buyer;
use App\Models\Customer;
use App\Models\Distribution;
use App\Models\FeedFormula;
use App\Models\FeedProduct;
use App\Models\RawMaterial;
use App\Models\Sale;
use App\Models\StockAlert;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the React dashboard page for authenticated users.
     */
    public function index(Request $request)
    {
        // Load raw materials defensively: database schema may vary across environments.
        $rawMaterialsQuery = \App\Models\RawMaterial::query();
        $rawMaterials = $rawMaterialsQuery->get()->map(function ($m) {
            // Normalize field names for frontend
            $name = $m->material_name ?? $m->material ?? $m->name ?? $m->material_name ?? null;
            if (! $name && isset($m->material_name) === false) {
                // fallback: try common alternatives
                $name = $m->material_name ?? $m->material ?? $m->name ?? '';
            }

            return [
                'id' => $m->id,
                'code' => $m->material_code ?? $m->code ?? null,
                'name' => $name,
                'supplier' => $m->material_type ?? $m->category ?? 'Approved Supplier',
                'materialType' => $m->material_type ?? $m->category ?? '',
                'unit' => $m->unit ?? 'kg',
                'quantity' => (float) ($m->quantity_on_hand ?? $m->current_stock ?? $m->quantity ?? 0),
                'minStock' => (float) ($m->reorder_level ?? $m->min_stock ?? 0),
                'cost' => (float) ($m->cost_per_unit ?? $m->cost ?? 0),
                'status' => ucfirst(strtolower($m->status ?? 'active')),
            ];
        })->sortBy('name')->values();

        $feedProducts = \App\Models\FeedProduct::select(
            'id',
            'product_code as code',
            'product_name as name',
            'feed_type',
            'price',
            'unit',
            'status',
            'quantity_bags',
            'min_stock_bags',
            'bag_weight_kg'
        )->orderBy('product_name')->get()->map(function ($f) {
            return [
                'id' => $f->id,
                'code' => $f->code,
                'name' => $f->name,
                'feedType' => $f->feed_type,
                'price' => $f->price,
                'unit' => $f->unit,
                'status' => $f->status ?? 'active',
                'quantityBags' => intval($f->quantity_bags ?? 0),
                'minStockBags' => intval($f->min_stock_bags ?? 0),
                'bagWeightKg' => intval($f->bag_weight_kg ?? 25),
            ];
        });
        $formulas = \App\Models\FeedFormula::with('items.rawMaterial')->get()->map(function($f){
            return [
                'id' => $f->id,
                'code' => $f->formula_code,
                'name' => $f->formula_name,
                'feedProductId' => $f->feed_product_id,
                'feedProductCode' => optional($f->feedProduct)->product_code,
                'bagWeightKg' => (float) (optional($f->feedProduct)->bag_weight_kg ?? 25),
                'batchSizeKg' => (float) ($f->batch_size_kg ?? 0),
                'ingredients' => $f->items->map(function($it){
                    return [
                        'rawMaterialId' => $it->raw_material_id,
                        'rawMaterialCode' => optional($it->rawMaterial)->material_code,
                        'quantityKg' => $it->quantity_required,
                        'unit' => $it->unit,
                    ];
                })->toArray(),
            ];
        });

        $productionBatches = \App\Models\ProductionBatch::with(['feedProduct', 'materials.rawMaterial', 'formula'])->orderByDesc('id')->get()->map(function($b){
            $totalRawUsed = (float) ($b->total_raw_material_used > 0 ? $b->total_raw_material_used : $b->materials->sum('quantity_used'));
            $bagWeight = (float) (optional($b->feedProduct)->bag_weight_kg ?? 25);
            $outputKg = (float) ($b->quantity_kg > 0 ? $b->quantity_kg : (($b->sacks_produced ?? 0) * $bagWeight));
            $yieldPct = $totalRawUsed > 0 ? round(($outputKg / $totalRawUsed) * 100, 1) : 100.0;

            return [
                'id' => $b->id,
                'batchNo' => $b->batch_number,
                'feedProductId' => $b->feed_product_id,
                'feedProductCode' => optional($b->feedProduct)->product_code,
                'feedProductName' => optional($b->feedProduct)->product_name,
                'formulaId' => $b->feed_formula_id,
                'formulaCode' => optional($b->formula)->formula_code,
                'productionDate' => $b->production_date ? (\Carbon\Carbon::parse($b->production_date)->format('Y-m-d')) : null,
                'quantityProducedBags' => intval($b->sacks_produced ?? 0),
                'quantityKg' => $outputKg,
                'totalRawMaterialUsed' => $totalRawUsed,
                'yieldPercentage' => $yieldPct,
                'notes' => $b->notes ?? '',
                'rawMaterialsUsed' => $b->materials->map(fn ($material) => [
                    'rawMaterialId' => $material->raw_material_id,
                    'rawMaterialCode' => optional($material->rawMaterial)->material_code,
                    'rawMaterialName' => optional($material->rawMaterial)->material_name ?? optional($material->rawMaterial)->name,
                    'quantityUsedKg' => (float) $material->quantity_used,
                    'unit' => $material->unit ?? 'kg',
                ])->values(),
                'status' => strtolower($b->status ?? 'completed'),
            ];
        });

        $users = User::where('workspace_id', $request->user()->workspace_id)->orderBy('name')->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role ?? '',
                'status' => $u->status ?? 'active',
            ];
        });

        $buyers = Buyer::orderBy('buyer_name')->get()->map(function ($b) {
            return [
                'id' => $b->id,
                'buyerCode' => $b->buyer_code ?? '',
                'name' => $b->buyer_name ?? $b->name ?? '',
                'fishCageName' => $b->fishpond_or_cage_name ?? $b->fish_cage_name ?? $b->buyer_cage ?? '',
                'address' => $b->address ?? '',
                'contactNumber' => $b->contact_number ?? $b->phone ?? '',
            ];
        });

        $customerSortColumn = Schema::hasColumn('customers', 'customer_name') ? 'customer_name' : 'name';
        $customers = Customer::orderBy($customerSortColumn)->get()->map(function ($c) {
            return [
                'id' => $c->id,
                'name' => $c->customer_name ?? $c->name ?? '',
                'fishCage' => $c->fish_cage ?? '',
                'address' => $c->address ?? '',
                'phone' => $c->contact_number ?? $c->phone ?? '',
                'email' => $c->email ?? '',
                'status' => $c->status ?? 'active',
            ];
        });

        $distributions = Distribution::with(['buyer','items.feedProduct'])->orderByDesc('id')->get()->map(function ($d) {
            $firstItem = $d->items->first();
            return [
                'id' => $d->id,
                'distributionNumber' => $d->distribution_number ?? "DIST-{$d->id}",
                'buyerId' => $d->buyer_id,
                'buyerName' => optional($d->buyer)->buyer_name ?? $d->buyer_name ?? '',
                'distributionDate' => $d->distribution_date ? \Carbon\Carbon::parse($d->distribution_date)->format('Y-m-d') : null,
                'feedProductId' => optional($firstItem)->feed_product_id,
                'feedProductCode' => optional(optional($firstItem)->feedProduct)->product_code ?? '',
                'feedProductName' => optional(optional($firstItem)->feedProduct)->product_name ?? '',
                'quantityBags' => intval($d->items->sum('quantity') ?: $d->total_quantity),
                'unitPrice' => floatval(optional($firstItem)->unit_price ?? 0),
                'totalAmount' => floatval($d->total_amount ?? 0),
                'remarks' => $d->remarks ?? '',
                'status' => $d->status ?? 'completed',
            ];
        });

        $sales = Sale::with(['customer','items.feedProduct'])->orderByDesc('id')->get()->map(function ($s) {
            $firstItem = $s->items->first();
            return [
                'id' => $s->id,
                'customerId' => $s->customer_id,
                'customerName' => optional($s->customer)->customer_name ?? optional($s->customer)->name ?? '',
                'salesDate' => $s->sale_date ? \Carbon\Carbon::parse($s->sale_date)->format('Y-m-d') : null,
                'feedProductId' => optional($firstItem)->feed_product_id,
                'feedProductCode' => optional(optional($firstItem)->feedProduct)->product_code ?? '',
                'feedProductName' => optional(optional($firstItem)->feedProduct)->product_name ?? '',
                'quantityBags' => intval($s->items->sum('quantity') ?: $s->quantity),
                'unitPrice' => floatval(optional($firstItem)->unit_price ?? 0),
                'totalAmount' => floatval($s->total_amount ?? 0),
                'status' => $s->status ?? 'completed',
                'notes' => $s->notes ?? '',
            ];
        });

        $inventoryMovements = \App\Models\Inventory::with(['rawMaterial', 'feedProduct'])
            ->orderByDesc('id')
            ->limit(100)
            ->get()
            ->map(function ($inv) {
                $isRaw = $inv->inventory_type === 'raw_material';
                $code = $isRaw ? optional($inv->rawMaterial)->material_code : optional($inv->feedProduct)->product_code;
                $name = $isRaw ? (optional($inv->rawMaterial)->material_name ?? optional($inv->rawMaterial)->name) : (optional($inv->feedProduct)->product_name ?? optional($inv->feedProduct)->name);

                return [
                    'id' => $inv->id,
                    'date' => $inv->last_updated ? \Carbon\Carbon::parse($inv->last_updated)->format('Y-m-d H:i') : ($inv->created_at ? $inv->created_at->format('Y-m-d H:i') : ''),
                    'inventoryType' => $inv->inventory_type,
                    'itemCode' => $code ?? 'N/A',
                    'itemName' => $name ?? 'Unknown Item',
                    'quantity' => (float) $inv->quantity,
                    'quantityAvailable' => (float) $inv->quantity_available,
                    'unit' => $inv->unit ?? ($isRaw ? 'kg' : 'bag'),
                    'referenceBatchId' => $inv->reference_batch_id,
                ];
            });

        $analytics = $this->buildAnalytics($productionBatches, $distributions, $sales, $inventoryMovements, $rawMaterials, $feedProducts, $formulas);

        return Inertia::render('dashboard', [
            'rawMaterials' => $rawMaterials,
            'feedProducts' => $feedProducts,
            'formulas' => $formulas,
            'productionBatches' => $productionBatches,
            'users' => $users,
            'buyers' => $buyers,
            'customers' => $customers,
            'distributions' => $distributions,
            'sales' => $sales,
            'inventoryMovements' => $inventoryMovements,
            'analytics' => $analytics,
        ]);
    }

    public function superAdmin()
    {
        $users = User::where('workspace_id', auth()->user()->workspace_id)
            ->orderByDesc('id')
            ->get(['id', 'name', 'username', 'email', 'role', 'status', 'created_at']);
        $activities = \App\Models\ActivityLog::with('user:id,name,role')->latest()->limit(10)->get();

        return Inertia::render('super-admin/dashboard', [
            'users' => $users,
            'activities' => $activities,
            'systemStatus' => 'Operational',
        ]);
    }

    public function production()
    {
        return redirect()->route('feedchain.dashboard', ['tab' => 'production']);
    }

    public function analytics()
    {
        return redirect()->route('feedchain.dashboard', ['tab' => 'analytics']);
    }

    /** Build read-only analytics from persisted operational records. */
    private function buildAnalytics($batches, $distributions, $sales, $movements, $rawMaterials, $feedProducts, $formulas): array
    {
        $completed = $batches->filter(fn ($batch) => strtolower((string) $batch['status']) === 'completed');
        $monthKeys = collect($completed)->pluck('productionDate')->filter()->map(fn ($date) => substr($date, 0, 7))
            ->merge($distributions->pluck('distributionDate')->filter()->map(fn ($date) => substr($date, 0, 7)))
            ->merge($sales->pluck('salesDate')->filter()->map(fn ($date) => substr($date, 0, 7)))->unique()->sort()->values();

        $shortages = StockAlert::query()
            ->where('status', 'active')
            ->selectRaw('created_at')
            ->pluck('created_at')
            ->map(fn ($createdAt) => substr((string) $createdAt, 0, 7))
            ->countBy();
        $trends = $monthKeys->map(function ($month) use ($completed, $distributions, $sales, $movements, $shortages) {
            $monthBatches = $completed->filter(fn ($row) => str_starts_with((string) $row['productionDate'], $month));
            $rawUsed = $monthBatches->sum('totalRawMaterialUsed');
            $outputKg = $monthBatches->sum('quantityKg');
            return [
                'month' => $month,
                'productionBags' => (float) $monthBatches->sum('quantityProducedBags'),
                'distributionBags' => (float) $distributions->filter(fn ($row) => str_starts_with((string) $row['distributionDate'], $month))->sum('quantityBags'),
                'salesRevenue' => (float) $sales->filter(fn ($row) => str_starts_with((string) $row['salesDate'], $month))->sum('totalAmount'),
                // Inventory records are snapshots; this is the recorded availability for movements updated in the period.
                'inventoryAvailable' => (float) $movements->filter(fn ($row) => str_starts_with((string) $row['date'], $month))->sum('quantityAvailable'),
                'shortages' => (int) ($shortages[$month] ?? 0),
                // Wastage is only reported when actual material consumption was recorded.
                'wastageKg' => (float) max(0, $rawUsed - $outputKg),
            ];
        })->values();

        $productionPareto = $completed->groupBy(fn ($row) => $row['feedProductName'] ?: $row['feedProductCode'] ?: 'Unassigned')
            ->map(fn ($rows, $name) => ['name' => $name, 'value' => (float) $rows->sum('quantityProducedBags')])->values();
        $salesPareto = $sales->filter(fn ($row) => strtolower((string) $row['status']) === 'completed')
            ->groupBy(fn ($row) => $row['customerName'] ?: 'Unassigned customer')
            ->map(fn ($rows, $name) => ['name' => $name, 'value' => (float) $rows->sum('totalAmount')])->values();

        $rawAvailability = $rawMaterials->map(fn ($item) => $this->stockState((float) $item['quantity'], (float) $item['minStock']));
        $feedAvailability = $feedProducts->map(fn ($item) => $this->stockState((float) $item['quantityBags'], (float) $item['minStockBags']));
        $latestBatch = $completed->sortByDesc('productionDate')->first();
        $latestFormula = $formulas->firstWhere('id', $latestBatch['formulaId'] ?? null) ?? $formulas->first();

        return [
            'trends' => $trends,
            'kpis' => [
                'completedBatches' => $completed->count(), 'totalBatches' => $batches->count(),
                'rawMaterialKg' => (float) $rawMaterials->sum('quantity'), 'finishedFeedBags' => (float) $feedProducts->sum('quantityBags'),
                'availability' => ['adequate' => $rawAvailability->merge($feedAvailability)->filter(fn ($s) => $s === 'adequate')->count(), 'low' => $rawAvailability->merge($feedAvailability)->filter(fn ($s) => $s === 'low')->count(), 'critical' => $rawAvailability->merge($feedAvailability)->filter(fn ($s) => $s === 'critical')->count(), 'out' => $rawAvailability->merge($feedAvailability)->filter(fn ($s) => $s === 'out')->count()],
            ],
            'productionPareto' => $this->pareto($productionPareto), 'salesPareto' => $this->pareto($salesPareto),
            'forecast' => $this->multipleRegression($trends, $latestFormula, $rawMaterials),
        ];
    }

    private function stockState(float $quantity, float $minimum): string
    {
        if ($quantity <= 0) return 'out';
        if ($minimum > 0 && $quantity < $minimum * .5) return 'critical';
        return $minimum > 0 && $quantity < $minimum ? 'low' : 'adequate';
    }

    private function pareto($items): array
    {
        $total = (float) $items->sum('value'); $cumulative = 0;
        return $items->sortByDesc('value')->values()->map(function ($item) use ($total, &$cumulative) {
            $percentage = $total > 0 ? ($item['value'] / $total) * 100 : 0; $cumulative += $percentage;
            return $item + ['percentage' => round($percentage, 2), 'cumulativePercentage' => round($cumulative, 2)];
        })->all();
    }

    private function multipleRegression($trends, $formula, $rawMaterials): array
    {
        $formula = $formula ?: [];
        // OLS target: monthly production bags. Predictors: previous-month sales bags and production-period index.
        $rows = $trends->values();
        if ($rows->count() < 4) return ['available' => false, 'message' => 'At least four historical monthly periods with production activity are required for multiple linear regression.'];
        $x = []; $y = [];
        foreach ($rows as $index => $row) { $x[] = [1, $index ? (float) $rows[$index - 1]['salesRevenue'] : 0, $index + 1]; $y[] = (float) $row['productionBags']; }
        $a = [[0,0,0],[0,0,0],[0,0,0]]; $b = [0,0,0];
        foreach ($x as $i => $row) foreach ($row as $j => $value) { $b[$j] += $value * $y[$i]; foreach ($row as $k => $other) $a[$j][$k] += $value * $other; }
        for ($i=0; $i<3; $i++) { $pivot = $a[$i][$i]; if (abs($pivot) < 0.000001) return ['available' => false, 'message' => 'Historical records do not contain enough variation to fit a stable multiple linear regression model.']; for ($j=$i; $j<3; $j++) $a[$i][$j] /= $pivot; $b[$i] /= $pivot; for ($r=0; $r<3; $r++) if ($r !== $i) { $factor=$a[$r][$i]; for ($j=$i; $j<3; $j++) $a[$r][$j]-=$factor*$a[$i][$j]; $b[$r]-=$factor*$b[$i]; } }
        $forecastBags = max(0, $b[0] + $b[1] * (float) $rows->last()['salesRevenue'] + $b[2] * ($rows->count()+1));
        $bagWeight = (float) ($formula['bagWeightKg'] ?? 25);
        $forecastKg = $forecastBags * $bagWeight; $batchSize = (float) ($formula['batchSizeKg'] ?? 0);
        $materials = collect($formula['ingredients'] ?? [])->map(function ($ingredient) use ($batchSize, $forecastKg, $rawMaterials) { $material = $rawMaterials->firstWhere('id', $ingredient['rawMaterialId']); $inclusion = $batchSize > 0 ? ((float) $ingredient['quantityKg'] / $batchSize) * 100 : null; return ['name' => $material['name'] ?? $ingredient['rawMaterialCode'], 'inclusionPercentage' => $inclusion, 'requiredKg' => $batchSize > 0 ? round($forecastKg * ((float) $ingredient['quantityKg'] / $batchSize), 3) : null]; })->values();
        return ['available' => true, 'target' => 'Monthly production quantity (bags)', 'predictors' => ['Previous-month sales revenue', 'Production-period index'], 'historicalPeriods' => $rows->count(), 'forecastBags' => round($forecastBags, 2), 'forecastKg' => round($forecastKg, 2), 'formulaName' => $formula['name'] ?? null, 'materials' => $materials];
    }
}
