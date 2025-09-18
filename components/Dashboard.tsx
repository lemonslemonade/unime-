import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ConsentPreference, ActivityEvent } from '../types';
import { useToast } from '../hooks/useToast';
import Modal from './common/Modal';
import QrCodeIcon from './icons/QrCodeIcon';

interface DashboardProps {
  user: UserProfile;
  consentPreferences: ConsentPreference[];
  activityLog: ActivityEvent[];
  onProfilePictureUpdate: (base64: string) => void;
  onUserUpdate: (updatedFields: Partial<UserProfile>) => void;
}

const VerificationBadge: React.FC<{ status?: 'Verified' | 'Pending' | 'Unverified' }> = ({ status }) => {
  const currentStatus = status || 'Unverified';
  let colors = 'bg-gray-100 text-gray-800';

  switch (currentStatus) {
    case 'Verified':
      colors = 'bg-brand-success/20 text-brand-success';
      break;
    case 'Pending':
      colors = 'bg-brand-accent/20 text-brand-accent';
      break;
    case 'Unverified':
      colors = 'bg-brand-danger/20 text-brand-danger';
      break;
  }

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full leading-none ${colors}`}>
      {currentStatus}
    </span>
  );
};

const ActivityLogItem: React.FC<{ event: ActivityEvent }> = ({ event }) => {
    const getIcon = () => {
        const iconClass = "h-5 w-5";
        switch (event.type) {
            case 'security':
                return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
            case 'profile':
                return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
            case 'consent':
                return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'sharing':
                return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>;
            case 'complaint':
                return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
            default:
                return null;
        }
    };
    
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    return (
        <div className="flex items-start space-x-4 py-3">
            <div className="bg-gray-100 rounded-full p-2 text-gray-500">
                {getIcon()}
            </div>
            <div className="flex-grow">
                <p className="text-sm text-gray-800">{event.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(event.timestamp)}</p>
            </div>
        </div>
    );
};

const SkeletonLoader: React.FC = () => (
  <div className="p-8 space-y-8 animate-pulse">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="md:col-span-2 space-y-2">
             <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);


const Dashboard: React.FC<DashboardProps> = ({ user, consentPreferences, activityLog, onProfilePictureUpdate, onUserUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  const [greeting, setGreeting] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value } as UserProfile));
  };

  const handleSave = () => {
    onUserUpdate(profile);
    setIsEditing(false);
    toast.success('Profile saved successfully!');
  };
  
  const handleDeleteAccount = () => {
    console.log(`Account deletion requested for user: ${profile.id}`);
    setIsDeleteModalOpen(false);
    toast.success('Your account has been deleted.');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              onProfilePictureUpdate(base64String);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleExportData = () => {
    const exportData = {
      profile: user,
      consentPreferences: consentPreferences,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `unime_data_${user.id}.json`;
    link.click();
    toast.success('Data export started successfully!');
  };

  const handleEnable2FA = () => {
    setTwoFACode('');
    setTwoFAError('');
    setIs2FAModalOpen(true);
  };

  const handle2FASetup = () => {
    if (twoFACode.length !== 6 || !/^\d{6}$/.test(twoFACode)) {
        setTwoFAError('Please enter a valid 6-digit code.');
        return;
    }
    onUserUpdate({ is2FAEnabled: true });
    setIs2FAModalOpen(false);
    toast.success('Two-Factor Authentication has been enabled.');
  };

  const handleDisable2FAConfirm = () => {
    onUserUpdate({ is2FAEnabled: false });
    setIsDisable2FAModalOpen(false);
    toast.info('Two-Factor Authentication has been disabled.');
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="mb-6">
                    <h2 className="text-3xl font-bold text-brand-dark">{greeting}, {profile.firstName}!</h2>
                    <p className="text-gray-500">Welcome back to your UniMe dashboard.</p>
                </div>
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center">
                    <div className="relative group">
                      <img
                          src={profile.profilePictureUrl || `https://i.pravatar.cc/150?u=${profile.id}`}
                          alt="User avatar"
                          className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                      <button
                          onClick={handleUploadClick}
                          className="absolute inset-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Upload new profile picture"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                      </button>
                      <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePictureChange}
                          className="hidden"
                          accept="image/png, image/jpeg, image/gif"
                      />
                    </div>
                    <div className="ml-6">
                      <h2 className="text-3xl font-bold text-brand-dark">{profile.firstName} {profile.lastName}</h2>
                      <VerificationBadge status={profile.verificationStatus} />
                    </div>
                  </div>
                  {!isEditing ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Edit Profile
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-brand-success text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setProfile(user);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Security Settings</h3>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Two-Factor Authentication (2FA)</h4>
                        <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full leading-none ${profile.is2FAEnabled ? 'bg-brand-success/20 text-brand-success' : 'bg-gray-200 text-gray-800'}`}>
                            {profile.is2FAEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        {profile.is2FAEnabled ? (
                            <button 
                                onClick={() => setIsDisable2FAModalOpen(true)}
                                className="bg-brand-danger text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                            >
                                Disable
                            </button>
                        ) : (
                            <button 
                                onClick={handleEnable2FA}
                                className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                                Enable
                            </button>
                        )}
                    </div>
                </div>
                 <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Account Actions</h4>
                     <div className="flex items-center space-x-3">
                        <button
                          onClick={handleExportData}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center space-x-2"
                          aria-label="Export your profile and consent data"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Export Data</span>
                        </button>
                         <button
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="bg-brand-danger text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                          >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          <span>Delete Account</span>
                        </button>
                      </div>
                </div>
            </div>
        </div>
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-dark mb-2">Recent Activity</h3>
                <div className="flow-root">
                    <div className="-my-3 divide-y divide-gray-200">
                        {activityLog.length > 0 ? (
                           activityLog.map(event => <ActivityLogItem key={event.id} event={event} />)
                        ) : (
                            <p className="text-sm text-gray-500 py-4">No recent activity to display.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
       <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Account"
        titleIcon={
             <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-brand-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        }
       >
            <p className="text-sm text-gray-600">
                Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                 <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-brand-danger text-white border border-transparent rounded-md hover:bg-red-700"
                >
                    Yes, Delete My Account
                </button>
            </div>
       </Modal>
        <Modal isOpen={is2FAModalOpen} onClose={() => setIs2FAModalOpen(false)} title="Set Up Two-Factor Authentication">
          <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                  1. Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).
              </p>
              <div className="flex justify-center my-4">
                  <QrCodeIcon />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                  2. Enter the 6-digit code generated by your app.
              </p>
              <div className="w-full max-w-xs mx-auto">
                <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => {
                        setTwoFAError('');
                        setTwoFACode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                    }}
                    placeholder="123456"
                    className={`w-full text-center text-2xl tracking-[.2em] p-3 border ${twoFAError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary`}
                    maxLength={6}
                />
                {twoFAError && <p className="text-red-500 text-xs mt-2">{twoFAError}</p>}
              </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
              <button
                  type="button"
                  onClick={() => setIs2FAModalOpen(false)}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                  Cancel
              </button>
              <button
                  type="button"
                  onClick={handle2FASetup}
                  className="px-4 py-2 bg-brand-success text-white border border-transparent rounded-md hover:bg-green-600"
              >
                  Verify & Enable
              </button>
          </div>
      </Modal>

      <Modal 
        isOpen={isDisable2FAModalOpen} 
        onClose={() => setIsDisable2FAModalOpen(false)} 
        title="Disable Two-Factor Authentication?"
        titleIcon={
             <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-brand-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        }
      >
        <p className="text-sm text-gray-600">
            Disabling 2FA will reduce the security of your account. We recommend keeping it enabled. Are you sure you want to proceed?
        </p>
        <div className="mt-6 flex justify-end space-x-3">
             <button
                type="button"
                onClick={() => setIsDisable2FAModalOpen(false)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={handleDisable2FAConfirm}
                className="px-4 py-2 bg-brand-danger text-white border border-transparent rounded-md hover:bg-red-700"
            >
                Yes, Disable 2FA
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;