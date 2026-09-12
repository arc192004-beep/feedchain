import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface RawMaterial {
    id?: number;
    code: string;
    name: string;
    unit?: string;
    quantity: number;
    minStock?: number;
    cost?: number;
    status?: string;
    supplier?: string;
    [key: string]: unknown;
}

export interface FeedProduct {
    id?: number;
    code: string;
    name: string;
    feedType?: string;
    price?: number;
    unit?: string;
    status?: string;
    quantityBags: number;
    minStockBags?: number;
    bagWeightKg?: number;
    [key: string]: unknown;
}

export interface FeedFormula {
    id?: number;
    code: string;
    name: string;
    feedProductId?: number;
    feedProductCode?: string;
    ingredients: FormulaIngredient[];
    [key: string]: unknown;
}

export interface FormulaIngredient {
    rawMaterialId?: number;
    rawMaterialCode: string;
    quantityKg: number;
    quantityRequired?: number;
    unit?: string;
    [key: string]: unknown;
}

export interface ProductionBatch {
    batchNo: string;
    feedProductCode?: string;
    productionDate: string;
    quantityProducedBags: number;
    rawMaterialsUsed?: Array<{ rawMaterialCode: string; quantityUsedKg: number }>;
    status?: string;
    [key: string]: unknown;
}

export interface DistributionRecord {
    id: string;
    buyerId: string;
    distributionDate: string;
    feedProductCode: string;
    quantityBags: number;
    remarks?: string;
    [key: string]: unknown;
}

export interface SalesRecord {
    id: string;
    customerId: string;
    salesDate: string;
    feedProductCode: string;
    quantityBags: number;
    unitPrice: number;
    totalAmount: number;
    [key: string]: unknown;
}

export interface BuyerProfile {
    id: string | number;
    name: string;
    fishCageName?: string;
    address?: string;
    contactNumber?: string;
    [key: string]: unknown;
}

export interface CustomerProfile {
    id: string | number;
    name: string;
    address?: string;
    phone?: string;
    [key: string]: unknown;
}

export interface SystemActivityLog {
    id: string | number;
    action: string;
    user?: string;
    created_at?: string;
    [key: string]: unknown;
}

export interface BackupRecord {
    id: string | number;
    fileName: string;
    created_at?: string;
    [key: string]: unknown;
}

export interface SystemSettings {
    key: string;
    value: string;
    [key: string]: unknown;
}

export interface InventoryMovement {
    id: number | string;
    date: string;
    inventoryType: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    quantityAvailable: number;
    unit: string;
    referenceBatchId?: number | null;
    [key: string]: unknown;
}

export type UserRole = 'super_admin' | 'administrator' | 'production_manager' | string;
export type UserStatus = 'active' | 'inactive' | string;
