"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { Product } from "../types/products";
import { getProducts } from "../api/queries/Products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSale } from "../api/queries/sale";

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

import SaleProductCard from "../components/sales/SaleProductCard";

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

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [today, setToday] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      productId: null,
      quantity: 1,
    },
  ]);

  useEffect(() => {
    setInvoiceNumber(`INV-${Date.now()}`);
    setToday(new Date().toLocaleDateString("ar-EG"));
  }, []);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }
    load();
  }, []);

  // selectedIds now excludes null values properly (already did, kept as-is)
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
    try {
      const salePayload = {
        type: saleType,
        customerName: saleType === "customer" ? customerName : null,
        customerPhone: saleType === "customer" ? customerPhone : null,
        discount,
        subtotal,
        total,
        notes,
      };

      const itemsPayload = items
        .filter((i) => i.productId)
        .map((i) => ({
          productId: i.productId!,
          quantity: i.quantity,
        }));

      const result = await createSale(salePayload,itemsPayload,);
      console.log(result);
      setReceiptOpen(false);
    } catch (error) {
      console.error(error);
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

  const canSave =
    items.some((i) => i.productId) &&
    (saleType === "customer" ? customerName.trim() !== "" : true);

  // Bug fix 3: error handling for print
  const handlePrint = async () => {
    try {
      const success = await window.api.invoice.print();
      if (success) {
        console.log("printed");
      }
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
            // Bug fix 1: exclude current item's own productId from selectedIds
            // so the current row can still display/select its own product
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
              {/* Bug fix 2: clamp discount to >= 0 */}
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

              <Button className="w-full" onClick={handleSaveSale}>حفظ بقاعدة البيانات</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
