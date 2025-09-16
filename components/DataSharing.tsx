
import React, { useState } from 'react';
import { BusinessPartner } from '../types';

const initialBusinessPartners: BusinessPartner[] = [
  { id: '1', name: 'Global Retail Inc.', logo: 'https://logo.clearbit.com/walmart.com', category: 'E-commerce', dataShared: ['Name', 'Email', 'Purchase History'], accessDate: '2023-01-20' },
  { id: '2', name: 'AgriConnect SA', logo: 'https://logo.clearbit.com/deere.com', category: 'Agriculture', dataShared: ['Name', 'Phone', 'Address'], accessDate: '2023-03-10' },
  { id: '3', name: 'Sportify Gear', logo: 'https://logo.clearbit.com/nike.com', category: 'Sports & Recreation', dataShared: ['Name', 'Email'], accessDate: '2023-05-01' },
  { id: '4', name: 'FinSecure Bank', logo: 'https://logo.clearbit.com/standardbank.com', category: 'Finance', dataShared: ['Name', 'Email', 'Address', 'Phone'], accessDate: '2022-11-15' },
];

const PartnerCard: React.FC<{ partner: BusinessPartner, onManage: (partner: BusinessPartner) => void }> = ({ partner, onManage }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="flex items-center p-5 border-b border-gray-200">
            <img src={partner.logo} alt={`${partner.name} logo`} className="w-12 h-12 rounded-full mr-4"/>
            <div>
                <h3 className="font-bold text-lg text-brand-dark">{partner.name}</h3>
                <p className="text-sm text-gray-500">{partner.category}</p>
            </div>
        </div>
        <div className="p-6 flex-grow">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Data You've Shared:</h4>
            <div className="flex flex-wrap gap-2">
                {partner.dataShared.map(item => (
                    <span key={item} className="text-sm bg-brand-primary/10 text-brand-primary font-medium rounded-full px-3 py-1">{item}</span>
                ))}
            </div>
             <div className="mt-6">
                <p className="text-sm font-semibold text-gray-600">Access Granted On:</p>
                <p className="text-gray-800 font-medium">{partner.accessDate}</p>
            </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg mt-auto">
            <button 
                onClick={() => onManage(partner)} 
                className="w-full text-center bg-white border border-gray-300 text-brand-dark hover:bg-gray-100 font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Manage Access
            </button>
        </div>
    </div>
);

const DataSharing: React.FC = () => {
  const [partners, setPartners] = useState<BusinessPartner[]>(initialBusinessPartners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<BusinessPartner | null>(null);

  const handleManageClick = (partner: BusinessPartner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleRevokeAccess = () => {
    if (selectedPartner) {
      setPartners(prevPartners => prevPartners.filter(p => p.id !== selectedPartner.id));
      setIsModalOpen(false);
      setSelectedPartner(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  return (
    <div className="p-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-brand-dark">Who Has Your Data?</h2>
            <button 
                onClick={() => alert('This feature allows you to connect new business partners securely. Coming soon!')}
                className="bg-brand-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center shadow"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Connect New Business
            </button>
        </div>

        {partners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {partners.map(partner => (
                    <PartnerCard key={partner.id} partner={partner} onManage={handleManageClick} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-brand-dark">No Active Connections</h3>
                <p className="mt-2 text-gray-600">You are not currently sharing your data with any business partners through UniMe.</p>
            </div>
        )}
      
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                             <svg className="h-6 w-6 text-brand-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-grow">
                            <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                Revoke Access for {selectedPartner.name}?
                            </h3>
                             <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to revoke access? This action is permanent and will stop all future data sharing with this partner through UniMe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                    <button
                        type="button"
                        onClick={handleRevokeAccess}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-danger text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Revoke Access
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DataSharing;
