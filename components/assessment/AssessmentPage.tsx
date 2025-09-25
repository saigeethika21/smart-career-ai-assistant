import React from 'react';
import OnboardingPage from '../onboarding/OnboardingPage';
import { useAuth } from '../../hooks/useAuth';
import { View } from '../../App';

interface AssessmentPageProps {
    setView: (view: View) => void;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({ setView }) => {
    const { user } = useAuth();
    
    return (
        <div className="w-full">
            <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-xl shadow-lg border border-slate-200 mb-8">
                <div className="flex items-center gap-x-4">
                    <div className="p-3 bg-rose-100 rounded-full">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-600">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                         </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Career Assessment</h1>
                </div>
                {user?.careerPlan && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 mt-0.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="font-bold">Please Note:</p>
                            <p>You already have a career plan. Completing this assessment again will overwrite your current plan and progress.</p>
                        </div>
                    </div>
                )}
            </div>
            
            <OnboardingPage />
        </div>
    );
};

export default AssessmentPage;