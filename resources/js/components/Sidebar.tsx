import { User } from "../types";
import { 
  LayoutDashboard, Users, Pickaxe, Package, Truck, 
  ReceiptText, BarChart3, ShieldCheck, FileSpreadsheet, 
  Settings, LogOut, Coins, TrendingUp, Activity, Database, ShieldAlert
} from "lucide-react";

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentUser, activeTab, setActiveTab, onLogout }: SidebarProps) {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "users", label: "User & Role Management", icon: Users, roles: ["Super Administrator", "Administrator"] },
    { id: "production", label: "Production", icon: Pickaxe, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "inventory", label: "Inventory", icon: Package, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "distribution", label: "Distribution", icon: Truck, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "customer_sales", label: "Customer Sales", icon: Coins, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "analytics", label: "Descriptive Analytics", icon: BarChart3, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "bi", label: "Business Intelligence", icon: ShieldCheck, roles: ["Super Administrator", "Administrator"] },
    { id: "forecast", label: "Production Forecast", icon: TrendingUp, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "reports", label: "Reports Module", icon: FileSpreadsheet, roles: ["Super Administrator", "Administrator", "Production Manager"] },
    { id: "activity_logs", label: "System Activity Logs", icon: Activity, roles: ["Super Administrator", "Administrator"] },
    { id: "backup_restore", label: "Backup & Restore", icon: Database, roles: ["Super Administrator"] },
    { id: "settings", label: "System Settings", icon: Settings, roles: ["Super Administrator", "Administrator"] },
  ];

  // Check if current user has custom permissions array or standard roles
  const allowedNavigation = navigationItems.filter(item => {
    if (currentUser.role === "Super Administrator") return true;
    if (currentUser.permissions && currentUser.permissions.length > 0) {
      return currentUser.permissions.includes(item.id);
    }
    return item.roles.includes(currentUser.role);
  });

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600/20 p-1.5 rounded-lg border border-teal-500/30">
            <span className="font-mono font-bold text-teal-400 text-sm tracking-widest">FC</span>
          </div>
          <div>
            <h1 className="text-white text-sm font-extrabold tracking-wider">FEEDCHAIN</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">3H Enterprises</p>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-teal-600/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm shadow-inner uppercase">
          {currentUser.firstName.slice(0, 1)}
          {currentUser.lastName.slice(0, 1)}
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-white text-xs font-semibold truncate leading-tight">
            {currentUser.firstName} {currentUser.lastName}
          </h2>
          <p className="text-[10px] text-teal-400 font-semibold truncate uppercase mt-0.5 tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block animate-pulse"></span>
            {currentUser.role}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1 scrollbar-thin">
        {allowedNavigation.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                isActive
                  ? "bg-teal-700/90 text-white shadow-md border-l-4 border-teal-400 pl-2"
                  : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <IconComponent size={16} className={isActive ? "text-teal-300" : "text-slate-500"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/40 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 border border-transparent rounded-xl text-xs font-medium text-slate-400 transition-all"
        >
          <LogOut size={14} />
          Sign Out Portal
        </button>
        <p className="text-[9px] text-slate-600 text-center mt-3">
          Ver. 2026.7 • Davao del Sur
        </p>
      </div>
    </div>
  );
}
