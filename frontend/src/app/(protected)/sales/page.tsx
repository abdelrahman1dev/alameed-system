"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { Product } from "../../types/products";
import { getProducts } from "../../api/queries/Products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSale } from "../../api/queries/sale";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SaleProductCard from "../../components/sales/SaleProductCard";

type InvoiceItem = {
  id: number;
  productId: number | null;
  quantity: number;
};

type SaleType = "center" | "customer";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);

  const [saleType, setSaleType] = useState<SaleType>("center");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [invoiceSeq, setInvoiceSeq] = useState(1);
  const [today] = useState(() => new Date().toLocaleDateString("ar-EG"));
  const invoiceNumber = `INV-${invoiceSeq.toString().padStart(5, "0")}`;

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      productId: null,
      quantity: 1,
    },
  ]);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }
    load();
  }, []);

  const selectedIds = items
    .map((i) => i.productId)
    .filter((id): id is number => id !== null);

  const addProduct = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        productId: null,
        quantity: 1,
      },
    ]);
  };

  async function handleSaveSale() {
    if (!canSave || saving) return;

    setSaving(true);

    try {
      const salePayload = {
        customerName: saleType === "customer" ? customerName : null,
        totalAmount: total,
      };

      const itemsPayload = items
        .filter((i) => i.productId)
        .map((i) => ({
          productId: i.productId!,
          quantity: i.quantity,
        }));

      await createSale(salePayload, itemsPayload);

      toast.success("تم حفظ فاتورة البيع وتحديث المخزون");
      setItems([{ id: 1, productId: null, quantity: 1 }]);
      setCustomerName("");
      setCustomerPhone("");
      setDiscount(0);
      setNotes("");
      setInvoiceSeq((value) => value + 1);
      setProducts(await getProducts());
      setReceiptOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "تعذر حفظ فاتورة البيع");
    } finally {
      setSaving(false);
    }
  }

  const removeProduct = (id: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, data: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
            }
          : item,
      ),
    );
  };

  const subtotal = items.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return acc;
    return acc + product.sellPrice * item.quantity;
  }, 0);

  const total = Math.max(subtotal - discount, 0);
  const profit = items.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return acc;
    return acc + (product.sellPrice - product.buyPrice) * item.quantity;
  }, 0) - discount;

  const canSave =
    items.some((i) => i.productId) &&
    (saleType === "customer" ? customerName.trim() !== "" : true);

  const handlePrint = async () => {
    try {
      const success = await window.api.invoice.print();
      if (!success) toast.error("تعذرت الطباعة");
    } catch (err) {
      console.error("Print failed:", err);
    }
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إنشاء فاتورة بيع</h1>
          <p className="text-muted-foreground">{invoiceNumber}</p>
        </div>

        <Badge variant="outline">
          <Calendar />
          {today}
        </Badge>
      </div>

      {/* header */}
      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>نوع البيع</Label>

            <Select
              value={saleType}
              onValueChange={(value) => {
                setSaleType(value as SaleType);
                setCustomerName("");
                setCustomerPhone("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="center">البيع للمركز</SelectItem>
                <SelectItem value="customer">البيع لعميل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {saleType === "customer" && (
            <>
              <div className="space-y-2">
                <Label>اسم العميل</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* products */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <SaleProductCard
            key={item.id}
            index={index}
            item={item}
            products={products}
            selectedIds={selectedIds.filter((id) => id !== item.productId)}
            updateItem={updateItem}
            removeProduct={removeProduct}
          />
        ))}

        <Button variant="outline" className="w-full h-12" onClick={addProduct}>
          <Plus />
          إضافة منتج
        </Button>
      </div>

      {/* footer */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الخصم</Label>
              <Input
                type="number"
                min={0}
                value={discount}
                onChange={(e) =>
                  setDiscount(Math.max(0, Number(e.target.value)))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>ملاحظات</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t pt-5 space-y-3">
            <div className="flex justify-between text-xl">
              <span>الإجمالي قبل الخصم</span>
              <span>{subtotal}</span>
            </div>

            <div className="flex justify-between text-3xl font-bold">
              <span>الإجمالي النهائي</span>
              <span>{total}</span>
            </div>
            <div className="flex justify-between text-lg text-green-700">
              <span>الربح المتوقع</span>
              <span>{profit}</span>
            </div>
          </div>

          <Button
            className="w-full h-12 text-lg"
            disabled={!canSave}
            onClick={() => setReceiptOpen(true)}
          >
            حفظ العملية
          </Button>
        </CardContent>
      </Card>

      {/* receipt */}
      <div id="receipt">
        <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
          <DialogContent dir="rtl" className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>معاينة الفاتورة</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{invoiceNumber}</span>
                <span>{today}</span>
              </div>

              {saleType === "customer" && (
                <div className="text-sm space-y-1">
                  <div>العميل: {customerName || "-"}</div>
                  <div>الهاتف: {customerPhone || "-"}</div>
                </div>
              )}

              <div className="border rounded-md divide-y">
                {items
                  .filter((item) => item.productId)
                  .map((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId,
                    );
                    if (!product) return null;
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between p-3 text-sm"
                      >
                        <span>{product.name}</span>
                        <span>
                          {item.quantity} × {product.sellPrice} ={" "}
                          {item.quantity * product.sellPrice}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {notes && (
                <div className="text-sm">
                  <span className="font-medium">ملاحظات: </span>
                  {notes}
                </div>
              )}

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>الإجمالي قبل الخصم</span>
                  <span>{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الخصم</span>
                  <span>{discount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي النهائي</span>
                  <span>{total}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePrint}
              >
                طباعة
              </Button>

              <Button className="w-full" onClick={handleSaveSale} disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ بقاعدة البيانات"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
