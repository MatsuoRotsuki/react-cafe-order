import { create } from "zustand";
import { editUser, getAllUsers, getUserById } from "../lib/user";

interface IUsersStore {
  users: Users;
  total: number;
  user: IUser;
  searchResult: IUser[];
  getUsers: () => void;
  getUserById: (id: string) => void;
  searchUser: (searchValue: string) => void;
  editUser: (user: IUser) => void;
}

export const useUsersStore = create<IUsersStore>((set) => ({
  users: new Map<string, IUser>(),

  total: 0,

  user: {} as IUser,

  searchResult: [],

  getUsers: async () => {
    const { data, total } = await getAllUsers();

    set({ users: data, total: total });
  },

  getUserById: async (id: string) => {
    const user = await getUserById(id);

    set({ user: user });
  },

  searchUser: async (searchValue: string) => {},

  editUser: async (user: IUser) => {
    const newUserData = await editUser(user);

    set({ user: newUserData });
  },
}));
