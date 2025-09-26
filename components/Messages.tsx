import React, { useState, useMemo } from 'react';
import { Message } from '../types';
import { dbMessages } from '../database/db';

const Messages: React.FC = () => {
    const [messages] = useState<Message[]>(dbMessages);
    
    return (
        <div className="p-8 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Messages_Sents</h1>
            <p className="text-sm text-gray-500 my-4">Showing {messages.length} of {messages.length}</p>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Send Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient Customers</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {messages.map(message => (
                            <tr key={message.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.messageName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.sendDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {message.recipientCustomers.map((customer, index) => (
                                        <div key={index}>{customer}</div>
                                    ))}
                                </td>
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
        </div>
    );
};

export default Messages;
