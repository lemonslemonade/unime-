import React, { useState, useRef, useEffect, useCallback } from 'react';
import { categorizeComplaint, ComplaintAnalysis } from '../services/geminiService';
import { Complaint } from '../types';

const complaintCategories = [
    "Data Inaccuracy", 
    "Unauthorized Sharing", 
    "Consent Violation", 
    "Marketing Spam",
    "Difficulty Accessing Data", 
    "Data Breach Notification", 
    "Right to Erasure Request",
    "Data Portability Request", 
    "Algorithmic Decisioning Issue", 
    "Other"
];

const predefinedBusinesses = [
    "Global Retail Inc.",
    "AgriConnect SA",
    "Sportify Gear",
    "FinSecure Bank",
    "HealthWell Clinics",
    "NextGen Tech",
    "Creative Solutions",
    "Data Dynamics Corp",
];

const initialComplaints: Complaint[] = [
    {
        id: '1',
        text: 'I requested my data from Global Retail Inc. over a month ago and have not received any response. They are not complying with my right to access.',
        status: 'submitted',
        submittedDate: '2024-05-20',
        category: 'Difficulty Accessing Data',
        severity: 'High',
        businessInvolved: 'Global Retail Inc.',
        incidentDate: '2024-04-15',
        recommendations: [
            'Send a follow-up email to the company, referencing your initial request date.',
            'Locate the contact information for the company\'s Data Protection Officer (DPO) and escalate your request.',
            'If you receive no response, file a formal complaint with the Information Regulator.'
        ],
        fileName: 'request_email.pdf'
    },
    {
        id: '2',
        text: 'I keep getting marketing emails from Sportify Gear despite unsubscribing multiple times. The unsubscribe link seems to be broken.',
        status: 'submitted',
        submittedDate: '2024-05-18',
        category: 'Marketing Spam',
        severity: 'Medium',
        businessInvolved: 'Sportify Gear',
        incidentDate: '2024-05-01',
        recommendations: [
            'Take screenshots of the unsubscribe confirmation page and subsequent marketing emails.',
            'Check your email provider\'s spam filtering options to block the sender.',
            'Reply directly to one of the marketing emails with a formal request to be removed.'
        ]
    }
];

const OFFLINE_COMPLAINTS_KEY = 'uniMe-offline-complaints';

const ComplaintCard: React.FC<{ title: string, children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-brand-dark ml-3">{title}</h3>
        </div>
        <div className="flex-grow flex flex-col">
            {children}
        </div>
    </div>
);

