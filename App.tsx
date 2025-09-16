
import React, { useState } from 'react';
import { View, UserProfile } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Consent from './components/Consent';
import DataSharing from './components/DataSharing';
import Complaints from './components/Complaints';
import Verified from './components/Verified';
import ForBusiness from './components/ForBusiness';
import EnterpriseSSO from './components/EnterpriseSSO';
import DashboardIcon from './components/icons/DashboardIcon';
import ConsentIcon from './components/icons/ConsentIcon';
import DataSharingIcon from './components/icons/DataSharingIcon';
import ComplaintIcon from './components/icons/ComplaintIcon';
import VerifiedIcon from './components/icons/VerifiedIcon';
import BusinessIcon from './components/icons/BusinessIcon';
import SSOIcon from './components/icons/SSOIcon';

const mockUser: UserProfile = {
  id: 'user-123',
  firstName: 'Alex',
  lastName: 'Doe',
  email: 'alex.doe@example.com',
  phone: '+27 82 123 4567',
  address: '123 Main Street, Cape Town, 8001',
  isVerified: false,
  verificationStatus: 'Unverified',
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg
      ${isActive
        ? 'bg-brand-primary text-white shadow-lg'
        : 'text-gray-600 hover:bg-brand-neutral hover:text-brand-dark'
      }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handleVerificationSuccess = () => {
    setUser(currentUser => ({
      ...currentUser,
      isVerified: true,
      verificationStatus: 'Verified',
    }));
    // After successful verification, navigate the user to the dashboard.
    setActiveView(View.Dashboard);
  };

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard user={user} />;
      case View.Consent:
        return <Consent />;
      case View.DataSharing:
        return <DataSharing />;
      case View.Complaints:
        return <Complaints />;
      case View.Verified:
        return <Verified isVerified={user.isVerified} onVerificationSuccess={handleVerificationSuccess} />;
      case View.EnterpriseSSO:
        return <EnterpriseSSO user={user} />;
      case View.ForBusiness:
        return <ForBusiness />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { view: View.Consent, label: 'Consent', icon: <ConsentIcon /> },
    { view: View.DataSharing, label: 'Data Sharing', icon: <DataSharingIcon /> },
    { view: View.Complaints, label: 'Complaints', icon: <ComplaintIcon /> },
    { view: View.Verified, label: 'Get Verified', icon: <VerifiedIcon /> },
    { view: View.EnterpriseSSO, label: 'Enterprise SSO', icon: <SSOIcon /> },
    { view: View.ForBusiness, label: 'For Business', icon: <BusinessIcon /> },
  ];
  
  // Conditionally render the 'Verified' nav item, but keep 'Get Verified' always visible if not verified
  const displayedNavItems = navItems.map(item => {
      if (item.view === View.Verified) {
          return user.isVerified 
              ? { ...item, label: 'Verified' } // Change label if verified
              : item; // Show "Get Verified" if not
      }
      return item;
  });

  return (
    <div className="flex h-screen bg-brand-light">
      <aside className="w-64 bg-white flex-shrink-0 p-4 border-r border-gray-200 flex flex-col">
        <div className="text-center py-4">
            <h1 className="text-3xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
        </div>
        <nav className="mt-8 space-y-2 flex-grow" aria-label="Main navigation">
          {displayedNavItems.map(item => (
            <NavItem 
              key={item.view}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.view}
              onClick={() => setActiveView(item.view)}
            />
          ))}
        </nav>
        <div className="p-2 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} UniMe Inc.
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={handleLogout} activeView={activeView} />
        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;