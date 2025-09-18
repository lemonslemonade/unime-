import React, { useState, useMemo } from 'react';
import { DataSharingEvent } from '../types';

const EventTypeBadge: React.FC<{ type: DataSharingEvent['eventType'] }> = ({ type }) => {
    const styles = {
        initial_share: 'bg-blue-100 text-blue-800',
        data_update: 'bg-yellow-100 text-yellow-800',
        access_revoked: 'bg-red-100 text-red-800',
    };
    const text = {
        initial_share: 'Initial Share',
        data_update: 'Data Update',
        access_revoked: 'Access Revoked',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles[type]}`}>{text[type]}</span>;
};

const ConsentStatusBadge: React.FC<{ status: DataSharingEvent['consentStatus'] }> = ({ status }) => {
    const styles = {
        'opted-in': 'bg-green-100 text-green-800',
        'opted-out': 'bg-gray-200 text-gray-800',
    };
    const text = {
        'opted-in': 'Opted-In',
        'opted-out': 'Opted-Out',
    };
     return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
};


interface DataSharingAuditLogProps {
    log: DataSharingEvent[];
}

const DataSharingAuditLog: React.FC<DataSharingAuditLogProps> = ({ log }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLog = useMemo(() => {
        const sortedLog = [...log].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (!searchQuery) {
            return sortedLog;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return sortedLog.filter(event =>
            event.businessName.toLowerCase().includes(lowercasedQuery)
        );
    }, [log, searchQuery]);

    const formatTimestamp = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-brand-dark">Data Sharing History</h2>
                <p className="text-gray-600 mt-2">A complete record of every time your data was shared with a business partner through UniMe.</p>
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
                            placeholder="Search by business name..."
                            className="w-full max-w-lg pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Shared</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consent Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLog.length > 0 ? (
                                filteredLog.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full" src={event.businessLogo} alt={`${event.businessName} logo`} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{event.businessName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <EventTypeBadge type={event.eventType} />
                                        </td>
                                        <td className="px-6 py-4">
                                             <div className="flex flex-wrap gap-1 max-w-xs">
                                                {event.dataShared.map(item => (
                                                    <span key={item} className="text-xs bg-brand-primary/10 text-brand-primary font-medium rounded-full px-2 py-0.5">{item}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                           <ConsentStatusBadge status={event.consentStatus} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatTimestamp(event.timestamp)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 px-6">
                                        <div className="max-w-md mx-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-4 text-xl font-semibold text-brand-dark">
                                                {searchQuery ? 'No Matching Records' : 'No Sharing History'}
                                            </h3>
                                            <p className="mt-2 text-gray-600">
                                                {searchQuery 
                                                    ? `Your search for "${searchQuery}" did not match any audit log entries.`
                                                    : 'There are no data sharing events to display yet.'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataSharingAuditLog;