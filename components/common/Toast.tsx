import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const icons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const toastStyles = {
    success: 'bg-brand-success text-white',
    error: 'bg-brand-danger text-white',
    info: 'bg-brand-secondary text-white',
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);

  return (
    <div className={`flex items-center w-full max-w-sm p-4 rounded-lg shadow-lg ${toastStyles[toast.type]} animate-slide-in-right`} role="alert">
      <div className="flex-shrink-0 mr-3">{icons[toast.type]}</div>
      <div className="text-sm font-semibold">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent p-1.5 rounded-full inline-flex items-center justify-center h-8 w-8 text-white/70 hover:text-white hover:bg-white/20"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
