import React from "react";
import { useToast } from "./use-toast";

export const Toaster = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${
            toast.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-800"
              : toast.variant === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : toast.variant === "warning"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-start">
            <div className="flex-1">
              {toast.title && (
                <div className="font-semibold text-sm mb-1">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-sm opacity-90">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
