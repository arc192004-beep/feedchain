import { User, RawMaterial, FeedProduct, ProductionBatch, DistributionRecord, SalesRecord } from "../types";
import { 
  Users, Layers, Package, ClipboardList, Truck, 
  TrendingUp, AlertTriangle, Coins, ArrowUpRight, ArrowDownRight, 
  Calendar, CheckCircle2 
} from "lucide-react";

interface DashboardCardsProps {
  currentUser: User;
  users: User[];
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
  productionBatches: ProductionBatch[];
  distributions: DistributionRecord[];
  sales: SalesRecord[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardCards({
  currentUser,
  users,
  rawMaterials,
  feedProducts,
  productionBatches,
  distributions,
  sales,
  setActiveTab
}: DashboardCardsProps) {
  const isAdmin = (currentUser.role || '').toString().toLowerCase() === 'administrator';

  // Calculations
  const activeUsersCount = users.filter((u) => u.status === "Active").length;
  const totalRawMatTypes = rawMaterials.length;
  const totalFeedTypes = feedProducts.length;
  const totalBatches = productionBatches.length;
  const completedBatches = productionBatches.filter(b => b.status === "Completed");
  
  const totalBagsInStock = feedProducts.reduce((sum, f) => sum + f.quantityBags, 0);
  const totalTonsOfRawMaterials = Math.round(rawMaterials.reduce((sum, m) => sum + m.quantity, 0) / 1000);
  
  const totalDistributedBags = distributions.reduce((sum, d) => sum + d.quantityBags, 0);
  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  
  const lowMaterialsCount = rawMaterials.filter(m => m.quantity <= m.minStock).length;
  const lowFeedsCount = feedProducts.filter(f => f.quantityBags <= f.minStockBags).length;
  const totalLowAlerts = lowMaterialsCount + lowFeedsCount;

  // Monthly Metrics
  // We'll calculate June 2026 and July 2026 totals
  const juneProductionBags = productionBatches
    .filter(b => b.status === "Completed" && b.productionDate.startsWith("2026-06"))
    .reduce((sum, b) => sum + b.quantityProducedBags, 0);

  const julyProductionBags = productionBatches
    .filter(b => b.status === "Completed" && b.productionDate.startsWith("2026-07"))
    .reduce((sum, b) => sum + b.quantityProducedBags, 0);

  const juneSalesRevenue = sales
    .filter(s => s.salesDate.startsWith("2026-06"))
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const julySalesRevenue = sales
    .filter(s => s.salesDate.startsWith("2026-07"))
    .reduce((sum, s) => sum + s.totalAmount, 0);

  // Growth percentage
  const salesGrowthPct = juneSalesRevenue === 0 ? 0 : Math.round(((julySalesRevenue * (30/13) - juneSalesRevenue) / juneSalesRevenue) * 100); // Projected monthly normalized
  const prodGrowthPct = juneProductionBags === 0 ? 0 : Math.round(((julyProductionBags * (30/13) - juneProductionBags) / juneProductionBags) * 100);

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Welcome Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-[-10%] right-[-10%] w-[20rem] h-[20rem] bg-teal-800/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-widest bg-teal-950/55 border border-teal-500/20 px-2.5 py-1 rounded-full">
              Enterprise Dashboard
            </span>
            <h2 className="text-xl font-bold mt-3 text-slate-100">
              Welcome Back, {currentUser.firstName}!
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              You are currently authenticated as an <strong className="text-teal-300">{currentUser.role}</strong>. Here is the active operational summary of 3H Enterprises Ltd. feed operations in Tagansule, Malalag.
            </p>
          </div>
          <div className="flex gap-3">
            {isAdmin ? (
              <>
                <button 
                  onClick={() => setActiveTab("analytics")}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <TrendingUp size={14} />
                  View Analytics
                </button>
                <button 
                  onClick={() => setActiveTab("reports")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Users size={14} />
                  View Reports
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab("production")}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <ClipboardList size={14} />
                  Record Production
                </button>
                <button 
                  onClick={() => setActiveTab("inventory")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Package size={14} />
                  Warehouse Stock
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* TOTAL SALES REVENUE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl">
              <Coins className="text-teal-600" size={20} />
            </div>
            <span className="flex items-center text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} className="mr-0.5" />
              +14% vs Jun
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-4">Total Accumulated Sales</p>
          <h3 className="text-lg font-extrabold text-slate-800 mt-1">
            ₱{totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="text-[10px] text-slate-500 mt-2.5 flex justify-between">
            <span>July Actual: ₱{julySalesRevenue.toLocaleString()}</span>
            <span className="font-semibold text-slate-700">6-Month History</span>
          </div>
        </div>

        {/* TOTAL PRODUCTION CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl">
              <ClipboardList className="text-cyan-600" size={20} />
            </div>
            <span className="flex items-center text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} className="mr-0.5" />
              +8% Yield
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-4">Production Batches Yielded</p>
          <h3 className="text-lg font-extrabold text-slate-800 mt-1">
            {completedBatches.reduce((s,b) => s + b.quantityProducedBags, 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">Bags</span>
          </h3>
          <div className="text-[10px] text-slate-500 mt-2.5 flex justify-between">
            <span>Active: {totalBatches} runs</span>
            <span className="text-emerald-600 font-bold">96% Target Match</span>
          </div>
        </div>

        {/* INVENTORY WAREHOUSE LEVEL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Package className="text-indigo-600" size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Warehouse Level
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-4">Raw Materials / Finished Stock</p>
          <h3 className="text-lg font-extrabold text-slate-800 mt-1">
            {totalTonsOfRawMaterials}T <span className="text-xs text-slate-400 font-normal">/</span> {totalBagsInStock.toLocaleString()} <span className="text-xs font-normal text-slate-500">Bags</span>
          </h3>
          <div className="text-[10px] text-slate-500 mt-2.5 flex justify-between">
            <span>Feed items: {totalFeedTypes} types</span>
            <span className="font-semibold text-slate-700">Raw items: {totalRawMatTypes}</span>
          </div>
        </div>

        {/* DEFICIT & STOCK WARNINGS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <AlertTriangle className={totalLowAlerts > 0 ? "text-rose-600 animate-bounce" : "text-slate-400"} size={20} />
            </div>
            {totalLowAlerts > 0 ? (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full animate-pulse">
                ACTION REQUIRED
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                STABLE SECURE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium mt-4">Low Stock Alerts & Shortages</p>
          <h3 className="text-lg font-extrabold text-slate-800 mt-1">
            {totalLowAlerts} <span className="text-xs font-normal text-slate-500">items below limit</span>
          </h3>
          <div className="text-[10px] text-slate-500 mt-2.5 flex justify-between">
            <span className="text-rose-500 font-bold">{lowMaterialsCount} ingredients</span>
            <span className="text-amber-500 font-bold">{lowFeedsCount} feed bags</span>
          </div>
        </div>

      </div>

      {/* Recent operational activity */}
      <div>
        
        {/* RECENT BATCH LOGS / OPERATIONS SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Batching Statuses</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Most recent production line records from the mill</p>
            </div>
            <button 
              onClick={() => setActiveTab("production")}
              className="text-[11px] text-teal-600 font-bold hover:underline"
            >
              Access Production Hub &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-semibold">Batch No</th>
                  <th className="py-2.5 px-3 font-semibold">Feed Product</th>
                  <th className="py-2.5 px-3 font-semibold">Production Date</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Yield</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productionBatches.slice(-5).reverse().map((b) => {
                  const product = feedProducts.find(p => p.code === b.feedProductCode);
                  return (
                    <tr key={b.batchNo} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{b.batchNo}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {product ? product.name : b.feedProductCode}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{b.productionDate}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-800">{b.quantityProducedBags.toLocaleString()} bags</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                          b.status === "Completed" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : b.status === "Pending" 
                            ? "bg-amber-50 text-amber-700 border border-amber-100" 
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
