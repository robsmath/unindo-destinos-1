"use client";

import { create } from "zustand";

interface ToastState {
  toasts: Toast[];
  show: (toast: Toast) => void;
  remove: (id: string) => void;
}

interface Toast {
  id: string;
  title: string;
  description?: string;
  status?: "success" | "error" | "info";
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  show: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString() }],
    })),
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
