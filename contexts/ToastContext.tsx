import React, { createContext, useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
