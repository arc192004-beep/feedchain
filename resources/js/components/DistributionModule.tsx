import React, { useState } from "react";
import { csrfFetch } from "../lib/csrf-fetch";
import { User, BuyerProfile, DistributionRecord, FeedProduct } from "../types";
import { 
  Search, Plus, Edit2, Trash2, ShieldAlert, AlertTriangle, 
  MapPin, Phone, Anchor, Calendar, Truck, Clipboard 
} from "lucide-react";

interface DistributionModuleProps {
  currentUser: User;
  buyers: BuyerProfile[];
  distributions: DistributionRecord[];
  feedProducts: FeedProduct[];
  onUpdateBuyers: (newBuyers: BuyerProfile[]) => void;
  onUpdateDistributions: (newDistributions: DistributionRecord[]) => void;
  onUpdateFeedProducts: (newProducts: FeedProduct[]) => void;
}

export default function DistributionModule({
  currentUser,
  buyers,
  distributions,
  feedProducts,
  onUpdateBuyers,
  onUpdateDistributions,
  onUpdateFeedProducts
}: DistributionModuleProps) {
  const normalizedRole = (currentUser.role || '').toString().toLowerCase().replace(/\s+/g, '_');
  const isPM = ['production_manager', 'super_admin'].includes(normalizedRole);
  const [activeSubTab, setActiveSubTab] = useState<"records" | "buyers">("records");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal forms
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"record" | "buyer" | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Buyer Form fields
  const [buyerName, setBuyerName] = useState("");
  const [buyerCage, setBuyerCage] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  // Record Form fields
  const [distBuyerId, setDistBuyerId] = useState("");
  const [distDate, setDistDate] = useState(new Date().toISOString().split("T")[0]);
  const [distProductCode, setDistProductCode] = useState("");
  const [distQtyBags, setDistQtyBags] = useState(0);
  const [distRemarks, setDistRemarks] = useState("");

  const resetForm = () => {
    setErrorMsg("");
    setEditItem(null);
    setBuyerName("");
    setBuyerCage("");
    setBuyerAddress("");
    setBuyerPhone("");

    setDistBuyerId("");
    setDistProductCode("");
    setDistQtyBags(0);
    setDistRemarks("");
  };

  const handleOpenCreate = (type: "record" | "buyer") => {
    resetForm();
    setModalType(type);
    setShowModal(true);
  };

  const handleOpenEdit = (type: "record" | "buyer", item: any) => {
    resetForm();
    setModalType(type);
    setEditItem(item);

    if (type === "buyer") {
      setBuyerName(item.name);
      setBuyerCage(item.fishCageName);
      setBuyerAddress(item.address);
      setBuyerPhone(item.contactNumber);
    } else if (type === "record") {
      setDistBuyerId(item.buyerId);
      setDistDate(item.distributionDate);
      setDistProductCode(item.feedProductCode);
      setDistQtyBags(item.quantityBags);
      setDistRemarks(item.remarks || "");
    }
    setShowModal(true);
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerCage || !buyerAddress || !buyerPhone) {
      setErrorMsg("Please complete all fields.");
      return;
    }

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const payload = { buyer_name: buyerName, fishpond_or_cage_name: buyerCage, address: buyerAddress, contact_number: buyerPhone };
      const response = await csrfFetch(editItem ? route('buyers.update', editItem.id) : route('buyers.store'), {
        method: editItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Unable to save buyer.');
      const saved = await response.json();
      const item: BuyerProfile = { id: saved.id, name: saved.buyer_name, fishCageName: saved.fishpond_or_cage_name, address: saved.address, contactNumber: saved.contact_number };
      onUpdateBuyers(editItem ? buyers.map(b => b.id === editItem.id ? item : b) : [...buyers, item]);
      setShowModal(false);
    } catch (error: any) {
      setErrorMsg(error.message || 'Unable to save buyer.');
    }
  };

  // MAIN TRANSACTIONAL DISTRIBUTION ACTION (Subtracts physical feed inventory with verification)
  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!distBuyerId || !distProductCode || distQtyBags <= 0) {
      setErrorMsg("Please choose a buyer and a feed, and enter a positive quantity of bags.");
      return;
    }

    const selectedProduct = feedProducts.find(p => p.code === distProductCode);
    if (!selectedProduct) {
      setErrorMsg("Target product not found.");
      return;
    }

    if (editItem) {
      setErrorMsg('Editing saved deliveries is not available yet. Create a corrected delivery record instead.');
      return;
    }

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await csrfFetch(route('distributions.store'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify({ buyer_id: distBuyerId, distribution_date: distDate, feed_product_id: selectedProduct.id, quantity: distQtyBags, remarks: distRemarks }),
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Unable to save delivery.');
      const saved = await response.json();
      const item: DistributionRecord = { id: saved.id, buyerId: saved.buyer_id, distributionDate: saved.distribution_date, feedProductCode: distProductCode, quantityBags: Number(saved.total_quantity), remarks: saved.remarks || '' };
      onUpdateDistributions([...distributions, item]);
      onUpdateFeedProducts(feedProducts.map(product => product.code === distProductCode ? { ...product, quantityBags: Math.max(0, product.quantityBags - distQtyBags) } : product));
      setShowModal(false);
    } catch (error: any) {
      setErrorMsg(error.message || 'Unable to save delivery.');
    }
  };

  const handleDeleteItem = (type: "record" | "buyer", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    if (type === "buyer") {
      onUpdateBuyers(buyers.filter(b => b.id !== id));
    } else {
      onUpdateDistributions(distributions.filter(d => d.id !== id));
    }
  };

  const getFilteredItems = () => {
    const q = searchQuery.toLowerCase();
    if (activeSubTab === "buyers") {
      return buyers.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.fishCageName ?? "").toLowerCase().includes(q) ||
        (b.address ?? "").toLowerCase().includes(q)
      );
    } else {
      return distributions.filter(d => {
        const buyer = buyers.find(b => b.id === d.buyerId);
        const buyerNameText = buyer ? buyer.name.toLowerCase() : "";
        return d.feedProductCode.toLowerCase().includes(q) || buyerNameText.includes(q);
      });
    }
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Subtabs navigation row */}
      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveSubTab("records"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "records" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Distribution Deliveries ({distributions.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("buyers"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "buyers" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Aquatic Cage Buyers ({buyers.length})
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
              {activeSubTab === "records" ? "Cage Supply Deliveries Ledger" : "Aquaculture Business Profiles"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeSubTab === "records" ? "Active records of customized feeds delivered directly to deepwater cages in Malalag Bay" : "Contact details, cage specifications, and addresses of registered aquatic operators"}
            </p>
          </div>

          {isPM ? (
            <button
              onClick={() => handleOpenCreate(activeSubTab === "records" ? "record" : "buyer")}
              className="bg-teal-600 hover:bg-teal-500 active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              {activeSubTab === "records" ? "Record Delivery" : "Add Buyer Profile"}
            </button>
          ) : (
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-3 py-1 font-bold flex items-center gap-1">
              <ShieldAlert size={12} />
              ADMIN MONITORING ONLY
            </span>
          )}
        </div>

        {/* RECORDS LIST */}
        {activeSubTab === "records" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                  <th className="py-3.5 px-6">Delivery ID</th>
                  <th className="py-3.5 px-6">Buyer Name</th>
                  <th className="py-3.5 px-6">Delivery Date</th>
                  <th className="py-3.5 px-6">Feed Product Delivered</th>
                  <th className="py-3.5 px-6 text-right">Delivered Bags</th>
                  <th className="py-3.5 px-6">Remarks</th>
                  {isPM && <th className="py-3.5 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getFilteredItems().slice().reverse().map((d: any) => {
                  const buyer = buyers.find(b => b.id === d.buyerId);
                  const feed = feedProducts.find(f => f.code === d.feedProductCode);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-mono font-extrabold text-slate-400">{d.id}</td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 block">{buyer ? buyer.name : "Direct Delivery"}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Anchor size={10} /> {buyer?.fishCageName}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">{d.distributionDate}</td>
                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {feed ? feed.name : d.feedProductCode}
                        <span className="block font-mono text-[9px] text-slate-400 font-normal">{d.feedProductCode}</span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-800 text-sm">
                        {d.quantityBags.toLocaleString()} bags
                      </td>
                      <td className="py-4 px-6 text-slate-500 italic max-w-xs truncate">{d.remarks || "--"}</td>
                      {isPM && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit("record", d)}
                              className="p-1 hover:bg-teal-50 text-teal-600 rounded-lg transition-all"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("record", d.id)}
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

        {/* BUYERS LIST */}
        {activeSubTab === "buyers" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/40">
            {getFilteredItems().map((b: any) => (
              <div key={b.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-teal-500/20 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Cage ID: {b.id}</span>
                    {isPM && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenEdit("buyer", b)}
                          className="p-1 text-slate-400 hover:text-teal-600 transition-all rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("buyer", b.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-all rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-800">{b.name}</h4>
                  
                  <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Anchor size={14} className="text-teal-600 shrink-0" />
                      <span className="font-semibold text-teal-700">{b.fishCageName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span>{b.address}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>{b.contactNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* CORE POPUP ENTRY MODALS */}
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

            <form onSubmit={modalType === "buyer" ? handleBuyerSubmit : handleRecordSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="flex gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs items-center">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* A. BUYER FORM */}
              {modalType === "buyer" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company / Operator Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="E.g. Malalag Bay Aquaculture Coop"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fish Cage Group Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      value={buyerCage}
                      onChange={(e) => setBuyerCage(e.target.value)}
                      placeholder="E.g. Deep Sea Cage Site Bravo"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Office / Harbor Address *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      placeholder="E.g. Bolo Coastline Road, Malalag"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone Number *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="E.g. +63 912 345 6789"
                    />
                  </div>
                </div>
              )}

              {/* B. DISTRIBUTION RECORD FORM */}
              {modalType === "record" && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      <strong>Delivery Stocks Audit:</strong> Delivering feed packages will directly deduct finished product bags from your warehouses. Ensure sufficient physical bags are available first.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recipient Cage Operator *</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={distBuyerId}
                        onChange={(e) => setDistBuyerId(e.target.value)}
                      >
                        <option value="">-- Choose Buyer --</option>
                        {buyers.map(b => (
                          <option key={b.id} value={b.id}>{b.name} ({b.fishCageName})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery Date *</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                        value={distDate}
                        onChange={(e) => setDistDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Feed Product Link *</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                        value={distProductCode}
                        onChange={(e) => setDistProductCode(e.target.value)}
                      >
                        <option value="">-- Choose Product --</option>
                        {feedProducts.map(p => (
                          <option key={p.code} value={p.code}>{p.name} ({p.quantityBags.toLocaleString()} bags av.)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivered Bags Quantity *</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
                        value={distQtyBags}
                        onChange={(e) => setDistQtyBags(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery Notes / Remarks</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 h-16 resize-none"
                      value={distRemarks}
                      onChange={(e) => setDistRemarks(e.target.value)}
                      placeholder="E.g., Delivery vehicle, skipper details, sea conditions..."
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-teal-600 text-white text-xs font-bold px-5 py-2 rounded-xl">Save & Sync</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
