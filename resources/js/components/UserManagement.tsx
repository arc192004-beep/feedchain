import React, { useState } from "react";
import { User, UserRole, UserStatus } from "../types";
import { 
  Plus, Edit2, Trash2, Search, Filter, ShieldCheck, 
  UserCheck, Check, X, AlertCircle, ShieldAlert, Key, 
  Lock, Unlock, RefreshCw, CheckSquare, Square, Download, 
  Printer, UserX, Clock, Phone, Mail, Shield
} from "lucide-react";

interface UserManagementProps {
  currentUser: User;
  users: User[];
  onAddUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onLogActivity?: (category: "User Management" | "Role & Privileges" | "Authentication", details: string) => void;
}

const AVAILABLE_MODULE_PRIVILEGES = [
  { id: "dashboard", label: "Dashboard Overview" },
  { id: "users", label: "User Accounts & Role Management" },
  { id: "production", label: "Feed Production & Batching" },
  { id: "inventory", label: "Raw Material & Product Inventory" },
  { id: "distribution", label: "Cage Buyer Feed Distribution" },
  { id: "customer_sales", label: "Customer Point of Sale & Invoicing" },
  { id: "analytics", label: "Descriptive Production Analytics" },
  { id: "bi", label: "Business Intelligence & Cost Margin" },
  { id: "forecast", label: "AI Production Forecasting" },
  { id: "reports", label: "Reports Module & PDF Exports" },
  { id: "settings", label: "System Configurations & Settings" },
  { id: "activity_logs", label: "Audit & User Activity Logs" },
  { id: "backup_restore", label: "System Backup & Data Restoration" }
];

