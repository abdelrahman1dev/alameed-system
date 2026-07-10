"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";

import { Badge, Button, Card, CardContent, Combobox, Input, Label } from "../../components/ui-lite";
import { Product } from "@/app/types/products";

type InvoiceItem = {
  id: number;
  productId: number | null;
  quantity: number;
};

type Props = {
  index: number;
  item: InvoiceItem;
  products: Product[];
  selectedIds: (number | null)[];
  updateItem: (id: number, data: Partial<InvoiceItem>) => void;
  removeProduct: (id: number) => void;
};

export default function SaleProductCard({
  index,
  item,
  products,
  selectedIds,
  updateItem,
  removeProduct,
}: Props) {
  const selectedProduct = useMemo(() => {
    return products.find((product) => product.id === item.productId);
  }, [products, item]);

  // prevent duplicates
  const availableProducts = products.filter(
    (product) => !selectedIds.includes(product.id) || product.id === item.productId,
  );

  const comboOptions = availableProducts.map((product) => ({
    value: product.id,
    label: product.name,
    disabled: product.quantity === 0,
  }));

  const stockStatus = selectedProduct
    ? selectedProduct.quantity === 0
      ? "نفد"
      : selectedProduct.quantity <= 5
        ? "منخفض"
        : "متوفر"
    : "";

  const lineTotal = selectedProduct ? selectedProduct.sellPrice * item.quantity : 0;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">المنتج {index + 1}</h2>

          <Button
            variant="destructive"
            size="icon"
            disabled={index === 0}
            onClick={() => removeProduct(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Product selector */}
        <div className="space-y-2">
          <Label>اختر المنتج</Label>

          <Combobox
            value={item.productId}
            options={comboOptions}
            placeholder="ابحث عن منتج"
            emptyText="لا يوجد نتائج"
            onSelect={(productId) => {
              updateItem(item.id, {
                productId,
                quantity: 1,
              });
            }}
          />
        </div>

        {/* Product info */}
        {selectedProduct && (
          <>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>SKU</Label>
                <Input disabled value={selectedProduct.sku} />
              </div>

              <div>
                <Label>المخزون</Label>
                <Input disabled value={selectedProduct.quantity} />
              </div>

              <div>
                <Label>سعر الوحدة</Label>
                <Input disabled value={selectedProduct.sellPrice} />
              </div>

              <div className="space-y-2">
                <Label>الحالة</Label>
                <Badge className="w-full justify-center py-2">{stockStatus}</Badge>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>الكمية المطلوبة</Label>

              <Input
                type="number"
                min={1}
                max={selectedProduct.quantity}
                value={item.quantity}
                onChange={(e) => {
                  let value = Number(e.target.value);

                  if (value < 1) {
                    value = 1;
                  }

                  if (value > selectedProduct.quantity) {
                    value = selectedProduct.quantity;
                  }

                  updateItem(item.id, {
                    quantity: value,
                  });
                }}
              />
            </div>

            {/* Item total */}
            <div className="border rounded-lg p-4 flex justify-between items-center text-lg font-semibold">
              <span>إجمالي هذا المنتج</span>
              <span>
                {item.quantity}
                {" × "}
                {selectedProduct.sellPrice}
                {" = "}
                {lineTotal}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}