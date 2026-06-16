"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialForm = {
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
  categoryId: "",
  notes: "",
};

type FormState = typeof initialForm;
type FormErrors = Partial<Record<keyof FormState, string>>;

export default function AddProductPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));

    // clear error for this field as the user edits it
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "اسم المنتج مطلوب";
    if (!form.sku.trim()) newErrors.sku = "SKU مطلوب";

    if (Number(form.quantity) < 0)
      newErrors.quantity = "الكمية غير صالحة";

    if (Number(form.buyPrice) < 0)
      newErrors.buyPrice = "سعر الشراء غير صالح";

    if (Number(form.sellPrice) < 0)
      newErrors.sellPrice = "سعر البيع غير صالح";

    if (
      form.sellPrice !== 0 &&
      form.buyPrice !== 0 &&
      Number(form.sellPrice) < Number(form.buyPrice)
    ) {
      newErrors.sellPrice = "سعر البيع أقل من سعر الشراء";
    }

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("يرجى تصحيح الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      await window.api.products.create({
        name: form.name.trim(),
        sku: form.sku.trim(),
        barcode: form.barcode.trim(),
        quantity: Number(form.quantity),
        buyPrice: Number(form.buyPrice),
        sellPrice: Number(form.sellPrice),
        brand: form.brand.trim(),
        manufacturer: form.manufacturer.trim(),
        carBrand: form.carBrand.trim(),
        carModel: form.carModel.trim(),
        position: form.position.trim(),
        oemNumber: form.oemNumber.trim(),
        alternateNumber: form.alternateNumber.trim(),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        notes: form.notes.trim(),
      });

      toast.success("تمت إضافة المنتج بنجاح");
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما أثناء إضافة المنتج للمخزون");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div dir="rtl" className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>إضافة منتج جديد</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="اسم المنتج"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <Field
                label="SKU"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                error={errors.sku}
                required
              />

              <Field
                label="الباركود"
                name="barcode"
                value={form.barcode}
                onChange={handleChange}
              />

              <Field
                label="الكمية"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                error={errors.quantity}
                min={0}
              />

              <Field
                label="سعر الشراء"
                type="number"
                name="buyPrice"
                value={form.buyPrice}
                onChange={handleChange}
                error={errors.buyPrice}
                min={0}
                step="0.01"
              />

              <Field
                label="سعر البيع"
                type="number"
                name="sellPrice"
                value={form.sellPrice}
                onChange={handleChange}
                error={errors.sellPrice}
                min={0}
                step="0.01"
              />

              <Field
                label="الماركة"
                name="brand"
                value={form.brand}
                onChange={handleChange}
              />

              <Field
                label="الشركة المصنعة"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
              />

              <Field
                label="ماركة السيارة"
                name="carBrand"
                value={form.carBrand}
                onChange={handleChange}
              />

              <Field
                label="موديل السيارة"
                name="carModel"
                value={form.carModel}
                onChange={handleChange}
              />

              <Field
                label="المكان"
                name="position"
                value={form.position}
                onChange={handleChange}
              />

              <Field
                label="رقم OEM"
                name="oemNumber"
                value={form.oemNumber}
                onChange={handleChange}
              />

              <Field
                label="رقم بديل"
                name="alternateNumber"
                value={form.alternateNumber}
                onChange={handleChange}
              />

              <Field
                label="القسم"
                name="categoryId"
                type="number"
                value={form.categoryId}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جارٍ الإضافة..." : "إضافة المنتج"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  error?: string;
  required?: boolean;
  min?: number;
  step?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  required,
  min,
  step,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        min={min}
        step={step}
        aria-invalid={!!error}
        className={error ? "border-destructive" : undefined}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}