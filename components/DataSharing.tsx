import React, { useState, useMemo } from 'react';
import { BusinessPartner } from '../types';
import { dbBusinessPartners, dbAvailablePartners } from '../database/db';
import { useToast } from '../hooks/useToast';
import Modal from './common/Modal';

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
  const [partners, setPartners] = useState<BusinessPartner[]>(dbBusinessPartners);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<BusinessPartner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectSearch, setConnectSearch] = useState('');
  const toast = useToast();

  const filteredPartners = useMemo(() => {
    if (!searchQuery) {
        return partners;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return partners.filter(partner =>
        partner.name.toLowerCase().includes(lowercasedQuery) ||
        partner.category.toLowerCase().includes(lowercasedQuery)
    );
  }, [partners, searchQuery]);

  const availableToConnect = useMemo(() => {
    const existingPartnerIds = new Set(partners.map(p => p.id));
    return dbAvailablePartners
        .filter(p => !existingPartnerIds.has(p.id))
        .filter(p => 
            p.name.toLowerCase().includes(connectSearch.toLowerCase()) || 
            p.category.toLowerCase().includes(connectSearch.toLowerCase())
        );
  }, [partners, connectSearch]);

  const handleManageClick = (partner: BusinessPartner) => {
    setSelectedPartner(partner);
    setIsManageModalOpen(true);
  };

  const handleRevokeAccess = () => {
    if (selectedPartner) {
      setPartners(prevPartners => prevPartners.filter(p => p.id !== selectedPartner.id));
      toast.success(`Access for ${selectedPartner.name} has been revoked.`);
      setIsManageModalOpen(false);
      setSelectedPartner(null);
    }
  };
  
  const handleConnectNewPartner = (newPartner: Omit<BusinessPartner, 'dataShared' | 'accessDate'>) => {
    const newFullPartner: BusinessPartner = {
      ...newPartner,
      dataShared: ['Name', 'Email'], // Default shared data
      accessDate: new Date().toISOString().split('T')[0],
    };
    setPartners(prev => [newFullPartner, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
    toast.success(`Successfully connected with ${newFullPartner.name}.`);
  };

  const handleExportCSV = () => {
    if (partners.length === 0) return;

    const headers = ['Name', 'Category', 'Data Shared', 'Access Granted On'];
    const csvRows = [headers.join(',')];

    for (const partner of partners) {
        const dataSharedString = `"${partner.dataShared.join('; ')}"`;
        const row = [
            `"${partner.name.replace(/"/g, '""')}"`,
            `"${partner.category.replace(/"/g, '""')}"`,
            dataSharedString,
            partner.accessDate
        ].join(',');
        csvRows.push(row);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "unime_connections.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Connections exported successfully!');
  };

  return (
    <div className="p-8">
        <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-brand-dark">Who Has Your Data?</h2>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={handleExportCSV}
                        disabled={partners.length === 0}
                        className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105 flex items-center justify-center shadow disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                        aria-label="Export connections as CSV"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                         </svg>
                        Export Connections
                    </button>
                    <button 
                        onClick={() => {
                            setIsConnectModalOpen(true);
                            setConnectSearch('');
                        }}
                        className="bg-brand-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center justify-center shadow"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Connect New Business
                    </button>
                </div>
            </div>
             <div className="mt-6">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
            </div>
        </div>

        {partners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPartners.length > 0 ? (
                    filteredPartners.map(partner => (
                        <PartnerCard key={partner.id} partner={partner} onManage={handleManageClick} />
                    ))
                ) : (
                    <div className="text-center py-20 px-6 bg-gray-50 rounded-lg shadow-inner md:col-span-2 xl:col-span-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-semibold text-brand-dark">No Partners Found</h3>
                        <p className="mt-2 text-gray-600">Your search for "{searchQuery}" did not match any connected business partners.</p>
                    </div>
                )}
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
      
      <Modal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} title="Connect a New Business">
        <div className="mt-4 relative">
            <input
                type="text"
                value={connectSearch}
                onChange={(e) => setConnectSearch(e.target.value)}
                placeholder="Search by name or category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </span>
        </div>
        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
            {availableToConnect.length > 0 ? (
                availableToConnect.map(partner => (
                    <div key={partner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center">
                            <img src={partner.logo} alt={`${partner.name} logo`} className="w-10 h-10 rounded-full mr-4"/>
                            <div>
                                <p className="font-semibold text-brand-dark">{partner.name}</p>
                                <p className="text-sm text-gray-500">{partner.category}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleConnectNewPartner(partner)}
                            className="bg-brand-primary text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 text-sm"
                        >
                            Connect
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-8">No businesses found matching your search.</p>
            )}
        </div>
      </Modal>

      <Modal 
        isOpen={isManageModalOpen} 
        onClose={() => setIsManageModalOpen(false)} 
        title={`Revoke Access for ${selectedPartner?.name}?`}
        titleIcon={
             <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                 <svg className="h-6 w-6 text-brand-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        }
      >
        <p className="text-sm text-gray-600">
            Are you sure you want to revoke access? This action is permanent and will stop all future data sharing with this partner through UniMe.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
             <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={handleRevokeAccess}
                className="px-4 py-2 bg-brand-danger text-white border border-transparent rounded-md hover:bg-red-700"
            >
                Revoke Access
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default DataSharing;
