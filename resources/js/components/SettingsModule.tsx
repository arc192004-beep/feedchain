import React, { useState } from "react";
import { User, SystemSettings } from "../types";
import { 
  Settings, Database, ShieldAlert, Key, Sliders, 
  Save, RefreshCw, Table, Play, AlertTriangle, CheckCircle2, 
  Building, Mail, Phone, MapPin, DollarSign, Clock, Lock
} from "lucide-react";

interface SettingsModuleProps {
  currentUser: User;
  systemSettings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onResetDatabase: () => void;
  rawMaterials: any[];
  feedProducts: any[];
  formulas: any[];
  buyers: any[];
  customers: any[];
  productionBatches: any[];
  distributions: any[];
  sales: any[];
  users: any[];
  onLogActivity?: (category: "System Settings", details: string) => void;
}

export default function SettingsModule({
  currentUser,
  systemSettings,
  onUpdateSettings,
  onResetDatabase,
  rawMaterials,
  feedProducts,
  formulas,
  buyers,
  customers,
  productionBatches,
  distributions,
  sales,
  users,
  onLogActivity
}: SettingsModuleProps) {
  const isSuperAdmin = currentUser.role === "Super Administrator";

  const [activeSubTab, setActiveSubTab] = useState<"general" | "security" | "operations" | "sql">("general");

  // Settings form states
  const [facilityName, setFacilityName] = useState(systemSettings.facilityName || "Davao del Sur 3H AquaFeeds Manufacturing Facility");
  const [systemTitle, setSystemTitle] = useState(systemSettings.systemTitle || "FEEDCHAIN AquaFeeds ERP & Traceability System");
  const [contactEmail, setContactEmail] = useState(systemSettings.contactEmail || "admin@feedchain.com");
  const [contactPhone, setContactPhone] = useState(systemSettings.contactPhone || "+63 (082) 553-2940");
  const [address, setAddress] = useState(systemSettings.address || "Tagansule, Malalag, Davao del Sur, Philippines");
  const [currency, setCurrency] = useState(systemSettings.currency || "PHP (₱)");
  const [lowStockWarningThresholdPct, setLowStockWarningThresholdPct] = useState(systemSettings.lowStockWarningThresholdPct || 15);
  
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(systemSettings.sessionTimeoutMinutes || 30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(systemSettings.maxLoginAttempts || 5);
  const [requireMFA, setRequireMFA] = useState(systemSettings.requireMFA || false);
  const [maintenanceMode, setMaintenanceMode] = useState(systemSettings.maintenanceMode || false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(systemSettings.maintenanceMessage || "System under routine maintenance.");

  const [savedMsg, setSavedMsg] = useState("");

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM feed_products WHERE status = 'Active';");
  const [sqlError, setSqlError] = useState("");
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemSettings = {
      facilityName,
      systemTitle,
      contactEmail,
      contactPhone,
      address,
      currency,
      lowStockWarningThresholdPct: Number(lowStockWarningThresholdPct),
      sessionTimeoutMinutes: Number(sessionTimeoutMinutes),
      maxLoginAttempts: Number(maxLoginAttempts),
      requireMFA,
      maintenanceMode,
      maintenanceMessage,
      autoBackupDaily: systemSettings.autoBackupDaily,
      backupRetentionDays: systemSettings.backupRetentionDays
    };

    onUpdateSettings(updated);
    setSavedMsg("System configurations have been successfully updated.");
    setTimeout(() => setSavedMsg(""), 4000);

    if (onLogActivity) {
      onLogActivity("System Settings", `Updated facility parameters and security policies`);
    }
  };

  const handleRunSQL = () => {
    setSqlError("");
    setSqlResult(null);

    const query = sqlQuery.trim().toLowerCase();
    if (!query.startsWith("select")) {
      setSqlError("SQL Simulator: Only SELECT commands are supported in read-only audit mode.");
      return;
    }

    let targetTable = "";
    if (query.includes("from raw_materials")) targetTable = "raw_materials";
    else if (query.includes("from feed_products")) targetTable = "feed_products";
    else if (query.includes("from formulas")) targetTable = "formulas";
    else if (query.includes("from buyers")) targetTable = "buyers";
    else if (query.includes("from customers")) targetTable = "customers";
    else if (query.includes("from production_batches")) targetTable = "production_batches";
    else if (query.includes("from distributions")) targetTable = "distributions";
    else if (query.includes("from sales")) targetTable = "sales";
    else if (query.includes("from users")) targetTable = "users";
    else {
      setSqlError("SQL Error: Table not found. Try raw_materials, feed_products, production_batches, sales, distributions, or users.");
      return;
    }

    let sourceData: any[] = [];
    switch (targetTable) {
      case "raw_materials": sourceData = rawMaterials; break;
      case "feed_products": sourceData = feedProducts; break;
      case "formulas": sourceData = formulas; break;
      case "buyers": sourceData = buyers; break;
      case "customers": sourceData = customers; break;
      case "production_batches": sourceData = productionBatches; break;
      case "distributions": sourceData = distributions; break;
      case "sales": sourceData = sales; break;
      case "users": sourceData = users; break;
    }

    let results = [...sourceData];
    if (query.includes("where")) {
      const parts = query.split("where");
      const criteria = parts[1].replace(";", "").trim();
      
      if (criteria.includes("status = 'active'") || criteria.includes("status='active'")) {
        results = results.filter(item => item.status === "Active");
      } else if (criteria.includes("status = 'inactive'") || criteria.includes("status='inactive'")) {
        results = results.filter(item => item.status === "Inactive");
      }
    }

    setSqlResult(results);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* HEADER TABS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Settings className="text-teal-600" size={20} />
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">System Configuration & Governance</h3>
            <p className="text-[11px] text-slate-400">Control system parameters, facility details, security rules, and database schemas</p>
          </div>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab("general")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "general" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Facility & Identity
          </button>
          <button
            onClick={() => setActiveSubTab("security")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "security" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Security & Access Policies
          </button>
          <button
            onClick={() => setActiveSubTab("operations")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "operations" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Operational Parameters
          </button>
          <button
            onClick={() => setActiveSubTab("sql")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "sql" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            MySQL Audit Engine
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* TAB 1: GENERAL FACILITY & IDENTITY */}
      {activeSubTab === "general" && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building size={18} className="text-teal-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Facility Profile & System Branding</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Facility Name</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">System Software Title</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={systemTitle}
                onChange={(e) => setSystemTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Contact Email</label>
              <input
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Facility Contact Phone</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">System Base Currency</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Facility Physical Address</label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Save size={14} />
              Save Identity Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SECURITY & ACCESS POLICIES */}
      {activeSubTab === "security" && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <Lock size={18} className="text-purple-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">System Security & Access Controls (1.4)</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Session Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Automatic portal sign-out after duration of inactivity</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Failed Login Attempts</label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Account will automatically trigger Locked status upon exceed</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Enforce Multi-Factor Authentication (MFA)</span>
              <span className="text-[10px] text-slate-400">Require 2FA code verification for Super Admins and Admins upon login</span>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
              checked={requireMFA}
              onChange={(e) => setRequireMFA(e.target.checked)}
            />
          </div>

          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-800 block">System Maintenance Mode</span>
                <span className="text-[10px] text-rose-600">Lock non-admin access while updating plant floor databases</span>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
            </div>
            {maintenanceMode && (
              <input
                type="text"
                className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-xs text-rose-700 font-medium mt-2"
                placeholder="Maintenance message broadcast to operators..."
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
              />
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Save size={14} />
              Save Security Policies
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: OPERATIONAL PARAMETERS */}
      {activeSubTab === "operations" && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sliders size={18} className="text-cyan-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Plant Operational Defaults & Inventory Thresholds</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Low Stock Warning Threshold (%)</label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={lowStockWarningThresholdPct}
                onChange={(e) => setLowStockWarningThresholdPct(Number(e.target.value))}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Trigger inventory header warnings when stock drops below percentage of safety buffer</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Automated Daily Backup Schedule</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                value={systemSettings.autoBackupDaily ? "Enabled" : "Disabled"}
                onChange={(e) => onUpdateSettings({ ...systemSettings, autoBackupDaily: e.target.value === "Enabled" })}
              >
                <option value="Enabled">Enabled (Automated Midnight Snapshot)</option>
                <option value="Disabled">Disabled (Manual Only)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Save size={14} />
              Save Operational Parameters
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: MYSQL READ-ONLY AUDIT ENGINE & RESEED */}
      {activeSubTab === "sql" && (
        <div className="space-y-6">
          {/* Reset database card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase">Reseed Local Database State</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Wipe custom additions and restore original Davao del Sur 3H factory records</p>
            </div>
            <button
              onClick={onResetDatabase}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
              Restore Factory State
            </button>
          </div>

          {/* SQL QUERY ENGINE */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-slate-50 border-slate-100 flex items-center gap-2">
              <Table className="text-teal-600" size={16} />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">MySQL Read-Only Audit Simulator</h4>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Write SELECT query</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-emerald-400 font-mono focus:outline-none"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                  />
                  <button
                    onClick={handleRunSQL}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Play size={12} fill="white" />
                    Execute
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">
                  Try: <code>SELECT * FROM users;</code> or <code>SELECT * FROM raw_materials;</code> or <code>SELECT * FROM feed_products WHERE status = 'Active';</code>
                </span>
              </div>

              {sqlError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                  <span>{sqlError}</span>
                </div>
              )}

              {sqlResult && (
                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-slate-50 max-h-80">
                  <table className="w-full text-xs text-left font-mono border-collapse">
                    <thead>
                      <tr className="bg-slate-200 text-[10px] font-extrabold uppercase text-slate-600 border-b">
                        {Object.keys(sqlResult[0] || {}).map(key => (
                          <th key={key} className="py-2.5 px-4 border-r border-slate-300">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sqlResult.length === 0 ? (
                        <tr>
                          <td className="py-4 px-4 text-center text-slate-400 italic">Empty set (0 rows returned)</td>
                        </tr>
                      ) : (
                        sqlResult.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-100/50">
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="py-2 px-4 border-r border-slate-200 text-slate-700 whitespace-nowrap max-w-xs truncate">
                                {typeof val === "object" ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
