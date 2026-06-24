"use client";
import React from 'react'
import ProductsTable from '@/app/components/allProdTable';
import { useParams } from 'next/navigation'

function page() {
  const params = useParams();
  const catiD = Number(params.cat);

  return (
    <div>
      <ProductsTable categoryId={catiD} />
    </div>
  )
}


export default page
