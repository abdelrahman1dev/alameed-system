export interface ReportFilters {
  from?: string;
  to?: string;
  employeeId?: number;
  productId?: number;
  categoryId?: number;
}

export interface ReportsDashboard {
  summary: unknown;
  monthly: unknown[];
  inventory: unknown[];
  bestSelling: unknown[];
  profitability: unknown[];
  employees: unknown[];
  suppliers: unknown[];
  customers: unknown[];
  lowStock: unknown[];
  movements: unknown[];
}
