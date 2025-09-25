import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { View } from '../../App';
import SkillCard from './SkillCard';
import { JobSuggestion, Skill } from '../../types';
import AssessmentModal from './AssessmentModal';

interface LearningPlanPageProps {
    suggestionIndex: number;
    setView: (view: View) => void;
}

const LearningPlanPage: React.FC<LearningPlanPageProps> = ({ suggestionIndex, setView }) => {
    const { user, updateUser } = useAuth();
    const [assessingSkill, setAssessingSkill] = useState<Skill | null>(null);

    if (!user || !user.careerPlan || !user.careerPlan.suggestions[suggestionIndex]) {
        return (
            <div className="text-center p-8">
                <p className="text-slate-600">Could not find the selected learning plan. Please go back to the dashboard and try again.</p>
                <button onClick={() => setView('dashboard')} className="mt-4 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const suggestion: JobSuggestion = user.careerPlan.suggestions[suggestionIndex];

    const handleMarkSkillComplete = (skillName: string) => {
        if (!user || !user.careerPlan) return;

        const updatedSuggestions = user.careerPlan.suggestions.map((s, index) => {
            if (index === suggestionIndex) {
                const updatedSkills = s.skills.map(skill => {
                    if (skill.name === skillName) {
                        return { ...skill, completed: true };
                    }
                    return skill;
                });
                return { ...s, skills: updatedSkills };
            }
            return s;
        });

        const updatedCareerPlan = { ...user.careerPlan, suggestions: updatedSuggestions };
        updateUser({ careerPlan: updatedCareerPlan });
        setAssessingSkill(null);
    };

    const completedSkills = suggestion.skills.filter(skill => skill.completed).length;
    const totalSkills = suggestion.skills.length;
    const progressPercentage = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;

    return (
        <>
            <div className="space-y-8">
                <div>
                    <button 
                        onClick={() => setView('dashboard')}
                        className="flex items-center gap-x-2 rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 mb-6"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-rose-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69.159-1.006 0l4.875 2.437a1.125 1.125 0 001.006 0z" />
                        </svg>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">{suggestion.jobRole}</h1>
                            <p className="mt-1 text-lg text-slate-600">Your personalized roadmap to becoming a {suggestion.jobRole}.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Learning Progress</h2>
                        <span className="text-lg font-semibold text-rose-700">{completedSkills} / {totalSkills} skills completed</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-rose-500 h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestion.skills.map(skill => (
                        <SkillCard 
                            key={skill.name} 
                            skill={skill}
                            onTakeAssessment={() => setAssessingSkill(skill)}
                        />
                    ))}
                </div>
            </div>
            {assessingSkill && (
                <AssessmentModal
                    skill={assessingSkill}
                    onClose={() => setAssessingSkill(null)}
                    onComplete={handleMarkSkillComplete}
                />
            )}
        </>
    );
};

export default LearningPlanPage;