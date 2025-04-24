import { create } from 'zustand';

export const useStore = create((set) => ({
    user : JSON.parse(sessionStorage.getItem("users")) || null,
}));