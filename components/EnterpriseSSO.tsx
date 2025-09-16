
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface EnterpriseSSOProps {
    user: UserProfile;
}

type PermissionKey = 'name' | 'email' | 'address';

const EnterpriseSSO: React.FC<EnterpriseSSOProps> = ({ user }) => {
    const [showModal, setShowModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ssoState, setSsoState] = useState<'idle' | 'success' | 'denied'>('idle');
    const [permissionError, setPermissionError] = useState<string | null>(null);

    const allPermissions = {
        name: { id: 'name', label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
        email: { id: 'email', label: 'Email Address', value: user.email },
        address: { id: 'address', label: 'Shipping Address', value: user.address },
    };

    const [selectedPermissions, setSelectedPermissions] = useState<Record<PermissionKey, boolean>>({
        name: true,
        email: true,
        address: true,
    });

    useEffect(() => {
        if (showModal) {
            // A short delay is needed to allow the DOM to update before the transition starts.
            const timer = setTimeout(() => {
                setIsModalVisible(true);
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [showModal]);


    const handlePermissionToggle = (permission: PermissionKey) => {
        if (permissionError) {
            setPermissionError(null);
        }
        setSelectedPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
    };

    const getActivePermissions = () => {
        return (Object.keys(selectedPermissions) as PermissionKey[])
            .filter(key => selectedPermissions[key])
            .map(key => allPermissions[key]);
    };
    
    const activePermissions = getActivePermissions();

    const handleSignInClick = () => {
        setPermissionError(null);
        if (getActivePermissions().length === 0) {
            setPermissionError('Please select at least one piece of information to share before signing in.');
            return;
        }
        setShowModal(true);
    };
    
    const handleAllow = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            setShowModal(false);
            setSsoState('success');
        }, 300); // Corresponds to animation duration
    };

    const handleDeny = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            setShowModal(false);
            setSsoState('denied');
        }, 300); // Corresponds to animation duration
    };

    const handleReset = () => {
        setSsoState('idle');
        setPermissionError(null);
        setSelectedPermissions({
            name: true,
            email: true,
            address: true,
        });
    };

    const partner = {
        name: 'Global Retail Inc.',
        logo: 'https://logo.clearbit.com/walmart.com',
    };

    return (
        <div className="p-8 bg-brand-light min-h-full">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">The UniMe SSO Experience</h1>
                <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">One-click access to your favorite services. No new passwords, just seamless, secure sign-in.</p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-brand-dark mb-2">Live Demonstration</h2>
                <p className="text-gray-500 mb-6">Experience how easy it is to sign in to a partner website using your UniMe identity.</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    {ssoState === 'idle' && (
                         <div>
                            <div className="text-center">
                                <img src={partner.logo} alt={`${partner.name} logo`} className="h-16 mx-auto mb-4"/>
                                <h3 className="text-xl font-semibold text-gray-800">Welcome to {partner.name}</h3>
                                <p className="text-gray-500 mt-1">To continue to checkout, please sign in.</p>
                                <button
                                    onClick={handleSignInClick}
                                    className="mt-6 bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg inline-flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25z" /></svg>
                                    Sign in with UniMe
                                </button>
                                <p className="text-xs text-gray-400 mt-4">You will be redirected to UniMe to authenticate.</p>
                            </div>
                             <div className="mt-8 pt-6 border-t">
                                <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Configure Your Sharing Preferences</h3>
                                {permissionError && (
                                    <div className="text-center mb-4 p-3 bg-red-50 text-brand-danger text-sm font-semibold rounded-lg max-w-sm mx-auto">
                                        {permissionError}
                                    </div>
                                )}
                                <div className="space-y-3 max-w-sm mx-auto">
                                    {Object.values(allPermissions).map(p => (
                                        <label key={p.id} htmlFor={`perm-${p.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                                            <span>
                                                <span className="font-medium text-gray-800">{p.label}</span>
                                                <p className="text-sm text-gray-500">{p.value}</p>
                                            </span>
                                            <input
                                                id={`perm-${p.id}`}
                                                type="checkbox"
                                                checked={selectedPermissions[p.id as PermissionKey]}
                                                onChange={() => handlePermissionToggle(p.id as PermissionKey)}
                                                className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {ssoState === 'success' && (
                         <div className="text-center p-6 bg-green-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-bold text-brand-dark">Authentication Successful!</h3>
                            <p className="text-gray-600 mt-2">You are now signed in to {partner.name} as <span className="font-semibold">{user.firstName} {user.lastName}</span>.</p>
                            <div className="text-left mt-4 bg-white p-4 rounded-md border text-sm max-w-md mx-auto">
                                <p className="font-semibold mb-2">The following information was shared:</p>
                                {activePermissions.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-600">
                                        {activePermissions.map(p => <li key={p.id}><strong>{p.label}:</strong> {p.value}</li>)}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">No information was shared.</p>
                                )}
                            </div>
                            <button onClick={handleReset} className="mt-6 bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition">Reset Demo</button>
                        </div>
                    )}

                    {ssoState === 'denied' && (
                        <div className="text-center p-6 bg-red-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-danger mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-bold text-brand-dark">Access Denied</h3>
                            <p className="text-gray-600 mt-2">You cancelled the sign-in process for {partner.name}.</p>
                            <button onClick={handleReset} className="mt-6 bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition">Reset Demo</button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isModalVisible ? 'bg-opacity-60' : 'bg-opacity-0'}`} role="dialog" aria-modal="true" aria-labelledby="sso-modal-title">
                    <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out ${isModalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} >
                        <div className="p-8">
                            <div className="text-center">
                                 <h1 className="text-2xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
                                 <p id="sso-modal-title" className="mt-4 text-xl font-semibold text-gray-800">
                                    <span className="font-bold text-brand-primary">{partner.name}</span> would like to connect to your account
                                 </p>
                                 <p className="text-gray-500 mt-2">This will allow them to access the following information:</p>
                            </div>
                            
                            <div className="mt-6 space-y-4">
                                {activePermissions.length > 0 ? (
                                     activePermissions.map(perm => (
                                        <div key={perm.id} className="flex items-start p-3 bg-brand-light rounded-lg">
                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-brand-success flex items-center justify-center mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <div className="ml-4 flex-grow">
                                                <p className="font-semibold text-brand-dark">{perm.label}</p>
                                                <p className="text-sm text-gray-600">{perm.value}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                                        You must select at least one piece of information to share.
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 text-center text-xs text-gray-400">
                                By clicking "Allow", you agree to share this data.
                            </div>
                        </div>
                        <div className="bg-gray-50 px-8 py-4 rounded-b-2xl grid grid-cols-2 gap-4">
                            <button onClick={handleDeny} className="py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Deny</button>
                            <button 
                                onClick={handleAllow}
                                disabled={activePermissions.length === 0}
                                className="py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Allow
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnterpriseSSO;
