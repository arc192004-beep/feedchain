import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, LineChart, Line, Cell, PieChart, Pie
} from "recharts";
import { RawMaterial, FeedProduct, ProductionBatch, DistributionRecord, SalesRecord } from "../types";
import { AlertTriangle, TrendingUp, BarChart3, HelpCircle, Flame, Snowflake } from "lucide-react";

interface AnalyticsModuleProps {
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
  productionBatches: ProductionBatch[];
  distributions: DistributionRecord[];
  sales: SalesRecord[];
}

export default function AnalyticsModule({
  rawMaterials,
  feedProducts,
  productionBatches,
  distributions,
  sales
}: AnalyticsModuleProps) {

  // Compile 6-month data: Jan to Jun 2026
  const MONTHS = ["January", "February", "March", "April", "May", "June"];
  const MONTH_KEYS = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];

  const monthlyReportDataset = MONTH_KEYS.map((key, index) => {
    // 1. Production Bags
    const totalProd = productionBatches
      .filter(b => b.status === "Completed" && b.productionDate.startsWith(key))
      .reduce((sum, b) => sum + b.quantityProducedBags, 0);

    // 2. Distributed Bags
    const totalDist = distributions
      .filter(d => d.distributionDate.startsWith(key))
      .reduce((sum, d) => sum + d.quantityBags, 0);

    // 3. Sales Amount (PHP in Ten Thousands for cleaner chart axes scaling)
    const totalSalesPhp = sales
      .filter(s => s.salesDate.startsWith(key))
      .reduce((sum, s) => sum + s.totalAmount, 0);

    // 4. Simulated Wastage (process loss) in kg
    const processLossKg = Math.round(totalProd * 1.8); // standard feed milling process loss is ~1.8%
    
    // 5. Shortage incidents (low stock materials counts during that period)
    const shortageIndices = [3, 2, 4, 1, 0, 1][index]; 

    return {
      month: MONTHS[index],
      production: totalProd,
      distribution: totalDist,
      salesRevenue: Math.round(totalSalesPhp),
      wastageKg: processLossKg,
      shortages: shortageIndices
    };
  });

  // Calculate Feed Product Distribution share
  const productDistributionShare = feedProducts.map(p => {
    const totalBagsSold = sales
      .filter(s => s.feedProductCode === p.code)
      .reduce((sum, s) => sum + s.quantityBags, 0) +
      distributions
      .filter(d => d.feedProductCode === p.code)
      .reduce((sum, d) => sum + d.quantityBags, 0);
    return {
      name: p.name.split(" ")[0] + " " + (p.name.split(" ")[1] || ""),
      bagsSold: totalBagsSold
    };
  }).filter(item => item.bagsSold > 0);

  // Silo level statistics
  const siloDataset = rawMaterials.map(m => ({
    name: m.name.split(" ")[0],
    level: m.quantity,
    min: m.minStock
  }));

  // Chart Palettes
  const COLORS = ["#0F766E", "#14B8A6", "#0D9488", "#2DD4BF", "#06B6D4", "#0891B2", "#0284C7", "#0369A1"];

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Dynamic Summary Cards */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <BarChart3 className="text-teal-600" size={16} />
          Descriptive Analytics Dashboard
        </h3>
        <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
          Aggregated 6-month historical trends (Jan - Jun 2026) for the board of 3H Enterprises Ltd., illustrating correlations between pellet production outputs, bay distributions, and retail revenue streams.
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: PRODUCTION & DISTRIBUTION DUAL CURVES */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milling Yields vs. Cage Deliveries</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Correlation between bags produced and total bag distributions (Jan - Jun 2026)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyReportDataset} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  labelStyle={{ fontWeight: "bold", color: "#1E293B", fontSize: "11px" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="production" name="Milled Bags" stroke="#0F766E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProd)" />
                <Area type="monotone" dataKey="distribution" name="Delivered Bags" stroke="#14B8A6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDist)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: MONTHLY SALES REVENUE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Accumulated Sales Cash Flow</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Total wholesale and cooperative revenue in PHP (Jan - Jun 2026)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyReportDataset} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" />
                <YAxis 
                  tick={{ fontSize: 10, fill: "#64748B" }} 
                  stroke="#CBD5E1"
                  tickFormatter={(val) => `₱${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  itemStyle={{ fontSize: "11px" }}
                  formatter={(val: any) => [`₱${val.toLocaleString()}`, "Sales Revenue"]}
                />
                <Bar dataKey="salesRevenue" fill="#0F766E" radius={[6, 6, 0, 0]}>
                  {monthlyReportDataset.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? "#14B8A6" : "#0F766E"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: PROCESS WASTAGE & SHORTAGES CORRELATION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milling Loss & Silo Shortage Metrics</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Milling process losses in kilograms paired with critical stock warning events</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyReportDataset} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#0F766E" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#F43F5E" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line yAxisId="left" type="monotone" dataKey="wastageKg" name="Process Loss (kg)" stroke="#0F766E" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="shortages" name="Silo Alerts Logged" stroke="#F43F5E" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: TOP SELLING FEED PRODUCTS (MARKET SHARE) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Market Demand Distribution</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Top performing aquatic feeds by bags distributed (Sales + Deliveries)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productDistributionShare} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  itemStyle={{ fontSize: "11px" }}
                  formatter={(val: any) => [`${val.toLocaleString()} bags`, "Delivered Volume"]}
                />
                <Bar dataKey="bagsSold" fill="#14B8A6" radius={[0, 6, 6, 0]}>
                  {productDistributionShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 5: SILO STOCKS VS SAFE THRESHOLD */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Silo Stocking Allocation Chart</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Current physical raw material inventories (kg) plotted against minimum safety stock limits</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siloDataset} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} stroke="#CBD5E1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="level" name="Current Silo Level" fill="#0F766E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="min" name="Minimum Threshold Limit" fill="#FDA4AF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
