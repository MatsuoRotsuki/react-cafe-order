import { create } from "zustand";
import { getCurrentUser, login, registerNewUser } from "../lib/auth";
import { createJSONStorage, persist } from "zustand/middleware";

interface IAuthStore {
  currentUser: UserCredential;
  getCurrentUser: () => Promise<void>;
  login: (credentials: CredentialsType) => Promise<void>;
  register: (credentials: RegisterCredentialsType) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<IAuthStore>(
    (set) => ({
      currentUser: {} as UserCredential,

      getCurrentUser: async () => {
        const data = await getCurrentUser();

        set({ currentUser: data });
      },

      login: async (credentials: CredentialsType) => {
        const data = await login(credentials);

        set({ currentUser: data });
      },

      register: async (credentials: RegisterCredentialsType) => {
        const data = await registerNewUser(credentials);

        set({ currentUser: data });
      },

      logout: () => {
        set({ currentUser: {} as UserCredential });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
