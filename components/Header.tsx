
import React from 'react';
import { UserProfile, View } from '../types';

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
  activeView: View;
}

const viewTitles: Record<View, string> = {
  [View.Dashboard]: 'Profile Dashboard',
  [View.Consent]: 'Consent Controls',
  [View.DataSharing]: 'Data Sharing Overview',
  [View.DataSharingAuditLog]: 'Data Sharing Audit Log',
  [View.Complaints]: 'Submit a Complaint',
  [View.Verified]: 'UniMe Verified',
  [View.ForBusiness]: 'For Businesses',
  [View.EnterpriseSSO]: 'Enterprise SSO',
};

const Header: React.FC<HeaderProps> = ({ user, onLogout, activeView }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-brand-dark">{viewTitles[activeView]}</h1>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-brand-dark">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <img
          src={user.profilePictureUrl || `https://i.pravatar.cc/150?u=${user.id}`}
          alt="User avatar"
          className="w-12 h-12 rounded-full border-2 border-brand-primary object-cover"
        />
        <button
          onClick={onLogout}
          className="bg-brand-danger text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;