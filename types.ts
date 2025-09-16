
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
}

export interface ConsentPreference {
  id: string;
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
  status: 'submitted' | 'processing' | 'resolved';
  submittedDate: string;
  category?: string;
  severity?: string;
}