import { getDocument } from "../firebase/services";
import removeDiacritics from "../hooks/removeDiacritics";
import { getCategories } from "./menu";

export const getMenuItems = async () => {
  const categories = await getCategories();

  const menuItemsData = await getDocument({
    collectionName: "menu_items",
  });

  const categoriesMap = (categories as ICategory[]).reduce(
    (acc: Map<string, ICategory>, category: ICategory) => {
      acc.set(category.id, category);
      return acc;
    },
    new Map<string, ICategory>()
  );

  const menuItemsMap = (menuItemsData as IMenuItem[]).reduce(
    (acc: Map<string, IMenuItem>, item: IMenuItem) => {
      acc.set(item.id, item);
      return acc;
    },
    new Map<string, IMenuItem>()
  );

  const categoryToMenuItemsMap = (menuItemsData as IMenuItem[]).reduce(
    (acc: Map<string, IMenuItem[]>, item: IMenuItem) => {
      if (acc.has(item.categoryId)) {
        acc.get(item.categoryId)!.push(item);
      } else {
        acc.set(item.categoryId, [item]);
      }
      return acc;
    },
    new Map<string, IMenuItem[]>()
  );

  return { categoriesMap, menuItemsMap, categoryToMenuItemsMap };
};

export const searchMenuItems = async (searchValue: string) => {
  const normalizedSearchValue = removeDiacritics(searchValue).toLowerCase();

  if (!normalizedSearchValue) return await getMenuItems();

  const menuItemsData = await getDocument({
    collectionName: "menu_items",
  });

  const filteredMenuItems = (menuItemsData as IMenuItem[]).filter((item) => {
    const normalizedName = removeDiacritics(item.name).toLowerCase();
    return normalizedName.includes(normalizedSearchValue);
  });

  const menuItemsMap = filteredMenuItems.reduce(
    (acc: Map<string, IMenuItem>, item: IMenuItem) => {
      acc.set(item.id, item);
      return acc;
    },
    new Map<string, IMenuItem>()
  );

  const categoryToMenuItemsMap = filteredMenuItems.reduce(
    (acc: Map<string, IMenuItem[]>, item: IMenuItem) => {
      if (acc.has(item.categoryId)) {
        acc.get(item.categoryId)!.push(item);
      } else {
        acc.set(item.categoryId, [item]);
      }
      return acc;
    },
    new Map<string, IMenuItem[]>()
  );

  return { menuItemsMap, categoryToMenuItemsMap };
};
