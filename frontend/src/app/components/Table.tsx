'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProductsTable() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function getProducts() {
      const result = await window.api.products.getAll();
      setProducts(result);
    }

    getProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableCaption>List of all products</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>sku</TableHead>
              <TableHead>barcode</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Sell Price</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>manufacture</TableHead>
              <TableHead>car brand</TableHead>
              <TableHead>car model</TableHead>
              <TableHead>position</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.sku}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.barcode}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.buyPrice ?? 0} EGP</TableCell>
                  <TableCell>{product.sellPrice ?? 0} EGP</TableCell>
                  <TableCell>{product.brand ?? '-'}</TableCell>
                  <TableCell>{product.manufacturer ?? '-'}</TableCell>
                  <TableCell>{product.carBrand ?? '-'}</TableCell>
                  <TableCell>{product.carModel ?? '-'}</TableCell>
                  <TableCell>{product.position ?? '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}