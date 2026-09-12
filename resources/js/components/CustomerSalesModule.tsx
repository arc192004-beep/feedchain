import React, { useState } from "react";
import { User, CustomerProfile, SalesRecord, FeedProduct } from "../types";
import { 
  Search, Plus, Edit2, Trash2, ShieldAlert, AlertTriangle, 
  MapPin, Phone, DollarSign, Calendar, RefreshCw 
} from "lucide-react";

interface CustomerSalesModuleProps {
  currentUser: User;
  customers: CustomerProfile[];
  sales: SalesRecord[];
  feedProducts: FeedProduct[];
  onUpdateCustomers: (newCustomers: CustomerProfile[]) => void;
  onUpdateSales: (newSales: SalesRecord[]) => void;
  onUpdateFeedProducts: (newProducts: FeedProduct[]) => void;
}

export default function CustomerSalesModule({
  currentUser,
  customers,
  sales,
  feedProducts,
  onUpdateCustomers,
  onUpdateSales,
  onUpdateFeedProducts
}: CustomerSalesModuleProps) {
  const isPM = currentUser.role === "production_manager" || currentUser.role === "Production Manager";
  const [activeSubTab, setActiveSubTab] = useState<"sales" | "customers">("sales");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal forms
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"sale" | "customer" | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Customer form fields
  const [custName, setCustName] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custPhone, setCustPhone] = useState("");

  // Sale form fields
  const [saleCustomerId, setSaleCustomerId] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [saleProductCode, setSaleProductCode] = useState("");
  const [saleQtyBags, setSaleQtyBags] = useState(0);
  const [saleUnitPrice, setSaleUnitPrice] = useState(0);

  const resetForm = () => {
    setErrorMsg("");
    setEditItem(null);
    setCustName("");
    setCustAddress("");
    setCustPhone("");

    setSaleCustomerId("");
    setSaleProductCode("");
    setSaleQtyBags(0);
    setSaleUnitPrice(0);
  };

  const handleOpenCreate = (type: "sale" | "customer") => {
    resetForm();
    setModalType(type);
    setShowModal(true);
  };

  const handleOpenEdit = (type: "sale" | "customer", item: any) => {
    resetForm();
    setModalType(type);
    setEditItem(item);

    if (type === "customer") {
      setCustName(item.name);
      setCustAddress(item.address);
      setCustPhone(item.phone);
    } else if (type === "sale") {
      setSaleCustomerId(item.customerId);
      setSaleDate(item.salesDate);
      setSaleProductCode(item.feedProductCode);
      setSaleQtyBags(item.quantityBags);
      setSaleUnitPrice(item.unitPrice);
    }
    setShowModal(true);
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custAddress || !custPhone) {
      setErrorMsg("Please complete all fields.");
      return;
    }

    try {
      const response = await fetch(editItem ? `/customers/${editItem.id}` : '/customers', {
        method: editItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' },
        body: JSON.stringify({ name: custName, address: custAddress, contact_number: custPhone, status: 'active' }),
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.message || Object.values(saved.errors ?? {}).flat().join(' ') || 'Could not save customer.');
      const item: CustomerProfile = { id: saved.id, name: saved.name, address: saved.address, phone: saved.contact_number };
      onUpdateCustomers(editItem ? customers.map(c => c.id === editItem.id ? item : c) : [...customers, item]);
      setShowModal(false);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not save customer.');
    }
  };

  // MAIN TRANSACTIONAL SALES SUBMIT ACTION (Subtracts physical feed stock with verification)
  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!saleCustomerId || !saleProductCode || saleQtyBags <= 0 || saleUnitPrice <= 0) {
      setErrorMsg("Please choose a customer and a product, and enter positive quantities.");
      return;
    }

    const selectedProduct = feedProducts.find(p => p.code === saleProductCode);
    if (!selectedProduct) {
      setErrorMsg("Target product not found.");
      return;
    }

    if (!editItem && selectedProduct.quantityBags < saleQtyBags) {
        setErrorMsg(`Insufficient physical bags: '${selectedProduct.name}' only has ${selectedProduct.quantityBags} bags available in the warehouse, but you requested sale of ${saleQtyBags} bags.`);
      return;
    }

    try {
      const response = await fetch(editItem ? `/sales/${editItem.id}` : '/sales', {
        method: editItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' },
        body: JSON.stringify({ customer_id: saleCustomerId, sale_date: saleDate, items: [{ feed_product_id: selectedProduct.id, quantity: saleQtyBags, unit_price: saleUnitPrice }] }),
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.message || Object.values(saved.errors ?? {}).flat().join(' ') || 'Could not record sale.');
      const item: SalesRecord = { id: String(saved.id), customerId: String(saved.customer_id), salesDate: saved.sale_date, feedProductCode: saleProductCode, quantityBags: Number(saleQtyBags), unitPrice: Number(saleUnitPrice), totalAmount: Number(saved.total_amount) };
      onUpdateSales(editItem ? sales.map(s => s.id === editItem.id ? item : s) : [...sales, item]);
      onUpdateFeedProducts(feedProducts.map(p => p.id === selectedProduct.id ? { ...p, quantityBags: Number(selectedProduct.quantityBags) - saleQtyBags } : p));
      setShowModal(false);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not record sale.');
    }
  };

  const handleDeleteItem = async (type: "sale" | "customer", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetch(`/${type === 'customer' ? 'customers' : 'sales'}/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' } });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.message || 'Could not delete record.');
      if (type === "customer") onUpdateCustomers(customers.filter(c => c.id !== id));
      else onUpdateSales(sales.filter(s => s.id !== id));
    } catch (error) { setErrorMsg(error instanceof Error ? error.message : 'Could not delete record.'); }
  };

  const handleProductSelectChange = (code: string) => {
    setSaleProductCode(code);
    const prod = feedProducts.find(p => p.code === code);
    if (prod) {
      // Auto fill standard unit price
      setSaleUnitPrice(prod.price ?? 0);
    }
  };

  const getFilteredItems = () => {
    const q = searchQuery.toLowerCase();
    if (activeSubTab === "customers") {
      return customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.address ?? "").toLowerCase().includes(q)
      );
    } else {
      return sales.filter(s => {
        const customer = customers.find(c => c.id === s.customerId);
        const custNameText = customer ? customer.name.toLowerCase() : "";
        return s.feedProductCode.toLowerCase().includes(q) || custNameText.includes(q);
      });
    }
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Subtabs navigation row */}
      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveSubTab("sales"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "sales" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Sales Receipts & Transactions ({sales.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("customers"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "customers" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Distributor Customers ({customers.length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            placeholder="Search within this list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Board Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Board Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
              {activeSubTab === "sales" ? "Customer Sales Ledger" : "Aquatic Distributor Accounts"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeSubTab === "sales" ? "Active records of client billing receipts, sales values, and payments" : "Addresses, contact info, and transaction records of registered feed wholesalers"}
            </p>
          </div>

          {isPM ? (
            <button
              onClick={() => handleOpenCreate(activeSubTab === "sales" ? "sale" : "customer")}
              className="bg-teal-600 hover:bg-teal-500 active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              {activeSubTab === "sales" ? "Record Retail Sale" : "Register Wholesaler"}
            </button>
          ) : (
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-3 py-1 font-bold flex items-center gap-1">
              <ShieldAlert size={12} />
              ADMIN MONITORING ONLY
            </span>
          )}
        </div>

        {/* SALES RECEIPTS LIST */}
        {activeSubTab === "sales" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                  <th className="py-3.5 px-6">Invoice ID</th>
                  <th className="py-3.5 px-6">Wholesaler Client</th>
                  <th className="py-3.5 px-6">Transaction Date</th>
                  <th className="py-3.5 px-6">Feed Product Link</th>
                  <th className="py-3.5 px-6 text-right">Bags Sold</th>
                  <th className="py-3.5 px-6 text-right">Unit Price</th>
                  <th className="py-3.5 px-6 text-right">Billing Sum</th>
                  {isPM && <th className="py-3.5 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getFilteredItems().slice().reverse().map((s: any) => {
                  const customer = customers.find(c => c.id === s.customerId);
                  const feed = feedProducts.find(f => f.code === s.feedProductCode);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-mono font-extrabold text-slate-400">{s.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {customer ? customer.name : "Walk-in Retail"}
                        <span className="text-[10px] block text-slate-400 font-normal">{customer?.address}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">{s.salesDate}</td>
                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {feed ? feed.name : s.feedProductCode}
                        <span className="block font-mono text-[9px] text-slate-400 font-normal">{s.feedProductCode}</span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-slate-800">
                        {s.quantityBags.toLocaleString()} bags
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-600">
                        ₱{s.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-black text-teal-700 text-sm">
                        ₱{s.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      {isPM && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit("sale", s)}
                              className="p-1 hover:bg-teal-50 text-teal-600 rounded-lg transition-all"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("sale", s.id)}
                              className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* CUSTOMERS LIST */}
        {activeSubTab === "customers" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/40">
            {getFilteredItems().map((c: any) => (
              <div key={c.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-teal-500/20 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400">CLIENT ID: {c.id}</span>
                    {isPM && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenEdit("customer", c)}
                          className="p-1 text-slate-400 hover:text-teal-600 transition-all rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("customer", c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-all rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-800">{c.name}</h4>
                  
                  <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span>{c.address}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>{c.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* CORE ENTRY POPUP MODALS */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                {editItem ? "Edit Specifications" : "Create New Record Entry"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 rounded-lg p-1">
                <Plus size={16} />
              </button>
            </div>

            <form onSubmit={modalType === "customer" ? handleCustomerSubmit : handleSaleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="flex gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs items-center">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* A. CUSTOMER FORM */}
              {modalType === "customer" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Distributor / Wholesaler Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="E.g. Davao Del Sur Feeds Trading House"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Business Store Address *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="E.g. Rizal Avenue Extension, Digos City"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Store Telephone / Phone *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="E.g. 082-553-2211"
                    />
                  </div>
                </div>
              )}

              {/* B. SALES RECEIPT FORM */}
              {modalType === "sale" && (
                <div className="space-y-4">
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3">
                    <p className="text-[10px] text-teal-800 leading-relaxed">
                      <strong>Direct Warehouse Billing:</strong> Confirming a retail sale immediately deducts the finished bags from storage, updating active cash records and inventory trends.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Wholesale Client *</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-700"
                        value={saleCustomerId}
                        onChange={(e) => setSaleCustomerId(e.target.value)}
                      >
                        <option value="">-- Choose Wholesaler --</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sales Receipt Date *</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Feed Product sold *</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 text-slate-700"
                        value={saleProductCode}
                        onChange={(e) => handleProductSelectChange(e.target.value)}
                      >
                        <option value="">-- Choose Feed --</option>
                        {feedProducts.map(p => (
                          <option key={p.code} value={p.code}>{p.name} ({p.quantityBags.toLocaleString()} bags av.)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quantity (Bags) *</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
                        value={saleQtyBags}
                        onChange={(e) => setSaleQtyBags(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Unit Price (PHP) *</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
                      value={saleUnitPrice}
                      onChange={(e) => setSaleUnitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {saleQtyBags > 0 && saleUnitPrice > 0 && (
                    <div className="bg-slate-50 border p-3.5 rounded-xl flex justify-between font-mono font-bold text-xs">
                      <span className="text-slate-500">Calculated Grand Total:</span>
                      <span className="text-teal-700">₱{(saleQtyBags * saleUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-teal-600 text-white text-xs font-bold px-5 py-2 rounded-xl">Invoice and Adjust</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
