import React, { useContext } from 'react';
import { ToastContext } from '../../contexts/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null; // Or some fallback UI, though it should always be within a provider
  }

  const { toasts, removeToast } = context;

  return (
    <>
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s forwards ease-out;
        }
      `}</style>
      <div className="fixed top-8 right-8 z-[100] space-y-3">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </>
  );
};

export default ToastContainer;
