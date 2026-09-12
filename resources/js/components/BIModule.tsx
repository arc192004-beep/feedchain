import React, { useState } from "react";
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Cell 
} from "recharts";
import { RawMaterial, FeedProduct, ProductionBatch, DistributionRecord, SalesRecord, BuyerProfile, CustomerProfile } from "../types";
import { calculatePareto, performOLAPAnalysis, ParetoItem, OLAPRow } from "../utils/mathUtils";
import { 
  ShieldCheck, Calculator, Coins, Database, Layers, 
  Percent, ArrowRightLeft, PieChart, RefreshCcw 
} from "lucide-react";

interface BIModuleProps {
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
  productionBatches: ProductionBatch[];
  distributions: DistributionRecord[];
  sales: SalesRecord[];
  buyers: BuyerProfile[];
  customers: CustomerProfile[];
}

export default function BIModule({
  rawMaterials,
  feedProducts,
  productionBatches,
  distributions,
  sales,
  buyers,
  customers
}: BIModuleProps) {
  const [olapDimension, setOlapDimension] = useState<"Year" | "Month" | "Feed Product" | "Buyer" | "Customer">("Feed Product");
  const [paretoType, setParetoType] = useState<"Sales" | "Production">("Sales");

  // Calculations for advanced BI metrics
  const totalProductionBags = productionBatches
    .filter(b => b.status === "Completed")
    .reduce((sum, b) => sum + b.quantityProducedBags, 0);

  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  // Raw Material Inventory value
  const totalRawInventoryValue = rawMaterials.reduce((sum, m) => sum + (m.quantity * m.cost), 0);
  // Finished feed stock value
  const totalFinishedInventoryValue = feedProducts.reduce((sum, p) => sum + (p.quantityBags * p.price), 0);
  const totalWarehouseAssets = totalRawInventoryValue + totalFinishedInventoryValue;

  const totalDistributionRuns = distributions.length;
  const activeCustomerAccounts = customers.length;

  const totalRawMaterialsUsedKg = productionBatches
    .filter(b => b.status === "Completed")
    .reduce((sum, b) => {
      const batchSum = b.rawMaterialsUsed?.reduce((s, r) => s + r.quantityUsedKg, 0) || 0;
      return sum + batchSum;
    }, 0);

  // Production Efficiency: Standard is 98% target (due to normal 2% mill dust/shrinkage process loss)
  // Let's compute actual produced kg vs raw ingredients loaded kg!
  const totalProducedKg = totalProductionBags * 25;
  const productionEfficiencyPct = totalRawMaterialsUsedKg === 0 ? 98 : Math.round((totalProducedKg / totalRawMaterialsUsedKg) * 100);

  // 1. Compile Pareto Data
  const getParetoData = (): ParetoItem[] => {
    const rawItems: { name: string; value: number }[] = [];

    if (paretoType === "Sales") {
      feedProducts.forEach(p => {
        const productSales = sales
          .filter(s => s.feedProductCode === p.code)
          .reduce((sum, s) => sum + s.totalAmount, 0);
        rawItems.push({ name: p.code, value: productSales });
      });
    } else {
      feedProducts.forEach(p => {
        const productProd = productionBatches
          .filter(b => b.status === "Completed" && b.feedProductCode === p.code)
          .reduce((sum, b) => sum + b.quantityProducedBags, 0);
        rawItems.push({ name: p.code, value: productProd });
      });
    }

    return calculatePareto(rawItems);
  };

  const paretoData = getParetoData();

  // 2. Compile OLAP Data
  const olapRows = performOLAPAnalysis(
    olapDimension,
    productionBatches,
    distributions,
    sales,
    feedProducts,
    buyers,
    customers
  );

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header Block */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="text-teal-600" size={16} />
          Executive Decision Support & Business Intelligence
        </h3>
        <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
          Unlock predictive insight, check Pareto 80/20 product distribution patterns, and run multi-dimensional OLAP data cube slicing to optimize 3H Enterprises supply chains.
        </p>
      </div>

      {/* BI Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* WAREHOUSE ASSETS VALUE */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Warehouse Asset Value</span>
            <Coins className="text-teal-400 shrink-0" size={16} />
          </div>
          <h4 className="text-lg font-black text-white mt-3">
            ₱{totalWarehouseAssets.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h4>
          <div className="text-[10px] text-slate-400 mt-2 flex justify-between font-mono">
            <span>Ingredients: ₱{Math.round(totalRawInventoryValue / 1000)}k</span>
            <span>Feeds: ₱{Math.round(totalFinishedInventoryValue / 1000)}k</span>
          </div>
        </div>

        {/* INGREDIENTS UTILIZED */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ingredients Processed</span>
            <Database className="text-teal-600 shrink-0" size={16} />
          </div>
          <h4 className="text-lg font-black text-slate-800 mt-3">
            {(totalRawMaterialsUsedKg / 1000).toFixed(1)} Tons
          </h4>
          <span className="text-[10px] text-slate-500 block mt-2">Loaded to mixer silo runs</span>
        </div>

        {/* PRODUCTION EFFICIENCY */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Process Recovery Yield</span>
            <Percent className="text-indigo-600 shrink-0" size={16} />
          </div>
          <h4 className="text-lg font-black text-emerald-600 mt-3">
            {productionEfficiencyPct}%
          </h4>
          <span className="text-[10px] text-slate-500 block mt-2">&bull; 2% Shrinkage (normal dust loss)</span>
        </div>

        {/* OPERATIONS DENSITY */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Logistics Density</span>
            <ArrowRightLeft className="text-cyan-600 shrink-0" size={16} />
          </div>
          <h4 className="text-lg font-black text-slate-800 mt-3">
            {totalDistributionRuns + activeCustomerAccounts} units
          </h4>
          <div className="text-[10px] text-slate-500 mt-2 flex justify-between">
            <span>{totalDistributionRuns} deliveries</span>
            <span>{activeCustomerAccounts} wholesalers</span>
          </div>
        </div>

      </div>

      {/* PARETO ANALYSIS SECTOR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
              <PieChart size={14} className="text-teal-600" />
              Pareto 80/20 Distribution Analysis
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Identify high-impact feed formulas driving 80% of sales or production runs</p>
          </div>

          {/* Pareto Type Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl border">
            <button
              onClick={() => setParetoType("Sales")}
              className={`px-3.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                paretoType === "Sales" ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Analyze Sales (PHP)
            </button>
            <button
              onClick={() => setParetoType("Production")}
              className={`px-3.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                paretoType === "Production" ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Analyze Production (Bags)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* PARETO CHART PANEL */}
          <div className="lg:col-span-2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData} margin={{ top: 10, right: -5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#475569" }} stroke="#CBD5E1" />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#475569" }} stroke="#CBD5E1" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#E2E8F0" domain={[0, 100]} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar 
                  yAxisId="left" 
                  dataKey="value" 
                  name={paretoType === "Sales" ? "Sales Amount (PHP)" : "Production Amount (Bags)"} 
                  fill="#0F766E" 
                  radius={[5, 5, 0, 0]} 
                  barSize={40}
                >
                  {paretoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cumulativePct <= 80 ? "#0F766E" : "#94A3B8"} />
                  ))}
                </Bar>
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cumulativePct" 
                  name="Cumulative Percentage (%)" 
                  stroke="#F43F5E" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* PARETO INSIGHTS REPORT */}
          <div className="bg-slate-50 border p-5 rounded-2xl space-y-4 font-sans text-xs text-slate-700">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Pareto Analysis Log</h5>
            <div className="space-y-3">
              {paretoData.map((item, index) => (
                <div key={item.name} className="flex justify-between items-center text-[11px]">
                  <span className="font-mono font-bold text-teal-700">{item.name}</span>
                  <div className="text-right">
                    <span className="font-semibold block text-slate-800">
                      {paretoType === "Sales" ? `₱${item.value.toLocaleString()}` : `${item.value.toLocaleString()} bags`}
                    </span>
                    <span className={`text-[9px] font-bold ${item.cumulativePct <= 80 ? "text-teal-600" : "text-slate-400"}`}>
                      Cum Pct: {item.cumulativePct}% ({item.cumulativePct <= 80 ? "Top 80%" : "Remaining 20%"})
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl mt-3 text-[10px] text-teal-800 leading-relaxed font-medium">
              <strong>BI Strategy Note:</strong> The highlighted items contribute to over 80% of your operational volume. Prioritize silo replenishment scheduling and formulation adjustments specifically for these high-impact feeds.
            </div>
          </div>

        </div>

      </div>

      {/* MULTIDIMENSIONAL OLAP CUBE DRILL-DOWN */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
              <Calculator size={14} className="text-teal-600" />
              Multi-Dimensional OLAP Drill-down Table
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Aggregate production metrics, logistics shipments, and wholesale sales across any variable</p>
          </div>

          {/* OLAP Dimension Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl border">
            {["Feed Product", "Month", "Buyer", "Customer"].map((dim) => (
              <button
                key={dim}
                onClick={() => setOlapDimension(dim as any)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  olapDimension === dim ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="py-3 px-5">Dimension: {olapDimension}</th>
                <th className="py-3 px-5 text-right">Production (Bags)</th>
                <th className="py-3 px-5 text-right">Deliveries (Bags)</th>
                <th className="py-3 px-5 text-right">Sales Volume (Bags)</th>
                <th className="py-3 px-5 text-right">Sales Amount (PHP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {olapRows.map((row) => (
                <tr key={row.dimensionKey} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-bold text-slate-800">{row.dimensionKey}</td>
                  <td className="py-3.5 px-5 text-right font-mono font-medium text-slate-700">
                    {row.productionBags > 0 ? `${row.productionBags.toLocaleString()} bags` : "--"}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-medium text-slate-700">
                    {row.distributionBags > 0 ? `${row.distributionBags.toLocaleString()} bags` : "--"}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-medium text-slate-700">
                    {row.salesBags > 0 ? `${row.salesBags.toLocaleString()} bags` : "--"}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-black text-teal-700 text-sm">
                    {row.revenuePhp > 0 ? `₱${row.revenuePhp.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "--"}
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
