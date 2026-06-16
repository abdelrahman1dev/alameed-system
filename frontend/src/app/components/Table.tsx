"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";

import { Pencil, Save, Trash2, X } from "lucide-react";

import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "../api/queries/Products";

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

const COLUMNS = [
  { key: "id", label: "ID", editable: false, numeric: true },

  { key: "name", label: "Name", editable: true, numeric: false },

  { key: "sku", label: "SKU", editable: true, numeric: false },

  { key: "barcode", label: "Barcode", editable: true, numeric: false },

  { key: "quantity", label: "Quantity", editable: true, numeric: true },

  { key: "buyPrice", label: "Buy Price", editable: true, numeric: true },

  { key: "sellPrice", label: "Sell Price", editable: true, numeric: true },

  { key: "brand", label: "Brand", editable: true, numeric: false },

  {
    key: "manufacturer",
    label: "Manufacturer",
    editable: true,
    numeric: false,
  },

  { key: "carBrand", label: "Car Brand", editable: true, numeric: false },

  { key: "carModel", label: "Car Model", editable: true, numeric: false },

  { key: "position", label: "Position", editable: true, numeric: false },
];

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <>↑</>;

  if (direction === "desc") return <>↓</>;

  return <>⇅</>;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<any[]>([]);

  const [sort, setSort] = useState<SortState>({
    column: null,
    direction: null,
  });

  const [editMode, setEditMode] = useState(false);

  const [edits, setEdits] = useState<Record<number, any>>({});

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSort(column: string) {
    if (editMode) return;

    setSort((prev) => {
      if (prev.column !== column) {
        return {
          column,
          direction: "asc",
        };
      }

      if (prev.direction === "asc") {
        return {
          column,
          direction: "desc",
        };
      }

      return {
        column: null,
        direction: null,
      };
    });
  }

  const sortedProducts = [...products].sort((a, b) => {
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

  function getCellValue(product: any, key: string) {
    return edits[product.id]?.[key] ?? product[key] ?? "";
  }

  function handleCellChange(id: number, key: string, value: any) {
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

        const payload: Record<string, any> = {};

        Object.entries(values).forEach(([key, value]) => {

          const column = COLUMNS.find(
            c => c.key === key
          );

          if (!column) return;

          payload[key] = column.numeric
            ? value === ''
              ? null
              : Number(value)
            : value;
        });

        // IMPORTANT

        if (Object.keys(payload).length === 0) {
          continue;
        }

        requests.push(
          updateProduct(id, payload)
        );
      }

      await Promise.all(requests);

      await loadProducts();

      setEditMode(false);

      setEdits({});

      setSelected(new Set());
    } catch (err) {
      console.error("Save failed");

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
    if (selected.size === products.length) {
      setSelected(new Set());

      return;
    }

    setSelected(new Set(products.map((p) => p.id)));
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
    <div className="p-6">
      <div className="mb-4 flex gap-2">
        {!editMode ? (
          <Button onClick={enterEditMode}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        ) : (
          <>
            <Badge>{Object.keys(edits).length} rows edited</Badge>

            {selected.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={deleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selected.size})
              </Button>
            )}

            <Button variant="outline" onClick={cancelEdit}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />

              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </>
        )}
      </div>

      <Table>
        <TableCaption>Products</TableCaption>

        <TableHeader>
          <TableRow>
            {editMode && (
              <TableHead>
                <Checkbox
                  checked={selected.size === products.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
            )}

            {COLUMNS.map((col) => (
              <TableHead key={col.key}>
                <button disabled={editMode} onClick={() => handleSort(col.key)}>
                  {col.label}{" "}
                  {!editMode && (
                    <SortIcon
                      direction={
                        sort.column === col.key ? sort.direction : null
                      }
                    />
                  )}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id}>
              {editMode && (
                <TableCell>
                  <Checkbox
                    checked={selected.has(product.id)}
                    onCheckedChange={() => toggleSelect(product.id)}
                  />
                </TableCell>
              )}

              <TableCell>{product.id}</TableCell>

              {COLUMNS.slice(1).map((col) => (
                <TableCell key={col.key}>
                  {editMode ? (
                    <Input
                      type={col.numeric ? "number" : "text"}
                      value={getCellValue(product, col.key)}
                      onChange={(e) =>
                        handleCellChange(product.id, col.key, e.target.value)
                      }
                    />
                  ) : col.key === "buyPrice" ? (
                    `${product.buyPrice ?? 0} EGP`
                  ) : col.key === "sellPrice" ? (
                    `${product.sellPrice ?? 0} EGP`
                  ) : (
                    (product[col.key] ?? "-")
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
