
import React from 'react';
import { ConsentPreference } from '../types';

const ConsentHistoryItem: React.FC<{ item: ConsentPreference }> = ({ item }) => (
    <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="flex items-center">
            <img src={item.businessLogo} alt={`${item.businessName} logo`} className="w-8 h-8 mr-4 rounded-full" />
            <div>
                <p className="font-semibold text-brand-dark">{item.businessName}</p>
                <p className="text-sm text-gray-500">{item.purpose}</p>
            </div>
        </div>
        <div className="text-right">
            <p className={`font-medium ${item.status === 'opted-in' ? 'text-brand-success' : 'text-brand-danger'}`}>
                {item.status === 'opted-in' ? 'Opted-In' : 'Opted-Out'}
            </p>
            <p className="text-xs text-gray-400">Updated: {item.lastUpdated}</p>
        </div>
    </div>
);

const ConsentToggle: React.FC<{ pref: ConsentPreference, onToggle: (id: string) => void }> = ({ pref, onToggle }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div className="flex items-center">
            <img src={pref.businessLogo} alt={`${pref.businessName} logo`} className="w-10 h-10 mr-4 rounded-full" />
            <div>
                <p className="font-bold text-lg text-brand-dark">{pref.businessName}</p>
                <p className="text-gray-600">{pref.purpose}</p>
            </div>
        </div>
        <div className="flex items-center">
            <span className={`mr-3 font-semibold ${pref.status === 'opted-in' ? 'text-brand-success' : 'text-gray-500'}`}>
                {pref.status === 'opted-in' ? 'Allowed' : 'Blocked'}
            </span>
            <label htmlFor={`toggle-${pref.id}`} className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id={`toggle-${pref.id}`} className="sr-only" checked={pref.status === 'opted-in'} onChange={() => onToggle(pref.id)} />
                    <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                </div>
            </label>
            <style>{`
                input:checked ~ .dot {
                    transform: translateX(100%);
                }
                input:checked ~ .block {
                    background-color: #36b37e;
                }
            `}</style>
        </div>
    </div>
);

interface ConsentProps {
  preferences: ConsentPreference[];
  onToggle: (id: string) => void;
}

const Consent: React.FC<ConsentProps> = ({ preferences, onToggle }) => {
  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark">Consent Preferences</h2>
            {preferences.map(pref => (
                <ConsentToggle key={pref.id} pref={pref} onToggle={onToggle} />
            ))}
        </div>
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Consent History</h3>
                <div className="max-h-96 overflow-y-auto">
                    {preferences
                        .slice() // Create a copy to sort
                        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                        .map(item => (
                            <ConsentHistoryItem key={`hist-${item.id}`} item={item} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Consent;
