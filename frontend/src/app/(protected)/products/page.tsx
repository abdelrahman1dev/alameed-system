"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Category } from "@/types/api";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    void loadCategories();
  }, []);

  async function loadCategories() {
      try {
        const data = await window.api.categories.getAll();

        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
  }

  async function handleCreateCategory() {
    if (!newCategory.trim()) return;

    try {
      await window.api.categories.create({ name: newCategory.trim(), description: null });
      setNewCategory("");
      await loadCategories();
      toast.success("تمت إضافة التصنيف");
    } catch (error) {
      console.error(error);
      toast.error("تعذر إضافة التصنيف");
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">التصنيفات</h1>
        <button >
          <Link href="/products/new">إضافة منتج</Link>
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          placeholder="اسم تصنيف جديد"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
        />
        <button onClick={handleCreateCategory}>إضافة تصنيف</button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href={`/products/allProd`}
          className="rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="mb-2 text-xl font-semibold">جميع المنتجات</h2>
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products/allProd?categoryId=${category.id}`}
            className="rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-2 text-xl font-semibold">{category.name}</h2>

            <p className="text-sm text-gray-500">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
