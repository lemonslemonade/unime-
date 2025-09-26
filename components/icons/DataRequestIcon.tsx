import React from 'react';

const DataRequestIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l-4 4m0 0l4-4m-4 4H4m4-4V4m12 10h4m-4 0l4 4m0 0l-4-4" />
    </svg>
);

export default DataRequestIcon;
