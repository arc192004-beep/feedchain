import { 
  User, RawMaterial, FeedProduct, FeedFormula, 
  ProductionBatch, InventoryLog, BuyerProfile, 
  CustomerProfile, DistributionRecord, SalesRecord,
  SystemActivityLog, SystemSettings, BackupRecord 
} from "../types";

export const INITIAL_USERS: User[] = [
  {
    id: "U-000",
    firstName: "Gabriel",
    middleName: "Santos",
    lastName: "Dela Rosa",
    email: "superadmin@feedchain.com",
    username: "superadmin",
    role: "Super Administrator",
    status: "Active",
    createdAt: "2026-01-01",
    lastLogin: "2026-07-29 08:30 AM",
    phone: "+63 917 100 2000",
    permissions: [
      "dashboard", "users", "production", "inventory", 
      "distribution", "customer_sales", "analytics", "bi", 
      "forecast", "reports", "settings", "activity_logs", "backup_restore"
    ]
  },
  {
    id: "U-001",
    firstName: "Maria Clara",
    middleName: "Santos",
    lastName: "Dela Cruz",
    email: "admin@feedchain.com",
    username: "admin",
    role: "Administrator",
    status: "Active",
    createdAt: "2026-01-10",
    lastLogin: "2026-07-29 07:15 AM",
    phone: "+63 918 222 3344",
    permissions: [
      "dashboard", "users", "production", "inventory", 
      "distribution", "customer_sales", "analytics", "bi", 
      "forecast", "reports", "settings", "activity_logs"
    ]
  },
  {
    id: "U-002",
    firstName: "Juan",
    middleName: "Ramos",
    lastName: "Pilapil",
    email: "pm@feedchain.com",
    username: "pm",
    role: "Production Manager",
    status: "Active",
    createdAt: "2026-01-12",
    lastLogin: "2026-07-28 04:45 PM",
    phone: "+63 920 333 4455",
    permissions: [
      "dashboard", "production", "inventory", "distribution", 
      "customer_sales", "analytics", "forecast", "reports"
    ]
  },
  {
    id: "U-003",
    firstName: "Elizabeth",
    middleName: "Tan",
    lastName: "Lim",
    email: "e.lim@3henterprises.com",
    username: "elim",
    role: "Administrator",
    status: "Active",
    createdAt: "2026-02-14",
    lastLogin: "2026-07-27 11:20 AM",
    permissions: [
      "dashboard", "users", "production", "inventory", 
      "distribution", "customer_sales", "analytics", "bi", "reports"
    ]
  },
  {
    id: "U-004",
    firstName: "Rogelio",
    middleName: "Guzman",
    lastName: "Bautista",
    email: "r.bautista@3henterprises.com",
    username: "rogelio",
    role: "Production Manager",
    status: "Active",
    createdAt: "2026-03-01",
    lastLogin: "2026-07-26 02:10 PM",
    permissions: [
      "dashboard", "production", "inventory", "forecast", "reports"
    ]
  },
  {
    id: "U-005",
    firstName: "Simeon",
    middleName: "Alcantara",
    lastName: "Padilla",
    email: "s.padilla@3henterprises.com",
    username: "simeon",
    role: "Production Manager",
    status: "Inactive",
    createdAt: "2026-04-18",
    lastLogin: "2026-05-10 09:00 AM",
    permissions: [
      "dashboard", "production", "inventory"
    ]
  }
];

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    code: "RM-001",
    name: "Fish Meal (Super Grade)",
    supplier: "Davao Marine Protein Corp",
    unit: "kg",
    quantity: 14250,
    cost: 75.50,
    minStock: 5000,
    status: "Active"
  },
  {
    code: "RM-002",
    name: "Soybean Meal (Defatted)",
    supplier: "Agri-Bulk Mindanao Inc.",
    unit: "kg",
    quantity: 18400,
    cost: 38.20,
    minStock: 6000,
    status: "Active"
  },
  {
    code: "RM-003",
    name: "Yellow Corn (Fine Ground)",
    supplier: "Digos Corn Growers Assoc.",
    unit: "kg",
    quantity: 22100,
    cost: 22.00,
    minStock: 8000,
    status: "Active"
  },
  {
    code: "RM-004",
    name: "Rice Bran (D1 Fine)",
    supplier: "Malalag Rice Millers",
    unit: "kg",
    quantity: 12800,
    cost: 16.50,
    minStock: 4000,
    status: "Active"
  },
  {
    code: "RM-005",
    name: "Wheat Gluten/Flour Binder",
    supplier: "Mindanao Flour Corp.",
    unit: "kg",
    quantity: 3400,
    cost: 45.00,
    minStock: 2500,
    status: "Active"
  },
  {
    code: "RM-006",
    name: "Copra Meal",
    supplier: "Padada Coconut Oil Mill",
    unit: "kg",
    quantity: 9500,
    cost: 18.00,
    minStock: 3000,
    status: "Active"
  },
  {
    code: "RM-007",
    name: "Vitamin Premix (Aquatic)",
    supplier: "DSM Nutritionals Davao",
    unit: "kg",
    quantity: 850,
    cost: 320.00,
    minStock: 400,
    status: "Active"
  },
  {
    code: "RM-008",
    name: "Mineral Premix (Bio-Available)",
    supplier: "DSM Nutritionals Davao",
    unit: "kg",
    quantity: 1120,
    cost: 210.00,
    minStock: 450,
    status: "Active"
  },
  {
    code: "RM-009",
    name: "Premium Crude Fish Oil",
    supplier: "General Santos Fish Port Refinery",
    unit: "kg",
    quantity: 4100,
    cost: 95.00,
    minStock: 2000,
    status: "Active"
  },
  {
    code: "RM-010",
    name: "L-Lysine (Feed Grade)",
    supplier: "Interchem Trading Philippines",
    unit: "kg",
    quantity: 220,
    cost: 185.00,
    minStock: 300, // Low Stock Triggered!
    status: "Active"
  }
];