const Complaints: React.FC = () => {
    const [complaintText, setComplaintText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [incidentDate, setIncidentDate] = useState('');
    const [businessInvolved, setBusinessInvolved] = useState('');
    const [filteredBusinesses, setFilteredBusinesses] = useState<string[]>([]);
    const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ComplaintAnalysis | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    
    const businessAutocompleteRef = useRef<HTMLDivElement>(null);

    const syncOfflineComplaints = useCallback(async () => {
        const offlineFromStorage: Complaint[] = JSON.parse(localStorage.getItem(OFFLINE_COMPLAINTS_KEY) || '[]');
        if (offlineFromStorage.length === 0) return;

        setIsSyncing(true);
        const syncedResults = await Promise.all(offlineFromStorage.map(async (complaint) => {
            let fullComplaintDetails = `Complaint: "${complaint.text}"`;
            if (complaint.businessInvolved) fullComplaintDetails += `\nBusiness Involved: ${complaint.businessInvolved}`;
            if (complaint.incidentDate) fullComplaintDetails += `\nDate of Incident: ${complaint.incidentDate}`;
            
            const result = await categorizeComplaint(fullComplaintDetails, complaint.category!);
            if (result) {
                return {
                    ...complaint,
                    status: 'submitted' as const,
                    severity: result.severity,
                    recommendations: result.recommendations,
                };
            }
            return null; // Failed to sync
        }));

        const successfullySynced = syncedResults.filter(Boolean) as Complaint[];
        const failedToSync = offlineFromStorage.filter(offlineC => !successfullySynced.some(syncedC => syncedC.id === offlineC.id));

        if (successfullySynced.length > 0) {
            setComplaints(prev => {
                const withoutPending = prev.filter(c => !successfullySynced.some(s => s.id === c.id));
                return [...successfullySynced, ...withoutPending].sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
            });
        }
        
        localStorage.setItem(OFFLINE_COMPLAINTS_KEY, JSON.stringify(failedToSync));
        setIsSyncing(false);
    }, []);

    useEffect(() => {
        const savedOfflineComplaints: Complaint[] = JSON.parse(localStorage.getItem(OFFLINE_COMPLAINTS_KEY) || '[]');
        if (savedOfflineComplaints.length > 0) {
            setComplaints(prev => {
                const existingIds = new Set(prev.map(c => c.id));
                const uniqueOffline = savedOfflineComplaints.filter(c => !existingIds.has(c.id));
                return [...uniqueOffline, ...prev].sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
            });
        }
        
        const handleOnline = () => { setIsOnline(true); syncOfflineComplaints(); };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (navigator.onLine) {
            syncOfflineComplaints();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncOfflineComplaints]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (businessAutocompleteRef.current && !businessAutocompleteRef.current.contains(event.target as Node)) {
                setIsBusinessDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setBusinessInvolved(query);
        if (query) {
            setFilteredBusinesses(predefinedBusinesses.filter(b => b.toLowerCase().includes(query.toLowerCase())));
            setIsBusinessDropdownOpen(true);
        } else {
            setFilteredBusinesses([]);
            setIsBusinessDropdownOpen(false);
        }
    };

    const handleBusinessSelect = (businessName: string) => {
        setBusinessInvolved(businessName);
        setIsBusinessDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!complaintText.trim() || !selectedCategory) {
            setValidationError('Please enter your complaint and select a category before submitting.');
            return;
        }

        const commonComplaintData = {
            id: Date.now().toString(),
            text: complaintText,
            submittedDate: new Date().toISOString().split('T')[0],
            category: selectedCategory,
            businessInvolved: businessInvolved || undefined,
            incidentDate: incidentDate || undefined,
            fileName: attachedFile?.name || undefined,
        };

        if (isOnline) {
            setIsLoading(true);
            setApiError(null);
            setAnalysisResult(null);
            
            let fullComplaintDetails = `Complaint: "${complaintText}"`;
            if (businessInvolved.trim()) fullComplaintDetails += `\nBusiness Involved: ${businessInvolved.trim()}`;
            if (incidentDate) fullComplaintDetails += `\nDate of Incident: ${incidentDate}`;
            
            const result = await categorizeComplaint(fullComplaintDetails, selectedCategory);
            setIsLoading(false);
            
            if (result) {
                setAnalysisResult(result);
                const newComplaint: Complaint = { ...commonComplaintData, status: 'submitted', severity: result.severity, recommendations: result.recommendations };
                setComplaints(prev => [newComplaint, ...prev].sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()));
                setIsSubmitted(true);
            } else {
                setApiError('We could not analyze your complaint at this time. Please try again later.');
            }
        } else {
            // OFFLINE
            const newOfflineComplaint: Complaint = { ...commonComplaintData, status: 'pending-sync' };
            setComplaints(prev => [newOfflineComplaint, ...prev].sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()));
            const savedOffline = JSON.parse(localStorage.getItem(OFFLINE_COMPLAINTS_KEY) || '[]');
            savedOffline.push(newOfflineComplaint);
            localStorage.setItem(OFFLINE_COMPLAINTS_KEY, JSON.stringify(savedOffline));
            setIsSubmitted(true);
        }
    };

    const handleReset = () => {
        setComplaintText('');
        setSelectedCategory('');
        setIncidentDate('');
        setBusinessInvolved('');
        setAttachedFile(null);
        setAnalysisResult(null);
        setApiError(null);
        setValidationError(null);
        setIsSubmitted(false);
    };

    const getSeverityStyles = (severity?: string) => {
        switch (severity?.toLowerCase()) {
            case 'high': 
                return { badge: 'bg-red-100 text-red-800 border border-red-200', color: '#ff5630' };
            case 'medium': 
                return { badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200', color: '#ffab00' };
            case 'low': 
                return { badge: 'bg-green-100 text-green-800 border border-green-200', color: '#36b37e' };
            case 'pending-sync':
                return { badge: 'bg-gray-200 text-gray-800 border border-gray-300', color: '#A0AEC0' };
            default: 
                return { badge: 'bg-gray-100 text-gray-800 border border-gray-200', color: '#dfe1e6' };
        }
    };

    return (
        <div className="p-8">
            {!isOnline && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg" role="alert">
                    <p className="font-bold">You are offline</p>
                    <p>New complaints will be saved and submitted automatically when you reconnect.</p>
                </div>
            )}
            {isSyncing && (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-r-lg flex items-center" role="status">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Syncing offline complaints...</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Submit a Data Privacy Complaint</h2>
                    <p className="text-gray-600 mb-6">Describe your issue, select a category, and our AI will help assess its severity.</p>
                    
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={complaintText}
                                onChange={(e) => setComplaintText(e.target.value)}
                                placeholder="For example: 'I received a marketing email from a company I never signed up for, and they won't let me unsubscribe...'"
                                className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                disabled={isLoading}
                                aria-label="Complaint text area"
                            />
                            
                            <div className="mt-4">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Complaint Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="" disabled>Select a category...</option>
                                    {complaintCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-1">Date of Incident (Optional)</label>
                                    <input
                                        type="date"
                                        id="incidentDate"
                                        value={incidentDate}
                                        onChange={(e) => setIncidentDate(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="relative" ref={businessAutocompleteRef}>
                                    <label htmlFor="businessInvolved" className="block text-sm font-medium text-gray-700 mb-1">Business Involved (Optional)</label>
                                    <input
                                        type="text"
                                        id="businessInvolved"
                                        value={businessInvolved}
                                        onChange={handleBusinessChange}
                                        onFocus={() => { if (businessInvolved) setIsBusinessDropdownOpen(true); }}
                                        placeholder="e.g., Global Retail Inc."
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    {isBusinessDropdownOpen && businessInvolved && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                                            {filteredBusinesses.length > 0 ? (
                                                filteredBusinesses.map(business => (
                                                    <li key={business} onClick={() => handleBusinessSelect(business)} className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-brand-light" role="option">
                                                        {business}
                                                    </li>
                                                ))
                                            ) : (
                                                <li onClick={() => handleBusinessSelect(businessInvolved)} className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-brand-light" role="option">
                                                    <span className="font-semibold">Add:</span> "{businessInvolved}"
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Attach Supporting Documents (Optional)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isLoading} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        {attachedFile ? (
                                            <p className="text-sm font-semibold text-brand-success pt-2">{attachedFile.name}</p>
                                        ) : (
                                            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {validationError && <p className="text-red-500 mt-2">{validationError}</p>}
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`mt-6 w-full text-white py-3 rounded-lg font-semibold transition flex items-center justify-center disabled:bg-gray-400 ${
                                    isOnline 
                                    ? 'bg-brand-primary hover:bg-blue-700' 
                                    : 'bg-brand-secondary hover:bg-cyan-600'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing Complaint...
                                    </>
                                ) : isOnline ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                                        </svg>
                                        <span>Submit Complaint</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                        </svg>
                                        <span>Save Complaint Offline</span>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {isOnline || !complaints.find(c => c.status === 'pending-sync') ? (
                                <>
                                    <h3 className="text-xl font-bold text-brand-dark">Submission Received</h3>
                                    <p className="text-gray-600 mt-2">Your complaint has been submitted and analyzed. See the details in your history below.</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-brand-dark">Complaint Saved Locally</h3>
                                    <p className="text-gray-600 mt-2">It will be submitted automatically when you're back online.</p>
                                </>
                            )}
                            <button 
                                onClick={handleReset}
                                className="mt-6 bg-brand-secondary text-white py-2 px-6 rounded-lg font-semibold hover:bg-cyan-600 transition"
                            >
                                File Another Complaint
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="space-y-6">
                     {/* AI Analysis card content remains the same */}
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Complaint History</h2>
                <div className="space-y-4">
                    {complaints.length > 0 ? (
                        complaints.map(complaint => {
                            const isPending = complaint.status === 'pending-sync';
                            const severity = isPending ? 'pending-sync' : complaint.severity;
                            const styles = getSeverityStyles(severity);
                            return (
                                <div key={complaint.id} onClick={() => setSelectedComplaint(complaint)} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex items-center space-x-4 border-l-4" style={{borderColor: styles.color}}>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-brand-dark text-lg">{complaint.category}</p>
                                                <p className="text-sm text-gray-500">{complaint.businessInvolved || 'N/A'}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full leading-none ${styles.badge}`}>{isPending ? 'Pending Sync' : complaint.severity}</span>
                                        </div>
                                        <div className="mt-3 text-xs text-gray-400 flex items-center">
                                            {isPending && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="Pending sync icon">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                                </svg>
                                            )}
                                            <span>Submitted: {complaint.submittedDate}</span>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">You have not submitted any complaints yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="complaint-modal-title">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h3 id="complaint-modal-title" className="text-xl font-bold text-brand-dark">Complaint Details</h3>
                                <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Complaint Details</h4>
                                <dl className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="md:col-span-2"><dt className="font-medium text-gray-800">Category:</dt><dd className="text-gray-600">{selectedComplaint.category}</dd></div>
                                    <div><dt className="font-medium text-gray-800">Business Involved:</dt><dd className="text-gray-600">{selectedComplaint.businessInvolved || 'N/A'}</dd></div>
                                    <div><dt className="font-medium text-gray-800">Incident Date:</dt><dd className="text-gray-600">{selectedComplaint.incidentDate || 'N/A'}</dd></div>
                                    <div><dt className="font-medium text-gray-800">Submitted On:</dt><dd className="text-gray-600">{selectedComplaint.submittedDate}</dd></div>
                                    <div><dt className="font-medium text-gray-800">Attachment:</dt><dd className="text-gray-600">{selectedComplaint.fileName || 'None'}</dd></div>
                                </dl>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Full Complaint</h4>
                                <blockquote className="mt-2 p-4 bg-gray-50 border-l-4 border-gray-300 text-gray-700 rounded-r-lg">
                                    {selectedComplaint.text}
                                </blockquote>
                            </div>
                            {selectedComplaint.status === 'pending-sync' ? (
                                <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                                    <p className="font-semibold">Awaiting Sync</p>
                                    <p className="text-sm">This complaint is saved locally. AI analysis will be available once you are online and the complaint has been submitted.</p>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">AI Analysis & Recommendations</h4>
                                    <div className="mt-2 p-4 border border-gray-200 rounded-lg space-y-4">
                                        <div className="flex items-center">
                                            <p className="font-medium text-gray-800 w-32">AI-Suggested Severity:</p>
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full leading-none ${getSeverityStyles(selectedComplaint.severity).badge}`}>
                                                {selectedComplaint.severity}
                                            </span>
                                        </div>
                                        {selectedComplaint.recommendations && selectedComplaint.recommendations.length > 0 && (
                                            <div>
                                                <p className="font-medium text-gray-800 mb-2">Recommended Next Steps:</p>
                                                <ul className="space-y-2 text-gray-700">
                                                    {selectedComplaint.recommendations.map((rec, index) => (
                                                        <li key={index} className="flex items-start text-sm">
                                                            <svg className="h-4 w-4 text-brand-success mr-2.5 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                            <span>{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 text-right rounded-b-xl">
                             <button onClick={() => setSelectedComplaint(null)} className="bg-brand-primary text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;