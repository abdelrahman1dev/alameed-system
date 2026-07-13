import { getEmployeePerformance } from "./reports/employees";

import {
  getFinancialSummary,
  getMonthlyChart,
  ReportFilters,
} from "./reports/financial";

import {
  getInventoryReport,
  getLowStockProducts,
  getProductProfitability,
} from "./reports/inventory";

import { getInventoryMovements } from "./reports/movments";

import {
  getPurchaseHistory,
  getPurchaseSummary,
  getSupplierReport,
  getTopPurchasedProducts,
} from "./reports/purchase";

import {
  getBestSellingProducts,
  getCustomerReport,
  getRecentSales,
  getSalesHistory,
  getSalesSummary,
} from "./reports/sales";

export interface ReportsDashboard {

  summary: Awaited<
    ReturnType<typeof getFinancialSummary>
  >;

  monthly: Awaited<
    ReturnType<typeof getMonthlyChart>
  >;

  inventory: Awaited<
    ReturnType<typeof getInventoryReport>
  >;

  profitability: Awaited<
    ReturnType<typeof getProductProfitability>
  >;

  lowStock: Awaited<
    ReturnType<typeof getLowStockProducts>
  >;

  bestSelling: Awaited<
    ReturnType<typeof getBestSellingProducts>
  >;

  topPurchased: Awaited<
    ReturnType<typeof getTopPurchasedProducts>
  >;

  customers: Awaited<
    ReturnType<typeof getCustomerReport>
  >;

  suppliers: Awaited<
    ReturnType<typeof getSupplierReport>
  >;

  employees: Awaited<
    ReturnType<typeof getEmployeePerformance>
  >;

  recentSales: Awaited<
    ReturnType<typeof getRecentSales>
  >;

  salesHistory: Awaited<
    ReturnType<typeof getSalesHistory>
  >;

  purchaseHistory: Awaited<
    ReturnType<typeof getPurchaseHistory>
  >;

  salesSummary: Awaited<
    ReturnType<typeof getSalesSummary>
  >;

  purchaseSummary: Awaited<
    ReturnType<typeof getPurchaseSummary>
  >;

  movements: Awaited<
    ReturnType<typeof getInventoryMovements>
  >;

}

export async function getReportsDashboard(
  filters: ReportFilters = {},
): Promise<ReportsDashboard> {

  const [

    summary,

    monthly,

    inventory,

    profitability,

    lowStock,

    bestSelling,

    topPurchased,

    customers,

    suppliers,

    employees,

    recentSales,

    salesHistory,

    purchaseHistory,

    salesSummary,

    purchaseSummary,

    movements,

  ] = await Promise.all([

    getFinancialSummary(filters),

    getMonthlyChart(filters),

    getInventoryReport(),

    getProductProfitability(),

    getLowStockProducts(),

    getBestSellingProducts(),

    getTopPurchasedProducts(),

    getCustomerReport(),

    getSupplierReport(),

    getEmployeePerformance(),

    getRecentSales(),

    getSalesHistory(),

    getPurchaseHistory(),

    getSalesSummary(),

    getPurchaseSummary(),

    getInventoryMovements(),

  ]);

  return {

    summary,

    monthly,

    inventory,

    profitability,

    lowStock,

    bestSelling,

    topPurchased,

    customers,

    suppliers,

    employees,

    recentSales,

    salesHistory,

    purchaseHistory,

    salesSummary,

    purchaseSummary,

    movements,

  };

}