export async function createSale(
  sale: any,
  items: any[],
) {
  return await window.api.sales.create(
    sale,
    items,
  );
}
