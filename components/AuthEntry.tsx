import React from 'react';
import { UserType } from '../types';
import BusinessIcon from './icons/BusinessIcon';
import UserIcon from './icons/UserIcon';

const EntryCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-8 border-2 border-transparent rounded-xl shadow-lg hover:border-brand-primary hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
        <div className="flex items-center">
            <div className="bg-brand-primary text-white p-4 rounded-full">
                {icon}
            </div>
            <div className="ml-6">
                <h3 className="text-2xl font-bold text-brand-dark">{title}</h3>
                <p className="text-gray-500 mt-1">{description}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
    </button>
);


const AuthEntry: React.FC<{ onSelect: (userType: UserType) => void; }> = ({ onSelect }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-light to-brand-neutral flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
                    <p className="text-gray-500 mt-2">Welcome! How would you like to sign in?</p>
                </div>
                <div className="space-y-6">
                    <EntryCard 
                        title="Personal Account" 
                        description="Manage your personal data and consent preferences."
                        icon={<UserIcon />}
                        onClick={() => onSelect('personal')}
                    />
                    <EntryCard 
                        title="Business Account" 
                        description="Access your business dashboard and manage customer data."
                        icon={<BusinessIcon />}
                        onClick={() => onSelect('business')}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthEntry;