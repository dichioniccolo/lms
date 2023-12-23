import { create } from "zustand";

interface ConfettiStore {
  isOpen: boolean;
  open(): void;
  close(): void;
}

export const useConfetti = create<ConfettiStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
