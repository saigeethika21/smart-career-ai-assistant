import React from 'react';
import { Skill } from '../../types';

interface SkillCardProps {
    skill: Skill;
    onTakeAssessment: (skill: Skill) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onTakeAssessment }) => {
    
    return (
        <div 
            className={`rounded-xl border shadow-sm transition-all duration-300 flex flex-col justify-between ${skill.completed ? 'border-rose-400 bg-rose-50/50' : 'bg-white hover:shadow-md hover:-translate-y-1 border-slate-200'}`}
        >
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-bold ${skill.completed ? 'text-rose-900' : 'text-slate-800'}`}>{skill.name}</h3>
                    {skill.completed && (
                         <div className="flex-shrink-0 bg-rose-600 text-white rounded-full p-1.5">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                         </div>
                    )}
                </div>
                <p className={`mt-2 text-sm ${skill.completed ? 'text-rose-700' : 'text-slate-600'}`}>
                    {skill.description}
                </p>
            </div>
            
            <div className="p-4 bg-slate-50/50 rounded-b-xl border-t border-slate-200 mt-auto">
                {skill.completed ? (
                    <div className="text-center font-semibold text-rose-700">
                        Assessment Passed!
                    </div>
                ) : (
                    <button 
                        onClick={() => onTakeAssessment(skill)}
                        className="btn-grad-sm w-full"
                    >
                       Take Assessment
                    </button>
                )}
            </div>
        </div>
    );
};

export default SkillCard;