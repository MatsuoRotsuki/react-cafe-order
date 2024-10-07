import { addDocument } from "../firebase/services";

export const updateUserCart = async (userCart: IUserCart) => {
  await addDocument({
    collectionName: "users",
    id: userCart.id,
    data: userCart,
  });
};
