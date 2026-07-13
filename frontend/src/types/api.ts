export type UserRole = "admin" | "manager" | "employee";

export type UserSession = {
  id: number;
  username: string;
  role: UserRole;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  barcode: string | null;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  brand: string | null;
  manufacturer: string | null;
  carBrand: string | null;
  carModel: string | null;
  position: string | null;
  oemNumber: string | null;
  alternateNumber: string | null;
  categoryId: number | null;
  notes: string | null;
};

export type ProductInput = Omit<Product, "id">;

export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type SaleInput = {
  customerName?: string | null;
  totalAmount: number;
};

export type SaleItemInput = {
  productId: number;
  quantity: number;
};

export type Sale = {
  id: number;
  customerName: string | null;
  totalAmount: number;
  soldAt: string;
  createdBy: number | null;
};

export type PurchaseInput = {
  supplierName: string;
  totalAmount: number;
};

export type PurchaseItemInput = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

export type Purchase = {
  id: number;
  supplierName: string;
  totalAmount: number;
  purchasedAt: string;
  createdBy: number | null;
};

export type ReportFilters = {
  from?: string;
  to?: string;
};

export type FinancialSummary = {
  productCount: number;
  lowStockCount: number;
  totalSales: number;
  totalPurchases: number;
  grossProfit: number;
  inventoryValue: number;
  expectedProfit: number;
};

export type MonthlyFinancial = {
  month: string;
  sales: number;
  purchases: number;
  profit: number;
};

export type InventoryReport = {
  id: number;
  name: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  inventoryValue: number;
  expectedProfit: number;
  status: "منخفض" | "متوسط" | "جيد";
};

export type LowStockProduct = {
  id: number;
  name: string;
  quantity: number;
};

export type BestSellingProduct = {
  id: number;
  name: string;
  sold: number;
  revenue: number;
};

export type ProductProfitability = {
  id: number;
  name: string;
  sold: number;
  revenue: number;
  estimatedCost: number;
  profit: number;
  margin: number;
};

export type CustomerReport = {
  customerName: string;
  invoices: number;
  revenue: number;
};

export type SupplierReport = {
  supplierName: string;
  invoices: number;
  totalAmount: number;
};

export type EmployeePerformance = {
  id: number;
  username: string;
  salesCount: number;
  salesValue: number;
  purchasesCount: number;
  purchasesValue: number;
  totalTransactions: number;
};

export type SaleHistory = {
  id: number;
  customerName: string;
  employee: string | null;
  totalAmount: number;
  soldAt: string;
};

export type PurchaseHistory = {
  id: number;
  supplierName: string;
  employee: string | null;
  totalAmount: number;
  purchasedAt: string;
};

export type SalesSummary = {
  invoices: number;
  totalRevenue: number;
  averageInvoice: number;
};

export type PurchaseSummary = {
  invoices: number;
  totalPurchases: number;
  averageInvoice: number;
};

export type InventoryMovement = {
  id: string;
  type: "purchase" | "sale";
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierOrCustomer: string;
  employee: string | null;
  date: string;
};

export type TopPurchasedProduct = {
  id: number;
  name: string;
  quantity: number;
  totalCost: number;
};

export type ReportsDashboard = {
  summary: FinancialSummary;
  monthly: MonthlyFinancial[];
  inventory: InventoryReport[];
  profitability: ProductProfitability[];
  lowStock: LowStockProduct[];
  bestSelling: BestSellingProduct[];
  topPurchased: TopPurchasedProduct[];
  customers: CustomerReport[];
  suppliers: SupplierReport[];
  employees: EmployeePerformance[];
  recentSales: SaleHistory[];
  salesHistory: SaleHistory[];
  purchaseHistory: PurchaseHistory[];
  salesSummary: SalesSummary;
  purchaseSummary: PurchaseSummary;
  movements: InventoryMovement[];
};

export type DashboardStats = {
  productCount: number;
  lowStockCount: number;
  salesTotal: number;
  purchasesTotal: number;
  recentSales: Sale[];
  recentPurchases: Purchase[];
  lowStockProducts: Product[];
};
