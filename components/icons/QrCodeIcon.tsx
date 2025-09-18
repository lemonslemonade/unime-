import React from 'react';

const QrCodeIcon = ({ className = 'w-48 h-48' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H30V30H0V0ZM10 10V20H20V10H10Z" fill="black"/>
        <path d="M70 0H100V30H70V0ZM80 10V20H90V10H80Z" fill="black"/>
        <path d="M0 70H30V100H0V70ZM10 80V90H20V80H10Z" fill="black"/>
        <path d="M70 70H80V80H70V70ZM90 70H100V80H90V70ZM70 90H80V100H70V90ZM90 90H100V100H90V90Z" fill="black"/>
        <path d="M40 0H50V10H40V0ZM60 0H70V10H60V0ZM40 20H50V30H40V20Z" fill="black"/>
        <path d="M0 40H10V50H0V40ZM20 40H30V50H20V40Z" fill="black"/>
        <path d="M40 40H50V50H40V40ZM60 40H70V50H60V40ZM80 40H90V50H80V40Z" fill="black"/>
        <path d="M40 60H50V70H40V60ZM60 60H70V80H60V60Z" fill="black"/>
        <path d="M40 80H50V100H40V80ZM80 60H100V70H80V60Z" fill="black"/>
    </svg>
);

export default QrCodeIcon;