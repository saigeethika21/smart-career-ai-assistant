import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCareerGuidance } from '../../services/geminiService';
import { softwareQuestions, hardwareQuestions } from '../../constants';
import Loader from '../ui/Loader';
import { CareerPlan } from '../../types';

type UserType = 'fresher' | 'experienced' | null;
type FresherInterest = 'software' | 'hardware' | null;

const OnboardingPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [userType, setUserType] = useState<UserType>(null);
    const [fresherInterest, setFresherInterest] = useState<FresherInterest>(null);
    const [fresherAnswers, setFresherAnswers] = useState<Record<string, string>>({});
    const [experiencedDetails, setExperiencedDetails] = useState({ skillsLearnt: '', projects: '', achievements: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFresherAnswer = (questionId: string, answer: string) => {
        setFresherAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleExperiencedChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setExperiencedDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            let guidance: CareerPlan;
            if (userType === 'fresher') {
                if (!fresherInterest) {
                    throw new Error("Please select your area of interest.");
                }
                const currentQuestions = fresherInterest === 'software' ? softwareQuestions : hardwareQuestions;
                if (Object.keys(fresherAnswers).length !== currentQuestions.length) {
                    throw new Error("Please answer all questions.");
                }
                guidance = await getCareerGuidance(fresherAnswers, fresherInterest);
            } else if (userType === 'experienced') {
                 if (!experiencedDetails.skillsLearnt.trim()) {
                    throw new Error("Key Skills Learnt is a required field.");
                }
                if (!experiencedDetails.projects.trim()) {
                    throw new Error("Notable Projects is a required field.");
                }
                if (!experiencedDetails.achievements.trim()) {
                    throw new Error("Key Achievements is a required field.");
                }
                guidance = await getCareerGuidance(experiencedDetails, 'experienced');
            } else {
                 throw new Error("Invalid user type.");
            }
            updateUser({ careerPlan: guidance });
        } catch (err: any)
        {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleBack = () => {
        setError('');
        if (userType === 'fresher' && fresherInterest) {
            setFresherInterest(null);
            setFresherAnswers({});
        } else if (userType) {
            setUserType(null);
            setFresherInterest(null);
            setFresherAnswers({});
            setExperiencedDetails({ skillsLearnt: '', projects: '', achievements: '' });
        }
    };

    if (!userType) {
        return (
            <div className="text-center max-w-2xl mx-auto p-8 bg-gradient-to-br from-rose-50 to-white rounded-xl border border-slate-200 shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800">Select Your Experience Level</h2>
                <p className="mt-4 text-slate-600">This helps us tailor the next steps for you.</p>
                <div className="mt-8 flex items-center justify-center gap-x-6">
                    <button onClick={() => setUserType('fresher')} className="btn-grad">I'm a Fresher</button>
                    <button onClick={() => setUserType('experienced')} className="btn-grad">I'm Experienced</button>
                </div>
            </div>
        );
    }
    
    const questions = fresherInterest === 'software' ? softwareQuestions : hardwareQuestions;

    return (
        <div className="max-w-4xl mx-auto relative">
             {loading && (
                <div className="absolute inset-0 bg-rose-50/80 flex justify-center items-center z-10 rounded-xl">
                    <Loader message="Crafting your personalized career plan..." />
                </div>
            )}
             <div className="mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-x-2 rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back
                </button>
            </div>
             {error && <p className="mb-4 text-center text-red-700 bg-red-100 p-3 rounded-md border border-red-200">{error}</p>}
            
            {userType === 'fresher' && (
                <>
                    {!fresherInterest ? (
                         <div className="text-center p-8 bg-gradient-to-br from-rose-50 to-white rounded-xl border border-slate-200 shadow-lg">
                             <h2 className="text-3xl font-bold text-center text-slate-800">What is Your Area of Interest?</h2>
                             <p className="mt-4 text-lg leading-8 text-slate-600">This will help us tailor the questions for you.</p>
                             <div className="mt-10 flex items-center justify-center gap-x-6">
                                 <button onClick={() => setFresherInterest('software')} className="btn-grad">Software</button>
                                 <button onClick={() => setFresherInterest('hardware')} className="btn-grad">Hardware</button>
                             </div>
                         </div>
                    ) : (
                         <div className="space-y-8 p-8 bg-gradient-to-br from-rose-50 to-white rounded-xl border border-slate-200 shadow-lg">
                             <h2 className="text-3xl font-bold text-center text-slate-800">Tell Us About Yourself</h2>
                             {questions.map(q => (
                                 <div key={q.id}>
                                     <h3 className="text-lg font-semibold text-slate-700">{q.question}</h3>
                                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {q.options.map(option => (
                                             <label key={option} className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border ${fresherAnswers[q.id] === option ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-offset-2 ring-rose-500' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'}`}>
                                                 <input type="radio" name={q.id} value={option} onChange={() => handleFresherAnswer(q.id, option)} className="hidden" />
                                                 <span className="text-sm font-medium">{option}</span>
                                             </label>
                                         ))}
                                     </div>
                                 </div>
                             ))}
                         </div>
                    )}
                </>
            )}

             {userType === 'experienced' && (
                <div className="space-y-6 p-8 bg-gradient-to-br from-rose-50 to-white rounded-xl border border-slate-200 shadow-lg">
                     <h2 className="text-3xl font-bold text-center text-slate-800">Share Your Experience</h2>
                     <p className="text-center text-slate-600">Provide details on your skills, projects, and achievements for a tailored career analysis.</p>
                     
                     <div>
                         <label htmlFor="skillsLearnt" className="block text-sm font-medium text-slate-700 mb-2">Key Skills Learnt <span className="text-red-500">*</span></label>
                         <textarea id="skillsLearnt" name="skillsLearnt" rows={4} value={experiencedDetails.skillsLearnt} onChange={handleExperiencedChange} className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 focus:border-rose-500 transition-all duration-200" placeholder="e.g., Python, React, AWS, Agile Methodologies..." required />
                     </div>

                     <div>
                         <label htmlFor="projects" className="block text-sm font-medium text-slate-700 mb-2">Notable Projects <span className="text-red-500">*</span></label>
                         <textarea id="projects" name="projects" rows={4} value={experiencedDetails.projects} onChange={handleExperiencedChange} className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 focus:border-rose-500 transition-all duration-200" placeholder="Describe 1-2 key projects you've worked on, your role, and the outcome." required />
                     </div>

                     <div>
                         <label htmlFor="achievements" className="block text-sm font-medium text-slate-700 mb-2">Key Achievements <span className="text-red-500">*</span></label>
                         <textarea id="achievements" name="achievements" rows={4} value={experiencedDetails.achievements} onChange={handleExperiencedChange} className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 focus:border-rose-500 transition-all duration-200" placeholder="e.g., Led a team to increase user engagement by 15%, Published a paper on machine learning..." required />
                     </div>
                </div>
             )}
             
            {((userType === 'fresher' && fresherInterest) || userType === 'experienced') && (
                 <div className="mt-8 flex justify-end">
                    <button onClick={handleSubmit} className="btn-grad">Generate My Career Plan</button>
                 </div>
            )}
        </div>
    );
};

export default OnboardingPage;