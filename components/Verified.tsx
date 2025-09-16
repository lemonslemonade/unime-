import React, { useState } from 'react';
import VerifiedIcon from './icons/VerifiedIcon';

interface VerifiedProps {
    isVerified: boolean;
    onVerificationSuccess: () => void;
}

const Benefit: React.FC<{ title: string, description: string, icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-success text-white flex items-center justify-center">
            {icon}
        </div>
        <div className="ml-4">
            <h4 className="text-lg font-semibold text-brand-dark">{title}</h4>
            <p className="mt-1 text-gray-600">{description}</p>
        </div>
    </div>
);

const Verified: React.FC<VerifiedProps> = ({ isVerified, onVerificationSuccess }) => {
    const [status, setStatus] = useState<'idle' | 'pending'>('idle');

    const handleVerification = () => {
        setStatus('pending');
        setTimeout(() => {
            onVerificationSuccess();
            // The parent component will handle the state update and navigate to the dashboard.
        }, 2000); // Simulate a 2-second verification process
    };

    return (
        <div className="p-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-10 text-white text-center">
                    <div className="inline-block bg-white p-3 rounded-full mb-4">
                        <VerifiedIcon className="w-12 h-12 text-brand-primary" />
                    </div>
                    <h2 className="text-4xl font-extrabold">UniMe Verified</h2>
                    <p className="mt-2 text-xl opacity-90">Unlock a new level of trust and security online.</p>
                </div>
                <div className="p-8">
                    {isVerified ? (
                        <div className="text-center p-8 bg-green-50 rounded-lg">
                            <VerifiedIcon className="w-16 h-16 text-brand-success mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-brand-dark">You are Verified!</h3>
                            <p className="text-gray-700 mt-2">You can now securely share your verified status with partners.</p>
                            <button className="mt-6 bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                                Download Certificate
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-brand-dark mb-4">Why Get Verified?</h3>
                                <p className="text-gray-600 mb-6">
                                    UniMe Verified is a one-time KYC (Know Your Customer) process that confirms your identity.
                                    Share your verified status with businesses for faster, more secure transactions without repeatedly uploading your documents.
                                </p>
                                <div className="space-y-6">
                                    <Benefit title="Enhanced Security" description="Protect your account and prove you are you with a verified identity." icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    } />
                                    <Benefit title="Faster Onboarding" description="Skip repetitive identity checks with businesses that trust UniMe." icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    } />
                                    <Benefit title="Increased Trust" description="A verified badge shows businesses you are a legitimate customer." icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.224a2 2 0 00.174 2.573V10h7z" /></svg>
                                    } />
                                </div>
                            </div>
                            <div className="bg-brand-light p-8 rounded-lg text-center shadow-inner">
                                <h3 className="text-xl font-bold text-brand-dark">One-Time Fee</h3>
                                <p className="text-5xl font-extrabold text-brand-primary my-4">R150.00</p>
                                <p className="text-gray-600 mb-6">A single payment for a lifetime of digital trust.</p>
                                <button
                                    onClick={handleVerification}
                                    disabled={status === 'pending'}
                                    className="w-full bg-brand-success text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center"
                                >
                                    {status === 'pending' ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : 'Get UniMe Verified Now'}
                                </button>
                                <p className="text-xs text-gray-500 mt-4">Powered by trusted KYC partners.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Verified;
