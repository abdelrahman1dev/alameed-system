"use client";

import ProductsTable from '@/app/components/allProdTable'
import { useSearchParams } from 'next/navigation';

function Page() {
  const searchParams = useSearchParams();
  const categoryId = Number(searchParams.get('categoryId')) || undefined;

  return (
    <div>
      <ProductsTable categoryId={categoryId} />
    </div>
  )
}

export default Page
