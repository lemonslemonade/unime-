import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import { ToastType } from '../types';

interface UseToast {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export const useToast = (): UseToast => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = context;

  return {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };
};
