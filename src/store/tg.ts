import { TelegramWebApps } from "telegram-webapps-types";
import { create } from "zustand";
type states = {
  tg: TelegramWebApps.WebApp | null;
  userId: number | undefined;
};
type actions = {
  setTg: (tg: TelegramWebApps.WebApp) => void;
  removeTg: () => void;
  removeUserId: () => void;
};
export const useBaseStore = create<states & actions>((set) => ({
  tg: null,
  userId: undefined,
  setTg: (tg) =>
    set(() => ({
      tg: tg,
      userId: tg?.initDataUnsafe?.user?.id,
    })),
  removeTg: () => set({ tg: null }),
  removeUserId: () => set({ userId: undefined }),
}));
