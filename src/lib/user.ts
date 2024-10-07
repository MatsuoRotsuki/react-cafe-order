import { getDocument, updateDocument } from "../firebase/services";

export const getAllUsers = async () => {
  const usersData = await getDocument({
    collectionName: "users",
  });

  const users = (usersData as IUser[]).reduce(
    (acc: Map<string, IUser>, user: IUser) => {
      acc.set(user.id, user);

      return acc;
    },
    new Map<string, IUser>()
  );

  return { data: users, total: (usersData as IUser[]).length };
};

export const getUserById = async (id: string) => {
  const userData = await getDocument({
    collectionName: "users",
    id: id,
  });

  if (!userData) return;

  return userData as IUser;
};

export const editUser = async (user: IUser) => {
  await updateDocument({
    collectionName: "users",
    id: user.id,
    data: {
      email: user.email,
      photoUrl: user.photoUrl,
      role: user.role,
      username: user.username,
    },
  });

  const newUserData = await getDocument({
    collectionName: "users",
    id: user.id,
  });

  if (!newUserData) return;

  return newUserData as IUser;
};
