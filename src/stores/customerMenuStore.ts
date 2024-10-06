import { create } from "zustand";
import { getCategories } from "../lib/menu";

interface ICustomerMenuStore {
  categories: ICategory[];
  getCategories: () => Promise<void>;
}

export const useCustomerMenuStore = create<ICustomerMenuStore>((set) => ({
  categories: [],

  getCategories: async () => {
    const categoriesData = await getCategories();

    if (!categoriesData) return;

    set({ categories: categoriesData as ICategory[] });
  },
}));
