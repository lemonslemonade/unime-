import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  titleIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, titleIcon, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
      <div className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} flex flex-col animate-slide-up max-h-[90vh]`}>
        {title && (
            <div className="p-6 border-b">
                <div className="flex items-start">
                    {titleIcon && <div className="mr-4 flex-shrink-0">{titleIcon}</div>}
                    <div className="flex-grow">
                        <h3 id="modal-title" className="text-lg leading-6 font-bold text-gray-900">
                            {title}
                        </h3>
                    </div>
                    <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 flex-shrink-0" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        )}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
