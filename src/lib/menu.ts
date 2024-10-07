import { addDocument, deleteDocument, getDocument } from "../firebase/services";

export const getDishes = async () => {
  const menuItemsData = await getDocument({
    collectionName: "menu_items",
  });

  const menuItems = (menuItemsData as IMenuItem[]).reduce(
    (acc: Map<string, IMenuItem>, item: IMenuItem) => {
      acc.set(item.id, item);

      return acc;
    },
    new Map<string, IMenuItem>()
  );

  return { data: menuItems, total: (menuItemsData as IMenuItem[]).length };
};

export const getDishById = async (id: string | undefined) => {
  if (!id) return;

  const menuItemData = await getDocument({
    collectionName: "menu_items",
    id: id,
  });

  if (!menuItemData) return;

  return menuItemData as IMenuItem;
};

export const createDish = async (data: IMenuItem) => {
  await addDocument({
    collectionName: "menu_items",
    data: data,
  });
};

export const updateDish = async (data: IMenuItem) => {
  await addDocument({
    collectionName: "menu_items",
    id: data.id,
    data: data,
  });
};

export const deleteDish = async (id: string) => {
  await deleteDocument({
    collectionName: "menu_items",
    id: id,
  });
};

export const getCategories = async () => {
  const categoriesData = await getDocument({
    collectionName: "categories",
  });

  if (!categoriesData) return;

  return categoriesData as ICategory[];
};
