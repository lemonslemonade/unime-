import React, { useState, useEffect } from 'react';
import { View, UserProfile, ConsentPreference, ActivityEvent, DataSharingEvent } from './types';
import { dbUsers, dbConsentPreferences, dbActivityLog, dbDataSharingLog } from './database/db';
import { ToastProvider } from './contexts/ToastContext';
import { useToast } from './hooks/useToast';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Consent from './components/Consent';
import DataSharing from './components/DataSharing';
import DataSharingAuditLog from './components/DataSharingAuditLog';
import Complaints from './components/Complaints';
import Verified from './components/Verified';
import ForBusiness from './components/ForBusiness';
import EnterpriseSSO from './components/EnterpriseSSO';
import ToastContainer from './components/common/ToastContainer';
import DashboardIcon from './components/icons/DashboardIcon';
import ConsentIcon from './components/icons/ConsentIcon';
import DataSharingIcon from './components/icons/DataSharingIcon';
import ComplaintIcon from './components/icons/ComplaintIcon';
import VerifiedIcon from './components/icons/VerifiedIcon';
import BusinessIcon from './components/icons/BusinessIcon';
import SSOIcon from './components/icons/SSOIcon';
import AuditLogIcon from './components/icons/AuditLogIcon';

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

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>(dbUsers[0]);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [consentPreferences, setConsentPreferences] = useState<ConsentPreference[]>(dbConsentPreferences);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(dbActivityLog);
  const [dataSharingLog, setDataSharingLog] = useState<DataSharingEvent[]>(dbDataSharingLog);
  const toast = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      const savedPicture = localStorage.getItem(`profilePicture-${user.id}`);
      if (savedPicture) {
        setUser(prevUser => ({ ...prevUser, profilePictureUrl: savedPicture }));
      }
    }
  }, [isLoggedIn, user.id]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('rememberedEmail');
  };

  const handleVerificationSuccess = () => {
    setUser(currentUser => ({
      ...currentUser,
      isVerified: true,
      verificationStatus: 'Verified',
    }));
    setActiveView(View.Dashboard);
    toast.success('Your account has been successfully verified!');
  };
  
  const handleProfilePictureUpdate = (newPicture: string) => {
    setUser(prevUser => ({ ...prevUser, profilePictureUrl: newPicture }));
    localStorage.setItem(`profilePicture-${user.id}`, newPicture);
    toast.success('Profile picture updated successfully!');
  };

  const handleUserUpdate = (updatedFields: Partial<UserProfile>) => {
    setUser(currentUser => ({...currentUser, ...updatedFields}));
  };
  
  const handleConsentToggle = (id: string) => {
    setConsentPreferences(prefs =>
      prefs.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'opted-in' ? 'opted-out' : 'opted-in', lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard user={user} consentPreferences={consentPreferences} activityLog={activityLog} onProfilePictureUpdate={handleProfilePictureUpdate} onUserUpdate={handleUserUpdate} />;
      case View.Consent:
        return <Consent preferences={consentPreferences} onToggle={handleConsentToggle} />;
      case View.DataSharing:
        return <DataSharing />;
      case View.DataSharingAuditLog:
        return <DataSharingAuditLog log={dataSharingLog} />;
      case View.Complaints:
        return <Complaints />;
      case View.Verified:
        return <Verified isVerified={user.isVerified} onVerificationSuccess={handleVerificationSuccess} />;
      case View.EnterpriseSSO:
        return <EnterpriseSSO user={user} />;
      case View.ForBusiness:
        return <ForBusiness />;
      default:
        return <Dashboard user={user} consentPreferences={consentPreferences} activityLog={activityLog} onProfilePictureUpdate={handleProfilePictureUpdate} onUserUpdate={handleUserUpdate} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { view: View.Consent, label: 'Consent', icon: <ConsentIcon /> },
    { view: View.DataSharing, label: 'Data Sharing', icon: <DataSharingIcon /> },
    { view: View.DataSharingAuditLog, label: 'Audit Log', icon: <AuditLogIcon /> },
    { view: View.Complaints, label: 'Complaints', icon: <ComplaintIcon /> },
    { view: View.Verified, label: 'Get Verified', icon: <VerifiedIcon /> },
    { view: View.EnterpriseSSO, label: 'Enterprise SSO', icon: <SSOIcon /> },
    { view: View.ForBusiness, label: 'For Business', icon: <BusinessIcon /> },
  ];
  
  const displayedNavItems = navItems.map(item => {
      if (item.view === View.Verified) {
          return user.isVerified 
              ? { ...item, label: 'Verified' }
              : item;
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

const App: React.FC = () => (
    <ToastProvider>
        <AppContent />
        <ToastContainer />
    </ToastProvider>
);

export default App;