import { create } from "zustand";

export const useStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem("users")) || null,

  // 로그인
  setUser: (userData) => {
    sessionStorage.setItem("users", JSON.stringify(userData)); // 세션스토리지도 업데이트
    set({ user: userData });
  },
  // 로그아웃
  clearUser: () => {
    sessionStorage.removeItem("users");
    set({ user: null });
  },
}));
