import React, { useState } from "react";
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from "recharts";
import { RawMaterial, FeedProduct, ProductionBatch, FeedFormula } from "../types";
import { forecastNextPeriods } from "../utils/mathUtils";
import { 
  TrendingUp, Activity, AlertTriangle, CheckCircle, Info, 
  Layers, ChevronRight, ShoppingCart 
} from "lucide-react";

interface ForecastModuleProps {
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
  productionBatches: ProductionBatch[];
  formulas: FeedFormula[];
}

export default function ForecastModule({
  rawMaterials,
  feedProducts,
  productionBatches,
  formulas
}: ForecastModuleProps) {
  const [selectedProductCode, setSelectedProductCode] = useState<string | "ALL">("ALL");
  const [forecastPeriods, setForecastPeriods] = useState<number>(3); // Next 3 months

  // Run forecast helper
  const forecastResult = forecastNextPeriods(productionBatches, selectedProductCode, forecastPeriods);

  // Combine historical + forecast into a single array for charts
  const chartData = [
    ...forecastResult.historical.map(h => ({
      period: h.month,
      "Actual Yield": h.actual,
      "Trend Line": h.trend,
      type: "Historical" as const
    })),
    ...forecastResult.forecast.map(f => ({
      period: f.month,
      "Actual Yield": undefined as any,
      "Trend Line": f.predicted,
      type: "Forecast" as const
    }))
  ];

  // Calculate Raw Material Requirements Forecast based on August/September prediction
  const getForecastedMaterialRequirements = () => {
    if (forecastResult.forecast.length === 0) return [];

    // Let's target the immediate upcoming month (usually index 1 or 2 since current is July. Let's look at the first forecasted month)
    const primaryForecastMonth = forecastResult.forecast[0]; // e.g. August
    const predictedBags = primaryForecastMonth.predicted;

    // If selected ALL, let's average or use a composite feed formula. If a specific product is chosen, we parse its real formula!
    let targetFormula = formulas.find(f => f.feedProductCode === selectedProductCode);
    if (!targetFormula && selectedProductCode === "ALL") {
      // Create a simulated composite average formula of the mill (e.g. 30% fish meal, 24% soybean, 22% corn, 14% rice bran, etc.)
      targetFormula = {
        code: "FC-COMPOSITE",
        feedProductCode: "ALL",
        name: "Mill Composite Average Formula",
        ingredients: [
          { rawMaterialCode: "RM-001", quantityKg: 300 }, // 30% Fish meal
          { rawMaterialCode: "RM-002", quantityKg: 240 }, // 24% Soybean
          { rawMaterialCode: "RM-003", quantityKg: 220 }, // 22% Yellow Corn
          { rawMaterialCode: "RM-004", quantityKg: 140 }, // 14% Rice Bran
          { rawMaterialCode: "RM-005", quantityKg: 50 },  // 5% Wheat Gluten
          { rawMaterialCode: "RM-006", quantityKg: 40 },  // 4% Copra
          { rawMaterialCode: "RM-007", quantityKg: 10 }   // 1% Premix
        ]
      };
    }

    if (!targetFormula) return [];

    // Metric weight needed: Bags * 25kg
    const targetProduct = feedProducts.find(p => p.code === selectedProductCode);
    const bagWeight = targetProduct?.bagWeightKg || 25;
    const totalWeightKgNeeded = predictedBags * bagWeight;
    const formulaMultiplier = totalWeightKgNeeded / 1000; // ratio of metric ton

    return targetFormula.ingredients.map(ing => {
      const rawMat = rawMaterials.find(m => m.code === ing.rawMaterialCode);
      const quantityRequiredKg = Math.round(ing.quantityKg * formulaMultiplier);
      const currentStockLevel = rawMat ? rawMat.quantity : 0;
      const shortageAmount = Math.max(0, quantityRequiredKg - currentStockLevel);
      const isShortage = currentStockLevel < quantityRequiredKg;

      return {
        materialCode: ing.rawMaterialCode,
        materialName: rawMat ? rawMat.name : ing.rawMaterialCode,
        currentStock: currentStockLevel,
        requiredQty: quantityRequiredKg,
        shortage: shortageAmount,
        isShortage,
        supplier: rawMat ? rawMat.supplier : "N/A"
      };
    });
  };

  const materialRequirements = getForecastedMaterialRequirements();
  const nextMonthName = forecastResult.forecast[0]?.month || "Upcoming Month";

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header Block */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <TrendingUp className="text-teal-600" size={16} />
          Linear Regression Feed Yield DSS Forecasting
        </h3>
        <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
          The Decision Support System (DSS) runs recursive Ordinary Least Squares (OLS) calculations on your historic batch run logs to establish growth trajectories and predict silo supply-chain pressures.
        </p>
      </div>

      {/* Control Filters Block */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Feed Product Select */}
        <div className="flex-1 max-w-md">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Forecast Feed Category</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            value={selectedProductCode}
            onChange={(e) => setSelectedProductCode(e.target.value)}
          >
            <option value="ALL">Overall Combined Mill Production</option>
            {feedProducts.map(p => (
              <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
            ))}
          </select>
        </div>

        {/* Forecast Period */}
        <div className="flex bg-slate-100 p-1 rounded-xl border">
          {[3, 6, 12].map(p => (
            <button
              key={p}
              onClick={() => setForecastPeriods(p)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                forecastPeriods === p ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Next {p} Months
            </button>
          ))}
        </div>

      </div>

      {/* Main Graph Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* THE COMPOSED CHART GRAPH */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-2">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Historical vs. Projected Production Run</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Linear regression equation: <strong className="text-teal-600 font-mono">y = {forecastResult.slope.toFixed(2)}x + {forecastResult.intercept.toFixed(2)}</strong></p>
            </div>
            <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-100 border px-2.5 py-1 rounded-full">
              Model Fit (R²): {forecastResult.r2.toFixed(3)}
            </span>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#E2E8F0" />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} stroke="#E2E8F0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Actual Yield" name="Historic Bags Produced" fill="#0F766E" radius={[4, 4, 0, 0]} barSize={35} />
                <Line type="monotone" dataKey="Trend Line" name="OLS OLS Regression Line" stroke="#F43F5E" strokeWidth={3} strokeDasharray="5 5" activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATISTICS INSIGHT SIDEBAR */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[9px] bg-teal-950/60 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Mathematical Model Diagnostics
            </span>
            <h4 className="text-sm font-bold text-slate-100 mt-4 border-b border-white/5 pb-2">OLS Regression Insights</h4>
            
            <div className="mt-4 space-y-4 text-xs">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 font-medium">Monthly Slope (Growth Rate)</span>
                <span className="font-bold font-mono text-teal-400">+{Math.round(forecastResult.slope)} Bags/mo</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 font-medium">Model Correlation R²</span>
                <span className="font-bold font-mono text-cyan-400">{(forecastResult.r2 * 100).toFixed(1)}%</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 font-medium">August Predicted bags</span>
                <span className="font-bold font-mono text-teal-300">
                  {forecastResult.forecast[0]?.predicted.toLocaleString()} Bags
                </span>
              </div>
            </div>
          </div>

          <div className="bg-teal-950/40 border border-teal-500/10 p-3 rounded-xl mt-6 text-[10px] text-teal-400 leading-relaxed font-medium">
            <Info size={14} className="inline mr-1 text-teal-400 shrink-0 align-text-bottom" />
            An R² above <strong>0.80</strong> represents an extremely stable predictive growth trend. Under standard OLS models, these projections match 3H Enterprises historical local demand peaks perfectly.
          </div>
        </div>

      </div>

      {/* RAW MATERIAL DOWNSTREAM FORECAST REQUIREMENTS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <ShoppingCart size={15} className="text-teal-600" />
              Preemptive Silo Downstream Procurement Forecast ({nextMonthName})
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Calculated metric ingredient volumes required to produce the forecasted target of <strong className="text-teal-700">{forecastResult.forecast[0]?.predicted.toLocaleString()} bags</strong></p>
          </div>
          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full px-3 py-1 font-bold">
            DOWNSTREAM SUPPLY FORCAST
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="py-3 px-5">Material Code</th>
                <th className="py-3 px-5">Raw Ingredient</th>
                <th className="py-3 px-5 text-right">Current Silo Level</th>
                <th className="py-3 px-5 text-right">Forecasted Required Quantity</th>
                <th className="py-3 px-5 text-right">Predicted Deficit</th>
                <th className="py-3 px-5">Supplier</th>
                <th className="py-3 px-5 text-center">Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {materialRequirements.map((row) => (
                <tr key={row.materialCode} className="hover:bg-slate-50/50">
                  <td className="py-3 px-5 font-mono font-bold text-slate-400">{row.materialCode}</td>
                  <td className="py-3 px-5 font-bold text-slate-800">{row.materialName}</td>
                  <td className="py-3 px-5 text-right font-mono font-semibold text-slate-700">
                    {row.currentStock.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-5 text-right font-mono font-bold text-indigo-700">
                    {row.requiredQty.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-5 text-right font-mono font-black text-rose-600">
                    {row.shortage > 0 ? `${row.shortage.toLocaleString()} kg` : "--"}
                  </td>
                  <td className="py-3 px-5 text-slate-500 font-medium truncate max-w-xs">{row.supplier}</td>
                  <td className="py-3 px-5 text-center">
                    {row.isShortage ? (
                      <span className="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                        ORDER IMMEDIATELY
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        SAFE STOCK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
