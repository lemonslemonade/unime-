import React from 'react';
import { View } from '../types';

interface BusinessHeaderProps {
  businessName: string;
  onLogout: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItems = [
    { view: View.CompanyHome, label: 'Company Home' },
    { view: View.CustomerDetails, label: 'Customer Details' },
    { view: View.CustomerDataIssues, label: 'Customer Data Issues' },
    { view: View.CompanyWildCardsView, label: 'Company Wild Cards View' },
    { view: View.TargetedMarketing, label: 'Targeted Marketing' },
    { view: View.Messages, label: 'Messages' },
    { view: View.SendMessages, label: 'Send Messages' },
];

const NavItem: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 text-sm font-medium rounded-md ${
            isActive ? 'bg-blue-100 text-brand-primary' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`}
    >
        {label}
    </button>
);

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ businessName, onLogout, activeView, setActiveView }) => {
  return (
    <header className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
                 <h1 className="text-3xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
                 <div className="flex items-center space-x-4">
                     <div className="text-right">
                      <p className="text-sm font-medium text-brand-dark">Logged in as John Khumalo</p>
                      <a href="#" className="text-sm text-gray-500 hover:underline">Account Settings</a>
                      <span className="text-sm text-gray-500 mx-1"> - </span>
                      <button onClick={onLogout} className="text-sm text-gray-500 hover:underline">Log Out</button>
                    </div>
                </div>
            </div>
        </div>
         <nav className="bg-gray-50 border-t border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-4">
                    {navItems.map(item => (
                        <NavItem
                            key={item.view}
                            label={item.label}
                            isActive={activeView === item.view}
                            onClick={() => setActiveView(item.view)}
                        />
                    ))}
                </div>
            </div>
        </nav>
    </header>
  );
};

export default BusinessHeader;
