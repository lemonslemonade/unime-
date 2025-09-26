import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';

const SendMessages: React.FC = () => {
    const [messageName, setMessageName] = useState('');
    const [messageText, setMessageText] = useState('');
    const [manager, setManager] = useState('');
    const [messageDate, setMessageDate] = useState('');
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!messageName || !messageText) {
            toast.error("Message Name and Message Text are required.");
            return;
        }
        toast.success("Message sent successfully!");
        // Reset form
        setMessageName('');
        setMessageText('');
        setManager('');
        setMessageDate('');
    };

    return (
        <div className="p-8 bg-white">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Message</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div>
                    <label htmlFor="messageName" className="block text-sm font-medium text-gray-700">
                        Message Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="messageName"
                        value={messageName}
                        onChange={(e) => setMessageName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="messageText" className="block text-sm font-medium text-gray-700">
                        Message Text <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                        <div className="border border-gray-300 rounded-md p-2 bg-gray-100 text-sm text-gray-500">
                            Rich text editor placeholder
                        </div>
                        <textarea
                            id="messageText"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            rows={6}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                </div>
                 <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                        Manager
                    </label>
                    <select
                        id="manager"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                    >
                        <option value="">Select</option>
                        <option>John Khumalo</option>
                        <option>Jane Doe</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="messageDate" className="block text-sm font-medium text-gray-700">
                        Message Date
                    </label>
                    <input
                        type="date"
                        id="messageDate"
                        value={messageDate}
                        onChange={(e) => setMessageDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendMessages;
