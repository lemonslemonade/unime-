import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, UserProfile, ConsentPreference, ActivityEvent, DataSharingEvent, DataPoint, UserType, CustomerDataIssue } from './types';
import { dbUsers, dbConsentPreferences, dbActivityLog, dbDataSharingLog, dbBusinessProfile, dbCustomerDataIssues, dbBusinessCustomers } from './database/db';
import { ToastProvider } from './contexts/ToastContext';
import { useToast } from './hooks/useToast';
import Login from './components/Login';
import AuthEntry from './components/AuthEntry';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Consent from './components/Consent';
import DataSharing from './components/DataSharing';
import DataSharingAuditLog from './components/DataSharingAuditLog';
import Complaints from './components/Complaints';
import WildcardMarketing from './components/WildcardMarketing';
import Verified from './components/Verified';
import EnterpriseSSO from './components/EnterpriseSSO';
import CustomerDetails from './components/BusinessDashboard';
import CompanyHome from './components/CompanyHome';
import CustomerDataIssues from './components/CustomerDataIssues';
import CompanyWildCardsView from './components/CompanyWildCardsView';
import TargetedMarketing from './components/TargetedMarketing';
import Messages from './components/Messages';
import SendMessages from './components/SendMessages';
import ToastContainer from './components/common/ToastContainer';
import SessionTimeoutModal from './components/common/SessionTimeoutModal';
import DashboardIcon from './components/icons/DashboardIcon';
import ConsentIcon from './components/icons/ConsentIcon';
import DataSharingIcon from './components/icons/DataSharingIcon';
import ComplaintIcon from './components/icons/ComplaintIcon';
import WildcardMarketingIcon from './components/icons/WildcardMarketingIcon';
import VerifiedIcon from './components/icons/VerifiedIcon';
import AuditLogIcon from './components/icons/AuditLogIcon';
import SSOIcon from './components/icons/SSOIcon';
import OnboardingModal from './components/common/OnboardingModal';
import Onboarding from './components/Onboarding';
import { tourSteps } from './tourSteps';
import CompanyHomeIcon from './components/icons/CompanyHomeIcon';
import CustomerDetailsIcon from './components/icons/BusinessDashboardIcon';
import CustomerDataIssuesIcon from './components/icons/CustomerDataIssuesIcon';
import TargetedMarketingIcon from './components/icons/TargetedMarketingIcon';
import MessagesIcon from './components/icons/MessagesIcon';
import SendMessagesIcon from './components/icons/SendMessagesIcon';

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const TIMEOUT_WARNING = 2 * 60 * 1000; // 2 minutes

const useIdleTimer = (onIdle: () => void, onWarning: () => void, timeout: number, warningTime: number) => {
    const timeoutId = useRef<number | null>(null);
    const warningTimeoutId = useRef<number | null>(null);

    const resetTimer = useCallback(() => {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        if (warningTimeoutId.current) clearTimeout(warningTimeoutId.current);

        warningTimeoutId.current = window.setTimeout(onWarning, timeout - warningTime);
        timeoutId.current = window.setTimeout(onIdle, timeout);
    }, [onIdle, onWarning, timeout, warningTime]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
        
        const handleActivity = () => resetTimer();
        
        events.forEach(event => window.addEventListener(event, handleActivity));
        resetTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            if (timeoutId.current) clearTimeout(timeoutId.current);
            if (warningTimeoutId.current) clearTimeout(warningTimeoutId.current);
        };
    }, [resetTimer]);

    return resetTimer;
};