export default function UserManagement({
  currentUser,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onLogActivity
}: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("Production Manager");
  const [status, setStatus] = useState<UserStatus>("Active");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [password, setPassword] = useState("DefaultPass2026!");

  const [errorMsg, setErrorMsg] = useState("");

  // Inspect detail modal
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);

  // Set default privileges depending on role selected
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "Super Administrator") {
      setSelectedPermissions(AVAILABLE_MODULE_PRIVILEGES.map(p => p.id));
    } else if (newRole === "Administrator") {
      setSelectedPermissions([
        "dashboard", "users", "production", "inventory", 
        "distribution", "customer_sales", "analytics", "bi", 
        "forecast", "reports", "settings", "activity_logs"
      ]);
    } else {
      setSelectedPermissions([
        "dashboard", "production", "inventory", "distribution", 
        "customer_sales", "analytics", "forecast", "reports"
      ]);
    }
  };

  const togglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setPhone("");
    setRole("Production Manager");
    setStatus("Active");
    setPassword("DefaultPass2026!");
    setSelectedPermissions([
      "dashboard", "production", "inventory", "distribution", 
      "customer_sales", "analytics", "forecast", "reports"
    ]);
    setErrorMsg("");
    setEditingUser(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFirstName(user.firstName);
    setMiddleName(user.middleName || "");
    setLastName(user.lastName);
    setEmail(user.email);
    setUsername(user.username);
    setPhone(user.phone || "");
    setRole(user.role);
    setStatus(user.status);
    setSelectedPermissions(user.permissions || []);
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName || !lastName || !email || !username) {
      setErrorMsg("First Name, Last Name, Email, and Username are mandatory.");
      return;
    }

    // Check unique username / email
    const duplicateEmail = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (!editingUser || u.id !== editingUser.id));
    const duplicateUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() && (!editingUser || u.id !== editingUser.id));

    if (duplicateEmail) {
      setErrorMsg("This email address is already assigned to another account.");
      return;
    }

    if (duplicateUser) {
      setErrorMsg("This username is already taken in the system registry.");
      return;
    }

    if (editingUser) {
      // Update
      const updated: User = {
        ...editingUser,
        firstName,
        middleName: middleName || undefined,
        lastName,
        email,
        username,
        phone: phone || undefined,
        role,
        status,
        permissions: selectedPermissions,
        isLocked: status === "Locked"
      };
      onUpdateUser(updated);
      if (onLogActivity) {
        onLogActivity("User Management", `Updated account ${updated.username} (${updated.role}, ${updated.status})`);
      }
    } else {
      // Create
      const created: User = {
        id: `U-${Date.now().toString().slice(-3)}`,
        firstName,
        middleName: middleName || undefined,
        lastName,
        email,
        username,
        phone: phone || undefined,
        role,
        status,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "Never logged in",
        permissions: selectedPermissions,
        isLocked: status === "Locked"
      };
      onAddUser(created);
      if (onLogActivity) {
        onLogActivity("User Management", `Registered new account ${created.username} as ${created.role}`);
      }
    }

    setShowModal(false);
    resetForm();
  };

  // Status Toggle Handlers (1.3)
  const handleToggleStatus = (user: User) => {
    let nextStatus: UserStatus = "Active";
    if (user.status === "Active") nextStatus = "Inactive";
    else if (user.status === "Inactive") nextStatus = "Active";
    else if ((user.status as string) === "Locked") nextStatus = "Active";

    const updated = { ...user, status: nextStatus, isLocked: (nextStatus as string) === "Locked" };
    onUpdateUser(updated);
    if (onLogActivity) {
      onLogActivity("User Management", `Changed account status of ${user.username} to ${nextStatus}`);
    }
  };

  const handleResetPassword = (user: User) => {
    const newPass = prompt(`Enter new password for ${user.firstName} ${user.lastName} (@${user.username}):`, "Pass2026!Reset");
    if (newPass) {
      alert(`Password for user @${user.username} has been updated to: ${newPass}`);
      if (onLogActivity) {
        onLogActivity("User Management", `Reset security credentials for user @${user.username}`);
      }
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete account for ${name}?`)) {
      onDeleteUser(id);
      if (onLogActivity) {
        onLogActivity("User Management", `Deleted user account ID ${id}`);
      }
    }
  };

  // Export CSV (1.7)
  const handleExportCSV = () => {
    const headers = ["ID", "First Name", "Middle Name", "Last Name", "Username", "Email", "Role", "Status", "Created At", "Last Login"];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.firstName}"`,
      `"${u.middleName || ''}"`,
      `"${u.lastName}"`,
      `"${u.username}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.createdAt}"`,
      `"${u.lastLogin || 'N/A'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `feedchain_users_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintMatrix = () => {
    window.print();
  };

  // Filter & Search Logic
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.middleName || ""} ${u.lastName}`.toLowerCase();
    const matchSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  // Role Statistics
  const totalUsers = users.length;
  const superAdminCount = users.filter(u => u.role === "Super Administrator").length;
  const adminCount = users.filter(u => u.role === "Administrator").length;
  const pmCount = users.filter(u => u.role === "Production Manager").length;
  const activeCount = users.filter(u => u.status === "Active").length;

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* ROLE DISTRIBUTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Total Registered Accounts</span>
            <p className="text-2xl font-black text-slate-800 font-mono">{totalUsers}</p>
            <span className="text-[10px] text-teal-600 font-bold mt-1 inline-block">{activeCount} Active Operators</span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Super Administrators</span>
            <p className="text-2xl font-black text-purple-700 font-mono">{superAdminCount}</p>
            <span className="text-[10px] text-purple-600 font-bold mt-1 inline-block">Full System Authority</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Administrators</span>
            <p className="text-2xl font-black text-teal-700 font-mono">{adminCount}</p>
            <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">Operations Supervision</span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Production Managers</span>
            <p className="text-2xl font-black text-cyan-700 font-mono">{pmCount}</p>
            <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">Plant Floor Operators</span>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-100">
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700 placeholder-slate-400"
            placeholder="Search full name, email address, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 font-medium"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Role Authorities</option>
            <option value="Super Administrator">Super Administrator</option>
            <option value="Administrator">Administrator</option>
            <option value="Production Manager">Production Manager</option>
          </select>

          <select
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
            <option value="Suspended">Suspended</option>
          </select>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <button
              onClick={handleExportCSV}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download size={13} />
              Export
            </button>
            <button
              onClick={handlePrintMatrix}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer size={13} />
              Print
            </button>
            <button
              onClick={handleOpenCreate}
              className="bg-teal-600 hover:bg-teal-500 active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <Plus size={14} />
              New Account
            </button>
          </div>
        </div>

      </div>

      {/* MAIN ACCOUNTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Shield className="text-teal-600" size={16} />
              System Account & Privilege Access Control
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Manage operator credentials, role privilege templates, and active access states</p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border px-2.5 py-0.5 rounded-full">
            {filteredUsers.length} total user(s) matching
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/50 text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Operator Full Name</th>
                <th className="py-3.5 px-6">Username / Email</th>
                <th className="py-3.5 px-6">Role Authority</th>
                <th className="py-3.5 px-6">Granted Privileges</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No registered user accounts match the selected filters or search keyword.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-400">{user.id}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      <div>{user.lastName}, {user.firstName} {user.middleName ? `${user.middleName.charAt(0)}.` : ""}</div>
                      {user.phone && <div className="text-[10px] text-slate-400 font-mono font-normal">{user.phone}</div>}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-mono font-bold text-teal-600">@{user.username}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-lg border ${
                        user.role === "Super Administrator" 
                          ? "bg-purple-50 text-purple-700 border-purple-200" 
                          : user.role === "Administrator" 
                          ? "bg-teal-50 text-teal-700 border-teal-200" 
                          : "bg-cyan-50 text-cyan-700 border-cyan-200"
                      }`}>
                        {user.role === "Super Administrator" ? (
                          <ShieldAlert size={12} className="text-purple-600" />
                        ) : user.role === "Administrator" ? (
                          <ShieldCheck size={12} className="text-teal-600" />
                        ) : (
                          <UserCheck size={12} className="text-cyan-600" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="text-[11px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                        {user.permissions ? `${user.permissions.length} modules` : "Full Access"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                        user.status === "Active" 
                          ? "bg-teal-50 text-teal-700 border border-teal-100" 
                          : user.status === "Locked"
                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Active" ? "bg-teal-500" : user.status === "Locked" ? "bg-rose-500" : "bg-slate-400"
                        }`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingUser(user)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-all"
                          title="View Login Record & Details"
                        >
                          <Clock size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition-all ${
                            user.status === "Active" ? "hover:bg-amber-50 text-amber-600" : "hover:bg-emerald-50 text-emerald-600"
                          }`}
                          title={user.status === "Active" ? "Deactivate Account" : "Activate Account"}
                          disabled={user.id === "U-000"}
                          style={{ opacity: user.id === "U-000" ? 0.3 : 1 }}
                        >
                          {user.status === "Active" ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="p-1.5 hover:bg-purple-50 text-purple-600 hover:text-purple-800 rounded-lg transition-all"
                          title="Reset Password Credentials"
                        >
                          <Key size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 hover:bg-teal-50 text-teal-600 hover:text-teal-800 rounded-lg transition-all"
                          title="Edit Privileges & Profile"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-all"
                          title="Delete Account"
                          disabled={user.id === "U-000" || user.id === "U-001"}
                          style={{ opacity: (user.id === "U-000" || user.id === "U-001") ? 0.3 : 1 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT USER ACCOUNT MODAL (1.1, 1.2, 1.3) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Shield className="text-teal-600" size={16} />
                {editingUser ? "Edit Account Profile & Role Privileges" : "Register Super Admin / User Account"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 rounded-lg p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="flex gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs items-center">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">First Name *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="E.g. Gabriel"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Middle Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="E.g. Santos"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Last Name *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="E.g. Dela Rosa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Username *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E.g. superadmin"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address *</label>
                  <input
                    type="email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@feedchain.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 917 000 0000"
                  />
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Assign User Role (1.2)</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  >
                    <option value="Super Administrator">Super Administrator (Full System)</option>
                    <option value="Administrator">Administrator (Operations Management)</option>
                    <option value="Production Manager">Production Manager (Plant Floor Manager)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Account State (1.3)</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    disabled={editingUser?.id === "U-000"}
                  >
                    <option value="Active">Active Account</option>
                    <option value="Inactive">Inactive / Suspended</option>
                    <option value="Locked">Locked (Too many failed logins)</option>
                  </select>
                </div>
              </div>

              {/* PRIVILEGES MATRIX CHECKBOXES (1.2) */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700">
                    Custom Access Privileges & Module Permissions (1.2)
                  </label>
                  <button
                    type="button"
                    onClick={() => setSelectedPermissions(AVAILABLE_MODULE_PRIVILEGES.map(p => p.id))}
                    className="text-[10px] text-teal-600 font-bold hover:underline"
                  >
                    Grant All Privileges
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 max-h-48 overflow-y-auto">
                  {AVAILABLE_MODULE_PRIVILEGES.map((priv) => {
                    const isChecked = selectedPermissions.includes(priv.id);
                    return (
                      <div
                        key={priv.id}
                        onClick={() => togglePermission(priv.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer transition-all border ${
                          isChecked 
                            ? "bg-white border-teal-200 text-teal-900 font-bold shadow-xs" 
                            : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare size={14} className="text-teal-600 shrink-0" />
                        ) : (
                          <Square size={14} className="text-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{priv.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Save Account & Privileges
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAIL & LOGIN HISTORY INSPECTION MODAL (1.5) */}
      {inspectingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Clock className="text-teal-600" size={16} />
                User Profile & Activity Audit Record
              </h3>
              <button 
                onClick={() => setInspectingUser(null)}
                className="text-slate-400 hover:text-slate-700 rounded-lg p-1 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Operator ID</span>
                  <span className="font-mono font-bold text-slate-800">{inspectingUser.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Full Name</span>
                  <span className="font-bold text-slate-800">{inspectingUser.firstName} {inspectingUser.middleName} {inspectingUser.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Role Authority</span>
                  <span className="font-bold text-purple-700">{inspectingUser.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Account Status</span>
                  <span className="font-bold text-emerald-600">{inspectingUser.status}</span>
                </div>
              </div>

              <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Login Audit Details</span>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Last Portal Login:</span>
                  <span className="font-mono font-semibold text-slate-800">{inspectingUser.lastLogin || "2026-07-29 08:30 AM"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Account Created Date:</span>
                  <span className="font-mono text-slate-700">{inspectingUser.createdAt}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Failed Login Counter:</span>
                  <span className="font-mono font-bold text-emerald-600">0 attempts (Healthy)</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setInspectingUser(null)}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
