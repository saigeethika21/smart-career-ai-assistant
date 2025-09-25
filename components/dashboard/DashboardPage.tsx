import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { View } from '../../App';

interface DashboardPageProps {
    setView: (view: View) => void;
    setLearningPlanIndex: (index: number) => void;
}

const colorThemes = [
    { // Rose
        bg: 'bg-rose-100',
        hoverBg: 'hover:bg-rose-200',
        border: 'border-rose-300',
        selectedBorder: 'border-rose-600',
        text: 'text-rose-900',
        mutedText: 'text-rose-700',
        badgeBg: 'bg-rose-600',
        hoverBadgeBg: 'hover:bg-rose-700',
        focusRing: 'focus-visible:outline-rose-600',
        badgeText: 'text-white',
        sectionHeaderText: 'text-rose-700',
    },
    { // Orange
        bg: 'bg-orange-100',
        hoverBg: 'hover:bg-orange-200',
        border: 'border-orange-300',
        selectedBorder: 'border-orange-600',
        text: 'text-orange-900',
        mutedText: 'text-orange-700',
        badgeBg: 'bg-orange-600',
        hoverBadgeBg: 'hover:bg-orange-700',
        focusRing: 'focus-visible:outline-orange-600',
        badgeText: 'text-white',
        sectionHeaderText: 'text-orange-700',
    },
    { // Purple
        bg: 'bg-purple-100',
        hoverBg: 'hover:bg-purple-200',
        border: 'border-purple-300',
        selectedBorder: 'border-purple-600',
        text: 'text-purple-900',
        mutedText: 'text-purple-700',
        badgeBg: 'bg-purple-600',
        hoverBadgeBg: 'hover:bg-purple-700',
        focusRing: 'focus-visible:outline-purple-600',
        badgeText: 'text-white',
        sectionHeaderText: 'text-purple-700',
    }
];

const DashboardPage: React.FC<DashboardPageProps> = ({ setView, setLearningPlanIndex }) => {
    const { user } = useAuth();
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

    if (!user || !user.careerPlan || user.careerPlan.suggestions.length === 0) {
        return <div className="text-center text-slate-500">Your career dashboard is empty. Please complete the assessment to get started.</div>;
    }
    
    const selectedSuggestion = useMemo(() => {
        return user.careerPlan!.suggestions[selectedSuggestionIndex];
    }, [user.careerPlan, selectedSuggestionIndex]);
    
    const selectedTheme = colorThemes[selectedSuggestionIndex % 3];
    const { reason, skills, marketInsight } = selectedSuggestion;

    const handleCreatePlan = () => {
        setLearningPlanIndex(selectedSuggestionIndex);
        setView('learningPlan');
    };

    return (
        <div className="space-y-12">
            <div>
                 <div className="flex items-center gap-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-rose-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    <h1 className="text-4xl font-bold text-slate-900">Your Career Dashboard</h1>
                </div>
                <p className="mt-2 text-lg text-slate-600">Here are your personalized paths to success. Select a role to see its roadmap.</p>
            </div>

            <div>
                 <div className="flex items-center gap-x-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-slate-900">Top Job Recommendations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.careerPlan.suggestions.map((suggestion, index) => {
                        const theme = colorThemes[index % 3];
                        const isSelected = index === selectedSuggestionIndex;
                        return (
                             <button 
                                key={index}
                                onClick={() => setSelectedSuggestionIndex(index)}
                                className={`p-5 rounded-xl border-2 text-left transition-all duration-300 transform focus:outline-none ${theme.bg} ${theme.hoverBg} ${isSelected ? `${theme.selectedBorder} scale-105 shadow-lg` : theme.border}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className={`text-lg font-bold ${theme.text}`}>{suggestion.jobRole}</h3>
                                    <span className={`text-base font-bold px-3 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>{suggestion.matchPercentage}% Match</span>
                                </div>
                                <p className={`mt-2 text-sm ${theme.mutedText} line-clamp-2`}>{suggestion.reason}</p>
                            </button>
                        )
                    })}
                </div>
            </div>
            
            <div className="p-8 bg-white rounded-xl border border-slate-200 space-y-6">
                <div className="flex items-start gap-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${selectedTheme.sectionHeaderText} flex-shrink-0 mt-0.5`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <div>
                         <h2 className={`text-sm font-semibold ${selectedTheme.sectionHeaderText} uppercase tracking-wider`}>Why this role?</h2>
                         <p className="mt-2 text-slate-600">{reason}</p>
                    </div>
                </div>
                {marketInsight && (
                     <div className="flex items-start gap-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${selectedTheme.sectionHeaderText} flex-shrink-0 mt-0.5`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                        <div>
                            <h2 className={`text-sm font-semibold ${selectedTheme.sectionHeaderText} uppercase tracking-wider`}>Market Insight</h2>
                            <p className="mt-2 text-slate-600">{marketInsight}</p>
                        </div>
                    </div>
                )}
                 <div className="flex items-start gap-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${selectedTheme.sectionHeaderText} flex-shrink-0 mt-0.5`}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 15.75l2.472 2.472a3.375 3.375 0 004.773-4.773z" />
                    </svg>
                    <div>
                         <h2 className={`text-lg font-bold ${selectedTheme.sectionHeaderText}`}>Key Skills to Learn</h2>
                         <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skills.map(skill => (
                                <div key={skill.name} className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold text-slate-800">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <button 
                        onClick={handleCreatePlan}
                        className="btn-grad"
                    >
                        Create My Skill Roadmap 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;