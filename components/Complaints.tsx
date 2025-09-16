import React, { useState, useRef, useEffect } from 'react';
import { categorizeComplaint, ComplaintAnalysis } from '../services/geminiService';

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

const ComplaintCard: React.FC<{ title: string, children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[220px] flex flex-col">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-brand-dark ml-3">{title}</h3>
        </div>
        <div className="flex-grow flex flex-col justify-center">
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
    
    const businessAutocompleteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (businessAutocompleteRef.current && !businessAutocompleteRef.current.contains(event.target as Node)) {
                setIsBusinessDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
            const filtered = predefinedBusinesses.filter(business =>
                business.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredBusinesses(filtered);
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

        if (!complaintText.trim()) {
            setValidationError('Please enter your complaint before submitting.');
            return;
        }
        if (!selectedCategory) {
            setValidationError('Please select a complaint category.');
            return;
        }

        setIsLoading(true);
        setApiError(null);
        setAnalysisResult(null);
        
        let fullComplaintDetails = `Complaint: "${complaintText}"`;
        if (businessInvolved.trim()) {
            fullComplaintDetails += `\nBusiness Involved: ${businessInvolved.trim()}`;
        }
        if (incidentDate) {
            fullComplaintDetails += `\nDate of Incident: ${incidentDate}`;
        }
        
        const result = await categorizeComplaint(fullComplaintDetails, selectedCategory);
        
        setIsLoading(false);
        if (result) {
            setAnalysisResult(result);
            setIsSubmitted(true);
        } else {
            setApiError('We could not analyze your complaint at this time. Please try again later.');
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
                return { 
                    badge: 'bg-red-100 text-red-800 border border-red-200',
                    iconContainer: 'bg-red-100 text-red-800',
                };
            case 'medium': 
                return { 
                    badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                    iconContainer: 'bg-yellow-100 text-yellow-800',
                };
            case 'low': 
                return { 
                    badge: 'bg-green-100 text-green-800 border border-green-200',
                    iconContainer: 'bg-green-100 text-green-800',
                };
            default: 
                return { 
                    badge: 'bg-gray-100 text-gray-800 border border-gray-200',
                    iconContainer: 'bg-gray-100 text-gray-800',
                };
        }
    };

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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
                                                <li
                                                    key={business}
                                                    onClick={() => handleBusinessSelect(business)}
                                                    className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-brand-light"
                                                    role="option"
                                                    aria-selected="false"
                                                >
                                                    {business}
                                                </li>
                                            ))
                                        ) : (
                                            <li
                                                onClick={() => handleBusinessSelect(businessInvolved)}
                                                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-brand-light"
                                                role="option"
                                                aria-selected="false"
                                            >
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
                            className="mt-6 w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:bg-gray-400"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing Complaint...
                                </>
                            ) : 'Submit Complaint'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-brand-dark">Submission Received</h3>
                        <p className="text-gray-600 mt-2">Your complaint has been submitted and analyzed. You will be contacted by the relevant authorities shortly.</p>
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
                <ComplaintCard title="AI Analysis" icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 16.663c.178 0 .354-.028.524-.083A12.455 12.455 0 0112 15c1.12 0 2.206.31 3.203.88.17.054.346.082.523.082m-6.426 0a13.956 13.956 0 00-3.203-.88A12.53 12.53 0 004 15c0-1.12.31-2.206.88-3.203.054-.17.082-.346.082-.523m6.426 0c.178 0 .354.028.524.083A12.455 12.455 0 0012 9c-1.12 0-2.206-.31-3.203-.88-.17-.054-.346-.082-.523-.082" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 100-6 3 3 0 000 6zM12 21a3 3 0 100-6 3 3 0 000 6zM4 15a3 3 0 100-6 3 3 0 000 6zM20 15a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                }>
                    {(() => {
                        if (isLoading) {
                            return (
                                <div className="flex flex-col items-center justify-center text-gray-500 h-full">
                                    <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="mt-3 text-sm font-medium">Analyzing severity...</p>
                                </div>
                            );
                        }

                        if (apiError) {
                            return (
                                <div className="flex flex-col items-center justify-center text-center text-brand-danger bg-red-50 p-4 rounded-lg h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-bold text-lg">Analysis Failed</p>
                                    <p className="text-sm mt-1">{apiError}</p>
                                </div>
                            );
                        }

                        if (analysisResult) {
                            const severityStyles = getSeverityStyles(analysisResult.severity);
                            return (
                                <div className="space-y-5">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <p className="text-sm font-medium text-gray-500">Complaint Category</p>
                                            <p className="mt-1 font-semibold text-lg text-brand-dark">{analysisResult.category}</p>
                                            <p className="text-xs text-gray-400 mt-1">Your selected category for this complaint.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${severityStyles.iconContainer}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">AI-Suggested Severity</p>
                                            <span className={`inline-block text-base font-bold px-3 py-1 rounded-full ${severityStyles.badge}`}>{analysisResult.severity}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 p-4 rounded-lg h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-medium">Awaiting Submission</p>
                                <p className="text-sm mt-1">Analysis results will appear here once you submit a complaint.</p>
                            </div>
                        );
                    })()}
                </ComplaintCard>
            </div>
        </div>
    );
};

export default Complaints;