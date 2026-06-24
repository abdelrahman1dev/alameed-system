import { create } from "zustand";

export type SaleItem = {
  productId: number;
  quantity: number;
};

type SaleStore = {
  items: SaleItem[];

  setItems: (items: SaleItem[]) => void;

  addItems: (items: SaleItem[]) => void;

  clearItems: () => void;
};

export const useSaleStore = create<SaleStore>((set) => ({
  items: [],

  setItems: (items) =>
    set({
      items,
    }),

  addItems: (newItems) =>
    set((state) => {
      const merged = [...state.items];

      newItems.forEach((item) => {
        const existing = merged.find(
          (p) => p.productId === item.productId,
        );

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          merged.push(item);
        }
      });

      return {
        items: merged,
      };
    }),

  clearItems: () =>
    set({
      items: [],
    }),
}));