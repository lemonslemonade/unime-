import React, { useState, useMemo } from 'react';
import { dbBusinessCustomers } from '../database/db';
import { BusinessCustomer, availableDataPoints, CustomerDataIssue } from '../types';
import Modal from './common/Modal';
import LogDataIssueModal from './LogDataIssueModal';

// Customer Details Modal Component
const CustomerDetailsModal: React.FC<{ customer: BusinessCustomer; isOpen: boolean; onClose: () => void }> = ({ customer, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Customer Details: ${customer.name}`} size="lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img src={customer.profilePictureUrl} alt={customer.name} className="w-24 h-24 rounded-full border-4 border-gray-200" />
                <div>
                    <h3 className="text-2xl font-bold text-brand-dark">{customer.name}</h3>
                    <p className="text-gray-500">{customer.email}</p>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-800 mb-4">Consented Data Points</h4>
                <div className="space-y-3">
                {availableDataPoints.map(point => {
                    const isShared = customer.sharedDataPoints.includes(point);
                    return (
                         <div key={point} className={`flex items-center justify-between p-3 rounded-lg ${isShared ? 'bg-green-50' : 'bg-gray-100'}`}>
                            <span className={`font-medium ${isShared ? 'text-green-800' : 'text-gray-500'}`}>{point}</span>
                            {isShared ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-success" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    );
                })}
                </div>
            </div>
             <div className="mt-6 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-700">Close</button>
            </div>
        </Modal>
    );
};


interface CustomerDetailsProps {
    onLogIssue: (issueData: Omit<CustomerDataIssue, 'id' | 'organisation' | 'isResolved'>) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ onLogIssue }) => {
    const [customers] = useState<BusinessCustomer[]>(dbBusinessCustomers);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<BusinessCustomer | null>(null);
    const [isLogIssueModalOpen, setIsLogIssueModalOpen] = useState(false);

    const filteredCustomers = useMemo(() => {
        if (!searchQuery) return customers;
        const lowercasedQuery = searchQuery.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(lowercasedQuery) ||
            c.email.toLowerCase().includes(lowercasedQuery)
        );
    }, [customers, searchQuery]);
    
    const getConsentStatusStyles = (status: BusinessCustomer['consentStatus']) => {
        switch (status) {
            case 'Full':
                return 'bg-green-100 text-green-800';
            case 'Partial':
                return 'bg-yellow-100 text-yellow-800';
            case 'None':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-brand-dark">Customer Details</h3>
                 <button 
                    onClick={() => setIsLogIssueModalOpen(true)}
                    className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Log Data Issue</span>
                </button>
            </div>
            <div className="relative mb-4">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            </div>
             <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consent Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img src={customer.profilePictureUrl} alt={customer.name} className="w-10 h-10 rounded-full" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            <div className="text-sm text-gray-500">{customer.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getConsentStatusStyles(customer.consentStatus)}`}>
                                        {customer.consentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.sharedDataPoints.length} data point(s)</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedCustomer(customer)} className="text-brand-primary hover:text-blue-700">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedCustomer && (
                <CustomerDetailsModal customer={selectedCustomer} isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} />
            )}
             <LogDataIssueModal 
                isOpen={isLogIssueModalOpen}
                onClose={() => setIsLogIssueModalOpen(false)}
                onSubmit={onLogIssue}
                customers={customers}
            />
        </div>
    );
};

export default CustomerDetails;
