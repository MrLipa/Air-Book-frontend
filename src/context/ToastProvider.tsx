import { createContext, useCallback, useContext, useRef, FC } from "react";
import { Toast } from "primereact/toast";
import { ToastContextType, ToastProviderProps, ToastSeverity } from "@/types";

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback((severity: ToastSeverity, summary: string, detail: string) => {
    toastRef.current?.show({ severity, summary, detail });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => useContext(ToastContext);
