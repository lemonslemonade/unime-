import React, { useState, useMemo } from 'react';
import { CustomerDataIssue, BusinessCustomer } from '../types';
import LogDataIssueModal from './LogDataIssueModal';

interface CustomerDataIssuesProps {
    issues: CustomerDataIssue[];
    onLogIssue: (issueData: Omit<CustomerDataIssue, 'id' | 'organisation' | 'isResolved'>) => void;
    customers: BusinessCustomer[];
}

const CustomerDataIssues: React.FC<CustomerDataIssuesProps> = ({ issues, onLogIssue, customers }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLogIssueModalOpen, setIsLogIssueModalOpen] = useState(false);

    const sortedIssues = useMemo(() => {
        // Sort by date, most recent first. Handles the MM/DD/YYYY format.
        return [...issues].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [issues]);

    const filteredIssues = useMemo(() => {
        if (!searchQuery) return sortedIssues;
        const lowercasedQuery = searchQuery.toLowerCase();
        return sortedIssues.filter(issue => 
            issue.customer.toLowerCase().includes(lowercasedQuery) ||
            issue.description.toLowerCase().includes(lowercasedQuery) ||
            issue.interactionType.toLowerCase().includes(lowercasedQuery)
        );
    }, [sortedIssues, searchQuery]);

    return (
        <div className="p-8 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Customer Data Issues</h1>

            <div className="my-4 flex justify-between items-center">
                <div className="flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by keyword"
                        className="w-full md:w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 border-t border-r border-b border-gray-300 rounded-r-md hover:bg-gray-300">
                        Search
                    </button>
                </div>
                 <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                         <span>Export</span>
                    </button>
                    <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                        <span>Add filters</span>
                    </button>
                </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">Showing {filteredIssues.length} of {issues.length}</p>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Interaction Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Resolved?</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit Issue</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredIssues.map(issue => (
                            <tr key={issue.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.organisation}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.interactionType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.issueDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{issue.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.isResolved}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="text-brand-primary hover:underline font-semibold">
                                        edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6">
                <button onClick={() => setIsLogIssueModalOpen(true)} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">
                    Log Data Issue
                </button>
            </div>
            <LogDataIssueModal 
                isOpen={isLogIssueModalOpen}
                onClose={() => setIsLogIssueModalOpen(false)}
                onSubmit={onLogIssue}
                customers={customers}
            />
        </div>
    );
};

export default CustomerDataIssues;
