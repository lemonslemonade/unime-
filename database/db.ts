import { UserProfile, ConsentPreference, BusinessPartner, ActivityEvent, DataSharingEvent, Wildcard, BusinessProfile, BusinessCustomer, BusinessActivityEvent, CompanyDetails, CustomerDataIssue, TargetedMarketingCampaign, Message } from '../types';

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
    passwordStrength: 'Weak',
    passwordLastUpdated: '2024-01-10',
  }
];

export const dbConsentPreferences: ConsentPreference[] = [
  { id: '1', businessName: 'Global Retail Inc.', businessLogo: 'https://logo.clearbit.com/walmart.com', purpose: 'Marketing emails and promotions', sharedData: ['Name', 'Email', 'Purchase History'], lastUpdated: '2023-10-15' },
  { id: '2', businessName: 'AgriConnect SA', businessLogo: 'https://logo.clearbit.com/deere.com', purpose: 'Product updates and newsletters', sharedData: [], lastUpdated: '2023-09-22' },
  { id: '3', businessName: 'Sportify Gear', businessLogo: 'https://logo.clearbit.com/nike.com', purpose: 'Exclusive offers for members', sharedData: ['Name', 'Email'], lastUpdated: '2023-11-01' },
  { id: '4', businessName: 'FinSecure Bank', businessLogo: 'https://logo.clearbit.com/standardbank.com', purpose: 'Financial advice and new product alerts', sharedData: [], lastUpdated: '2024-01-10' },
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
    { id: 'act-0', type: 'login_success', description: 'Successfully logged in from new device.', timestamp: new Date().toISOString() },
    { id: 'act-1', type: 'profile', description: 'Profile picture was updated.', timestamp: '2024-07-21T14:30:00Z' },
    { id: 'act-2', type: 'security', description: 'Two-Factor Authentication was enabled.', timestamp: '2024-07-20T09:15:00Z' },
    { id: 'act-3', type: 'consent', description: 'Consent opted-in for "Marketing emails" with Global Retail Inc.', timestamp: '2024-07-19T11:05:00Z' },
    { id: 'act-4', type: 'sharing', description: 'Revoked data sharing access for FinSecure Bank.', timestamp: '2024-07-18T16:45:00Z' },
    { id: 'act-5', type: 'complaint', description: 'New complaint submitted regarding "Marketing Spam".', timestamp: '2024-07-17T08:20:00Z' },
    { id: 'act-7', type: 'session_timeout', description: 'Session automatically timed out due to inactivity.', timestamp: '2024-07-16T15:00:00Z' },
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

export const dbWildcards: Wildcard[] = [
  {
    id: 'wc-1',
    customerName: 'Jane Doe',
    startDate: '2022-09-13',
    endDate: '2022-09-13',
  },
   {
    id: 'wc-2',
    customerName: 'Mavis Toloane',
    startDate: '2022-07-22',
    endDate: '2022-07-22',
  },
];

export const dbBusinessProfile: BusinessProfile = {
  id: 'biz-1',
  name: 'Elite Fashion',
  logo: 'https://logo.clearbit.com/zara.com',
  category: 'Retail',
};

export const dbCompanyDetails: CompanyDetails = {
    contactName: 'John Khumalo',
    email: 'john.khumalo@elite.co.za',
    companyName: 'Elite Fashion',
    commercialSector: 'Retail',
    country: 'South Africa',
    corporateEmailAddress: 'info@elite.co.za',
    phoneNumber: '(011) 599-0101',
    customersCount: 3,
};

export const dbCustomerDataIssues: CustomerDataIssue[] = [
    {
        id: 'cdi-1',
        customer: 'Jane Doe',
        organisation: 'Elite Fashion',
        interactionType: 'Data Subject Request',
        issueDate: '08/03/2022',
        description: 'May you please confirm what PII Data you hold about me?',
        isResolved: 'Yes',
    },
];

export const dbTargetedMarketingCampaigns: TargetedMarketingCampaign[] = [
    {
        id: 'tm-1',
        startDate: '09/06/2024',
        endDate: '06/09/2024',
        productServiceWanted: 'Other',
        customers: ['Jane Doe'],
    },
    {
        id: 'tm-2',
        startDate: '09/06/2024',
        endDate: '06/09/2024',
        productServiceWanted: 'Financial Services',
        customers: ['Jane Doe'],
    },
    {
        id: 'tm-3',
        startDate: '19/06/2024',
        endDate: '06/12/2024',
        productServiceWanted: 'Bank Loan',
        customers: ['Jane Doe'],
    },
];

export const dbMessages: Message[] = [
    {
        id: 'msg-1',
        messageName: 'HH',
        sendDate: '09/01/2024',
        recipientCustomers: ['Bob Williams'],
        messageDetails: 'This is the message detail for HH.',
    },
    {
        id: 'msg-2',
        messageName: 'Laugh at life!',
        sendDate: '09/01/2024',
        recipientCustomers: ['Bob Williams', 'Sipho Ngomane'],
        messageDetails: 'This is the message detail for Laugh at life!.',
    },
    {
        id: 'msg-3',
        messageName: 'Rafola',
        sendDate: '09/01/2024',
        recipientCustomers: ['Mavis Toloane', 'Sipho Ngomane', 'Johannes Lefiso'],
        messageDetails: 'This is the message detail for Rafola.',
    },
];


export const dbBusinessCustomers: BusinessCustomer[] = [
  { id: 'user-123', name: 'Alex Doe', email: 'alex.doe@example.com', consentStatus: 'Full', sharedDataPoints: ['Name', 'Email', 'Purchase History'], lastUpdated: '2023-10-15', profilePictureUrl: `https://i.pravatar.cc/150?u=user-123` },
  { id: 'user-456', name: 'Jamie Smith', email: 'jamie.smith@example.com', consentStatus: 'Partial', sharedDataPoints: ['Name', 'Email'], lastUpdated: '2023-11-01', profilePictureUrl: `https://i.pravatar.cc/150?u=user-456` },
  { id: 'user-789', name: 'Casey Jones', email: 'casey.jones@example.com', consentStatus: 'None', sharedDataPoints: [], lastUpdated: '2023-09-22', profilePictureUrl: `https://i.pravatar.cc/150?u=user-789` },
  { id: 'user-101', name: 'Taylor Green', email: 'taylor.green@example.com', consentStatus: 'Full', sharedDataPoints: ['Name', 'Email', 'Phone', 'Address', 'Purchase History'], lastUpdated: '2024-02-28', profilePictureUrl: `https://i.pravatar.cc/150?u=user-101` },
];

export const dbBusinessActivityLog: BusinessActivityEvent[] = [
    { id: 'b-act-1', type: 'consent_update', description: 'Updated consent to share Purchase History.', timestamp: '2024-07-22T10:00:00Z', customerName: 'Alex Doe' },
    { id: 'b-act-2', type: 'new_customer', description: 'Connected with your business.', timestamp: '2024-07-21T15:30:00Z', customerName: 'Taylor Green' },
    { id: 'b-act-3', type: 'access_revoked', description: 'Revoked all data sharing consent.', timestamp: '2024-07-20T09:00:00Z', customerName: 'Casey Jones' },
    { id: 'b-act-4', type: 'consent_update', description: 'Updated consent, stopped sharing Purchase History.', timestamp: '2024-07-19T11:45:00Z', customerName: 'Jamie Smith' },
];
