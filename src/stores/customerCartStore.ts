import { create } from "zustand";
import { getDocument } from "../firebase/services";
import { updateUserCart } from "../lib/cart";

interface ICustomerCartStore {
  userCart: IUserCart;
  cart: Map<string, ICartItem>;
  total: number;
  totalAmount: number;
  getUserCart: (userUid: string) => Promise<void>;
  addToCart: (cartItem: ICartItem) => Promise<void>;
  removeFromCart: (index: string) => Promise<void>;
  increment: (index: string) => Promise<void>;
  decrement: (index: string) => Promise<void>;
}

export const useCustomerCartStore = create<ICustomerCartStore>((set, get) => ({
  userCart: {} as IUserCart,

  total: 0,

  totalAmount: 0,

  cart: new Map<string, ICartItem>(),

  getUserCart: async (userUid: string) => {
    const data = await getDocument({
      collectionName: "users",
      id: userUid,
    });

    if (!data) return;

    const currentUserCart = data as IUserCart;

    const cartMap = new Map<string, ICartItem>(
      currentUserCart.cart.map((item, index) => [index.toString(), item])
    );

    const totalAmount = currentUserCart.cart.reduce(
      (acc: number, cartItem: ICartItem) => acc + cartItem.calculatedPrice,
      0
    );

    set({
      userCart: currentUserCart,
      total: currentUserCart.cart.length || 0,
      cart: cartMap,
      totalAmount: totalAmount,
    });
  },
  addToCart: async (cartItem: ICartItem) => {
    const currentUserCart = get().userCart;
    currentUserCart.cart.push(cartItem);

    await updateUserCart(currentUserCart);

    const cartMap = new Map<string, ICartItem>(
      currentUserCart.cart.map((item, index) => [index.toString(), item])
    );

    const totalAmount = currentUserCart.cart.reduce(
      (acc: number, cartItem: ICartItem) => acc + cartItem.calculatedPrice,
      0
    );

    set({
      userCart: currentUserCart,
      total: currentUserCart.cart.length || 0,
      cart: cartMap,
      totalAmount: totalAmount,
    });
  },

  removeFromCart: async (index: string) => {
    const currentUserCart = get().userCart;
    currentUserCart.cart.splice(Number(index), 1);

    await updateUserCart(currentUserCart);

    const cartMap = new Map<string, ICartItem>(
      currentUserCart.cart.map((item, index) => [index.toString(), item])
    );

    const totalAmount = currentUserCart.cart.reduce(
      (acc: number, cartItem: ICartItem) => acc + cartItem.calculatedPrice,
      0
    );

    set({
      userCart: currentUserCart,
      total: currentUserCart.cart.length || 0,
      cart: cartMap,
      totalAmount: totalAmount,
    });
  },

  increment: async (index: string) => {
    const currentUserCart = get().userCart;
    const newQuantity = currentUserCart.cart[Number(index)].quantity + 1;
    const calculatedPrice =
      (currentUserCart.cart[Number(index)].calculatedPrice /
        currentUserCart.cart[Number(index)].quantity) *
      newQuantity;
    currentUserCart.cart[Number(index)] = {
      ...currentUserCart.cart[Number(index)],
      quantity: newQuantity,
      calculatedPrice: calculatedPrice,
    };

    await updateUserCart(currentUserCart);

    const cartMap = new Map<string, ICartItem>(
      currentUserCart.cart.map((item, index) => [index.toString(), item])
    );

    const totalAmount = currentUserCart.cart.reduce(
      (acc: number, cartItem: ICartItem) => acc + cartItem.calculatedPrice,
      0
    );

    set({
      userCart: currentUserCart,
      total: currentUserCart.cart.length || 0,
      cart: cartMap,
      totalAmount: totalAmount,
    });
  },

  decrement: async (index: string) => {
    const currentUserCart = get().userCart;
    const newQuantity = currentUserCart.cart[Number(index)].quantity - 1;
    const calculatedPrice =
      (currentUserCart.cart[Number(index)].calculatedPrice /
        currentUserCart.cart[Number(index)].quantity) *
      newQuantity;
    currentUserCart.cart[Number(index)] = {
      ...currentUserCart.cart[Number(index)],
      quantity: newQuantity,
      calculatedPrice: calculatedPrice,
    };

    await updateUserCart(currentUserCart);

    const cartMap = new Map<string, ICartItem>(
      currentUserCart.cart.map((item, index) => [index.toString(), item])
    );

    const totalAmount = currentUserCart.cart.reduce(
      (acc: number, cartItem: ICartItem) => acc + cartItem.calculatedPrice,
      0
    );

    set({
      userCart: currentUserCart,
      total: currentUserCart.cart.length || 0,
      cart: cartMap,
      totalAmount: totalAmount,
    });
  },
}));
