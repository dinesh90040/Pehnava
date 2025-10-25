import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = {
        id,
        title,
        description,
        variant,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return {
        id,
        dismiss: () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      };
    },
    []
  );

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onDismiss }) => {
  const { title, description, variant } = toast;

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-50 border-red-200 text-red-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-white border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${getVariantStyles()}`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};
