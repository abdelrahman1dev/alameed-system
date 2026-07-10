"use client";

import { useEffect, useState } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";

import { Badge, Button, Checkbox, Input } from "../components/ui-lite";
import {
  getProducts,
  getProductsByCat,
  updateProduct,
  deleteProduct,
} from "../api/queries/Products";
import type { Product, ProductInput } from "@/types/api";

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: keyof Product | null;
  direction: SortDirection;
}

type Column = {
  key: keyof Product;
  label: string;
  editable: boolean;
  numeric: boolean;
};

const COLUMNS: Column[] = [
  { key: "id", label: "المعرف", editable: false, numeric: true },
  { key: "name", label: "الاسم", editable: true, numeric: false },
  { key: "sku", label: "رمز المنتج", editable: true, numeric: false },
  { key: "barcode", label: "الباركود", editable: true, numeric: false },
  { key: "quantity", label: "الكمية", editable: true, numeric: true },
  { key: "buyPrice", label: "سعر الشراء", editable: true, numeric: true },
  { key: "sellPrice", label: "سعر البيع", editable: true, numeric: true },
  { key: "brand", label: "العلامة التجارية", editable: true, numeric: false },
  { key: "manufacturer", label: "الشركة المصنعة", editable: true, numeric: false },
  { key: "carBrand", label: "ماركة السيارة", editable: true, numeric: false },
  { key: "carModel", label: "موديل السيارة", editable: true, numeric: false },
  { key: "position", label: "الموضع", editable: true, numeric: false },
];

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <>↑</>;
  if (direction === "desc") return <>↓</>;
  return <>⇅</>;
}

export default function ProductsTable({ categoryId }: { categoryId?: number }) {
  const [products, setProducts] = useState<Product[]>([]);

  const [sort, setSort] = useState<SortState>({
    column: null,
    direction: null,
  });

  const [editMode, setEditMode] = useState(false);

  const [edits, setEdits] = useState<Record<number, Partial<Record<keyof ProductInput, string | number | null>>>>({});

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [deleting, setDeleting] = useState(false);

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase().trim();

    return (
      product.name?.toLowerCase().includes(term) ||
      product.sku?.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      product.carBrand?.toLowerCase().includes(term) ||
      product.carModel?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  async function loadProducts() {
    try {
      let data;

      if (categoryId) {
        data = await getProductsByCat(categoryId);
      } else {
        data = await getProducts();
      }

      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSort(column: keyof Product) {
    if (editMode) return;

    setSort((prev) => {
      if (prev.column !== column) {
        return { column, direction: "asc" };
      }

      if (prev.direction === "asc") {
        return { column, direction: "desc" };
      }

      return { column: null, direction: null };
    });
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sort.column || !sort.direction) return 0;

    const aVal = a[sort.column];
    const bVal = b[sort.column];

    const aNum = Number(aVal);
    const bNum = Number(bVal);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sort.direction === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = String(aVal ?? "").toLowerCase();
    const bStr = String(bVal ?? "").toLowerCase();

    if (aStr < bStr) {
      return sort.direction === "asc" ? -1 : 1;
    }

    if (aStr > bStr) {
      return sort.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  function enterEditMode() {
    setEditMode(true);
    setEdits({});
    setSelected(new Set());
  }

  function cancelEdit() {
    setEditMode(false);
    setEdits({});
    setSelected(new Set());
  }

  function getCellValue(product: Product, key: keyof ProductInput) {
    return edits[product.id]?.[key] ?? product[key] ?? "";
  }

  function handleCellChange(id: number, key: keyof ProductInput, value: string) {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  }

  async function handleSave() {
    setSaving(true);

    try {
      const requests = [];

      for (const [idStr, values] of Object.entries(edits)) {
        const id = Number(idStr);

        const payload: Partial<ProductInput> = {};

        Object.entries(values).forEach(([key, value]) => {
          const typedKey = key as keyof ProductInput;
          const column = COLUMNS.find((c) => c.key === typedKey);

          if (!column) return;

          if (column.numeric) {
            if (value === "") return;
            (payload[typedKey] as number) = Number(value);
            return;
          }

          (payload[typedKey] as string | null) = value === "" ? null : String(value);
        });

        if (Object.keys(payload).length === 0) {
          continue;
        }

        requests.push(updateProduct(id, payload));
      }

      await Promise.all(requests);

      await loadProducts();

      setEditMode(false);
      setEdits({});
      setSelected(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filteredProducts.length) {
      setSelected(new Set());
      return;
    }

    setSelected(new Set(filteredProducts.map((p) => p.id)));
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;

    setDeleting(true);

    try {
      await Promise.all([...selected].map((id) => deleteProduct(id)));

      await loadProducts();

      setSelected(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 text-right">
      <h1 className="mb-6 text-3xl font-bold">{categoryId ? "منتجات القسم" : "جميع المنتجات"}</h1>

      <div className="mb-4 flex gap-2">
        <Input placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />

        {!editMode ? (
          <Button onClick={enterEditMode}>
            <Pencil className="h-4 w-4" />
            تعديل
          </Button>
        ) : (
          <>
            <Badge>تم تعديل {Object.keys(edits).length}</Badge>

            {selected.size > 0 && (
              <Button variant="destructive" onClick={handleDeleteSelected} disabled={deleting}>
                <Trash2 className="h-4 w-4" />
                حذف ({selected.size})
              </Button>
            )}

            <Button variant="outline" onClick={cancelEdit}>
              <X className="h-4 w-4" />
              إلغاء
            </Button>

            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <caption className="p-3 text-muted-foreground text-xs">جدول المنتجات</caption>

          <thead>
            <tr className="border-b bg-gray-50">
              {editMode && (
                <th className="p-3 text-right">
                  <Checkbox
                    checked={products.length > 0 && selected.size === products.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
              )}

              {COLUMNS.map((col) => (
                <th key={col.key} className="p-3 text-right font-medium">
                  <button
                    type="button"
                    disabled={editMode}
                    onClick={() => handleSort(col.key)}
                    className="inline-flex items-center gap-1 disabled:cursor-default"
                  >
                    {col.label}{" "}
                    {!editMode && <SortIcon direction={sort.column === col.key ? sort.direction : null} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                {editMode && (
                  <td className="p-3">
                    <Checkbox checked={selected.has(product.id)} onCheckedChange={() => toggleSelect(product.id)} />
                  </td>
                )}

                <td className="p-3">{product.id}</td>

                {COLUMNS.slice(1).map((col) => (
                  <td key={col.key} className="p-3">
                    {editMode ? (
                      <Input
                        type={col.numeric ? "number" : "text"}
                        value={getCellValue(product, col.key as keyof ProductInput)}
                        onChange={(e) => handleCellChange(product.id, col.key as keyof ProductInput, e.target.value)}
                      />
                    ) : col.key === "buyPrice" ? (
                      `${product.buyPrice ?? 0} EGP`
                    ) : col.key === "sellPrice" ? (
                      `${product.sellPrice ?? 0} EGP`
                    ) : (
                      (product[col.key] ?? "-")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}