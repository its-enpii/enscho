"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    message: "",
  });
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (opts: ConfirmDialogOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false);
    }
    setIsOpen(false);
  };

  const variantStyles = {
    danger: {
      icon: "bg-red-100 text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: "bg-yellow-100 text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      icon: "bg-blue-100 text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const variant = options.variant || "danger";
  const styles = variantStyles[variant];

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-slate-200">
              <div className={`p-3 rounded-full ${styles.icon}`}>
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {options.title || "Konfirmasi"}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{options.message}</p>
              </div>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
              >
                {options.cancelText || "Batal"}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-colors ${styles.button}`}
              >
                {options.confirmText || "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmDialogProvider");
  }
  return context;
}
