import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TOAST UI */}
      {toast && (
        <div className="
          fixed top-5 right-5 z-[9999]
          animate-slideIn
        ">
          <div
            className={`
              px-5 py-3 rounded-xl shadow-lg text-white font-medium
              ${toast.type === "success"
                ? "bg-green-600"
                : "bg-red-600"}
            `}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
