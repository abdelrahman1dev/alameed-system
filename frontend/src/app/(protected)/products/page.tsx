"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await window.api.categories.getAll();

        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">التصنيفات</h1>

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
            href={`/products/${category.id}`}
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
