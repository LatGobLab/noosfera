import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import Toast from "../components/ui/Toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toastState, setToastState] = useState({
    visible: false,
    message: "",
    type: "info" as ToastType,
    duration: 3000,
  });

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      // Si ya hay un toast visible, lo ocultamos primero
      if (toastState.visible) {
        setToastState((prev) => ({ ...prev, visible: false }));

        // Esperamos un momento antes de mostrar el nuevo toast
        setTimeout(() => {
          setToastState({
            message,
            type,
            duration,
            visible: true,
          });
        }, 100);
      } else {
        setToastState({
          message,
          type,
          duration,
          visible: true,
        });
      }
    },
    [toastState.visible]
  );

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}
