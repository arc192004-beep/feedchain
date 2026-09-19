import React, { useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { csrfFetch } from "../lib/csrf-fetch";
import type { User, RawMaterial, FeedProduct, FeedFormula, ProductionBatch } from "../types";
import { 
  Plus, Edit2, Trash2, Search, Filter, ShieldAlert, 
  CheckCircle2, FlaskConical, Settings, Calendar, 
  ArrowRight, Activity, Beaker, Clipboard, Package, AlertTriangle, X,
  Play, Check, Ban, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, Layers
} from "lucide-react";

type IngredientRow = {
  rawMaterialCode: string;
  percentage: number;
  quantityKg: number;
  unit?: string;
};

interface ProductionModuleProps {
  currentUser: User;
  rawMaterials: RawMaterial[];
  feedProducts: FeedProduct[];
  formulas: FeedFormula[];
  productionBatches: ProductionBatch[];
  onUpdateRawMaterials: (newMaterials: RawMaterial[]) => void;
  onUpdateFeedProducts: (newProducts: FeedProduct[]) => void;
  onUpdateFormulas: (newFormulas: FeedFormula[]) => void;
  onUpdateBatches: (newBatches: ProductionBatch[]) => void;
}

export default function ProductionModule({
  currentUser,
  rawMaterials,
  feedProducts,
  formulas,
  productionBatches,
  onUpdateRawMaterials,
  onUpdateFeedProducts,
  onUpdateFormulas,
  onUpdateBatches
}: ProductionModuleProps) {
  const normalizedRole = (currentUser.role || '').toString().toLowerCase().replace(/\s+/g, '_');
  const isPM = ['production_manager', 'super_admin'].includes(normalizedRole);

  // Synchronized state with parent props
  const [materialsState, setMaterialsState] = useState<any[]>(rawMaterials || []);
  const [productsState, setProductsState] = useState<any[]>(feedProducts || []);
  const [formulasState, setFormulasState] = useState<any[]>(formulas || []);
  const [batchesState, setBatchesState] = useState<any[]>(productionBatches || []);

  useEffect(() => { setMaterialsState(rawMaterials || []); }, [rawMaterials]);
  useEffect(() => { setProductsState(feedProducts || []); }, [feedProducts]);
  useEffect(() => { setFormulasState(formulas || []); }, [formulas]);
  useEffect(() => { setBatchesState(productionBatches || []); }, [productionBatches]);

  const [activeSubTab, setActiveSubTab] = useState<"materials" | "products" | "formulas" | "batches">("batches");

  // Filtering, Searching, Sorting, and Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"material" | "product" | "formula" | "batch" | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: "delete_material" | "delete_product" | "delete_formula" | "delete_batch" | "start_batch" | "cancel_batch" | "complete_batch";
    data?: any;
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionType: "delete_batch",
  });

  // Material Form fields
  const [matCode, setMatCode] = useState("");
  const [matName, setMatName] = useState("");
  const [matSupplier, setMatSupplier] = useState("");
  const [matUnit, setMatUnit] = useState<"kg" | "g" | "liters">("kg");
  const [matQty, setMatQty] = useState(0);
  const [matCost, setMatCost] = useState(0);
  const [matMin, setMatMin] = useState(1000);
  const [matStatus, setMatStatus] = useState<"Active" | "Inactive">("Active");

  // Product Form fields
  const [prodCode, setProdCode] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodType, setProdType] = useState<"Starter" | "Grower" | "Finisher" | "Broodstock">("Starter");
  const [prodPrice, setProdPrice] = useState(0);
  const [prodBagWeight, setProdBagWeight] = useState(25);
  const [prodBags, setProdBags] = useState(0);
  const [prodMinBags, setProdMinBags] = useState(200);
  const [prodStatus, setProdStatus] = useState<"Active" | "Inactive">("Active");

  // Formula Form fields (100% rule)
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formProduct, setFormProduct] = useState("");
  const [formIngredients, setFormIngredients] = useState<IngredientRow[]>([]);

  // Batch Form fields
  const [batchNo, setBatchNo] = useState("");
  const [batchProduct, setBatchProduct] = useState("");
  const [batchDate, setBatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [batchQtyBags, setBatchQtyBags] = useState(40);
  const [batchStatus, setBatchStatus] = useState<"planned" | "in_progress" | "completed" | "cancelled">("completed");
  const [batchNotes, setBatchNotes] = useState("");

  const resetForm = () => {
    setErrorMessage("");
    setEditItem(null);
    setIsSubmitting(false);

    setMatCode("");
    setMatName("");
    setMatSupplier("");
    setMatUnit("kg");
    setMatQty(0);
    setMatCost(0);
    setMatMin(1000);
    setMatStatus("Active");

    setProdCode("");
    setProdName("");
    setProdType("Starter");
    setProdPrice(0);
    setProdBagWeight(25);
    setProdBags(0);
    setProdMinBags(200);
    setProdStatus("Active");

    setFormCode("");
    setFormName("");
    setFormProduct("");
    setFormIngredients([]);

    setBatchNo(`BATCH-${new Date().getFullYear()}-${String((batchesState || []).length + 1).padStart(3, "0")}`);
    setBatchProduct("");
    setBatchDate(new Date().toISOString().split("T")[0]);
    setBatchQtyBags(40);
    setBatchStatus("completed");
    setBatchNotes("");
  };

  const handleOpenCreate = (type: "material" | "product" | "formula" | "batch") => {
    resetForm();
    setModalType(type);

    if (type === "formula") {
      // Initialize with two starter ingredient lines if materials exist
      if (materialsState.length >= 2) {
        setFormIngredients([
          { rawMaterialCode: materialsState[0].code || materialsState[0].material_code, percentage: 60, quantityKg: 600, unit: "kg" },
          { rawMaterialCode: materialsState[1].code || materialsState[1].material_code, percentage: 40, quantityKg: 400, unit: "kg" },
        ]);
      }
    }

    setShowModal(true);
  };

  const handleOpenEdit = (type: "material" | "product" | "formula" | "batch", item: any) => {
    resetForm();
    setModalType(type);
    setEditItem(item);

    if (type === "material") {
      setMatCode(item.code || item.material_code);
      setMatName(item.name || item.material_name);
      setMatSupplier(item.supplier || item.material_type || "");
      setMatUnit(item.unit || "kg");
      setMatQty(Number(item.quantity ?? item.quantity_on_hand ?? 0));
      setMatCost(Number(item.cost ?? item.cost_per_unit ?? 0));
      setMatMin(Number(item.minStock ?? item.reorder_level ?? 1000));
      setMatStatus((item.status || "active").toLowerCase() === "active" ? "Active" : "Inactive");
    } else if (type === "product") {
      setProdCode(item.code || item.product_code);
      setProdName(item.name || item.product_name);
      setProdType(item.feedType || item.feed_type || "Starter");
      setProdPrice(Number(item.price || 0));
      setProdBagWeight(Number(item.bagWeightKg || item.bag_weight_kg || 25));
      setProdBags(Number(item.quantityBags ?? item.quantity_bags ?? 0));
      setProdMinBags(Number(item.minStockBags ?? item.min_stock_bags ?? 200));
      setProdStatus((item.status || "active").toLowerCase() === "active" ? "Active" : "Inactive");
    } else if (type === "formula") {
      setFormCode(item.code || item.formula_code);
      setFormName(item.name || item.formula_name);
      setFormProduct(item.feedProductCode || "");
      const mapped = (item.ingredients || []).map((ing: any) => {
        const qty = Number(ing.quantityKg ?? ing.quantity_required ?? 0);
        const pct = qty <= 100 ? qty : roundToTwo(qty / 10);
        return {
          rawMaterialCode: ing.rawMaterialCode || "",
          percentage: pct,
          quantityKg: qty <= 100 ? qty * 10 : qty,
          unit: ing.unit || "kg",
        };
      });
      setFormIngredients(mapped);
    } else if (type === "batch") {
      setBatchNo(item.batchNo || item.batch_number);
      setBatchProduct(item.feedProductCode || "");
      setBatchDate(item.productionDate || new Date().toISOString().split("T")[0]);
      setBatchQtyBags(Number(item.quantityProducedBags ?? item.sacks_produced ?? 40));
      setBatchStatus((item.status || "completed").toLowerCase() as any);
      setBatchNotes(item.notes || "");
    }

    setShowModal(true);
  };

  const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  // Formula ingredient helper calculations
  const totalFormPercentage = useMemo(() => {
    return roundToTwo(formIngredients.reduce((sum, ing) => sum + (Number(ing.percentage) || 0), 0));
  }, [formIngredients]);

  const handleUpdateIngredientPercentage = (index: number, percentVal: number) => {
    const updated = [...formIngredients];
    updated[index] = {
      ...updated[index],
      percentage: percentVal,
      quantityKg: roundToTwo(percentVal * 10), // 1 MT = 1000 kg => 1% = 10 kg
    };
    setFormIngredients(updated);
  };

  const handleAddIngredientRow = () => {
    const unallocated = materialsState.find(
      (m: any) => !formIngredients.some(ing => ing.rawMaterialCode === (m.code || m.material_code))
    );
    const codeToUse = unallocated ? (unallocated.code || unallocated.material_code) : (materialsState[0]?.code || "");
    const remainingPct = Math.max(0, roundToTwo(100 - totalFormPercentage));
    setFormIngredients([
      ...formIngredients,
      { rawMaterialCode: codeToUse, percentage: remainingPct, quantityKg: roundToTwo(remainingPct * 10), unit: "kg" }
    ]);
  };

  const handleRemoveIngredientRow = (index: number) => {
    setFormIngredients(formIngredients.filter((_, i) => i !== index));
  };

  // 1. MATERIAL SUBMISSION
  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matCode.trim() || !matName.trim() || !matSupplier.trim() || matQty < 0 || matCost < 0) {
      setErrorMessage("Please fill all required fields with non-negative values.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      material_code: matCode.trim().toUpperCase(),
      material_name: matName.trim(),
      material_type: matSupplier.trim(),
      unit: matUnit,
      quantity_on_hand: matQty,
      reorder_level: matMin,
      cost_per_unit: matCost,
      status: matStatus.toLowerCase(),
    };

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const url = editItem ? route('raw_materials.update', editItem.id) : route('raw_materials.store');
      const method = editItem ? 'PUT' : 'POST';

      const res = await csrfFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || Object.values(data?.errors || {}).flat().join(' ') || 'Server error while saving raw material');
      }

      // Reload Inertia props to sync all calculations & inventories
      router.reload({
        only: ['rawMaterials', 'inventoryMovements'],
        onSuccess: (page: any) => {
          if (page.props.rawMaterials) onUpdateRawMaterials(page.props.rawMaterials);
        }
      });

      setShowModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save raw material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. PRODUCT SUBMISSION
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodCode.trim() || !prodName.trim() || prodPrice < 0 || prodBags < 0 || prodBagWeight <= 0) {
      setErrorMessage("Please complete all fields with positive numerical values.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      product_code: prodCode.trim().toUpperCase(),
      product_name: prodName.trim(),
      feed_type: prodType,
      unit: 'bag',
      price: prodPrice,
      quantity_bags: prodBags,
      min_stock_bags: prodMinBags,
      bag_weight_kg: prodBagWeight,
      status: prodStatus.toLowerCase(),
    };

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const url = editItem ? route('feed_products.update', editItem.id) : route('feed_products.store');
      const method = editItem ? 'PUT' : 'POST';

      const res = await csrfFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || Object.values(data?.errors || {}).flat().join(' ') || 'Server error while saving feed product');
      }

      router.reload({
        only: ['feedProducts', 'inventoryMovements'],
        onSuccess: (page: any) => {
          if (page.props.feedProducts) onUpdateFeedProducts(page.props.feedProducts);
        }
      });

      setShowModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save feed product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. FORMULA SUBMISSION (With Strict 100% Inclusion Rule)
  const handleFormulaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim() || !formProduct || formIngredients.length === 0) {
      setErrorMessage("Formula must have a code, name, target feed product, and ingredients.");
      return;
    }

    // STRICT 100% VALIDATION
    if (Math.abs(totalFormPercentage - 100.0) > 0.05) {
      setErrorMessage(`Total ingredient inclusion rate is currently ${totalFormPercentage}%. Feed formulas MUST equal exactly 100.0% (difference: ${(100 - totalFormPercentage).toFixed(2)}%).`);
      return;
    }

    const selectedProduct = productsState.find(
      (p: any) => (p.code || p.product_code) === formProduct
    );
    if (!selectedProduct?.id) {
      setErrorMessage("The selected feed product could not be identified.");
      return;
    }

    // Resolve raw material ids
    const itemsPayload = formIngredients.map((ing) => {
      const raw = materialsState.find(
        (m: any) => (m.code || m.material_code) === ing.rawMaterialCode
      );
      return {
        raw_material_id: raw?.id || null,
        quantity_required: ing.quantityKg,
        unit: 'kg',
      };
    });

    if (itemsPayload.some(i => !i.raw_material_id)) {
      setErrorMessage("One or more raw material codes could not be resolved. Please verify your ingredient lines.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      formula_code: formCode.trim().toUpperCase(),
      formula_name: formName.trim(),
      feed_product_id: selectedProduct.id,
      batch_size_kg: 1000,
      status: 'active',
      items: itemsPayload,
    };

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const url = editItem ? route('feed_formulas.update', editItem.id) : route('feed_formulas.store');
      const method = editItem ? 'PUT' : 'POST';

      const res = await csrfFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || Object.values(data?.errors || {}).flat().join(' ') || 'Server error while saving formula');
      }

      router.reload({
        only: ['formulas'],
        onSuccess: (page: any) => {
          if (page.props.formulas) onUpdateFormulas(page.props.formulas);
        }
      });

      setShowModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save formula.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. BATCH SUBMISSION (With Full Lifecycle: Planned -> In Progress -> Completed)
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNo.trim() || !batchProduct || batchQtyBags <= 0) {
      setErrorMessage("Please specify a batch run number, select a feed product, and enter positive bags.");
      return;
    }

    const selectedProduct = productsState.find(
      (p: any) => (p.code || p.product_code) === batchProduct
    );
    if (!selectedProduct?.id) {
      setErrorMessage("Selected feed product is invalid.");
      return;
    }

    const matchedFormula = formulasState.find(
      (f: any) => f.feedProductCode === batchProduct || f.feedProductId === selectedProduct.id
    );
    if (!matchedFormula) {
      setErrorMessage(`No approved formula found for ${selectedProduct.name} (${selectedProduct.code}). Register a formula first.`);
      return;
    }

    const bagWeight = selectedProduct.bagWeightKg || 25;
    const totalOutputKg = batchQtyBags * bagWeight;

    // If status is completed, perform client-side stock preview check
    if (batchStatus === "completed") {
      const ratio = totalOutputKg / 1000;
      for (const ing of matchedFormula.ingredients) {
        const needed = Math.round(ing.quantityKg * ratio);
        const mat = materialsState.find(
          (m: any) => (m.code || m.material_code) === ing.rawMaterialCode || m.id === ing.rawMaterialId
        );
        const currentStock = mat ? Number(mat.quantity ?? mat.quantity_on_hand ?? 0) : 0;
        if (!mat || currentStock < needed) {
          const matName = mat ? (mat.name || mat.material_name) : ing.rawMaterialCode;
          setErrorMessage(`Insufficient physical stock for '${matName}': requires ${needed.toLocaleString()} kg, but only ${currentStock.toLocaleString()} kg is currently available in the silo.`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      batch_number: batchNo.trim().toUpperCase(),
      feed_product_id: selectedProduct.id,
      feed_formula_id: matchedFormula.id,
      production_date: batchDate,
      quantity_kg: totalOutputKg,
      sacks_produced: batchQtyBags,
      status: batchStatus,
      notes: batchNotes.trim(),
    };

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const url = editItem ? route('production_batches.update', editItem.id) : route('production_batches.store');
      const method = editItem ? 'PUT' : 'POST';

      const res = await csrfFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || Object.values(data?.errors || {}).flat().join(' ') || 'Server error while recording batch run');
      }

      router.reload({
        only: ['productionBatches', 'rawMaterials', 'feedProducts', 'inventoryMovements'],
        onSuccess: (page: any) => {
          if (page.props.productionBatches) onUpdateBatches(page.props.productionBatches);
          if (page.props.rawMaterials) onUpdateRawMaterials(page.props.rawMaterials);
          if (page.props.feedProducts) onUpdateFeedProducts(page.props.feedProducts);
        }
      });

      setShowModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to record production batch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick action: Transition batch status
  const handleQuickStatusChange = async (batch: any, targetStatus: "in_progress" | "completed" | "cancelled") => {
    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      batch_number: batch.batchNo || batch.batch_number,
      feed_product_id: batch.feedProductId || productsState.find(p => p.code === batch.feedProductCode)?.id,
      feed_formula_id: batch.formulaId || formulasState.find(f => f.feedProductCode === batch.feedProductCode)?.id,
      production_date: batch.productionDate,
      quantity_kg: batch.quantityKg,
      sacks_produced: batch.quantityProducedBags,
      status: targetStatus,
      notes: batch.notes || "",
    };

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const res = await csrfFetch(route('production_batches.update', batch.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update batch status');
      }

      router.reload({
        only: ['productionBatches', 'rawMaterials', 'feedProducts', 'inventoryMovements'],
        onSuccess: (page: any) => {
          if (page.props.productionBatches) onUpdateBatches(page.props.productionBatches);
          if (page.props.rawMaterials) onUpdateRawMaterials(page.props.rawMaterials);
          if (page.props.feedProducts) onUpdateFeedProducts(page.props.feedProducts);
        }
      });

      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (err: any) {
      alert(err.message || 'Status transition error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler with confirmation
  const handleExecuteDelete = async () => {
    if (!confirmDialog.data) return;
    setIsSubmitting(true);

    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      let url = "";

      if (confirmDialog.actionType === "delete_material") {
        url = route('raw_materials.destroy', confirmDialog.data.id);
      } else if (confirmDialog.actionType === "delete_product") {
        url = route('feed_products.destroy', confirmDialog.data.id);
      } else if (confirmDialog.actionType === "delete_formula") {
        url = route('feed_formulas.destroy', confirmDialog.data.id);
      } else if (confirmDialog.actionType === "delete_batch") {
        url = route('production_batches.destroy', confirmDialog.data.id);
      }

      const res = await csrfFetch(url, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || 'Server error during deletion');
      }

      router.reload({
        only: ['productionBatches', 'rawMaterials', 'feedProducts', 'formulas', 'inventoryMovements'],
        onSuccess: (page: any) => {
          if (page.props.productionBatches) onUpdateBatches(page.props.productionBatches);
          if (page.props.rawMaterials) onUpdateRawMaterials(page.props.rawMaterials);
          if (page.props.feedProducts) onUpdateFeedProducts(page.props.feedProducts);
          if (page.props.formulas) onUpdateFormulas(page.props.formulas);
        }
      });

      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered & Sorted items
  const processedItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (activeSubTab === "batches") {
      let filtered = (batchesState || []).filter((b: any) => {
        const matchesSearch = !q ||
          (b.batchNo || "").toLowerCase().includes(q) ||
          (b.feedProductCode || "").toLowerCase().includes(q) ||
          (b.feedProductName || "").toLowerCase().includes(q);
        const matchesStatus = statusFilter === "all" || (b.status || "completed").toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      });

      return filtered.sort((a: any, b: any) => {
        if (sortField === "batchNo") {
          return sortAsc ? (a.batchNo || "").localeCompare(b.batchNo || "") : (b.batchNo || "").localeCompare(a.batchNo || "");
        }
        if (sortField === "bags") {
          return sortAsc ? a.quantityProducedBags - b.quantityProducedBags : b.quantityProducedBags - a.quantityProducedBags;
        }
        if (sortField === "status") {
          return sortAsc ? (a.status || "").localeCompare(b.status || "") : (b.status || "").localeCompare(a.status || "");
        }
        // default: date
        return sortAsc ? (a.productionDate || "").localeCompare(b.productionDate || "") : (b.productionDate || "").localeCompare(a.productionDate || "");
      });
    }

    if (activeSubTab === "materials") {
      let filtered = (materialsState || []).filter((m: any) => {
        const matchesSearch = !q ||
          (m.code || "").toLowerCase().includes(q) ||
          (m.name || "").toLowerCase().includes(q) ||
          (m.supplier || "").toLowerCase().includes(q);
        const isLow = Number(m.quantity || 0) <= Number(m.minStock || 0);
        const matchesStatus = statusFilter === "all"
          ? true
          : statusFilter === "low_stock"
          ? isLow
          : (m.status || "active").toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      });

      return filtered.sort((a: any, b: any) => {
        if (sortField === "name") return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        if (sortField === "stock") return sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity;
        if (sortField === "cost") return sortAsc ? a.cost - b.cost : b.cost - a.cost;
        return sortAsc ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
      });
    }

    if (activeSubTab === "products") {
      let filtered = (productsState || []).filter((p: any) => {
        const matchesSearch = !q ||
          (p.code || "").toLowerCase().includes(q) ||
          (p.name || "").toLowerCase().includes(q) ||
          (p.feedType || "").toLowerCase().includes(q);
        const isLow = Number(p.quantityBags || 0) <= Number(p.minStockBags || 0);
        const matchesStatus = statusFilter === "all"
          ? true
          : statusFilter === "low_stock"
          ? isLow
          : (p.feedType || "").toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      });

      return filtered.sort((a: any, b: any) => {
        if (sortField === "name") return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        if (sortField === "price") return sortAsc ? a.price - b.price : b.price - a.price;
        if (sortField === "bags") return sortAsc ? a.quantityBags - b.quantityBags : b.quantityBags - a.quantityBags;
        return sortAsc ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
      });
    }

    if (activeSubTab === "formulas") {
      let filtered = (formulasState || []).filter((f: any) => {
        return !q ||
          (f.code || "").toLowerCase().includes(q) ||
          (f.name || "").toLowerCase().includes(q) ||
          (f.feedProductCode || "").toLowerCase().includes(q);
      });

      return filtered.sort((a: any, b: any) => {
        if (sortField === "name") return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        return sortAsc ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
      });
    }

    return [];
  }, [activeSubTab, batchesState, materialsState, productsState, formulasState, searchQuery, statusFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(processedItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedItems.slice(start, start + pageSize);
  }, [processedItems, currentPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Top statistics summary row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Raw Materials Inventory</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
              {Math.round(materialsState.reduce((sum, m) => sum + Number(m.quantity || 0), 0) / 1000)} Tons
            </h3>
            <span className="text-[10px] text-teal-600 block mt-1 font-bold">{materialsState.length} ingredients cataloged</span>
          </div>
          <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl">
            <Beaker className="text-teal-600" size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Finished Feed Sacks</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
              {productsState.reduce((sum, p) => sum + Number(p.quantityBags || 0), 0).toLocaleString()} Bags
            </h3>
            <span className="text-[10px] text-teal-600 block mt-1 font-bold">{productsState.length} feed formulations</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
            <Package className="text-emerald-600" size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Batches In Pipeline</span>
            <h3 className="text-xl font-extrabold text-blue-600 mt-0.5">
              {batchesState.filter(b => ["planned", "in_progress"].includes((b.status || "").toLowerCase())).length} Active
            </h3>
            <span className="text-[10px] text-slate-500 block mt-1 font-medium">{batchesState.filter(b => (b.status || "").toLowerCase() === "completed").length} runs completed</span>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
            <Activity className="text-blue-600" size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Stock Alerts</span>
            <h3 className="text-xl font-extrabold text-amber-600 mt-0.5">
              {materialsState.filter(m => Number(m.quantity || 0) <= Number(m.minStock || 0)).length + productsState.filter(p => Number(p.quantityBags || 0) <= Number(p.minStockBags || 0)).length} Items
            </h3>
            <span className="text-[10px] text-rose-500 block mt-1 font-bold">Requires procurement attention</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
            <AlertTriangle className="text-amber-500" size={22} />
          </div>
        </div>

      </div>

      {/* Subtabs navigation bar */}
      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap gap-1 w-full md:w-auto">
          <button
            onClick={() => { setActiveSubTab("batches"); setSearchQuery(""); setStatusFilter("all"); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "batches" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Production Batches ({batchesState.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("materials"); setSearchQuery(""); setStatusFilter("all"); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "materials" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Raw Materials ({materialsState.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("products"); setSearchQuery(""); setStatusFilter("all"); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "products" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Feed Products ({productsState.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("formulas"); setSearchQuery(""); setStatusFilter("all"); setCurrentPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "formulas" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Formulations ({formulasState.length})
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          {/* Status filter dropdown */}
          {activeSubTab === "batches" && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            >
              <option value="all">All Batches</option>
              <option value="planned">Planned Only</option>
              <option value="in_progress">In Progress Only</option>
              <option value="completed">Completed Runs</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}

          {activeSubTab === "materials" && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            >
              <option value="all">All Ingredients</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="low_stock">Low Stock Only</option>
            </select>
          )}

          {activeSubTab === "products" && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            >
              <option value="all">All Classifications</option>
              <option value="starter">Starter</option>
              <option value="grower">Grower</option>
              <option value="finisher">Finisher</option>
              <option value="broodstock">Broodstock</option>
              <option value="low_stock">Low Stock Bags</option>
            </select>
          )}

          {/* Search box */}
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table header with title and action */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
              {activeSubTab === "batches" && "Production Batch Execution Ledger"}
              {activeSubTab === "materials" && "Raw Material Ingredients Database"}
              {activeSubTab === "products" && "Finished Feed Products Catalog"}
              {activeSubTab === "formulas" && "Standard Feed Milling Formulations (100% Inclusion Rule)"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeSubTab === "batches" && "Schedule, execute, and verify milling runs with automatic ingredient deduction & yield computation"}
              {activeSubTab === "materials" && "Manage inventory, supplier accounts, safety reorder thresholds, and unit costs"}
              {activeSubTab === "products" && "Manage wholesale pricing, bag weights, bag stocks, and classification"}
              {activeSubTab === "formulas" && "Strict inclusion formulas summing precisely to 100.0% (1 MT standard milling)"}
            </p>
          </div>

          {isPM ? (
            <button
              onClick={() => handleOpenCreate(activeSubTab === "materials" ? "material" : activeSubTab === "products" ? "product" : activeSubTab === "formulas" ? "formula" : "batch")}
              className="bg-teal-600 hover:bg-teal-500 active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              {activeSubTab === "batches" && "Schedule Batch"}
              {activeSubTab === "materials" && "Add Ingredient"}
              {activeSubTab === "products" && "Add Feed Product"}
              {activeSubTab === "formulas" && "Draft Formulation"}
            </button>
          ) : (
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-3 py-1 font-bold flex items-center gap-1">
              <ShieldAlert size={12} />
              ADMIN MONITORING ONLY
            </span>
          )}
        </div>

        {/* 1. BATCHES TABLE VIEW */}
        {activeSubTab === "batches" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                  <th onClick={() => handleSort("batchNo")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Batch Run ID <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3.5 px-6">Feed Product Target</th>
                  <th onClick={() => handleSort("date")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Milling Date <ArrowUpDown size={11} /></div>
                  </th>
                  <th onClick={() => handleSort("bags")} className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-800">
                    <div className="flex items-center justify-end gap-1">Output Sacks <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3.5 px-6 text-center">Production Yield</th>
                  <th onClick={() => handleSort("status")} className="py-3.5 px-6 text-center cursor-pointer hover:text-slate-800">
                    <div className="flex items-center justify-center gap-1">Lifecycle Status <ArrowUpDown size={11} /></div>
                  </th>
                  {isPM && <th className="py-3.5 px-6 text-right">Batch Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium text-xs">
                      No production batches found matching current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((b: any) => {
                    const statusLower = (b.status || "completed").toLowerCase();
                    const product = productsState.find((p: any) => (p.code || p.product_code) === b.feedProductCode);
                    const isCompleted = statusLower === "completed";
                    const isInProgress = statusLower === "in_progress";
                    const isPlanned = statusLower === "planned";
                    const isCancelled = statusLower === "cancelled";

                    return (
                      <tr key={b.batchNo || b.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 font-mono font-extrabold text-slate-800">
                          {b.batchNo || b.batch_number}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-800 block">{product ? product.name : (b.feedProductName || b.feedProductCode)}</span>
                          <span className="text-[10px] text-teal-600 font-mono">{b.feedProductCode || "Standard Feed"}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-medium">{b.productionDate}</td>
                        <td className="py-4 px-6 text-right font-extrabold text-slate-800">
                          {Number(b.quantityProducedBags || 0).toLocaleString()} bags
                          <span className="text-[10px] block text-slate-400 font-normal">
                            ({Number(b.quantityKg || (b.quantityProducedBags * 25)).toLocaleString()} kg)
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {isCompleted ? (
                            <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                              {b.yieldPercentage ? `${b.yieldPercentage}%` : "100%"} Yield
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Pending run</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider inline-block ${
                            isCompleted 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isInProgress
                              ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                              : isPlanned
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {statusLower === "in_progress" ? "In Progress" : statusLower}
                          </span>
                        </td>
                        {isPM && (
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end items-center gap-1.5">
                              {/* Planned: Can Start or Complete */}
                              {isPlanned && (
                                <>
                                  <button
                                    onClick={() => handleQuickStatusChange(b, "in_progress")}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Start Milling (In Progress)"
                                  >
                                    <Play size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleQuickStatusChange(b, "completed")}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="Complete and Deduct Stock"
                                  >
                                    <Check size={13} />
                                  </button>
                                </>
                              )}

                              {/* In Progress: Can Complete or Cancel */}
                              {isInProgress && (
                                <button
                                  onClick={() => handleQuickStatusChange(b, "completed")}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Complete and Deduct Stock"
                                >
                                  <Check size={13} />
                                </button>
                              )}

                              {/* Edit details */}
                              <button
                                onClick={() => handleOpenEdit("batch", b)}
                                className="p-1.5 hover:bg-teal-50 text-teal-600 rounded-lg transition-all"
                                title="Edit Specifications"
                              >
                                <Edit2 size={13} />
                              </button>

                              {/* Cancel if active */}
                              {(isPlanned || isInProgress || isCompleted) && (
                                <button
                                  onClick={() => {
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: "Cancel Batch Run?",
                                      message: isCompleted
                                        ? "This batch is currently COMPLETED. Cancelling it will restore raw materials back into silos and deduct the finished bags from warehouse inventory."
                                        : "Are you sure you want to mark this scheduled batch as Cancelled?",
                                      actionType: "cancel_batch",
                                      data: b,
                                    });
                                  }}
                                  className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                  title="Cancel Batch Run"
                                >
                                  <Ban size={13} />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: "Delete Production Batch Record?",
                                    message: isCompleted
                                      ? "Deleting a completed batch will permanently remove the log and reverse all inventory adjustments (restoring raw materials and removing finished bags)."
                                      : "Permanently delete this batch log record?",
                                    actionType: "delete_batch",
                                    data: b,
                                  });
                                }}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete Batch Run"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. MATERIALS TABLE VIEW */}
        {activeSubTab === "materials" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                  <th onClick={() => handleSort("code")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Material Code <ArrowUpDown size={11} /></div>
                  </th>
                  <th onClick={() => handleSort("name")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Ingredient Name <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3.5 px-6">Approved Supplier</th>
                  <th onClick={() => handleSort("stock")} className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-800">
                    <div className="flex items-center justify-end gap-1">Physical Stock <ArrowUpDown size={11} /></div>
                  </th>
                  <th onClick={() => handleSort("cost")} className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-800">
                    <div className="flex items-center justify-end gap-1">Unit Cost (PHP) <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3.5 px-6 text-center">Alert Status</th>
                  {isPM && <th className="py-3.5 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium text-xs">
                      No raw materials found.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((m: any) => {
                    const isLow = Number(m.quantity || 0) <= Number(m.minStock || 0);
                    return (
                      <tr key={m.code || m.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 font-mono font-extrabold text-slate-700">{m.code || m.material_code}</td>
                        <td className="py-4 px-6 font-bold text-slate-800">{m.name || m.material_name}</td>
                        <td className="py-4 px-6 text-slate-500 font-medium">{m.supplier || m.material_type || "Direct Supplier"}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`font-mono font-black text-sm ${isLow ? "text-rose-600" : "text-slate-800"}`}>
                            {Number(m.quantity || 0).toLocaleString()} {m.unit || "kg"}
                          </span>
                          <span className="text-[10px] block text-slate-400 font-normal">
                            Min: {Number(m.minStock || 0).toLocaleString()} {m.unit || "kg"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-slate-700">
                          ₱{Number(m.cost || 0).toFixed(2)} / {m.unit || "kg"}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                            isLow 
                              ? "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse" 
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}>
                            {isLow ? "LOW STOCK" : "ADEQUATE"}
                          </span>
                        </td>
                        {isPM && (
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit("material", m)}
                                className="p-1 hover:bg-teal-50 text-teal-600 rounded-lg transition-all"
                                title="Edit Ingredient"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: "Delete Raw Material?",
                                    message: `Are you sure you want to delete '${m.name}'? This cannot be undone.`,
                                    actionType: "delete_material",
                                    data: m,
                                  });
                                }}
                                className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                                title="Delete Ingredient"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. PRODUCTS TABLE VIEW */}
        {activeSubTab === "products" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                  <th onClick={() => handleSort("code")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Feed Code <ArrowUpDown size={11} /></div>
                  </th>
                  <th onClick={() => handleSort("name")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Product Description <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3.5 px-6">Feed Classification</th>
                  <th onClick={() => handleSort("price")} className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-800">
                    <div className="flex items-center justify-end gap-1">Price per Bag <ArrowUpDown size={11} /></div>
                  </th>
                  <th onClick={() => handleSort("bags")} className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-800">
                    <div className="flex items-center justify-end gap-1">Warehouse Stock <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  {isPM && <th className="py-3.5 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium text-xs">
                      No feed products found.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((p: any) => {
                    const isLow = Number(p.quantityBags || 0) <= Number(p.minStockBags || 0);
                    return (
                      <tr key={p.code || p.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 font-mono font-extrabold text-slate-700">{p.code || p.product_code}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-800 block">{p.name || p.product_name}</span>
                          <span className="text-[10px] text-slate-400">Bag weight: {p.bagWeightKg || 25} kg</span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-teal-700">{p.feedType || "Aquatic"}</td>
                        <td className="py-4 px-6 text-right font-extrabold text-slate-800">
                          ₱{Number(p.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`font-mono font-black text-sm ${isLow ? "text-rose-600" : "text-slate-800"}`}>
                            {Number(p.quantityBags || 0).toLocaleString()} bags
                          </span>
                          <span className="text-[10px] block text-slate-400 font-normal">
                            Min: {Number(p.minStockBags || 0).toLocaleString()} bags
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                            (p.status || "active").toLowerCase() === "active"
                              ? "bg-teal-50 text-teal-700 border border-teal-100" 
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}>
                            {(p.status || "active").toUpperCase()}
                          </span>
                        </td>
                        {isPM && (
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit("product", p)}
                                className="p-1 hover:bg-teal-50 text-teal-600 rounded-lg transition-all"
                                title="Edit Product"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: "Delete Feed Product?",
                                    message: `Are you sure you want to delete '${p.name}'?`,
                                    actionType: "delete_product",
                                    data: p,
                                  });
                                }}
                                className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. FORMULATIONS TABLE VIEW */}
        {activeSubTab === "formulas" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                  <th onClick={() => handleSort("code")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Formula Code <ArrowUpDown size={11} /></div>
                  </th>
                  <th onClick={() => handleSort("name")} className="py-3.5 px-6 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Formulation Name <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="py-3.5 px-6">Linked Feed Product</th>
                  <th className="py-3.5 px-6">Inclusion Profile (100% Total)</th>
                  {isPM && <th className="py-3.5 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium text-xs">
                      No feed formulas drafted yet.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((f: any) => {
                    const linkedProduct = productsState.find((p: any) => (p.code || p.product_code) === f.feedProductCode || p.id === f.feedProductId);
                    return (
                      <tr key={f.code || f.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 font-mono font-extrabold text-slate-700">{f.code || f.formula_code}</td>
                        <td className="py-4 px-6 font-bold text-slate-800">{f.name || f.formula_name}</td>
                        <td className="py-4 px-6 font-semibold text-teal-700">
                          {linkedProduct ? linkedProduct.name : f.feedProductCode}
                          <span className="block font-mono text-[9px] text-slate-400">{f.feedProductCode}</span>
                        </td>
                        <td className="py-4 px-6 max-w-sm">
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            {(f.ingredients || []).map((ing: any) => {
                              const raw = materialsState.find((r: any) => (r.code || r.material_code) === ing.rawMaterialCode || r.id === ing.rawMaterialId);
                              const qty = Number(ing.quantityKg ?? ing.quantity_required ?? 0);
                              const pct = qty <= 100 ? qty : roundToTwo(qty / 10);
                              return (
                                <div key={ing.rawMaterialCode || ing.raw_material_id} className="flex justify-between items-center pr-2">
                                  <span className="truncate">{raw ? (raw.name || raw.material_name).split(" ")[0] : ing.rawMaterialCode}:</span>
                                  <span className="font-bold text-slate-800">{pct}% ({roundToTwo(pct * 10)}kg)</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        {isPM && (
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit("formula", f)}
                                className="p-1 hover:bg-teal-50 text-teal-600 rounded-lg transition-all"
                                title="Edit Formula"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: "Delete Feed Formulation?",
                                    message: `Are you sure you want to delete '${f.name}'?`,
                                    actionType: "delete_formula",
                                    data: f,
                                  });
                                }}
                                className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                                title="Delete Formula"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>
            Showing <strong>{processedItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, processedItems.length)}</strong> of <strong>{processedItems.length}</strong> items
          </span>
          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 font-mono font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* CORE POPUP ACTION MODALS */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                {editItem ? "Edit Specifications" : "Create New Record Entry"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 rounded-lg p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {errorMessage && (
                <div className="flex gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs items-center mb-4">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* A. MATERIAL FORM */}
              {modalType === "material" && (
                <form onSubmit={handleMaterialSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Code *</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={matCode}
                        onChange={(e) => setMatCode(e.target.value)}
                        placeholder="E.g. RM-011"
                        disabled={!!editItem}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ingredient Name *</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={matName}
                        onChange={(e) => setMatName(e.target.value)}
                        placeholder="E.g. Premium Squid Powder"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Approved Supplier *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      value={matSupplier}
                      onChange={(e) => setMatSupplier(e.target.value)}
                      placeholder="E.g. Mindanao Marine Feeds Trading"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stock Unit</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={matUnit}
                        onChange={(e) => setMatUnit(e.target.value as any)}
                      >
                        <option value="kg">kg (Kilograms)</option>
                        <option value="g">g (Grams)</option>
                        <option value="liters">liters (Liters)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Stock</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={matQty}
                        onChange={(e) => setMatQty(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reorder Level</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={matMin}
                        onChange={(e) => setMatMin(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Unit Cost (PHP) *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={matCost}
                        onChange={(e) => setMatCost(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ingredient Status</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={matStatus}
                        onChange={(e) => setMatStatus(e.target.value as any)}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                    <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-xl">
                      {isSubmitting ? "Saving..." : "Save Raw Material"}
                    </button>
                  </div>
                </form>
              )}

              {/* B. PRODUCT FORM */}
              {modalType === "product" && (
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Feed Code *</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={prodCode}
                        onChange={(e) => setProdCode(e.target.value)}
                        placeholder="E.g. FP-009"
                        disabled={!!editItem}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Feed Product Name *</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="E.g. Bangus Broodstock Floating Pellets"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Classification</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={prodType}
                        onChange={(e) => setProdType(e.target.value as any)}
                      >
                        <option value="Starter">Starter</option>
                        <option value="Grower">Grower</option>
                        <option value="Finisher">Finisher</option>
                        <option value="Broodstock">Broodstock</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bag Weight (kg)</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={prodBagWeight}
                        onChange={(e) => setProdBagWeight(parseInt(e.target.value) || 25)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Selling Price (PHP)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bags In Stock</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={prodBags}
                        onChange={(e) => setProdBags(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reorder Limit (Bags)</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={prodMinBags}
                        onChange={(e) => setProdMinBags(parseInt(e.target.value) || 200)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Product Status</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-sans"
                      value={prodStatus}
                      onChange={(e) => setProdStatus(e.target.value as any)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                    <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-xl">
                      {isSubmitting ? "Saving..." : "Save Feed Product"}
                    </button>
                  </div>
                </form>
              )}

              {/* C. FORMULA FORM (With Strict 100% Rule Validation) */}
              {modalType === "formula" && (
                <form onSubmit={handleFormulaSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Formula Code *</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value)}
                        placeholder="E.g. FC-005"
                        disabled={!!editItem}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Linked Feed Product *</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={formProduct}
                        onChange={(e) => setFormProduct(e.target.value)}
                      >
                        <option value="">-- Choose Target Feed --</option>
                        {productsState.map((p: any) => (
                          <option key={(p.code || p.product_code)} value={(p.code || p.product_code)}>
                            {p.name || p.product_name} ({p.code || p.product_code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Formulation Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="E.g. Special Bangus Grower V3 High Energy"
                    />
                  </div>

                  {/* Dynamic ingredients inclusion manager */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black text-teal-800 uppercase tracking-wider flex items-center gap-1">
                        <Beaker size={12} />
                        Raw Ingredients Inclusion (Must sum to 100.0%)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddIngredientRow}
                        className="text-[10px] bg-teal-50 border border-teal-200 text-teal-600 px-2 py-1 rounded-lg font-bold hover:bg-teal-100 transition-all cursor-pointer"
                      >
                        + Add Raw Line
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {formIngredients.map((ing, index) => (
                        <div key={index} className="flex gap-2 items-center bg-slate-50 border p-2 rounded-xl">
                          <select
                            className="bg-white border text-xs rounded-lg px-2 py-1.5 flex-1"
                            value={ing.rawMaterialCode}
                            onChange={(e) => {
                              const updated = [...formIngredients];
                              updated[index] = { ...updated[index], rawMaterialCode: e.target.value };
                              setFormIngredients(updated);
                            }}
                          >
                            {materialsState.map((m: any) => (
                              <option key={(m.code || m.material_code)} value={(m.code || m.material_code)}>
                                {m.name || m.material_name} ({m.code || m.material_code})
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              className="bg-white border text-xs rounded-lg px-2 py-1.5 w-20 text-right font-mono"
                              value={ing.percentage}
                              onChange={(e) => handleUpdateIngredientPercentage(index, parseFloat(e.target.value) || 0)}
                              placeholder="%"
                            />
                            <span className="text-xs font-mono font-bold text-slate-500">%</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 w-16 text-right">
                            ({ing.quantityKg} kg)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredientRow(index)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-3 p-3 bg-slate-100 rounded-xl border flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-mono font-extrabold">
                        <span>Total Inclusion Rate:</span>
                        <span className={Math.abs(totalFormPercentage - 100) <= 0.05 ? "text-emerald-700" : "text-rose-600 animate-pulse"}>
                          {totalFormPercentage}% / 100.0%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            Math.abs(totalFormPercentage - 100) <= 0.05
                              ? "bg-emerald-500"
                              : totalFormPercentage > 100
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.min(100, totalFormPercentage)}%` }}
                        />
                      </div>
                      {Math.abs(totalFormPercentage - 100) > 0.05 && (
                        <span className="text-[10px] text-rose-600 font-bold">
                          Warning: Inclusions must equal 100.0% to save (Difference: {(100 - totalFormPercentage).toFixed(1)}%).
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                    <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || Math.abs(totalFormPercentage - 100) > 0.05}
                      className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2 rounded-xl"
                    >
                      {isSubmitting ? "Saving..." : "Save Formulation"}
                    </button>
                  </div>
                </form>
              )}

              {/* D. PRODUCTION BATCH FORM */}
              {modalType === "batch" && (
                <form onSubmit={handleBatchSubmit} className="space-y-4">
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3">
                    <p className="text-[11px] text-teal-800 leading-relaxed font-medium">
                      <strong>Inventory Lifecycle Synchronization:</strong> Selecting <em>Completed</em> immediately allocates and verifies physical silo stocks, deducts raw materials, records finished bags, and calculates yield.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Batch Run ID *</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono font-bold"
                        value={batchNo}
                        onChange={(e) => setBatchNo(e.target.value)}
                        placeholder="E.g. BATCH-2026-028"
                        disabled={!!editItem}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Milling Date *</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={batchDate}
                        onChange={(e) => setBatchDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Feed Product *</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        value={batchProduct}
                        onChange={(e) => setBatchProduct(e.target.value)}
                      >
                        <option value="">-- Select Feed to Mill --</option>
                        {productsState.map(p => (
                          <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lifecycle Status *</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                        value={batchStatus}
                        onChange={(e) => setBatchStatus(e.target.value as any)}
                      >
                        <option value="planned">Planned (Scheduled)</option>
                        <option value="in_progress">In Progress (Milling)</option>
                        <option value="completed">Completed (Deduct Inventory)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quantity Produced (Bags of 25kg) *</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      value={batchQtyBags}
                      onChange={(e) => setBatchQtyBags(parseInt(e.target.value) || 0)}
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Total output weight: <strong>{(batchQtyBags * 25).toLocaleString()} kg</strong> ({((batchQtyBags * 25) / 1000).toFixed(2)} Metric Tons)
                    </span>
                  </div>

                  {batchProduct && (
                    <div className="p-3 bg-slate-50 border rounded-xl">
                      <span className="text-[10px] text-slate-500 block font-bold uppercase mb-2">Simulated Raw Materials Consumption:</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-600">
                        {formulasState.find((f: any) => f.feedProductCode === batchProduct)?.ingredients.map((ing: any) => {
                          const raw = materialsState.find((r: any) => (r.code || r.material_code) === ing.rawMaterialCode);
                          const totalBatchWeightKg = batchQtyBags * 25;
                          const quantityNeededKg = Math.round(ing.quantityKg * (totalBatchWeightKg / 1000));
                          const currentStock = raw ? Number(raw.quantity ?? raw.quantity_on_hand ?? 0) : 0;
                          const isShort = currentStock < quantityNeededKg;

                          return (
                            <div key={ing.rawMaterialCode} className={`flex justify-between p-1 rounded border ${isShort ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-slate-200"}`}>
                              <span className="truncate">{raw ? (raw.name || raw.material_name).split(" ")[0] : ing.rawMaterialCode}:</span>
                              <span className="font-bold">
                                {quantityNeededKg.toLocaleString()} kg {isShort ? `(Silo: ${currentStock}kg!)` : ""}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Notes / Remarks</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none h-16 resize-none"
                      value={batchNotes}
                      onChange={(e) => setBatchNotes(e.target.value)}
                      placeholder="Operator notes, quality check details..."
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                    <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-xl">
                      {isSubmitting ? "Syncing..." : batchStatus === "completed" ? "Complete and Sync Batch" : "Save Batch"}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <AlertTriangle size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">{confirmDialog.title}</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-200 transition-all"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  if (confirmDialog.actionType === "cancel_batch") {
                    handleQuickStatusChange(confirmDialog.data, "cancelled");
                  } else {
                    handleExecuteDelete();
                  }
                }}
                className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-xl shadow transition-all"
              >
                {isSubmitting ? "Processing..." : "Confirm Action"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
