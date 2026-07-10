"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, NativeSelect } from "../../components/ui-lite";
import type { Product } from "@/types/api";

type InvoiceItem = {
  id: number;
  productId: number | null;
  quantity: number;
  unitPrice: number;
};

const suppliers = ["المورد الرئيسي", "مورد قطع الغيار", "مورد الزيوت", "مورد خارجي"];

export default function PurchasesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierName, setSupplierName] = useState(suppliers[0]);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, productId: null, quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(await window.api.products.getAll());
      } catch (error) {
        console.error(error);
        toast.error("تعذر تحميل المنتجات");
      }
    }

    void loadProducts();
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  const canSave = supplierName.trim() !== "" && items.some((item) => item.productId);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), productId: null, quantity: 1, unitPrice: 0 },
    ]);
  }

  function updateItem(id: number, data: Partial<InvoiceItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
  }

  function removeItem(id: number) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSave() {
    if (!canSave || saving) return;

    const purchaseItems = items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId!,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

    if (purchaseItems.some((item) => item.quantity <= 0 || item.unitPrice < 0)) {
      toast.error("تأكد من الكميات والأسعار");
      return;
    }

    setSaving(true);

    try {
      await window.api.purchases.create(
        { supplierName: supplierName.trim(), totalAmount: total },
        purchaseItems,
      );

      toast.success("تم حفظ فاتورة الشراء وتحديث المخزون");
      setItems([{ id: 1, productId: null, quantity: 1, unitPrice: 0 }]);
      setProducts(await window.api.products.getAll());
    } catch (error) {
      console.error(error);
      toast.error("تعذر حفظ فاتورة الشراء");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">فاتورة شراء</h1>
        <p className="text-muted-foreground">أضف المنتجات المشتراة وسيتم تحديث المخزون تلقائياً.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات المورد</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>اختيار مورد سريع</Label>
            <NativeSelect value={supplierName} onChange={setSupplierName}>
              {suppliers.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>اسم المورد</Label>
            <Input value={supplierName} onChange={(event) => setSupplierName(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الأصناف</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => {
            const selectedProduct = products.find((product) => product.id === item.productId);

            return (
              <div key={item.id} className="grid gap-3 rounded-xl border p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                <div className="space-y-2">
                  <Label>المنتج {index + 1}</Label>
                  <NativeSelect
                    value={item.productId ?? ""}
                    onChange={(value) => {
                      const productId = Number(value) || null;
                      const product = products.find((entry) => entry.id === productId);
                      updateItem(item.id, {
                        productId,
                        unitPrice: product?.buyPrice ?? 0,
                      });
                    }}
                  >
                    <option value="">اختر منتج</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.sku}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-2">
                  <Label>المخزون الحالي</Label>
                  <Input disabled value={selectedProduct?.quantity ?? "-"} />
                </div>

                <div className="space-y-2">
                  <Label>الكمية</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateItem(item.id, { quantity: Math.max(1, Number(event.target.value)) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>سعر الشراء</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) => updateItem(item.id, { unitPrice: Math.max(0, Number(event.target.value)) })}
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  className="self-end"
                  disabled={items.length === 1}
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          <Button type="button" variant="outline" className="w-full" onClick={addItem}>
            <Plus className="h-4 w-4" />
            إضافة صنف
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-muted-foreground">إجمالي الفاتورة</p>
            <p className="text-3xl font-bold">{total} EGP</p>
          </div>

          <Button disabled={!canSave || saving} onClick={handleSave} className="min-w-48">
            {saving ? "جاري الحفظ..." : "حفظ فاتورة الشراء"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}