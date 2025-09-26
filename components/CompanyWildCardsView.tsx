import React, { useState, useMemo } from 'react';
import { Wildcard } from '../types';
import { dbWildcards } from '../database/db';

const CompanyWildCardsView: React.FC = () => {
    const [wildcards, setWildcards] = useState<Wildcard[]>(dbWildcards);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWildcards = useMemo(() => {
        if (!searchQuery) return wildcards;
        const lowercasedQuery = searchQuery.toLowerCase();
        return wildcards.filter(wc => wc.customerName.toLowerCase().includes(lowercasedQuery));
    }, [wildcards, searchQuery]);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-GB');

    return (
        <div className="p-8 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Wildcards</h1>
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
                        <span>Add filters</span>
                    </button>
                </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">Showing {filteredWildcards.length} of {wildcards.length}</p>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wildcard Start Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wildcard End Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wildcard Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredWildcards.map(wildcard => (
                            <tr key={wildcard.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wildcard.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(wildcard.startDate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(wildcard.endDate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="text-brand-primary hover:underline font-semibold">
                                        view
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-8 text-sm text-gray-600">
                <a href="#" className="text-brand-primary hover:underline">Powered by Knack</a>
            </div>
        </div>
    );
};

export default CompanyWildCardsView;
