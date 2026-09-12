import React, { useState } from "react";
import { User, RawMaterial, FeedProduct } from "../types";
import { 
  Package, TrendingUp, AlertTriangle, RefreshCw, 
  Settings, CheckCircle2, Search, ArrowUpRight, ArrowDownRight 
} from "lucide-react";

interface InventoryModuleProps {
  currentUser: User;
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
  onUpdateRawMaterials: (newMaterials: RawMaterial[]) => void;
  onUpdateFeedProducts: (newProducts: FeedProduct[]) => void;
}

export default function InventoryModule({
  currentUser,
  rawMaterials,
  feedProducts,
  onUpdateRawMaterials,
  onUpdateFeedProducts
}: InventoryModuleProps) {
  const isPM = currentUser.role === "Production Manager" || currentUser.role === "production_manager";
  const [activeSubTab, setActiveSubTab] = useState<"all" | "raw" | "finished" | "low">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Adjustment form states
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustItemType, setAdjustItemType] = useState<"Raw" | "Finished">("Raw");
  const [adjustItemCode, setAdjustItemCode] = useState("");
  const [adjustType, setAdjustType] = useState<"Stock In" | "Stock Out" | "Adjustment">("Adjustment");
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustRemarks, setAdjustRemarks] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Low/critical counts
  const lowMaterials = rawMaterials.filter(m => m.quantity <= m.minStock);
  const lowFeeds = feedProducts.filter(f => f.quantityBags <= f.minStockBags);
  const criticalMaterials = rawMaterials.filter(m => m.quantity <= m.minStock * 0.4); // extremely low
  const criticalFeeds = feedProducts.filter(f => f.quantityBags <= f.minStockBags * 0.4);

  const totalLowCount = lowMaterials.length + lowFeeds.length;
  const totalCriticalCount = criticalMaterials.length + criticalFeeds.length;

  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!adjustItemCode || adjustQty === 0) {
      setErrorMsg("Please select an item and provide a non-zero adjustment quantity.");
      return;
    }

    const target = adjustItemType === "Raw"
      ? rawMaterials.find(m => m.code === adjustItemCode)
      : feedProducts.find(f => f.code === adjustItemCode);
    if (!target) return;
    const currentQuantity = adjustItemType === "Raw" ? (target as RawMaterial).quantity : (target as FeedProduct).quantityBags;
    if (currentQuantity + adjustQty < 0) {
      setErrorMsg(`Cannot adjust stock below zero. Current stock is ${currentQuantity.toLocaleString()}.`);
      return;
    }
    try {
      const response = await fetch('/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' },
        body: JSON.stringify({ item_type: adjustItemType === 'Raw' ? 'raw_material' : 'finished_product', item_id: target.id, quantity: adjustQty, remarks: adjustRemarks }),
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.message || Object.values(saved.errors ?? {}).flat().join(' ') || 'Could not save inventory adjustment.');
      if (adjustItemType === "Raw") {
        onUpdateRawMaterials(rawMaterials.map(m => m.id === saved.id ? { ...m, quantity: Number(saved.quantity_on_hand) } : m));
      } else {
        onUpdateFeedProducts(feedProducts.map(f => f.id === saved.id ? { ...f, quantityBags: Number(saved.quantity_bags) } : f));
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not save inventory adjustment.');
      return;
    }

    setShowAdjustmentModal(false);
    setAdjustItemCode("");
    setAdjustQty(0);
    setAdjustRemarks("");
  };

  const getFilteredItems = () => {
    const q = searchQuery.toLowerCase();
    let items: any[] = [];

    if (activeSubTab === "all" || activeSubTab === "raw") {
      const mappedRaw = rawMaterials.map(m => ({ ...m, type: "Raw Material", displayStock: `${m.quantity.toLocaleString()} ${m.unit}`, isLow: m.quantity <= m.minStock, isCritical: m.quantity <= m.minStock * 0.4 }));
      items = [...items, ...mappedRaw];
    }
    if (activeSubTab === "all" || activeSubTab === "finished") {
      const mappedFeeds = feedProducts.map(f => ({ ...f, type: "Feed Product", displayStock: `${f.quantityBags.toLocaleString()} bags`, isLow: f.quantityBags <= f.minStockBags, isCritical: f.quantityBags <= f.minStockBags * 0.4 }));
      items = [...items, ...mappedFeeds];
    }
    if (activeSubTab === "low") {
      const mappedRaw = rawMaterials.filter(m => m.quantity <= m.minStock).map(m => ({ ...m, type: "Raw Material", displayStock: `${m.quantity.toLocaleString()} ${m.unit}`, isLow: true, isCritical: m.quantity <= m.minStock * 0.4 }));
      const mappedFeeds = feedProducts.filter(f => f.quantityBags <= f.minStockBags).map(f => ({ ...f, type: "Feed Product", displayStock: `${f.quantityBags.toLocaleString()} bags`, isLow: true, isCritical: f.quantityBags <= f.minStockBags * 0.4 }));
      items = [...mappedRaw, ...mappedFeeds];
    }

    return items.filter(item => item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q));
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Top statistics summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* TOTAL VALUE PANEL */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Raw Materials Silo Status</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">
              {Math.round(rawMaterials.reduce((sum, m) => sum + m.quantity, 0) / 1000)} Tons
            </h3>
            <span className="text-[10px] text-teal-600 block mt-1.5 font-bold">10 silo slots registered</span>
          </div>
          <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-xl">
            <Package className="text-teal-600" size={24} />
          </div>
        </div>

        {/* LOW STOCK CARD */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Stock Limit Warning</span>
            <h3 className="text-xl font-extrabold text-amber-600 mt-1">
              {totalLowCount} items
            </h3>
            <span className="text-[10px] text-slate-500 block mt-1.5 font-medium">Require immediate replenishment</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl">
            <AlertTriangle className="text-amber-500" size={24} />
          </div>
        </div>

        {/* CRITICAL SLOTS */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Critical Stock Level Warning</span>
            <h3 className="text-xl font-extrabold text-rose-600 mt-1">
              {totalCriticalCount} items
            </h3>
            <span className="text-[10px] text-rose-500 block mt-1.5 font-bold">HIGH STOCKOUT HAZARD</span>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl">
            <AlertTriangle className="text-rose-600 animate-pulse" size={24} />
          </div>
        </div>

      </div>

      {/* Main filter subtabs and adjustment trigger */}
      <div className="bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveSubTab("all"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "all" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            All Inventory Items
          </button>
          <button
            onClick={() => { setActiveSubTab("raw"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "raw" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Raw Ingredients
          </button>
          <button
            onClick={() => { setActiveSubTab("finished"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "finished" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Finished Feed Products
          </button>
          <button
            onClick={() => { setActiveSubTab("low"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "low" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Low Stock Alerts ({totalLowCount})
          </button>
        </div>

        <div className="flex gap-3 items-center w-full sm:w-auto">
          {/* Search field */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
              placeholder="Search by code or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Correct adjustment triggers only for PM */}
          {isPM && (
            <button
              onClick={() => { setErrorMsg(""); setShowAdjustmentModal(true); }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
              Adjust Stock
            </button>
          )}
        </div>

      </div>

      {/* Main Stock Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Stock Ledger</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Physical inventory stocks recorded in tagansule mills silos and warehouses</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="py-3.5 px-6">Item Code</th>
                <th className="py-3.5 px-6">Item Description</th>
                <th className="py-3.5 px-6">Classification</th>
                <th className="py-3.5 px-6 text-right">Physical Inventory Stock</th>
                <th className="py-3.5 px-6 text-right">Target / Minimum Stock</th>
                <th className="py-3.5 px-6 text-center">Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {getFilteredItems().map((item) => (
                <tr key={item.code} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-mono font-extrabold text-slate-700">{item.code}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                  <td className="py-4 px-6 font-semibold text-slate-500">{item.type}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-mono font-black text-sm ${
                      item.isCritical ? "text-rose-600 animate-pulse" : item.isLow ? "text-amber-600" : "text-slate-800"
                    }`}>
                      {item.displayStock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-slate-400">
                    {item.type === "Raw Material" ? `${item.minStock.toLocaleString()} kg` : `${item.minStockBags.toLocaleString()} bags`}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                      item.isCritical 
                        ? "bg-rose-100 text-rose-700 border border-rose-200" 
                        : item.isLow 
                        ? "bg-amber-100 text-amber-700 border border-amber-200" 
                        : "bg-teal-50 text-teal-700 border border-teal-100"
                    }`}>
                      {item.isCritical ? "CRITICAL OUTAGE" : item.isLow ? "REPLENISH" : "ADEQUATE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUSTMENT DIALOG MODAL */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Log Stock Adjustment Action
              </h3>
              <button onClick={() => setShowAdjustmentModal(false)} className="text-slate-400 hover:text-slate-700 rounded-lg p-1">
                <Settings size={16} />
              </button>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs items-center flex gap-1.5">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Inventory Category</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setAdjustItemType("Raw"); setAdjustItemCode(""); }}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      adjustItemType === "Raw" ? "bg-teal-600 border-teal-500 text-white" : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    Raw Materials
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdjustItemType("Finished"); setAdjustItemCode(""); }}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      adjustItemType === "Finished" ? "bg-teal-600 border-teal-500 text-white" : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    Finished Feeds
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Target Item *</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={adjustItemCode}
                  onChange={(e) => setAdjustItemCode(e.target.value)}
                >
                  <option value="">-- Choose Item --</option>
                  {adjustItemType === "Raw" 
                    ? rawMaterials.map(m => <option key={m.code} value={m.code}>{m.name} ({m.quantity.toLocaleString()} kg)</option>)
                    : feedProducts.map(f => <option key={f.code} value={f.code}>{f.name} ({f.quantityBags.toLocaleString()} bags)</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Adjustment Type *</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                >
                  <option value="Adjustment">Adjustment (Audit Correction)</option>
                  <option value="Stock In">Manual Stock In (Direct Silo Entry)</option>
                  <option value="Stock Out">Manual Stock Out (Silo Disposal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Quantity ({adjustItemType === "Raw" ? "kg" : "bags"}) *
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseFloat(e.target.value) || 0)}
                  placeholder="Use negative numbers for stock removals (e.g., -50)"
                />
                <span className="text-[10px] text-slate-400 block mt-1">E.g., enter <strong>100</strong> to add stock, or <strong>-50</strong> to remove stock.</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Reason / Remarks</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none h-16 resize-none"
                  value={adjustRemarks}
                  onChange={(e) => setAdjustRemarks(e.target.value)}
                  placeholder="Reason for adjustment, audit details..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowAdjustmentModal(false)} className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2 rounded-xl">Apply and Sync</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
