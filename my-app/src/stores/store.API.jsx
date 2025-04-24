import { create } from 'zustand';

export const useStore = create((set) => ({
    user : JSON.parse(localStorage.getItem("users"))[0] || null,
}));