export const INITIAL_FEED_PRODUCTS: FeedProduct[] = [
  {
    code: "FP-001",
    name: "Bangus Fry Mash (A1 Premium)",
    feedType: "Starter",
    price: 1150.00, // PHP per 25kg bag
    bagWeightKg: 25,
    quantityBags: 620,
    minStockBags: 150,
    status: "Active"
  },
  {
    code: "FP-002",
    name: "Bangus Starter Pellets",
    feedType: "Starter",
    price: 1080.00, // PHP per 25kg bag
    bagWeightKg: 25,
    quantityBags: 1140,
    minStockBags: 300,
    status: "Active"
  },
  {
    code: "FP-003",
    name: "Bangus Grower Pellets",
    feedType: "Grower",
    price: 1020.00, // PHP per 25kg bag
    bagWeightKg: 25,
    quantityBags: 1890,
    minStockBags: 400,
    status: "Active"
  },
  {
    code: "FP-004",
    name: "Bangus Finisher Pellets",
    feedType: "Finisher",
    price: 980.00, // PHP per 25kg bag
    bagWeightKg: 25,
    quantityBags: 2450,
    minStockBags: 400,
    status: "Active"
  },
  {
    code: "FP-005",
    name: "Tilapia Fingerling Feed",
    feedType: "Starter",
    price: 1040.00, // PHP per 25kg bag
    bagWeightKg: 25,
    quantityBags: 120, // Low stock
    minStockBags: 200,
    status: "Active"
  },
  {
    code: "FP-006",
    name: "Tilapia Grower Pellets",
    feedType: "Grower",
    price: 960.00, // PHP per 25kg bag
    bagWeightKg: 25,
    quantityBags: 980,
    minStockBags: 300,
    status: "Active"
  },
  {
    code: "FP-007",
    name: "Shrimp Starter Post-Larvae",
    feedType: "Starter",
    price: 2450.00, // Premium feed, 25kg
    bagWeightKg: 25,
    quantityBags: 310,
    minStockBags: 100,
    status: "Active"
  },
  {
    code: "FP-008",
    name: "Shrimp Grower Pellets",
    feedType: "Grower",
    price: 2150.00,
    bagWeightKg: 25,
    quantityBags: 450,
    minStockBags: 150,
    status: "Active"
  }
];

