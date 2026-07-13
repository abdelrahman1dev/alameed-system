export { };

import type {
  Category,
  DashboardStats,
  InventoryMovement,
  InventoryReport,
  Product,
  ProductInput,
  Purchase,
  PurchaseHistory,
  PurchaseInput,
  PurchaseItemInput,
  ReportFilters,
  ReportsDashboard,
  Sale,
  SaleHistory,
  SaleInput,
  SaleItemInput,
  UserSession,
} from "./api";

declare global {
  interface Window {
    api: {
      // products

      products: {
        getAll: () => Promise<Product[]>;
        export: () => Promise;
        create: (data: ProductInput) => Promise<Product>;
        update: (id: number, data: Partial<ProductInput>) => Promise<Product | null>;
        delete: (id: number) => Promise<Product | null>;
        getByCategory: (id: number) => Promise<Product[]>;
      };

      //print

      invoice: {
        print: () => Promise<boolean>;
      };

      // sales
      sales: {
        create: (sale: SaleInput, items: SaleItemInput[]) => Promise<Sale>;
      };

      // purchases
      purchases: {
        getAll: () => Promise<Purchase[]>;
        getById: (id: number) => Promise<Purchase | null>;
        create: (purchase: PurchaseInput, items: PurchaseItemInput[]) => Promise<Purchase>;
      };
      auth: {
        login: (username: string, password: string) => Promise<UserSession | null>;

        getSession: () => Promise<UserSession | null>;

        logout: () => Promise<boolean>;
      };
      categories: {
        getAll: () => Promise<Category[]>;
        create: (data: Omit<Category, "id">) => Promise<Category>;
        delete: (id: number) => Promise<Category | null>;
      };
      dashboard: {
        getStats: () => Promise<DashboardStats>;
      };
      reports: {

        getDashboard(
          filters?: ReportFilters,
        ): Promise<ReportsDashboard>;

        getInventory():
          Promise<InventoryReport[]>;

        getMovements():
          Promise<InventoryMovement[]>;

        getSalesHistory():
          Promise<SaleHistory[]>;

        getPurchaseHistory():
          Promise<PurchaseHistory[]>;
      },
      backup: {
        create: () => Promise;
        restore: () => Promise;
      }
    };
  }
}
