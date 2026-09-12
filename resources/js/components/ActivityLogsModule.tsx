import React, { useState } from "react";
import { User, SystemActivityLog } from "../types";
import { 
  ShieldAlert, Search, Filter, Calendar, UserCheck, 
  Download, Printer, AlertTriangle, CheckCircle2, Clock, 
  Trash2, ShieldCheck, Activity, Key, FileText, Database, Settings
} from "lucide-react";

interface ActivityLogsModuleProps {
  currentUser: User;
  activityLogs: SystemActivityLog[];
  onClearLogs?: () => void;
}

export default function ActivityLogsModule({
  currentUser,
  activityLogs,
  onClearLogs
}: ActivityLogsModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const [selectedLog, setSelectedLog] = useState<SystemActivityLog | null>(null);

  // Filter logs
  const filteredLogs = activityLogs.filter((log) => {
    const matchSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = categoryFilter === "All" || log.actionCategory === categoryFilter;
    const matchStatus = statusFilter === "All" || log.status === statusFilter;
    const matchRole = roleFilter === "All" || log.role === roleFilter;

    return matchSearch && matchCategory && matchStatus && matchRole;
  });

  // Calculate Metrics
  const totalLogs = activityLogs.length;
  const successLogins = activityLogs.filter(l => l.actionCategory === "Authentication" && l.status === "Success").length;
  const failedLogins = activityLogs.filter(l => l.status === "Failed").length;
  const adminActions = activityLogs.filter(l => l.role === "Super Administrator" || l.role === "Administrator").length;

  const handleExportCSV = () => {
    const headers = ["ID", "Timestamp", "User", "Username", "Role", "Category", "Action Details", "IP Address", "Status"];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.username}"`,
      `"${l.role}"`,
      `"${l.actionCategory}"`,
      `"${l.actionDetails.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `feedchain_activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* HEADER SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Total Audit Entries</span>
            <p className="text-2xl font-black text-slate-800 font-mono">{totalLogs}</p>
            <span className="text-[10px] text-teal-600 font-bold mt-1 inline-block">Real-time system events</span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <Activity size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Authentications</span>
            <p className="text-2xl font-black text-emerald-600 font-mono">{successLogins}</p>
            <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">Successful portal logins</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Key size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Security Warnings</span>
            <p className="text-2xl font-black text-rose-600 font-mono">{failedLogins}</p>
            <span className="text-[10px] text-rose-500 font-bold mt-1 inline-block">Failed attempts / alerts</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Admin Executions</span>
            <p className="text-2xl font-black text-cyan-600 font-mono">{adminActions}</p>
            <span className="text-[10px] text-cyan-600 font-medium mt-1 inline-block">Super Admin & Admin events</span>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-100">
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>

      {/* FILTER AND CONTROLS SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700 placeholder-slate-400"
            placeholder="Search operator name, username, IP, or event detail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Authentication">Authentication</option>
            <option value="User Management">User Management</option>
            <option value="Role & Privileges">Role & Privileges</option>
            <option value="System Settings">System Settings</option>
            <option value="Data Backup/Restore">Data Backup/Restore</option>
            <option value="Production">Production</option>
            <option value="Security Audit">Security Audit</option>
          </select>

          <select
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All User Roles</option>
            <option value="Super Administrator">Super Administrator</option>
            <option value="Administrator">Administrator</option>
            <option value="Production Manager">Production Manager</option>
          </select>

          <select
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Outcomes</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Warning">Warning</option>
          </select>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <button
              onClick={handleExportCSV}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download size={13} />
              Export CSV
            </button>
            <button
              onClick={handlePrintReport}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Printer size={13} />
              Print Audit
            </button>
          </div>
        </div>

      </div>

      {/* ACTIVITY LOGS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="text-teal-600" size={16} />
              System Activity & Audit Log Stream
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Chronological record of user logins, account privilege modifications, and system operations</p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border px-2.5 py-1 rounded-full">
            Showing {filteredLogs.length} of {activityLogs.length} logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">User / Operator</th>
                <th className="py-3 px-6">Role Authority</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Action Details</th>
                <th className="py-3 px-6">IP Address</th>
                <th className="py-3 px-6 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No system activity logs match the selected search terms or filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-6 font-mono font-medium text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400 shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-800 whitespace-nowrap">
                      <div>{log.user}</div>
                      <div className="text-[10px] font-mono font-normal text-teal-600">@{log.username}</div>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase ${
                        log.role === "Super Administrator" ? "text-purple-700" :
                        log.role === "Administrator" ? "text-teal-700" : "text-cyan-700"
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.actionCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 max-w-xs truncate font-medium">
                      {log.actionDetails}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                        log.status === "Success" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : log.status === "Failed"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {log.status === "Success" ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL INSPECTION MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="text-teal-600" size={18} />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  Audit Log Detail Inspection
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700 rounded-lg p-1 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Log Event ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedLog.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Timestamp</span>
                  <span className="font-mono text-slate-700">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">IP Address</span>
                  <span className="font-mono text-slate-700">{selectedLog.ipAddress}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-xl bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Operator Name</span>
                  <p className="text-xs font-bold text-slate-800">{selectedLog.user}</p>
                  <p className="text-[10px] font-mono text-teal-600">@{selectedLog.username}</p>
                </div>
                <div className="p-3 border rounded-xl bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Assigned Role</span>
                  <p className="text-xs font-bold text-slate-800">{selectedLog.role}</p>
                </div>
              </div>

              <div className="p-3 border rounded-xl bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Event Action Details</span>
                <p className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedLog.actionDetails}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