export const INITIAL_FORMULAS: FeedFormula[] = [
  {
    code: "FC-001",
    feedProductCode: "FP-002", // Bangus Starter
    name: "Standard Bangus Starter Formula V2",
    ingredients: [
      { rawMaterialCode: "RM-001", quantityKg: 350 }, // 35% Fish Meal
      { rawMaterialCode: "RM-002", quantityKg: 220 }, // 22% Soybean Meal
      { rawMaterialCode: "RM-003", quantityKg: 180 }, // 18% Yellow Corn
      { rawMaterialCode: "RM-004", quantityKg: 120 }, // 12% Rice Bran
      { rawMaterialCode: "RM-005", quantityKg: 60 },  // 6% Wheat Gluten
      { rawMaterialCode: "RM-006", quantityKg: 30 },  // 3% Copra
      { rawMaterialCode: "RM-007", quantityKg: 15 },  // 1.5% Vit
      { rawMaterialCode: "RM-008", quantityKg: 15 },  // 1.5% Min
      { rawMaterialCode: "RM-009", quantityKg: 8 },   // 0.8% Fish Oil
      { rawMaterialCode: "RM-010", quantityKg: 2 }    // 0.2% Lysine
    ]
  },
  {
    code: "FC-002",
    feedProductCode: "FP-003", // Bangus Grower
    name: "Standard Bangus Grower Formula V1",
    ingredients: [
      { rawMaterialCode: "RM-001", quantityKg: 280 }, // 28% Fish Meal
      { rawMaterialCode: "RM-002", quantityKg: 240 }, // 24% Soybean
      { rawMaterialCode: "RM-003", quantityKg: 220 }, // 22% Corn
      { rawMaterialCode: "RM-004", quantityKg: 140 }, // 14% Rice Bran
      { rawMaterialCode: "RM-005", quantityKg: 50 },  // 5% Wheat Gluten
      { rawMaterialCode: "RM-006", quantityKg: 40 },  // 4% Copra
      { rawMaterialCode: "RM-007", quantityKg: 10 },  // 1% Vit
      { rawMaterialCode: "RM-008", quantityKg: 10 },  // 1% Min
      { rawMaterialCode: "RM-009", quantityKg: 8 },   // 0.8% Oil
      { rawMaterialCode: "RM-010", quantityKg: 2 }    // 0.2% Lysine
    ]
  },
  {
    code: "FC-003",
    feedProductCode: "FP-004", // Bangus Finisher
    name: "Standard Bangus Finisher Formula V3",
    ingredients: [
      { rawMaterialCode: "RM-001", quantityKg: 220 }, // 22% Fish Meal
      { rawMaterialCode: "RM-002", quantityKg: 240 }, // 24% Soybean
      { rawMaterialCode: "RM-003", quantityKg: 260 }, // 26% Corn
      { rawMaterialCode: "RM-004", quantityKg: 160 }, // 16% Rice Bran
      { rawMaterialCode: "RM-005", quantityKg: 40 },  // 4% Wheat Gluten
      { rawMaterialCode: "RM-006", quantityKg: 55 },  // 5.5% Copra
      { rawMaterialCode: "RM-007", quantityKg: 10 },  // 1% Vit
      { rawMaterialCode: "RM-008", quantityKg: 10 },  // 1% Min
      { rawMaterialCode: "RM-009", quantityKg: 4 },   // 0.4% Oil
      { rawMaterialCode: "RM-010", quantityKg: 1 }    // 0.1% Lysine
    ]
  },
  {
    code: "FC-004",
    feedProductCode: "FP-005", // Tilapia Fingerling
    name: "Standard Tilapia Fingerling Formula",
    ingredients: [
      { rawMaterialCode: "RM-001", quantityKg: 300 },
      { rawMaterialCode: "RM-002", quantityKg: 280 },
      { rawMaterialCode: "RM-003", quantityKg: 190 },
      { rawMaterialCode: "RM-004", quantityKg: 120 },
      { rawMaterialCode: "RM-005", quantityKg: 50 },
      { rawMaterialCode: "RM-006", quantityKg: 30 },
      { rawMaterialCode: "RM-007", quantityKg: 12 },
      { rawMaterialCode: "RM-008", quantityKg: 12 },
      { rawMaterialCode: "RM-009", quantityKg: 5 },
      { rawMaterialCode: "RM-010", quantityKg: 1 }
    ]
  }
];

export const INITIAL_BUYERS: BuyerProfile[] = [
  {
    id: "B-001",
    name: "Sarangani Aquacultures Corp.",
    fishCageName: "Cage Delta Group (Malalag)",
    address: "Bolo, Malalag, Davao del Sur",
    contactNumber: "+63 917 882 1204"
  },
  {
    id: "B-002",
    name: "Malalag Bay Marine Sanctuary Coop",
    fishCageName: "MBMSC Fish Pen Site A",
    address: "Poblacion, Malalag, Davao del Sur",
    contactNumber: "+63 920 441 5592"
  },
  {
    id: "B-003",
    name: "Davao Gulf Aqua Farms",
    fishCageName: "Tagansule Deepwater Cages",
    address: "Tagansule, Malalag, Davao del Sur",
    contactNumber: "+63 908 771 9910"
  },
  {
    id: "B-004",
    name: "San Pedro Aquaculture Ventures",
    fishCageName: "San Pedro Mariculture Farm",
    address: "San Pedro, Santa Maria, Davao del Sur",
    contactNumber: "+63 918 333 4455"
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: "C-001",
    name: "Digos Feeds & Agricultural Supply",
    address: "Rizal Avenue, Digos City, Davao del Sur",
    phone: "082-553-2940"
  },
  {
    id: "C-002",
    name: "Tagansule Coastal Feed Retailers",
    address: "Tagansule, Malalag, Davao del Sur",
    phone: "+63 945 111 8822"
  },
  {
    id: "C-003",
    name: "Padada Fish Breeders Association",
    address: "Poblacion, Padada, Davao del Sur",
    phone: "+63 928 445 9931"
  },
  {
    id: "C-004",
    name: "General Santos Fish Port Feed Outlet",
    address: "Calumpang, General Santos City",
    phone: "083-301-2294"
  }
];

