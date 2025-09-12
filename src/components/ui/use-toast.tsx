// src/components/ui/use-toast.tsx
import * as React from "react";
import { v4 as uuidv4 } from "uuid"; // You'll need to install uuid

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

interface ToastState {
  toasts: ToastProps[];
  setToasts: React.Dispatch<React.SetStateAction<ToastProps[]>>;
}

const ToastStateContext = React.createContext<ToastState | null>(null);

export function ToastStateProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const value = { toasts, setToasts };

  return (
    <ToastStateContext.Provider value={value}>
      {children}
    </ToastStateContext.Provider>
  );
}

export function useToastState() {
  const context = React.useContext(ToastStateContext);
  if (context === null) {
    throw new Error("useToastState must be used within a ToastStateProvider");
  }
  return context;
}

export function useToast() {
  const { setToasts } = useToastState();

  const toast = (props: Omit<ToastProps, "id">) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { ...props, id }]);
  };

  return { toast };
}