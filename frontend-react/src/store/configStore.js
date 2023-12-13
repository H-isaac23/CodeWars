import { create } from "zustand";

const useConfigStore = create((set) => ({
  account: { username: "", email: "", stars: 0, gold: 0 },
  isPlaying: false,
  isConnected: false,
  optionCharacter: false,
  setAccount: (username, email, stars, gold) =>
    set({
      account: { username, email, stars, gold },
    }),
  removeAccount: () => set({ account: { username: "", email: "" } }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  optionCharacterClicked: () => set((state) => ({ optionCharacter: !state.optionCharacter })),
  
  setIsConnected: () => set({ isConnected: true }),
  incrementStar: () =>
    set((state) => ({ account: { stars: state.account.stars + 1 } })),
  decrementStar: () =>
    set((state) => ({ account: { stars: state.account.stars - 1 } })),
}));

export default useConfigStore;
