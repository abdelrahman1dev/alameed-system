import type { SaleInput, SaleItemInput } from "@/types/api";

export async function createSale(
  sale: SaleInput,
  items: SaleItemInput[],
) {
  return await window.api.sales.create(
    sale,
    items,
  );
}