const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  'data-tour'?: string;
}> = ({ icon, label, isActive, onClick, ...rest }) => (
  <button
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg
      ${isActive
        ? 'bg-brand-primary text-white shadow-lg'
        : 'text-gray-600 hover:bg-brand-neutral hover:text-brand-dark'
      }`}
    {...rest}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </button>
);

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>(dbUsers[0]);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [activeBusinessView, setActiveBusinessView] = useState<View>(View.CompanyHome);
  const [consentPreferences, setConsentPreferences] = useState<ConsentPreference[]>(dbConsentPreferences);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(dbActivityLog);
  const [dataSharingLog, setDataSharingLog] = useState<DataSharingEvent[]>(dbDataSharingLog);
  const [customerDataIssues, setCustomerDataIssues] = useState<CustomerDataIssue[]>(dbCustomerDataIssues);
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [authScreen, setAuthScreen] = useState<'entry' | 'login'>('entry');
  const toast = useToast();

  const businessUser: UserProfile = {
      id: 'biz-user-john-khumalo',
      firstName: 'John',
      lastName: 'Khumalo',
      email: 'john.khumalo@elite.co.za',
      phone: '(011) 599-0101',
      address: '100 Business Rd, Sandton, 2196',
      isVerified: true,
      verificationStatus: 'Verified',
      profilePictureUrl: `https://i.pravatar.cc/150?u=johnkhumalo`,
      is2FAEnabled: true,
      passwordStrength: 'Strong',
      passwordLastUpdated: new Date().toISOString().split('T')[0],
  };

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserType(null);
    setAuthScreen('entry');
    setActiveView(View.Dashboard);
    setActiveBusinessView(View.CompanyHome);
    setIsTimeoutModalOpen(false);
    localStorage.removeItem('rememberedEmail');
  }, []);

  const handleIdle = useCallback(() => {
    toast.info("You've been logged out due to inactivity.");
    handleLogout();
  }, [handleLogout, toast]);
  
  const handleWarning = () => setIsTimeoutModalOpen(true);
  
  const resetIdleTimer = useIdleTimer(handleIdle, handleWarning, SESSION_TIMEOUT, TIMEOUT_WARNING);

  useEffect(() => {
    if (isLoggedIn && userType === 'personal') {
      const savedPicture = localStorage.getItem(`profilePicture-${user.id}`);
      if (savedPicture) {
        setUser(prevUser => ({ ...prevUser, profilePictureUrl: savedPicture }));
      }
      const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
      if (!hasCompletedOnboarding) {
          setTimeout(() => setShowOnboardingModal(true), 1000);
      }
    }
  }, [isLoggedIn, user.id, userType]);

  const handleLogin = (type: UserType) => {
    setIsLoggedIn(true);
    setUserType(type);
    resetIdleTimer();
  };
  
  const handleAuthTypeSelect = (type: UserType) => {
    setUserType(type);
    setAuthScreen('login');
  };

  const handleStartTour = () => {
    setShowOnboardingModal(false);
    setActiveView(View.Dashboard); // Ensure tour starts on dashboard
    setIsOnboardingActive(true);
  };
  
  const handleSkipTour = () => {
    setShowOnboardingModal(false);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingActive(false);
    localStorage.setItem('onboardingCompleted', 'true');
    toast.success("You've completed the tour! Feel free to explore.");
  };

  const handleExtendSession = () => {
    setIsTimeoutModalOpen(false);
    resetIdleTimer();
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
    try {
      localStorage.setItem(`profilePicture-${user.id}`, newPicture);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error("Failed to save profile picture to localStorage:", error);
      toast.error("Picture updated, but failed to save for next session. Storage may be full.");
    }
  };

  const handleUserUpdate = (updatedFields: Partial<UserProfile>) => {
    setUser(currentUser => ({...currentUser, ...updatedFields}));
  };
  
  const handleConsentUpdate = (id: string, sharedData: DataPoint[]) => {
    setConsentPreferences(prefs =>
        prefs.map(p =>
            p.id === id
                ? { ...p, sharedData, lastUpdated: new Date().toISOString().split('T')[0] }
                : p
        )
    );
  };

    const handleAddCustomerDataIssue = (issueData: Omit<CustomerDataIssue, 'id' | 'organisation' | 'isResolved'>) => {
        const [year, month, day] = issueData.issueDate.split('-');
        const formattedDate = `${month}/${day}/${year}`;

        const newIssue: CustomerDataIssue = {
            ...issueData,
            id: `cdi-${Date.now()}`,
            organisation: dbBusinessProfile.name,
            isResolved: 'No',
            issueDate: formattedDate,
        };

        setCustomerDataIssues(prevIssues => [newIssue, ...prevIssues]);
        toast.success('New data issue logged successfully!');
    };

  const renderPersonalView = () => {
    switch (activeView) {
      case View.Consent:
        return <Consent preferences={consentPreferences} onUpdate={handleConsentUpdate} />;
      case View.DataSharing:
        return <DataSharing />;
      case View.DataSharingAuditLog:
        return <DataSharingAuditLog log={dataSharingLog} />;
      case View.Complaints:
        return <Complaints />;
      case View.WildcardMarketing:
        return <WildcardMarketing />;
      case View.Verified:
        return <Verified isVerified={user.isVerified} onVerificationSuccess={handleVerificationSuccess} />;
      case View.EnterpriseSSO:
        return <EnterpriseSSO user={user} />;
      case View.Dashboard:
      default:
        return <Dashboard user={user} consentPreferences={consentPreferences} activityLog={activityLog} onProfilePictureUpdate={handleProfilePictureUpdate} onUserUpdate={handleUserUpdate} />;
    }
  };

  const renderBusinessView = () => {
    switch (activeBusinessView) {
        case View.CompanyHome:
            return <CompanyHome />;
        case View.CustomerDetails:
            return <CustomerDetails onLogIssue={handleAddCustomerDataIssue} />;
        case View.CustomerDataIssues:
            return <CustomerDataIssues issues={customerDataIssues} onLogIssue={handleAddCustomerDataIssue} customers={dbBusinessCustomers} />;
        case View.CompanyWildCardsView:
            return <CompanyWildCardsView />;
        case View.TargetedMarketing:
            return <TargetedMarketing />;
        case View.Messages:
            return <Messages />;
        case View.SendMessages:
            return <SendMessages />;
        default:
            return <CompanyHome />;
    }
  };


  if (!isLoggedIn) {
    if (authScreen === 'entry') {
        return <AuthEntry onSelect={handleAuthTypeSelect} />;
    }
    if (authScreen === 'login' && userType) {
        return <Login 
            onLogin={handleLogin} 
            userType={userType} 
            onBack={() => setAuthScreen('entry')} 
        />;
    }
    return <AuthEntry onSelect={handleAuthTypeSelect} />;
  }

  const personalNavItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { view: View.Consent, label: 'Consent', icon: <ConsentIcon /> },
    { view: View.DataSharing, label: 'Data Sharing', icon: <DataSharingIcon /> },
    { view: View.DataSharingAuditLog, label: 'Audit Log', icon: <AuditLogIcon /> },
    { view: View.Complaints, label: 'Complaints', icon: <ComplaintIcon /> },
    { view: View.WildcardMarketing, label: 'Wildcard Marketing', icon: <WildcardMarketingIcon /> },
    { view: View.Verified, label: 'Get Verified', icon: <VerifiedIcon /> },
    { view: View.EnterpriseSSO, label: 'Enterprise SSO', icon: <SSOIcon /> },
  ];

  const businessNavItems = [
    { view: View.CompanyHome, label: 'Company Home', icon: <CompanyHomeIcon /> },
    { view: View.CustomerDetails, label: 'Customer Details', icon: <CustomerDetailsIcon /> },
    { view: View.CustomerDataIssues, label: 'Customer Data Issues', icon: <CustomerDataIssuesIcon /> },
    { view: View.CompanyWildCardsView, label: 'Wild Cards View', icon: <WildcardMarketingIcon /> },
    { view: View.TargetedMarketing, label: 'Targeted Marketing', icon: <TargetedMarketingIcon /> },
    { view: View.Messages, label: 'Messages', icon: <MessagesIcon /> },
    { view: View.SendMessages, label: 'Send Messages', icon: <SendMessagesIcon /> },
  ];
  

  if (userType === 'business') {
    return (
      <div className="flex h-screen bg-brand-light">
        <aside className="w-64 bg-white flex-shrink-0 p-4 border-r border-gray-200 flex flex-col">
          <div className="text-center py-4">
              <h1 className="text-3xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
              <p className="text-sm text-gray-500 mt-1">Business Portal</p>
          </div>
          <nav className="mt-8 space-y-2 flex-grow" aria-label="Main navigation">
            {businessNavItems.map(item => (
              <NavItem 
                key={item.view}
                icon={item.icon}
                label={item.label}
                isActive={activeBusinessView === item.view}
                onClick={() => setActiveBusinessView(item.view)}
              />
            ))}
          </nav>
          <div className="p-2 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
              &copy; {new Date().getFullYear()} UniMe Inc.
          </div>
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header user={businessUser} onLogout={handleLogout} activeView={activeBusinessView} />
          <div className="flex-1 overflow-y-auto">
            {renderBusinessView()}
          </div>
        </main>
      </div>
    );
  }

  
  const displayedPersonalNavItems = personalNavItems.map(item => {
      if (item.view === View.Verified) {
          return user.isVerified 
              ? { ...item, label: 'Verified' }
              : item;
      }
      return item;
  });

  return (
    <>
      <div className="flex h-screen bg-brand-light">
        <aside className="w-64 bg-white flex-shrink-0 p-4 border-r border-gray-200 flex flex-col">
          <div className="text-center py-4">
              <h1 className="text-3xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
          </div>
          <nav className="mt-8 space-y-2 flex-grow" aria-label="Main navigation">
            {displayedPersonalNavItems.map(item => (
              <NavItem 
                key={item.view}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.view}
                onClick={() => setActiveView(item.view)}
                data-tour={`nav-${item.view}`}
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
            {renderPersonalView()}
          </div>
        </main>
      </div>
      <SessionTimeoutModal 
        isOpen={isTimeoutModalOpen}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
        countdownFrom={TIMEOUT_WARNING}
      />
      <OnboardingModal isOpen={showOnboardingModal} onStart={handleStartTour} onSkip={handleSkipTour} />
      {isOnboardingActive && (
          <Onboarding 
            steps={tourSteps}
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingComplete}
            navigateToView={setActiveView}
          />
      )}
    </>
  );
};

const App: React.FC = () => (
    <ToastProvider>
        <AppContent />
        <ToastContainer />
    </ToastProvider>
);

export default App;