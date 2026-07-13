"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  NativeSelect,
  Textarea,
} from "../../../components/ui-lite";
import type { Category, ProductInput } from "@/types/api";

const initialForm: ProductInput = {
  name: "",
  sku: "",
  barcode: "",
  quantity: 0,
  buyPrice: 0,
  sellPrice: 0,
  brand: "",
  manufacturer: "",
  carBrand: "",
  carModel: "",
  position: "",
  oemNumber: "",
  alternateNumber: "",
  categoryId: null,
  notes: "",
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      setCategories(await window.api.categories.getAll());
    }

    void loadCategories();
  }, []);

  function updateField<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    console.log("Submit clicked");

    if (!form.name.trim() || !form.sku.trim()) {
      toast.error("اسم المنتج و SKU مطلوبان");
      return;
    }

    if (form.quantity < 0 || form.buyPrice < 0 || form.sellPrice < 0) {
      toast.error("تأكد من الكمية والأسعار");
      return;
    }

    setSaving(true);

    try {
      await window.api.products.create({
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim(),
      });

      toast.success("تمت إضافة المنتج");
      router.push("/products/allProd");
    } catch (error) {
      console.error(error);
      toast.error("تعذر إضافة المنتج. تأكد من عدم تكرار SKU");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div dir="rtl" className="mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>إضافة منتج جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="اسم المنتج" value={form.name} onChange={(value) => updateField("name", value)} required />
              <Field label="SKU" value={form.sku} onChange={(value) => updateField("sku", value)} required />
              <Field label="الباركود" value={form.barcode ?? ""} onChange={(value) => updateField("barcode", value)} />
              <Field
                label="الكمية"
                type="number"
                value={form.quantity}
                onChange={(value) => updateField("quantity", Number(value))}
              />
              <Field
                label="سعر الشراء"
                type="number"
                value={form.buyPrice}
                onChange={(value) => updateField("buyPrice", Number(value))}
              />
              <Field
                label="سعر البيع"
                type="number"
                value={form.sellPrice}
                onChange={(value) => updateField("sellPrice", Number(value))}
              />
              <Field label="الماركة" value={form.brand ?? ""} onChange={(value) => updateField("brand", value)} />
              <Field
                label="الشركة المصنعة"
                value={form.manufacturer ?? ""}
                onChange={(value) => updateField("manufacturer", value)}
              />
              <Field label="ماركة السيارة" value={form.carBrand ?? ""} onChange={(value) => updateField("carBrand", value)} />
              <Field label="موديل السيارة" value={form.carModel ?? ""} onChange={(value) => updateField("carModel", value)} />
              <Field label="المكان" value={form.position ?? ""} onChange={(value) => updateField("position", value)} />
              <Field label="رقم OEM" value={form.oemNumber ?? ""} onChange={(value) => updateField("oemNumber", value)} />
              <Field
                label="رقم بديل"
                value={form.alternateNumber ?? ""}
                onChange={(value) => updateField("alternateNumber", value)}
              />

              <div className="space-y-2">
                <Label>التصنيف</Label>
                <NativeSelect
                  value={form.categoryId ?? ""}
                  onChange={(value) => updateField("categoryId", Number(value) || null)}
                >
                  <option value="">بدون تصنيف</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-2">
              <Label>ملاحظات</Label>
              <Textarea value={form.notes ?? ""} onChange={(event) => updateField("notes", event.target.value)} />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50"
            >
              {saving ? "جاري الحفظ..." : "حفظ المنتج"}

            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}