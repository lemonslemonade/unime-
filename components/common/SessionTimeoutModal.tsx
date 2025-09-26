import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface SessionTimeoutModalProps {
    isOpen: boolean;
    onExtend: () => void;
    onLogout: () => void;
    countdownFrom: number; // in milliseconds
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ isOpen, onExtend, onLogout, countdownFrom }) => {
    const [countdown, setCountdown] = useState(countdownFrom / 1000);

    useEffect(() => {
        if (isOpen) {
            setCountdown(countdownFrom / 1000);
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isOpen, countdownFrom]);
    
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onLogout}
            title="Session Expiring"
            size="sm"
            titleIcon={
                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            }
        >
            <p className="text-sm text-gray-600">
                For your security, you will be logged out due to inactivity in:
            </p>
            <div className="text-center text-4xl font-bold text-brand-dark my-4">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
             <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                <button
                    type="button"
                    onClick={onExtend}
                    className="w-full px-4 py-2 bg-brand-primary text-white border border-transparent rounded-md hover:bg-blue-700"
                >
                    Stay Logged In
                </button>
                 <button
                    type="button"
                    onClick={onLogout}
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Logout
                </button>
            </div>
        </Modal>
    );
};

export default SessionTimeoutModal;
