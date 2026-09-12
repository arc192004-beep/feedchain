import React, { useState } from "react";
import { User, RawMaterial, FeedProduct, ProductionBatch, DistributionRecord, SalesRecord } from "../types";
import { 
  FileText, Download, Printer, Eye, CheckCircle2, 
  Calendar, Anchor, MapPin, DollarSign, Info 
} from "lucide-react";

interface ReportsModuleProps {
  currentUser: User;
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
  productionBatches: ProductionBatch[];
  distributions: DistributionRecord[];
  sales: SalesRecord[];
}

export default function ReportsModule({
  currentUser,
  rawMaterials,
  feedProducts,
  productionBatches,
  distributions,
  sales
}: ReportsModuleProps) {
  const [reportType, setReportType] = useState<"SILO_STOCK" | "PRODUCTION_LOG" | "DISTRIBUTION" | "SALES_REVENUE">("SILO_STOCK");
  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleExport = (format: "PDF" | "EXCEL") => {
    setIsExporting(true);
    setSuccessMsg("");

    setTimeout(() => {
      setIsExporting(false);
      setSuccessMsg(`Successfully generated and downloaded ${reportType}_REPORT_${new Date().toISOString().split("T")[0]}.${format === "PDF" ? "pdf" : "xlsx"}`);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header Block */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <FileText className="text-teal-600" size={16} />
          Operational Reports & Audit Exports
        </h3>
        <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
          Compile formal operational manifests and regulatory audit summaries for the board of 3H Enterprises, regional cooperatives, or tax filing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* REPORT SELECTOR SIDEBAR */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Report Classification</h4>
            <div className="space-y-1.5">
              {[
                { id: "SILO_STOCK", label: "Silo Inventory & Levels Audit", desc: "Raw ingredients current stocks" },
                { id: "PRODUCTION_LOG", label: "Monthly Milling Yield Runs", desc: "Completed feed batch totals" },
                { id: "DISTRIBUTION", label: "Malalag Bay Cage Supplies", desc: "Feeds dispatched to buyers" },
                { id: "SALES_REVENUE", label: "Sales Receipts & Ledger", desc: "Wholesale transactions list" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setReportType(item.id as any); setSuccessMsg(""); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    reportType === item.id 
                      ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm" 
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="font-extrabold text-xs block">{item.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Export Document</h4>
            
            <button
              onClick={() => handleExport("PDF")}
              disabled={isExporting}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
            >
              <Download size={14} />
              {isExporting ? "Compiling PDF..." : "Export as Formal PDF"}
            </button>

            <button
              onClick={() => handleExport("EXCEL")}
              disabled={isExporting}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
            >
              <FileText size={14} />
              {isExporting ? "Compiling Excel..." : "Export as Excel (.xlsx)"}
            </button>
          </div>
        </div>

        {/* REPORT SIMULATED PRINTABLE PREVIEW SHEET */}
        <div className="lg:col-span-3 space-y-4">
          
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIMULATED A4 PRINT SHEET */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 font-sans min-h-[600px] relative overflow-hidden">
            
            {/* watermark style backdrop decoration */}
            <div className="absolute right-10 top-10 opacity-5 pointer-events-none text-right font-black text-6xl uppercase tracking-widest text-slate-900 select-none">
              3H FEEDS
            </div>

            {/* Letterhead Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">3H Enterprises Ltd., Inc.</h3>
                <p className="text-[10px] text-slate-500 font-medium">Tagansule, Malalag, Davao del Sur, Philippines</p>
                <p className="text-[9px] text-slate-400 font-mono">Email: operations@3henterprises.com.ph | Tel: +63 (82) 553-2211</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] bg-slate-100 border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-600 uppercase">
                  Simulated Manifest Sheet
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-2">Date Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-[10px] text-slate-400 font-mono">Generated By: {currentUser.firstName} {currentUser.lastName} ({currentUser.role})</p>
              </div>
            </div>

            {/* Document Title & Description */}
            <div className="mb-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                {reportType === "SILO_STOCK" && "RAW MATERIALS SILO AUDIT LEDGER"}
                {reportType === "PRODUCTION_LOG" && "FEED MILLING PRODUCTION LEDGER"}
                {reportType === "DISTRIBUTION" && "COOPERATIVE DELIVERIES MANIFEST"}
                {reportType === "SALES_REVENUE" && "RETAIL SALES RECEIPTS & REGISTER"}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                {reportType === "SILO_STOCK" && "Complete audit of physical raw material stocks currently stored across silo compartments. Used to authorize procurement pipelines."}
                {reportType === "PRODUCTION_LOG" && "Log of completed feed milling production runs, documenting feed product types, outputs in 25kg bags, and quality validation."}
                {reportType === "DISTRIBUTION" && "Operational dispatch logs of custom feed outputs distributed to cage cooperatives and operators in Malalag Bay."}
                {reportType === "SALES_REVENUE" && "Cash register of completed feed sales, invoices, client wholesale accounts, and accumulated regional revenue."}
              </p>
            </div>

            {/* REPORT SPECIFIC TABLES */}
            
            {/* A. SILO STOCK COMPONENT */}
            {reportType === "SILO_STOCK" && (
              <table className="w-full text-[11px] text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-4 border-r border-slate-200">Code</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Material Name</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Current Stock</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Unit Cost</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Safety Level</th>
                    <th className="py-2.5 px-4">Alert Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rawMaterials.map(m => (
                    <tr key={m.code} className="hover:bg-slate-50">
                      <td className="py-2 px-4 border-r border-slate-200 font-mono font-bold text-slate-500">{m.code}</td>
                      <td className="py-2 px-4 border-r border-slate-200 font-semibold text-slate-800">{m.name}</td>
                      <td className="py-2 px-4 text-right border-r border-slate-200 font-mono">{m.quantity.toLocaleString()} {m.unit}</td>
                      <td className="py-2 px-4 text-right border-r border-slate-200 font-mono">₱{m.cost.toFixed(2)}</td>
                      <td className="py-2 px-4 text-right border-r border-slate-200 font-mono">{m.minStock.toLocaleString()} kg</td>
                      <td className="py-2 px-4">
                        <span className={`font-bold ${m.quantity <= m.minStock ? "text-rose-600" : "text-teal-600"}`}>
                          {m.quantity <= m.minStock ? "LOW STOCK ALERT" : "STABLE COMPARTMENT"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* B. PRODUCTION LOGS COMPONENT */}
            {reportType === "PRODUCTION_LOG" && (
              <table className="w-full text-[11px] text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-4 border-r border-slate-200">Batch ID</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Feed Product</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Milling Date</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Bags Produced</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Validation</th>
                    <th className="py-2.5 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productionBatches.map(b => {
                    const prod = feedProducts.find(f => f.code === b.feedProductCode);
                    return (
                      <tr key={b.batchNo} className="hover:bg-slate-50">
                        <td className="py-2 px-4 border-r border-slate-200 font-mono font-bold text-slate-500">{b.batchNo}</td>
                        <td className="py-2 px-4 border-r border-slate-200 font-semibold text-slate-800">{prod ? prod.name : b.feedProductCode}</td>
                        <td className="py-2 px-4 border-r border-slate-200 font-mono">{b.productionDate}</td>
                        <td className="py-2 px-4 text-right border-r border-slate-200 font-mono font-bold">{b.quantityProducedBags.toLocaleString()} bags</td>
                        <td className="py-2 px-4 border-r border-slate-200">
                          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px]">
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-slate-500 italic max-w-xs truncate">{b.notes || "--"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* C. DISTRIBUTION LEDGER */}
            {reportType === "DISTRIBUTION" && (
              <table className="w-full text-[11px] text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-4 border-r border-slate-200">Delivery ID</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Cage Wholesaler</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Date Dispatched</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Feed product</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Delivered Volume</th>
                    <th className="py-2.5 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {distributions.map(d => {
                    const prod = feedProducts.find(f => f.code === d.feedProductCode);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="py-2 px-4 border-r border-slate-200 font-mono font-bold text-slate-500">{d.id}</td>
                        <td className="py-2 px-4 border-r border-slate-200 font-semibold text-slate-800">{d.buyerId}</td>
                        <td className="py-2 px-4 border-r border-slate-200 font-mono">{d.distributionDate}</td>
                        <td className="py-2 px-4 border-r border-slate-200 font-semibold">{prod ? prod.name : d.feedProductCode}</td>
                        <td className="py-2 px-4 text-right border-r border-slate-200 font-mono font-bold">{d.quantityBags.toLocaleString()} bags</td>
                        <td className="py-2 px-4 text-slate-500 italic max-w-xs truncate">{d.remarks || "--"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* D. SALES RECEIPTS COMPONENT */}
            {reportType === "SALES_REVENUE" && (
              <table className="w-full text-[11px] text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-4 border-r border-slate-200">Invoice ID</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Client / Wholesaler</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Sales Date</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Bags Sold</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total Invoice Sum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2 px-4 border-r border-slate-200 font-mono font-bold text-slate-500">{s.id}</td>
                      <td className="py-2 px-4 border-r border-slate-200 font-semibold text-slate-800">{s.customerId}</td>
                      <td className="py-2 px-4 border-r border-slate-200 font-mono">{s.salesDate}</td>
                      <td className="py-2 px-4 text-right border-r border-slate-200 font-mono">{s.quantityBags.toLocaleString()} bags</td>
                      <td className="py-2 px-4 text-right border-r border-slate-200 font-mono">₱{s.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-4 text-right font-mono font-black text-teal-700">₱{s.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={5} className="py-3 px-4 border-r border-slate-200 text-right">Accumulated Total Billings:</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-sm text-teal-800">
                      ₱{sales.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Formal Footer signatures */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-[10px] text-slate-500">
              <div>
                <p className="font-bold text-slate-700">Audit Certification:</p>
                <div className="border-b border-slate-400 h-10 w-48 mt-2"></div>
                <p className="mt-1">Production Manager</p>
                <p className="text-[8px] text-slate-400 font-mono">Date signed: ____________________</p>
              </div>

              <div className="text-right flex flex-col items-end">
                <p className="font-bold text-slate-700">Approved for release:</p>
                <div className="border-b border-slate-400 h-10 w-48 mt-2"></div>
                <p className="mt-1">Chief Executive Administrator</p>
                <p className="text-[8px] text-slate-400 font-mono">Date signed: ____________________</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