// Rich 6-month historical data: Jan 2026 to Jun 2026. Current date is Jul 2026.
// Let's create realistic production batches
export const INITIAL_PRODUCTION_BATCHES: ProductionBatch[] = [
  // January 2026 (Total approx: 8200 bags)
  { batchNo: "PB-26-001", feedProductCode: "FP-002", productionDate: "2026-01-05", quantityProducedBags: 1200, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-002", feedProductCode: "FP-003", productionDate: "2026-01-12", quantityProducedBags: 2500, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-003", feedProductCode: "FP-004", productionDate: "2026-01-18", quantityProducedBags: 3000, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-004", feedProductCode: "FP-005", productionDate: "2026-01-25", quantityProducedBags: 1500, status: "Completed", rawMaterialsUsed: [] },

  // February 2026 (Total approx: 9100 bags)
  { batchNo: "PB-26-005", feedProductCode: "FP-002", productionDate: "2026-02-04", quantityProducedBags: 1500, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-006", feedProductCode: "FP-003", productionDate: "2026-02-11", quantityProducedBags: 2800, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-007", feedProductCode: "FP-004", productionDate: "2026-02-18", quantityProducedBags: 3400, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-008", feedProductCode: "FP-006", productionDate: "2026-02-24", quantityProducedBags: 1400, status: "Completed", rawMaterialsUsed: [] },

  // March 2026 (Total approx: 10400 bags)
  { batchNo: "PB-26-009", feedProductCode: "FP-002", productionDate: "2026-03-03", quantityProducedBags: 1600, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-010", feedProductCode: "FP-003", productionDate: "2026-03-10", quantityProducedBags: 3200, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-011", feedProductCode: "FP-004", productionDate: "2026-03-18", quantityProducedBags: 4200, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-012", feedProductCode: "FP-007", productionDate: "2026-03-26", quantityProducedBags: 1400, status: "Completed", rawMaterialsUsed: [] },

  // April 2026 (Total approx: 11500 bags)
  { batchNo: "PB-26-013", feedProductCode: "FP-002", productionDate: "2026-04-02", quantityProducedBags: 2000, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-014", feedProductCode: "FP-003", productionDate: "2026-04-10", quantityProducedBags: 3600, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-015", feedProductCode: "FP-004", productionDate: "2026-04-17", quantityProducedBags: 4800, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-016", feedProductCode: "FP-008", productionDate: "2026-04-24", quantityProducedBags: 1100, status: "Completed", rawMaterialsUsed: [] },

  // May 2026 (Total approx: 12800 bags)
  { batchNo: "PB-26-017", feedProductCode: "FP-002", productionDate: "2026-05-04", quantityProducedBags: 2200, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-018", feedProductCode: "FP-003", productionDate: "2026-05-12", quantityProducedBags: 4000, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-019", feedProductCode: "FP-004", productionDate: "2026-05-20", quantityProducedBags: 5200, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-020", feedProductCode: "FP-001", productionDate: "2026-05-27", quantityProducedBags: 1400, status: "Completed", rawMaterialsUsed: [] },

  // June 2026 (Total approx: 14100 bags)
  { batchNo: "PB-26-021", feedProductCode: "FP-002", productionDate: "2026-06-02", quantityProducedBags: 2400, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-022", feedProductCode: "FP-003", productionDate: "2026-06-11", quantityProducedBags: 4500, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-023", feedProductCode: "FP-004", productionDate: "2026-06-19", quantityProducedBags: 5800, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-024", feedProductCode: "FP-005", productionDate: "2026-06-25", quantityProducedBags: 1400, status: "Completed", rawMaterialsUsed: [] },

  // July 2026 (Ongoing)
  { batchNo: "PB-26-025", feedProductCode: "FP-002", productionDate: "2026-07-04", quantityProducedBags: 1100, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-026", feedProductCode: "FP-003", productionDate: "2026-07-09", quantityProducedBags: 1800, status: "Completed", rawMaterialsUsed: [] },
  { batchNo: "PB-26-027", feedProductCode: "FP-004", productionDate: "2026-07-12", quantityProducedBags: 2000, status: "Completed", rawMaterialsUsed: [] },
];

// Let's populate the raw material usage in seed batches automatically using standard formulations where matches exist
INITIAL_PRODUCTION_BATCHES.forEach(batch => {
  const matchFormula = INITIAL_FORMULAS.find(f => f.feedProductCode === batch.feedProductCode);
  if (matchFormula) {
    // Standard formulation is based on 1000kg (40 bags of 25kg). Let's scale ingredient needs.
    const multiplier = (batch.quantityProducedBags * 25) / 1000; // how many metric tons produced
    batch.rawMaterialsUsed = matchFormula.ingredients.map(ing => ({
      rawMaterialCode: ing.rawMaterialCode,
      quantityUsedKg: Math.round(ing.quantityKg * multiplier)
    }));
  } else {
    // Default fallback
    batch.rawMaterialsUsed = [
      { rawMaterialCode: "RM-001", quantityUsedKg: batch.quantityProducedBags * 8 },
      { rawMaterialCode: "RM-002", quantityUsedKg: batch.quantityProducedBags * 6 },
      { rawMaterialCode: "RM-003", quantityUsedKg: batch.quantityProducedBags * 6 },
      { rawMaterialCode: "RM-004", quantityUsedKg: batch.quantityProducedBags * 5 }
    ];
  }
});


// Distribution Records (Jan - Jun 2026)
export const INITIAL_DISTRIBUTIONS: DistributionRecord[] = [
  { id: "D-001", buyerId: "B-001", distributionDate: "2026-01-10", feedProductCode: "FP-002", quantityBags: 450, remarks: "Delivery to Cage Delta B1" },
  { id: "D-002", buyerId: "B-002", distributionDate: "2026-01-15", feedProductCode: "FP-003", quantityBags: 800, remarks: "Cooperative monthly supply" },
  { id: "D-003", buyerId: "B-003", distributionDate: "2026-01-20", feedProductCode: "FP-004", quantityBags: 1200, remarks: "Deepwater cage finisher stocking" },

  { id: "D-004", buyerId: "B-001", distributionDate: "2026-02-05", feedProductCode: "FP-002", quantityBags: 500, remarks: "Batch 2 delivery" },
  { id: "D-005", buyerId: "B-003", distributionDate: "2026-02-12", feedProductCode: "FP-003", quantityBags: 950, remarks: "Standard grower feeds" },
  { id: "D-006", buyerId: "B-004", distributionDate: "2026-02-20", feedProductCode: "FP-004", quantityBags: 1100, remarks: "San Pedro mariculture site delivery" },

  { id: "D-007", buyerId: "B-001", distributionDate: "2026-03-05", feedProductCode: "FP-002", quantityBags: 600, remarks: "Fry post-transfer starter feeds" },
  { id: "D-008", buyerId: "B-002", distributionDate: "2026-03-12", feedProductCode: "FP-003", quantityBags: 1100, remarks: "Grower feeding peak" },
  { id: "D-009", buyerId: "B-003", distributionDate: "2026-03-20", feedProductCode: "FP-004", quantityBags: 1500, remarks: "Tagansule site high demand" },

  { id: "D-010", buyerId: "B-004", distributionDate: "2026-04-05", feedProductCode: "FP-002", quantityBags: 750, remarks: "Starter feed schedule" },
  { id: "D-011", buyerId: "B-001", distributionDate: "2026-04-12", feedProductCode: "FP-003", quantityBags: 1300, remarks: "Grower feed schedule" },
  { id: "D-012", buyerId: "B-003", distributionDate: "2026-04-18", feedProductCode: "FP-004", quantityBags: 1800, remarks: "Finisher feed schedule" },

  { id: "D-013", buyerId: "B-002", distributionDate: "2026-05-08", feedProductCode: "FP-002", quantityBags: 800, remarks: "MBMSC cage expansion" },
  { id: "D-014", buyerId: "B-003", distributionDate: "2026-05-15", feedProductCode: "FP-003", quantityBags: 1400, remarks: "Tagansule site" },
  { id: "D-015", buyerId: "B-001", distributionDate: "2026-05-22", feedProductCode: "FP-004", quantityBags: 2000, remarks: "Cage Delta Harvest stage" },

  { id: "D-016", buyerId: "B-001", distributionDate: "2026-06-05", feedProductCode: "FP-002", quantityBags: 900, remarks: "Starter batch delivery" },
  { id: "D-017", buyerId: "B-002", distributionDate: "2026-06-12", feedProductCode: "FP-003", quantityBags: 1600, remarks: "Grower stock" },
  { id: "D-018", buyerId: "B-003", distributionDate: "2026-06-18", feedProductCode: "FP-004", quantityBags: 2200, remarks: "Finisher stock" },
  
  { id: "D-019", buyerId: "B-004", distributionDate: "2026-07-02", feedProductCode: "FP-003", quantityBags: 350, remarks: "Grower feeds delivery" },
  { id: "D-020", buyerId: "B-001", distributionDate: "2026-07-08", feedProductCode: "FP-004", quantityBags: 500, remarks: "Ongoing finisher supply" },
];


// Customer Sales Records (Jan - Jun 2026)
export const INITIAL_SALES: SalesRecord[] = [
  // January 2026
  { id: "S-001", customerId: "C-001", salesDate: "2026-01-08", feedProductCode: "FP-002", quantityBags: 300, unitPrice: 1080.00, totalAmount: 324000.00 },
  { id: "S-002", customerId: "C-002", salesDate: "2026-01-14", feedProductCode: "FP-003", quantityBags: 500, unitPrice: 1020.00, totalAmount: 510000.00 },
  { id: "S-003", customerId: "C-003", salesDate: "2026-01-22", feedProductCode: "FP-004", quantityBags: 600, unitPrice: 980.00, totalAmount: 588000.00 },

  // February 2026
  { id: "S-004", customerId: "C-001", salesDate: "2026-02-05", feedProductCode: "FP-002", quantityBags: 400, unitPrice: 1080.00, totalAmount: 432000.00 },
  { id: "S-005", customerId: "C-004", salesDate: "2026-02-12", feedProductCode: "FP-001", quantityBags: 200, unitPrice: 1150.00, totalAmount: 230000.00 },
  { id: "S-006", customerId: "C-002", salesDate: "2026-02-19", feedProductCode: "FP-003", quantityBags: 700, unitPrice: 1020.00, totalAmount: 714000.00 },

  // March 2026
  { id: "S-007", customerId: "C-001", salesDate: "2026-03-06", feedProductCode: "FP-002", quantityBags: 450, unitPrice: 1080.00, totalAmount: 486000.00 },
  { id: "S-008", customerId: "C-003", salesDate: "2026-03-15", feedProductCode: "FP-003", quantityBags: 800, unitPrice: 1020.00, totalAmount: 816000.00 },
  { id: "S-009", customerId: "C-002", salesDate: "2026-03-24", feedProductCode: "FP-004", quantityBags: 1000, unitPrice: 980.00, totalAmount: 980000.00 },

  // April 2026
  { id: "S-010", customerId: "C-004", salesDate: "2026-04-03", feedProductCode: "FP-001", quantityBags: 300, unitPrice: 1150.00, totalAmount: 345000.00 },
  { id: "S-011", customerId: "C-001", salesDate: "2026-04-12", feedProductCode: "FP-003", quantityBags: 900, unitPrice: 1020.00, totalAmount: 918000.00 },
  { id: "S-012", customerId: "C-002", salesDate: "2026-04-20", feedProductCode: "FP-004", quantityBags: 1200, unitPrice: 980.00, totalAmount: 1176000.00 },

  // May 2026
  { id: "S-013", customerId: "C-001", salesDate: "2026-05-04", feedProductCode: "FP-002", quantityBags: 600, unitPrice: 1080.00, totalAmount: 648000.00 },
  { id: "S-014", customerId: "C-003", salesDate: "2026-05-14", feedProductCode: "FP-003", quantityBags: 1100, unitPrice: 1020.00, totalAmount: 1122000.00 },
  { id: "S-015", customerId: "C-002", salesDate: "2026-05-22", feedProductCode: "FP-004", quantityBags: 1400, unitPrice: 980.00, totalAmount: 1372000.00 },

  // June 2026
  { id: "S-016", customerId: "C-004", salesDate: "2026-06-03", feedProductCode: "FP-001", quantityBags: 500, unitPrice: 1150.00, totalAmount: 575000.00 },
  { id: "S-017", customerId: "C-001", salesDate: "2026-06-11", feedProductCode: "FP-003", quantityBags: 1300, unitPrice: 1020.00, totalAmount: 1326000.00 },
  { id: "S-018", customerId: "C-002", salesDate: "2026-06-20", feedProductCode: "FP-004", quantityBags: 1700, unitPrice: 980.00, totalAmount: 1666000.00 },

  // July 2026
  { id: "S-019", customerId: "C-001", salesDate: "2026-07-02", feedProductCode: "FP-002", quantityBags: 200, unitPrice: 1080.00, totalAmount: 216000.00 },
  { id: "S-020", customerId: "C-003", salesDate: "2026-07-06", feedProductCode: "FP-003", quantityBags: 400, unitPrice: 1020.00, totalAmount: 408000.00 },
];


export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  facilityName: "Davao del Sur 3H AquaFeeds Manufacturing Facility",
  systemTitle: "FEEDCHAIN AquaFeeds ERP & Traceability System",
  contactEmail: "admin@feedchain.com",
  contactPhone: "+63 (082) 553-2940",
  address: "Tagansule, Malalag, Davao del Sur, Philippines",
  currency: "PHP (₱)",
  lowStockWarningThresholdPct: 15,
  sessionTimeoutMinutes: 30,
  maxLoginAttempts: 5,
  requireMFA: false,
  maintenanceMode: false,
  maintenanceMessage: "System is currently undergoing routine maintenance. Operations will resume shortly.",
  autoBackupDaily: true,
  backupRetentionDays: 30
};

export const INITIAL_ACTIVITY_LOGS: SystemActivityLog[] = [
  {
    id: "LOG-1001",
    timestamp: "2026-07-29 08:30:12",
    user: "Gabriel Dela Rosa",
    username: "superadmin",
    role: "Super Administrator",
    actionCategory: "Authentication",
    actionDetails: "User superadmin logged into portal via biometric 2FA verification",
    ipAddress: "192.168.10.5",
    status: "Success"
  },
  {
    id: "LOG-1002",
    timestamp: "2026-07-29 08:15:00",
    user: "Gabriel Dela Rosa",
    username: "superadmin",
    role: "Super Administrator",
    actionCategory: "Role & Privileges",
    actionDetails: "Updated access privileges for account U-002 (Juan Pilapil)",
    ipAddress: "192.168.10.5",
    status: "Success"
  },
  {
    id: "LOG-1003",
    timestamp: "2026-07-29 07:15:40",
    user: "Maria Clara Dela Cruz",
    username: "admin",
    role: "Administrator",
    actionCategory: "Authentication",
    actionDetails: "User admin logged into portal from Davao HQ",
    ipAddress: "192.168.10.12",
    status: "Success"
  },
  {
    id: "LOG-1004",
    timestamp: "2026-07-28 16:45:22",
    user: "Juan Pilapil",
    username: "pm",
    role: "Production Manager",
    actionCategory: "Production",
    actionDetails: "Completed batch PB-26-027 for FP-004 (Bangus Finisher Pellets - 2000 bags)",
    ipAddress: "192.168.10.45",
    status: "Success"
  },
  {
    id: "LOG-1005",
    timestamp: "2026-07-28 14:10:05",
    user: "Gabriel Dela Rosa",
    username: "superadmin",
    role: "Super Administrator",
    actionCategory: "Data Backup/Restore",
    actionDetails: "Executed full system database backup: feedchain_backup_20260728.json (2.4 MB)",
    ipAddress: "192.168.10.5",
    status: "Success"
  },
  {
    id: "LOG-1006",
    timestamp: "2026-07-27 11:20:18",
    user: "Elizabeth Lim",
    username: "elim",
    role: "Administrator",
    actionCategory: "User Management",
    actionDetails: "Activated customer profile C-004 (General Santos Fish Port Feed Outlet)",
    ipAddress: "192.168.10.88",
    status: "Success"
  },
  {
    id: "LOG-1007",
    timestamp: "2026-07-26 18:02:11",
    user: "Unknown User",
    username: "guest_tester",
    role: "Production Manager",
    actionCategory: "Authentication",
    actionDetails: "Failed login attempt for username 'guest_tester': Invalid password credential",
    ipAddress: "112.198.45.12",
    status: "Failed"
  },
  {
    id: "LOG-1008",
    timestamp: "2026-07-25 09:12:33",
    user: "Gabriel Dela Rosa",
    username: "superadmin",
    role: "Super Administrator",
    actionCategory: "System Settings",
    actionDetails: "Updated session timeout policy from 15 mins to 30 mins",
    ipAddress: "192.168.10.5",
    status: "Success"
  }
];

export const INITIAL_BACKUPS: BackupRecord[] = [
  {
    id: "BAK-2026-003",
    fileName: "feedchain_full_backup_20260728.json",
    timestamp: "2026-07-28 14:10:05",
    sizeKb: 2450,
    createdBy: "Gabriel Dela Rosa (Super Admin)",
    type: "Full System Backup",
    status: "Completed",
    notes: "Pre-audit automated routine snapshot"
  },
  {
    id: "BAK-2026-002",
    fileName: "feedchain_users_backup_20260715.json",
    timestamp: "2026-07-15 09:30:00",
    sizeKb: 320,
    createdBy: "Gabriel Dela Rosa (Super Admin)",
    type: "User Registry Backup",
    status: "Completed",
    notes: "User accounts and privilege matrix export"
  },
  {
    id: "BAK-2026-001",
    fileName: "feedchain_prod_inv_20260701.json",
    timestamp: "2026-07-01 18:00:00",
    sizeKb: 1890,
    createdBy: "Maria Clara Dela Cruz (Admin)",
    type: "Production & Inventory Backup",
    status: "Completed",
    notes: "Monthly production closing snapshot"
  }
];

// Database Setup helper to initialize LocalStorage
export function initializeLocalStorageDatabase() {
  if (!localStorage.getItem("feedchain_users")) {
    localStorage.setItem("feedchain_users", JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem("feedchain_raw_materials")) {
    localStorage.setItem("feedchain_raw_materials", JSON.stringify(INITIAL_RAW_MATERIALS));
  }
  if (!localStorage.getItem("feedchain_feed_products")) {
    localStorage.setItem("feedchain_feed_products", JSON.stringify(INITIAL_FEED_PRODUCTS));
  }
  if (!localStorage.getItem("feedchain_formulas")) {
    localStorage.setItem("feedchain_formulas", JSON.stringify(INITIAL_FORMULAS));
  }
  if (!localStorage.getItem("feedchain_buyers")) {
    localStorage.setItem("feedchain_buyers", JSON.stringify(INITIAL_BUYERS));
  }
  if (!localStorage.getItem("feedchain_customers")) {
    localStorage.setItem("feedchain_customers", JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem("feedchain_production_batches")) {
    localStorage.setItem("feedchain_production_batches", JSON.stringify(INITIAL_PRODUCTION_BATCHES));
  }
  if (!localStorage.getItem("feedchain_distributions")) {
    localStorage.setItem("feedchain_distributions", JSON.stringify(INITIAL_DISTRIBUTIONS));
  }
  if (!localStorage.getItem("feedchain_sales")) {
    localStorage.setItem("feedchain_sales", JSON.stringify(INITIAL_SALES));
  }
  if (!localStorage.getItem("feedchain_system_settings")) {
    localStorage.setItem("feedchain_system_settings", JSON.stringify(INITIAL_SYSTEM_SETTINGS));
  }
  if (!localStorage.getItem("feedchain_activity_logs")) {
    localStorage.setItem("feedchain_activity_logs", JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
  if (!localStorage.getItem("feedchain_backups")) {
    localStorage.setItem("feedchain_backups", JSON.stringify(INITIAL_BACKUPS));
  }
}

export function getDatabaseState() {
  initializeLocalStorageDatabase();
  
  let loadedUsers = JSON.parse(localStorage.getItem("feedchain_users") || "[]") as User[];
  // Guarantee superadmin account exists in user list even if old localStorage cache exists
  if (!loadedUsers.some(u => u.username.toLowerCase() === "superadmin")) {
    loadedUsers = [INITIAL_USERS[0], ...loadedUsers];
    localStorage.setItem("feedchain_users", JSON.stringify(loadedUsers));
  }

  return {
    users: loadedUsers,
    rawMaterials: JSON.parse(localStorage.getItem("feedchain_raw_materials") || "[]") as RawMaterial[],
    feedProducts: JSON.parse(localStorage.getItem("feedchain_feed_products") || "[]") as FeedProduct[],
    formulas: JSON.parse(localStorage.getItem("feedchain_formulas") || "[]") as FeedFormula[],
    buyers: JSON.parse(localStorage.getItem("feedchain_buyers") || "[]") as BuyerProfile[],
    customers: JSON.parse(localStorage.getItem("feedchain_customers") || "[]") as CustomerProfile[],
    productionBatches: JSON.parse(localStorage.getItem("feedchain_production_batches") || "[]") as ProductionBatch[],
    distributions: JSON.parse(localStorage.getItem("feedchain_distributions") || "[]") as DistributionRecord[],
    sales: JSON.parse(localStorage.getItem("feedchain_sales") || "[]") as SalesRecord[],
    systemSettings: JSON.parse(localStorage.getItem("feedchain_system_settings") || "{}") as SystemSettings,
    activityLogs: JSON.parse(localStorage.getItem("feedchain_activity_logs") || "[]") as SystemActivityLog[],
    backups: JSON.parse(localStorage.getItem("feedchain_backups") || "[]") as BackupRecord[],
  };
}

export function saveDatabaseState(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}
