import React, { useState } from 'react';
import Modal from './common/Modal';
import { useToast } from '../hooks/useToast';
import { CustomerDataIssue, BusinessCustomer } from '../types';

interface LogDataIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (issueData: Omit<CustomerDataIssue, 'id' | 'organisation' | 'isResolved'>) => void;
    customers: BusinessCustomer[];
}

const interactionTypes = [
    "Data Subject Request",
    "Data Inaccuracy Report",
    "Consent Withdrawal",
    "Right to be Forgotten Request",
    "Other"
];

const LogDataIssueModal: React.FC<LogDataIssueModalProps> = ({ isOpen, onClose, onSubmit, customers }) => {
    const [customer, setCustomer] = useState('');
    const [interactionType, setInteractionType] = useState('');
    const [customInteractionType, setCustomInteractionType] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [description, setDescription] = useState('');
    const toast = useToast();

    const getInteractionValue = () => {
        return interactionType === 'Other' ? customInteractionType : interactionType;
    };

    const resetForm = () => {
        setCustomer('');
        setInteractionType('');
        setCustomInteractionType('');
        setIssueDate('');
        setDescription('');
    };

    const handleSubmit = () => {
        if (!customer || !getInteractionValue() || !issueDate || !description) {
            toast.error('Please fill out all required fields.');
            return;
        }
        
        const finalInteractionType = getInteractionValue();

        onSubmit({
            customer,
            interactionType: finalInteractionType,
            issueDate,
            description,
        });

        resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log New Customer Data Issue">
            <div className="space-y-4">
                <div>
                    <label htmlFor="customer" className="block text-sm font-medium text-gray-700">Customer <span className="text-red-500">*</span></label>
                    <select
                        id="customer"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                        required
                    >
                        <option value="">Select a customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="interactionType" className="block text-sm font-medium text-gray-700">Customer Interaction Type <span className="text-red-500">*</span></label>
                    <select
                        id="interactionType"
                        value={interactionType}
                        onChange={(e) => setInteractionType(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                        required
                    >
                        <option value="">Select a type</option>
                        {interactionTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                {interactionType === 'Other' && (
                     <div>
                        <label htmlFor="customInteractionType" className="block text-sm font-medium text-gray-700">Please specify <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="customInteractionType"
                            value={customInteractionType}
                            onChange={(e) => setCustomInteractionType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        id="issueDate"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                    <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        required
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-brand-primary text-white border border-transparent rounded-md hover:bg-blue-700">Log Issue</button>
            </div>
        </Modal>
    );
};

export default LogDataIssueModal;
