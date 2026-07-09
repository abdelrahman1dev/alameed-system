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

export type DashboardStats = {
  productCount: number;
  lowStockCount: number;
  salesTotal: number;
  purchasesTotal: number;
  recentSales: Sale[];
  recentPurchases: Purchase[];
  lowStockProducts: Product[];
};
