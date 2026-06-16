export async function getProducts() {
  return await window.api.products.getAll();
}
export async function updateProduct(id:number , data: any) {
  return await window.api.products.update(id , data);
}
export async function deleteProduct(id:number) {
  return await window.api.products['delete'](id);
}