import { useState, useEffect } from "react";
import { User, RawMaterial, FeedProduct } from "../types";
import { Bell, Clock, AlertTriangle, ShieldCheck, UserCheck } from "lucide-react";

interface HeaderProps {
  currentUser: User;
  activeTab: string;
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
}

export default function Header({ currentUser, activeTab, rawMaterials, feedProducts }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Operational Executive Summary";
      case "users": return "System User & Privileges Administration";
      case "production": return "Aquatic Feeds Production & Batching Control";
      case "inventory": return "Raw Materials & Finished Feeds Warehouse Logistics";
      case "distribution": return "Aquatic Cage Distribution & Buyer Log";
      case "customer_sales": return "Customer Sales & Distribution Revenue Transcripts";
      case "analytics": return "Descriptive Analytics Intelligence Hub";
      case "bi": return "Decision Support & Business Intelligence Dashboard";
      case "reports": return "Operational & Analytical Report Ledger";
      case "settings": return "MySQL Relational Model & Settings Console";
      default: return "FEEDCHAIN Portal";
    }
  };

  // Calculate notifications based on low stocks
  const lowMaterials = rawMaterials.filter(m => m.quantity <= m.minStock && m.status === "Active");
  const lowFeeds = feedProducts.filter(f => f.quantityBags <= f.minStockBags && f.status === "Active");
  const totalAlerts = lowMaterials.length + lowFeeds.length;

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 relative select-none shrink-0 font-sans">
      
      {/* Tab Context Name */}
      <div className="flex items-center gap-3">
        <h1 className="text-slate-800 font-bold text-sm uppercase tracking-wider">
          {getTabTitle()}
        </h1>
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-mono">
          3H-TAGANSULE
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        
        {/* Dynamic Clock */}
        <div className="hidden lg:flex items-center gap-2 text-slate-500 text-xs font-mono bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
          <Clock size={14} className="text-teal-600 animate-spin-slow" />
          <span>
            {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-700">
            {time.toLocaleTimeString("en-US", { hour12: true })}
          </span>
          <span className="bg-teal-500/10 text-teal-700 text-[9px] px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">PST</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl border border-slate-200 transition-all relative"
          >
            <Bell size={16} />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                {totalAlerts}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 max-h-96 overflow-y-auto font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Supply Chain Alerts</h3>
                <span className="text-[10px] font-semibold text-rose-500 px-2 py-0.5 bg-rose-50 rounded-full">{totalAlerts} warning(s)</span>
              </div>

              {totalAlerts === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No current low stock anomalies detected.</p>
              ) : (
                <div className="space-y-2">
                  {lowMaterials.map(m => (
                    <div key={m.code} className="flex gap-2.5 p-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-100 rounded-xl transition-all">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-800 leading-snug">{m.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Stock level: <strong className="text-rose-600">{m.quantity.toLocaleString()} {m.unit}</strong> (Min: {m.minStock})</p>
                      </div>
                    </div>
                  ))}

                  {lowFeeds.map(f => (
                    <div key={f.code} className="flex gap-2.5 p-2 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-100 rounded-xl transition-all">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-800 leading-snug">{f.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Available bags: <strong className="text-amber-600">{f.quantityBags.toLocaleString()} bags</strong> (Min: {f.minStockBags})</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Small Active User Badge */}
        <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.lastName}, {currentUser.firstName.split(" ")[0]}</p>
            <span className="text-[9px] text-teal-600 font-semibold uppercase tracking-widest mt-1 inline-block">{currentUser.role}</span>
          </div>
          {currentUser.role === "Administrator" ? (
            <ShieldCheck size={18} className="text-teal-600 shrink-0" />
          ) : (
            <UserCheck size={18} className="text-cyan-600 shrink-0" />
          )}
        </div>

      </div>
    </header>
  );
}
