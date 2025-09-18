import { UserProfile, ConsentPreference, BusinessPartner, ActivityEvent, DataSharingEvent } from '../types';

export const dbUsers: UserProfile[] = [
  {
    id: 'user-123',
    firstName: 'Alex',
    lastName: 'Doe',
    email: 'alex.doe@example.com',
    phone: '+27 82 123 4567',
    address: '123 Main Street, Cape Town, 8001',
    isVerified: false,
    verificationStatus: 'Unverified',
    is2FAEnabled: false,
  }
];

export const dbConsentPreferences: ConsentPreference[] = [
  { id: '1', businessName: 'Global Retail Inc.', businessLogo: 'https://logo.clearbit.com/walmart.com', purpose: 'Marketing emails and promotions', status: 'opted-in', lastUpdated: '2023-10-15' },
  { id: '2', businessName: 'AgriConnect SA', businessLogo: 'https://logo.clearbit.com/deere.com', purpose: 'Product updates and newsletters', status: 'opted-out', lastUpdated: '2023-09-22' },
  { id: '3', businessName: 'Sportify Gear', businessLogo: 'https://logo.clearbit.com/nike.com', purpose: 'Exclusive offers for members', status: 'opted-in', lastUpdated: '2023-11-01' },
  { id: '4', businessName: 'FinSecure Bank', businessLogo: 'https://logo.clearbit.com/standardbank.com', purpose: 'Financial advice and new product alerts', status: 'opted-out', lastUpdated: '2024-01-10' },
];

export const dbBusinessPartners: BusinessPartner[] = [
  { id: '1', name: 'Global Retail Inc.', logo: 'https://logo.clearbit.com/walmart.com', category: 'E-commerce', dataShared: ['Name', 'Email', 'Purchase History'], accessDate: '2023-01-20' },
  { id: '2', name: 'AgriConnect SA', logo: 'https://logo.clearbit.com/deere.com', category: 'Agriculture', dataShared: ['Name', 'Phone', 'Address'], accessDate: '2023-03-10' },
  { id: '3', name: 'Sportify Gear', logo: 'https://logo.clearbit.com/nike.com', category: 'Sports & Recreation', dataShared: ['Name', 'Email'], accessDate: '2023-05-01' },
  { id: '4', name: 'FinSecure Bank', logo: 'https://logo.clearbit.com/standardbank.com', category: 'Finance', dataShared: ['Name', 'Email', 'Address', 'Phone'], accessDate: '2022-11-15' },
];

export const dbAvailablePartners: Omit<BusinessPartner, 'dataShared' | 'accessDate'>[] = [
  { id: '5', name: 'HealthWell Clinics', logo: 'https://logo.clearbit.com/discovery.co.za', category: 'Healthcare' },
  { id: '6', name: 'NextGen Tech', logo: 'https://logo.clearbit.com/microsoft.com', category: 'Technology' },
  { id: '7', name: 'Creative Solutions', logo: 'https://logo.clearbit.com/adobe.com', category: 'Software' },
  { id: '8', name: 'Data Dynamics Corp', logo: 'https://logo.clearbit.com/oracle.com', category: 'Enterprise Software' },
  { id: '9', name: 'AutoDrive Motors', logo: 'https://logo.clearbit.com/tesla.com', category: 'Automotive' },
  { id: '10', name: 'SkyHigh Airlines', logo: 'https://logo.clearbit.com/flysaa.com', category: 'Travel' },
];

export const dbActivityLog: ActivityEvent[] = [
    { id: 'act-1', type: 'profile', description: 'Profile picture was updated.', timestamp: '2024-07-21T14:30:00Z' },
    { id: 'act-2', type: 'security', description: 'Two-Factor Authentication was enabled.', timestamp: '2024-07-20T09:15:00Z' },
    { id: 'act-3', type: 'consent', description: 'Consent opted-in for "Marketing emails" with Global Retail Inc.', timestamp: '2024-07-19T11:05:00Z' },
    { id: 'act-4', type: 'sharing', description: 'Revoked data sharing access for FinSecure Bank.', timestamp: '2024-07-18T16:45:00Z' },
    { id: 'act-5', type: 'complaint', description: 'New complaint submitted regarding "Marketing Spam".', timestamp: '2024-07-17T08:20:00Z' },
    { id: 'act-6', type: 'profile', description: 'Profile information was successfully saved.', timestamp: '2024-07-16T12:00:00Z' },
];

export const dbDataSharingLog: DataSharingEvent[] = [
    { id: 'log-1', businessName: 'Global Retail Inc.', businessLogo: 'https://logo.clearbit.com/walmart.com', dataShared: ['Name', 'Email', 'Purchase History'], timestamp: '2024-07-20T10:00:00Z', consentStatus: 'opted-in', eventType: 'initial_share' },
    { id: 'log-2', businessName: 'Sportify Gear', businessLogo: 'https://logo.clearbit.com/nike.com', dataShared: ['Email'], timestamp: '2024-07-19T11:30:00Z', consentStatus: 'opted-in', eventType: 'data_update' },
    { id: 'log-3', businessName: 'FinSecure Bank', businessLogo: 'https://logo.clearbit.com/standardbank.com', dataShared: ['Name', 'Email', 'Address', 'Phone'], timestamp: '2024-07-18T16:45:00Z', consentStatus: 'opted-out', eventType: 'access_revoked' },
    { id: 'log-4', businessName: 'AgriConnect SA', businessLogo: 'https://logo.clearbit.com/deere.com', dataShared: ['Name', 'Phone'], timestamp: '2024-07-15T09:00:00Z', consentStatus: 'opted-in', eventType: 'data_update' },
    { id: 'log-5', businessName: 'Sportify Gear', businessLogo: 'https://logo.clearbit.com/nike.com', dataShared: ['Name', 'Email'], timestamp: '2024-07-12T14:00:00Z', consentStatus: 'opted-in', eventType: 'initial_share' },
    { id: 'log-6', businessName: 'FinSecure Bank', businessLogo: 'https://logo.clearbit.com/standardbank.com', dataShared: ['Name', 'Email', 'Address', 'Phone'], timestamp: '2024-07-10T18:00:00Z', consentStatus: 'opted-in', eventType: 'initial_share' },
];
