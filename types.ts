export enum View {
  Dashboard = 'Dashboard',
  Consent = 'Consent',
  DataSharing = 'DataSharing',
  DataSharingAuditLog = 'DataSharingAuditLog',
  Complaints = 'Complaints',
  WildcardMarketing = 'WildcardMarketing',
  Verified = 'Verified',
  ForBusiness = 'ForBusiness',
  EnterpriseSSO = 'EnterpriseSSO',
  // Business views
  BusinessDashboard = 'BusinessDashboard', // This will now be CustomerDetails
  CompanyHome = 'CompanyHome',
  CustomerDetails = 'CustomerDetails',
  CustomerDataIssues = 'CustomerDataIssues',
  CompanyWildCardsView = 'CompanyWildCardsView',
  TargetedMarketing = 'TargetedMarketing',
  Messages = 'Messages',
  SendMessages = 'SendMessages',
}

export type UserType = 'personal' | 'business';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName:string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  verificationStatus?: 'Verified' | 'Pending' | 'Unverified';
  profilePictureUrl?: string;
  is2FAEnabled: boolean;
  passwordStrength: 'Strong' | 'Medium' | 'Weak';
  passwordLastUpdated: string;
}

export type DataPoint = 'Name' | 'Email' | 'Phone' | 'Address' | 'Purchase History';

export const availableDataPoints: DataPoint[] = ['Name', 'Email', 'Phone', 'Address', 'Purchase History'];

export interface ConsentPreference {
  id: string;
  businessName: string;
  businessLogo: string;
  purpose: string;
  sharedData: DataPoint[];
  lastUpdated: string;
}

export interface BusinessPartner {
  id: string;
  name: string;
  logo: string;
  category: string;
  dataShared: string[];
  accessDate: string;
}

export interface Complaint {
  id: string;
  text: string;
  status: 'submitted' | 'processing' | 'resolved' | 'pending-sync';
  submittedDate: string;
  category?: string;
  severity?: string;
  businessInvolved?: string;
  incidentDate?: string;
  fileName?: string;
  recommendations?: string[];
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ActivityEvent {
    id: string;
    type: 'security' | 'profile' | 'consent' | 'sharing' | 'complaint' | 'login_success' | 'session_timeout';
    description: string;
    timestamp: string;
}

export interface DataSharingEvent {
    id: string;
    businessName: string;
    businessLogo: string;
    dataShared: string[];
    timestamp: string;
    consentStatus: 'opted-in' | 'opted-out';
    eventType: 'initial_share' | 'data_update' | 'access_revoked';
}

export interface TourStep {
  targetSelector: string;
  title: string;
  content: string;
  view: View;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isCentered?: boolean;
}

export interface Wildcard {
  id: string;
  customerName: string;
  startDate: string;
  endDate: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  logo: string;
  category: string;
}

export interface BusinessCustomer {
  id: string;
  name: string;
  email: string;
  consentStatus: 'Full' | 'Partial' | 'None';
  sharedDataPoints: DataPoint[];
  lastUpdated: string;
  profilePictureUrl: string;
}

export interface BusinessActivityEvent {
  id: string;
  type: 'consent_update' | 'new_customer' | 'access_revoked';
  description: string;
  timestamp: string;
  customerName: string;
}

export interface CompanyDetails {
  contactName: string;
  email: string;
  companyName: string;
  commercialSector: string;
  country: string;
  corporateEmailAddress: string;
  phoneNumber: string;
  customersCount: number;
}

export interface CustomerDataIssue {
  id: string;
  customer: string;
  organisation: string;
  interactionType: string;
  issueDate: string;
  description: string;
  isResolved: 'Yes' | 'No';
}

export interface TargetedMarketingCampaign {
  id: string;
  startDate: string;
  endDate: string;
  productServiceWanted: string;
  customers: string[];
}

export interface Message {
  id: string;
  messageName: string;
  sendDate: string;
  recipientCustomers: string[];
  messageDetails: string;
}
