import React, { useState } from 'react';
import { ConsentPreference, DataPoint, availableDataPoints } from '../types';
import Modal from './common/Modal';

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
             <p className={`font-medium ${item.sharedData.length > 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
                Sharing {item.sharedData.length} item(s)
            </p>
            <p className="text-xs text-gray-400">Updated: {item.lastUpdated}</p>
        </div>
    </div>
);

const GranularConsentModal: React.FC<{
    preference: ConsentPreference;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, sharedData: DataPoint[]) => void;
}> = ({ preference, isOpen, onClose, onSave }) => {
    const [localSharedData, setLocalSharedData] = useState<DataPoint[]>(preference.sharedData);

    const handleToggle = (dataPoint: DataPoint) => {
        setLocalSharedData(prev => 
            prev.includes(dataPoint) ? prev.filter(p => p !== dataPoint) : [...prev, dataPoint]
        );
    };

    const handleSave = () => {
        onSave(preference.id, localSharedData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage Data Sharing for ${preference.businessName}`}>
            <p className="text-sm text-gray-600 mb-4">
                You are in control. Select the specific pieces of information you consent to share with {preference.businessName}.
            </p>
            <div className="space-y-3">
                {availableDataPoints.map(point => (
                    <label key={point} htmlFor={`dp-${point}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                        <span className="font-medium text-gray-800">{point}</span>
                        <input
                            id={`dp-${point}`}
                            type="checkbox"
                            checked={localSharedData.includes(point)}
                            onChange={() => handleToggle(point)}
                            className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                    </label>
                ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white border border-transparent rounded-md hover:bg-blue-700">Save Preferences</button>
            </div>
        </Modal>
    );
};

const ConsentCard: React.FC<{ pref: ConsentPreference, onManage: (pref: ConsentPreference) => void }> = ({ pref, onManage }) => (
    <div data-tour="consent-card" className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div className="flex items-center">
            <img src={pref.businessLogo} alt={`${pref.businessName} logo`} className="w-10 h-10 mr-4 rounded-full" />
            <div>
                <p className="font-bold text-lg text-brand-dark">{pref.businessName}</p>
                <p className="text-gray-600">{pref.purpose}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-right">
                <span className={`font-semibold ${pref.sharedData.length > 0 ? 'text-brand-success' : 'text-gray-500'}`}>
                    Sharing {pref.sharedData.length} of {availableDataPoints.length} items
                </span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                        className={`h-1.5 rounded-full ${pref.sharedData.length > 0 ? 'bg-brand-success' : 'bg-gray-300'}`} 
                        style={{ width: `${(pref.sharedData.length / availableDataPoints.length) * 100}%` }}
                    ></div>
                </div>
            </div>
            <button onClick={() => onManage(pref)} className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Manage
            </button>
        </div>
    </div>
);

interface ConsentProps {
  preferences: ConsentPreference[];
  onUpdate: (id: string, sharedData: DataPoint[]) => void;
}

const Consent: React.FC<ConsentProps> = ({ preferences, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState<ConsentPreference | null>(null);

  const handleManageClick = (preference: ConsentPreference) => {
      setSelectedPreference(preference);
      setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedPreference(null);
  }

  return (
    <>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-brand-dark">Granular Consent Preferences</h2>
                {preferences.map(pref => (
                    <ConsentCard key={pref.id} pref={pref} onManage={handleManageClick} />
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
        {selectedPreference && (
            <GranularConsentModal 
                preference={selectedPreference}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={onUpdate}
            />
        )}
    </>
  );
};

export default Consent;
