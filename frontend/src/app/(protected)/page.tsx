"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Package, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types/api";
import Menu from "./sections/Menu";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setStats(await window.api.dashboard.getStats());
      } catch (error) {
        console.error(error);
        toast.error("تعذر تحميل بيانات لوحة التحكم");
      }
    }

    void loadStats();
  }, []);

  if (!stats) {
    return <div className="p-8">جاري تحميل لوحة التحكم...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة سريعة على المبيعات والمخزون.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="المنتجات" value={stats.productCount} icon={<Package />} />
        <Metric title="إجمالي المبيعات" value={`${stats.salesTotal} EGP`} icon={<ShoppingCart />} />
        <Metric title="إجمالي المشتريات" value={`${stats.purchasesTotal} EGP`} icon={<Truck />} />
        <Metric title="مخزون منخفض" value={stats.lowStockCount} icon={<AlertTriangle />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>منتجات منخفضة المخزون</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground">لا توجد منتجات منخفضة المخزون.</p>
            ) : (
              stats.lowStockProducts.map((product) => (
                <Link key={product.id} href="/products/allProd" className="flex justify-between rounded-lg border p-3 hover:bg-muted">
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.quantity}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر النشاط</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...stats.recentSales.map((sale) => ({ label: `بيع إلى ${sale.customerName ?? "عميل نقدي"}`, amount: sale.totalAmount })),
              ...stats.recentPurchases.map((purchase) => ({ label: `شراء من ${purchase.supplierName}`, amount: purchase.totalAmount }))]
              .slice(0, 6)
              .map((activity, index) => (
                <div key={`${activity.label}-${index}`} className="flex justify-between rounded-lg border p-3">
                  <span>{activity.label}</span>
                  <span>{activity.amount} EGP</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <Menu />
    </div>
  );
}

function Metric({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-xl bg-blue-100 p-3 text-blue-700">{icon}</div>
      </CardContent>
    </Card>
  );
}
