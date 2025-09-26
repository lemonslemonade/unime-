
import React, { useState, useMemo } from 'react';
import { Wildcard } from '../types';
import { dbWildcards } from '../database/db';
import Modal from './common/Modal';
import { useToast } from '../hooks/useToast';

const WildcardMarketing: React.FC = () => {
    const [wildcards, setWildcards] = useState<Wildcard[]>(dbWildcards);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWildcard, setCurrentWildcard] = useState<Partial<Wildcard> | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toast = useToast();

    const filteredWildcards = useMemo(() => {
        if (!searchQuery) return wildcards;
        const lowercasedQuery = searchQuery.toLowerCase();
        return wildcards.filter(wc => wc.customerName.toLowerCase().includes(lowercasedQuery));
    }, [wildcards, searchQuery]);

    const isAllSelected = useMemo(() => 
        filteredWildcards.length > 0 && selectedIds.size === filteredWildcards.length,
    [filteredWildcards, selectedIds]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(filteredWildcards.map(wc => wc.id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
        } else {
            newSelectedIds.add(id);
        }
        setSelectedIds(newSelectedIds);
    };

    const handleDeleteSelected = () => {
        setWildcards(wcs => wcs.filter(wc => !selectedIds.has(wc.id)));
        const count = selectedIds.size;
        setSelectedIds(new Set());
        toast.success(`${count} wildcard(s) deleted successfully.`);
    };

    const handleExportSelected = () => {
        if (selectedIds.size === 0) return;

        const selectedData = wildcards.filter(wc => selectedIds.has(wc.id));
        const headers = ['Customer', 'Start Date', 'End Date'];
        const csvRows = [headers.join(',')];

        for (const wildcard of selectedData) {
            const row = [
                `"${wildcard.customerName.replace(/"/g, '""')}"`,
                wildcard.startDate,
                wildcard.endDate
            ].join(',');
            csvRows.push(row);
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "selected_wildcards.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${selectedIds.size} wildcard(s) exported.`);
    };

    const formatDateForDisplay = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate + 'T00:00:00');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const handleOpenModal = (wildcard?: Wildcard) => {
        setCurrentWildcard(wildcard || { customerName: '', startDate: '', endDate: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentWildcard(null);
    };

    const handleSave = () => {
        if (!currentWildcard || !currentWildcard.customerName || !currentWildcard.startDate || !currentWildcard.endDate) {
            toast.error("All fields are required.");
            return;
        }

        if (currentWildcard.id) {
            setWildcards(wcs => wcs.map(wc => wc.id === currentWildcard!.id ? (currentWildcard as Wildcard) : wc));
            toast.success('Wildcard updated successfully!');
        } else {
            const newWildcard: Wildcard = { ...currentWildcard, id: `wc-${Date.now()}` } as Wildcard;
            setWildcards(wcs => [newWildcard, ...wcs]);
            toast.success('Wildcard added successfully!');
        }
        handleCloseModal();
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentWildcard(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="p-8 bg-brand-light min-h-full">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-brand-dark mb-6">Wildcards</h1>

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div className="flex items-center">
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
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            <span>Export</span>
                        </button>
                        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM14 10a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2z" /></svg>
                            <span>Add filters</span>
                        </button>
                    </div>
                </div>
                
                {selectedIds.size > 0 && (
                    <div className="bg-brand-primary/10 border-l-4 border-brand-primary text-brand-dark p-3 my-4 rounded-r-lg flex items-center justify-between">
                        <p className="font-semibold">{selectedIds.size} item(s) selected</p>
                        <div className="space-x-2">
                            <button
                                onClick={handleExportSelected}
                                className="px-3 py-1.5 bg-white text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Export Selected
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                className="px-3 py-1.5 bg-brand-danger text-sm text-white border border-transparent rounded-md hover:bg-red-700"
                            >
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-500 mb-4">Showing {filteredWildcards.length} of {wildcards.length}</p>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        aria-label="Select all wildcards"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Wildcard Start Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Wildcard End Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Edit Wildcard</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredWildcards.map(wildcard => {
                                const isSelected = selectedIds.has(wildcard.id);
                                return (
                                <tr key={wildcard.id} className={isSelected ? 'bg-blue-50' : ''}>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                            checked={isSelected}
                                            onChange={() => handleSelectOne(wildcard.id)}
                                            aria-label={`Select wildcard for ${wildcard.customerName}`}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wildcard.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(wildcard.startDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(wildcard.endDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => handleOpenModal(wildcard)} className="text-brand-primary hover:underline font-semibold">
                                            edit
                                        </button>
                                    </td>
                                </tr>
                            )})}
                             {filteredWildcards.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No wildcards found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-6">
                    <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">
                        Add Wildcard
                    </button>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentWildcard?.id ? 'Edit Wildcard' : 'Add Wildcard'}>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={currentWildcard?.customerName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                     <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={currentWildcard?.startDate || ''}
                            onChange={handleChange}
                             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                     <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={currentWildcard?.endDate || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white border border-transparent rounded-md hover:bg-blue-700">Save</button>
                </div>
            </Modal>
        </div>
    );
};

export default WildcardMarketing;
