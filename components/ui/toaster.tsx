"use client";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function Toaster() {
  const { toasts, remove } = useToast();

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        remove(toast.id);
      }, 3000)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, remove]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="min-w-[250px] rounded-lg bg-white dark:bg-black p-4 shadow-lg border dark:border-strokedark animate-fadeIn"
        >
          <p className="font-semibold mb-1">{toast.title}</p>
          {toast.description && (
            <p className="text-sm text-muted-foreground">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
