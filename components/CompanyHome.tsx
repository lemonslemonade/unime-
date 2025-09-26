import React from 'react';
import { dbCompanyDetails } from '../database/db';
import { CompanyDetails } from '../types';

const DetailItem: React.FC<{ label: string; value: string | number; isLink?: boolean }> = ({ label, value, isLink }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {isLink ? <a href={`mailto:${value}`} className="text-brand-primary hover:underline">{value}</a> : value}
    </dd>
  </div>
);

const CompanyHome: React.FC = () => {
    const companyDetails: CompanyDetails = dbCompanyDetails;

    return (
        <div className="p-8 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Company Details</h1>
            <div className="mt-6 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                    <DetailItem label="Contact Name" value={companyDetails.contactName} />
                    <DetailItem label="Email" value={companyDetails.email} isLink />
                    <DetailItem label="Company Name" value={companyDetails.companyName} />
                    <DetailItem label="Commercial Sector" value={companyDetails.commercialSector} />
                    <DetailItem label="Country" value={companyDetails.country} />
                    <DetailItem label="Corporate Email Address" value={companyDetails.corporateEmailAddress} isLink />
                    <DetailItem label="Phone Number" value={companyDetails.phoneNumber} />
                    <DetailItem label="Customers Count" value={companyDetails.customersCount} />
                </dl>
            </div>
        </div>
    );
};

export default CompanyHome;
