import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateFeatureImage } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import AutomatedConsentIcon from './icons/AutomatedConsentIcon';
import AuditTrailIcon from './icons/AuditTrailIcon';
import DataRequestIcon from './icons/DataRequestIcon';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    imageUrl?: string;
    onVisible: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, imageUrl, onVisible }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onVisible();
                    observer.disconnect(); // Trigger only once
                }
            },
            {
                rootMargin: '0px',
                threshold: 0.1, // Trigger when 10% of the card is visible
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [onVisible]);

    return (
        <div ref={cardRef} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
            <div className="h-40 w-full bg-gray-200 flex items-center justify-center relative">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gray-300 animate-pulse" aria-hidden="true"></div>
                        <div className="text-gray-500 z-10" aria-label="Loading image placeholder">{icon}</div>
                    </>
                )}
            </div>
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-brand-dark mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};


const features = [
    {
        title: "REST API Integration",
        description: "Effortlessly connect UniMe to your CRM, marketing automation, or e-commerce platforms. Our developer-friendly REST API ensures a quick and straightforward setup, enabling you to synchronize customer data and consent status in real-time, reducing manual data entry and ensuring consistency across all your systems.",
        prompt: "Abstract visualization of data flowing through an API, with clean lines and a blue and green color palette, representing seamless integration and security. Professional, corporate style, minimalist.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    },
    {
        title: "Real-Time Data",
        description: "Power your marketing and sales efforts with the most current customer information, provided directly by the users themselves. Eliminate data decay, reduce bounced communications, and significantly improve campaign accuracy and personalization for a higher return on investment.",
        prompt: "An abstract representation of a dynamic, flowing stream of data, glowing with a vibrant light, symbolizing up-to-the-minute information. Modern and technological aesthetic, dark background.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
    },
    {
        title: "Compliance Assured",
        description: "Navigate the complex landscape of data privacy regulations like POPIA and GDPR with confidence. UniMe automates the entire consent lifecycle, from collection to withdrawal, providing a clear audit trail. This minimizes your regulatory risk and helps you avoid costly non-compliance penalties.",
        prompt: "A stylized, modern shield icon intertwined with a digital lock and a checkmark, symbolizing data protection and regulatory compliance. Colors should be reassuring, like deep blue and silver, on a clean background.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
        title: "Customer Intelligence",
        description: "(Paid Add-On) Unlock powerful market insights from aggregated and anonymized user data. Understand marketing eligibility, identify optimal engagement times, and discover trends to refine your strategy, all while respecting individual privacy.",
        prompt: "An abstract image of a brain made of interconnected data points and charts, glowing softly, representing deep insights and analytics. Sophisticated and futuristic, dark theme.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
    },
     {
        title: "Verified Customers",
        description: "Build a trusted user base by connecting with KYC-verified customers. Drastically reduce the risk of fraud and chargebacks in high-value transactions. Streamline your customer onboarding process, increase conversion rates, and build lasting customer relationships on a foundation of trust.",
        prompt: "A clean, abstract design of a user profile icon with a glowing verification badge. The overall feel should be about trust and security, using a palette of white, silver, and light blue.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.789-2.756 9.588-1.748-2.8-2.756-6.07-2.756-9.588a2.756 2.756 0 115.512 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517.99 6.789 2.732 9.588C16.48 17.79 17.468 14.517 17.468 11A5.468 5.468 0 1012 11z" /></svg>
    },
    {
        title: "Flexible Subscriptions",
        description: "Our subscription plans are designed to match your business needs, whether you're a startup or a large enterprise. Start with a plan that fits your current scale and easily upgrade as your user base grows, ensuring UniMe provides continuous value without locking you into a rigid contract.",
        prompt: "An abstract visual of interlocking, scalable geometric shapes that grow in size, representing flexibility and growth. A clean, minimalist corporate aesthetic with a professional color palette.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    }
];

const ComplianceCard: React.FC<{ title: string, description: string, icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="text-center p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-lg hover:border-brand-primary">
        <div className="inline-block bg-brand-primary/10 text-brand-primary p-4 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-brand-dark mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);


const CACHE_KEY = 'unime-for-business-images';

const ForBusiness: React.FC = () => {
    const [images, setImages] = useState<Record<string, string>>({});
    const [generating, setGenerating] = useState<Set<string>>(new Set());
    const toast = useToast();
    const generationFailedRef = useRef(false);

    // Load images from cache on initial mount
    useEffect(() => {
        try {
            const cachedData = sessionStorage.getItem(CACHE_KEY);
            if (cachedData) {
                setImages(JSON.parse(cachedData));
            }
        } catch (error) {
            console.error("Failed to parse cached images:", error);
            sessionStorage.removeItem(CACHE_KEY);
        }
    }, []);

    const handleGenerateImage = useCallback(async (title: string, prompt: string) => {
        // Don't generate if already cached, already generating, or if a failure has already occurred
        if (images[title] || generating.has(title) || generationFailedRef.current) {
            return;
        }

        setGenerating(prev => new Set(prev).add(title));

        try {
            const imageUrl = await generateFeatureImage(prompt);
            if (imageUrl) {
                setImages(prevImages => {
                    const newImages = { ...prevImages, [title]: imageUrl };
                    try {
                        sessionStorage.setItem(CACHE_KEY, JSON.stringify(newImages));
                    } catch (error) {
                        console.error("Failed to cache generated images in sessionStorage:", error);
                        // Silently fail on cache write error. The app remains functional.
                    }
                    return newImages;
                });
            } else {
                // This 'else' block will be hit for rate limit errors, which return null from the service
                if (!generationFailedRef.current) {
                    toast.error('Image generation failed, likely due to API rate limits.');
                    generationFailedRef.current = true;
                }
                console.warn(`Image generation failed for "${title}". Further generation is paused.`);
            }
        } catch (error) {
             if (!generationFailedRef.current) {
                toast.error('An unexpected error occurred during image generation.');
                generationFailedRef.current = true;
            }
            console.error(`Error generating image for "${title}":`, error);
        } finally {
            setGenerating(prev => {
                const newSet = new Set(prev);
                newSet.delete(title);
                return newSet;
            });
        }
    }, [images, generating, toast]);

    return (
        <div className="bg-brand-light">
            <div className="text-center p-12 bg-white shadow-sm">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Build Trust. Ensure Compliance.</h1>
                <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">Access accurate, consent-driven customer data to power your business growth while respecting user privacy.</p>
                <button className="mt-8 bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg">
                    Request a Demo
                </button>
            </div>

            <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-center text-brand-dark mb-10">The UniMe Advantage for Your Business</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                     {features.map(feature => (
                        <FeatureCard
                            key={feature.title}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                            imageUrl={images[feature.title]}
                            onVisible={() => handleGenerateImage(feature.title, feature.prompt)}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-white py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">Stay Compliant with GDPR & POPIA</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            UniMe is designed with privacy at its core, providing the tools you need to meet your data protection obligations effortlessly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        <ComplianceCard
                            title="Automated Consent Management"
                            description="Capture and manage granular user consent in real-time. Our platform logs every consent change, ensuring you always have an up-to-date record of user preferences."
                            icon={<AutomatedConsentIcon className="w-8 h-8" />}
                        />
                         <ComplianceCard
                            title="Comprehensive Audit Trails"
                            description="Access immutable, timestamped logs of all data sharing and consent activities. Easily demonstrate compliance to regulators and build trust with your customers."
                            icon={<AuditTrailIcon className="w-8 h-8" />}
                        />
                         <ComplianceCard
                            title="Streamlined Data Requests"
                            description="Effortlessly handle Data Subject Access Requests (DSARs). UniMe provides a centralized way for users to access their data, reducing your administrative burden."
                            icon={<DataRequestIcon className="w-8 h-8" />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForBusiness;
