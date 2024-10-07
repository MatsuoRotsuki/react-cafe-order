import { create } from "zustand";
import { getMenuItems, searchMenuItems } from "../lib/customerMenu";
import { getDishById } from "../lib/menu";

interface ICustomerMenuStore {
  categories: Map<string, ICategory>;
  menuItem: IMenuItem;
  menuItemsMap: Map<string, IMenuItem>;
  categoryToMenuItemsMap: Map<string, IMenuItem[]>;
  getMenuItems: () => Promise<void>;
  getCurrentMenuItem: (id: string) => Promise<void>;
  searchMenuItems: (searchValue: string) => Promise<void>;
}

export const useCustomerMenuStore = create<ICustomerMenuStore>((set, get) => ({
  categories: new Map<string, ICategory>(),

  menuItem: {} as IMenuItem,

  menuItemsMap: new Map<string, IMenuItem>(),

  categoryToMenuItemsMap: new Map<string, IMenuItem[]>(),

  getMenuItems: async () => {
    const { categoriesMap, menuItemsMap, categoryToMenuItemsMap } =
      await getMenuItems();

    set({
      categories: categoriesMap,
      menuItemsMap: menuItemsMap,
      categoryToMenuItemsMap: categoryToMenuItemsMap,
    });
  },

  getCurrentMenuItem: async (id: string) => {
    const menuItem = await getDishById(id);
    if (!menuItem) return;
    set({ menuItem: menuItem });
  },

  searchMenuItems: async (searchValue: string) => {
    const { menuItemsMap, categoryToMenuItemsMap } = await searchMenuItems(
      searchValue
    );

    set({
      menuItemsMap: menuItemsMap,
      categoryToMenuItemsMap: categoryToMenuItemsMap,
    });
  },
}));
