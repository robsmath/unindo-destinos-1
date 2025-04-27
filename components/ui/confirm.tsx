"use client";

import { toast } from "sonner";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md w-72">
        <h3 className="text-lg font-semibold">{options.title}</h3>
        {options.description && (
          <p className="text-sm text-gray-600">{options.description}</p>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => {
              toast.dismiss(t);
              resolve(false);
            }}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            {options.cancelText || "Cancelar"}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              resolve(true);
            }}
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            {options.confirmText || "Confirmar"}
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  });
};
