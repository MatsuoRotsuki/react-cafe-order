declare type UserCredential = {
  uid: string | null;
  email: string | null;
  username: string | null;
  photoUrl: string | null;
  role: string | null;
};

interface IUser {
  id: string;
  email: string;
  username: string;
  photoUrl?: string;
  role: string;
}

declare type Users = Map<string, IUser>;

declare type CredentialsType = {
  email: string;
  password: string;
};

declare type RegisterCredentialsType = {
  email: string;
  password: string;
  username: string;
};

type Users = Map<string, UserCredential>;

declare enum MenuItemProp {
  BASE = "base",
  VARIATION = "variation",
  EXTRA = "extra",
}

declare enum OrderStatus {
  PENDING = "pending",
  IN_PROGRESS = "inProgress",
  DELIVERING = "delivering",
  FINISHED = "finished",
}

interface ICategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface IMenuItem {
  id: string;
  name: string;
  basePrice: number;
  description?: string;
  thumbnailUrl: string;
  categoryId: string;
  createdBy: string;
  availableBaseProps: IItemPropOption[];
  availableVariationProps: IOptionalProp[];
  availableExtraProps: IOptionalProp[];
}

interface IItemPropOption {
  name: string;
  price: number;
}

interface IOptionalProp {
  alias: string;
  name: string;
  options: IItemPropOption[];
}

interface Order {
  id: string;
  totalAmount: number;
  orderDate: Date;
  orderStatus: OrderStatus;
}
