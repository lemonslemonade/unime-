import React from 'react';
import Modal from './Modal';

interface OnboardingModalProps {
    isOpen: boolean;
    onStart: () => void;
    onSkip: () => void;
}

const GuideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onStart, onSkip }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onSkip}
            title="Welcome to UniMe!"
            size="sm"
            titleIcon={
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary sm:mx-0 sm:h-10 sm:w-10">
                    <GuideIcon />
                </div>
            }
        >
            <p className="text-sm text-gray-600">
                Would you like a quick, interactive tour to get familiar with the key features of your dashboard?
            </p>
            <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                <button
                    type="button"
                    onClick={onStart}
                    className="w-full px-4 py-2 bg-brand-primary text-white border border-transparent rounded-md hover:bg-blue-700"
                >
                    Start Tour
                </button>
                <button
                    type="button"
                    onClick={onSkip}
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    No, thanks
                </button>
            </div>
        </Modal>
    );
};

export default OnboardingModal;
