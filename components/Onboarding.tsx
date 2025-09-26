import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { TourStep, View } from '../types';

interface OnboardingProps {
    steps: TourStep[];
    onComplete: () => void;
    onSkip: () => void;
    navigateToView: (view: View) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ steps, onComplete, onSkip, navigateToView }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const currentStep = steps[stepIndex];

    useLayoutEffect(() => {
        if (currentStep.isCentered) {
            setTargetRect(null);
            return;
        }

        const targetElement = document.querySelector(currentStep.targetSelector);
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            setTargetRect(rect);
            targetElement.classList.add('onboarding-highlight');
        }

        return () => {
            if (targetElement) {
                targetElement.classList.remove('onboarding-highlight');
            }
        };
    }, [stepIndex, currentStep]);
    
    useEffect(() => {
        navigateToView(currentStep.view);
    }, [currentStep.view, navigateToView]);

    const handleNext = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };
    
    const getTooltipPosition = () => {
        if (!targetRect || !tooltipRef.current) return {};
        const tooltipHeight = tooltipRef.current.offsetHeight;
        const tooltipWidth = tooltipRef.current.offsetWidth;
        const space = 16; // space between target and tooltip

        switch (currentStep.position) {
            case 'top':
                return { top: targetRect.top - tooltipHeight - space, left: targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2) };
            case 'right':
                return { top: targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2), left: targetRect.right + space };
            case 'left':
                return { top: targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2), left: targetRect.left - tooltipWidth - space };
            case 'bottom':
            default:
                return { top: targetRect.bottom + space, left: targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2) };
        }
    };
    
    return (
        <div className="fixed inset-0 z-[1000]">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
            <style>{`
                .onboarding-highlight {
                    position: relative;
                    z-index: 1001;
                    box-shadow: 0 0 0 9999px rgba(0,0,0,0.6);
                    border-radius: 6px;
                }
            `}</style>
            
            <div
                ref={tooltipRef}
                style={currentStep.isCentered ? {} : getTooltipPosition()}
                className={`absolute w-80 p-5 bg-white rounded-lg shadow-2xl transition-all duration-300
                    ${currentStep.isCentered ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
            >
                <h3 className="text-lg font-bold text-brand-dark mb-2">{currentStep.title}</h3>
                <p className="text-sm text-gray-600">{currentStep.content}</p>

                <div className="flex justify-between items-center mt-6">
                    <div>
                        <span className="text-xs font-bold text-gray-400">
                            {stepIndex + 1} / {steps.length}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {stepIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                            >
                                Back
                            </button>
                        )}
                         <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-md hover:bg-blue-700"
                        >
                            {stepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
                 <button 
                    onClick={onSkip} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Skip tutorial"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
