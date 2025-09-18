export enum View {
  Dashboard = 'Dashboard',
  Consent = 'Consent',
  DataSharing = 'DataSharing',
  Complaints = 'Complaints',
  Verified = 'Verified',
  ForBusiness = 'ForBusiness',
  EnterpriseSSO = 'EnterpriseSSO',
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  verificationStatus?: 'Verified' | 'Pending' | 'Unverified';
  profilePictureUrl?: string;
  is2FAEnabled: boolean;
}

export interface ConsentPreference {
  id:string;
  businessName: string;
  businessLogo: string;
  purpose: string;
  status: 'opted-in' | 'opted-out';
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