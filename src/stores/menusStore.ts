import { create } from "zustand";
import {
  createDish,
  deleteDish,
  getCategories,
  getDishById,
  getDishes,
} from "../lib/menu";

interface IMenuStore {
  menuItem: IMenuItem;
  menuItems: Map<string, IMenuItem>;
  total: number;
  getMenuItems: () => Promise<void>;
  getMenuItemById: (id: string | undefined) => Promise<void>;
  categories: ICategory[];
  getCategories: () => Promise<void>;
  createMenuItem: (menuItem: IMenuItem) => Promise<void>;
  deleteMenuItemById: (id: string) => Promise<void>;
}

export const useMenuStore = create<IMenuStore>((set, get) => ({
  menuItem: {} as IMenuItem,

  menuItems: new Map<string, IMenuItem>(),

  total: 0,

  getMenuItems: async () => {
    const { data, total } = await getDishes();

    set({ menuItems: data, total: total });
  },

  getMenuItemById: async (id: string | undefined) => {
    if (!id) return;

    const menuItem = await getDishById(id);

    if (!menuItem) return;

    set({ menuItem: menuItem });
  },

  categories: [] as ICategory[],

  getCategories: async () => {
    const categories = await getCategories();

    if (!categories) return;

    set({ categories: categories });
  },

  createMenuItem: async (menuItem: IMenuItem) => {
    await createDish(menuItem);
    await get().getMenuItems();
  },

  deleteMenuItemById: async (id: string) => {
    await deleteDish(id);
    const newMenuItems: Map<string, IMenuItem> = new Map(get().menuItems);
    newMenuItems.delete(id);
    set({ menuItems: newMenuItems, total: get().total - 1 });
  },
}));
