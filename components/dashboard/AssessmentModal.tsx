import React, { useState, useEffect, useMemo } from 'react';
import { Skill, Assessment, EvaluationResult } from '../../types';
import { generateAssessment, evaluateAssessment } from '../../services/geminiService';
import Loader from '../ui/Loader';

interface AssessmentModalProps {
    skill: Skill;
    onClose: () => void;
    onComplete: (skillName: string) => void;
}

type AssessmentStatus = 'loading' | 'ready' | 'submitting' | 'result';

const AssessmentModal: React.FC<AssessmentModalProps> = ({ skill, onClose, onComplete }) => {
    const [status, setStatus] = useState<AssessmentStatus>('loading');
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [error, setError] = useState('');
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
    const [result, setResult] = useState<EvaluationResult | null>(null);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const generatedAssessment = await generateAssessment(skill.name);
                setAssessment(generatedAssessment);
                setStatus('ready');
            } catch (err: any) {
                setError('Failed to generate assessment. Please try again later.');
                setStatus('result'); // Use result status to show error
            }
        };
        fetchAssessment();
    }, [skill.name]);

    const handleAnswerChange = (question: string, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [question]: answer }));
    };

    const isSubmittable = useMemo(() => {
        // Per user request, the submit button is always enabled once the assessment is loaded.
        return assessment ? true : false;
    }, [assessment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assessment) return;

        setStatus('submitting');
        setError('');
        try {
            const evaluationResult = await evaluateAssessment(skill.name, assessment, userAnswers);
            setResult(evaluationResult);
            setStatus('result');
            if (evaluationResult.passed) {
                setTimeout(() => {
                    onComplete(skill.name);
                }, 3500); // Wait a bit longer so user can review results
            }
        } catch (err: any) {
            setError('Failed to evaluate assessment. Please try again.');
            setStatus('result');
        }
    };
    
    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <Loader message={`Generating assessment for ${skill.name}...`} />;
            case 'submitting':
                return <Loader message="Evaluating your answers..." />;
            case 'result':
                if (error) {
                     return (
                         <div className="flex flex-col items-center text-center p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold mt-4 text-slate-800">An Error Occurred</h3>
                            <p className="text-slate-600 mt-2">{error}</p>
                            <button onClick={onClose} className="btn-grad mt-6">Close</button>
                         </div>
                    );
                }
                if (!result) return null; // Should not happen if no error
                
                return (
                    <div className="p-2 space-y-6">
                        <div className={`text-center p-6 rounded-xl ${result.passed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                            {result.passed ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-3xl font-bold mt-4 text-green-800">Congratulations! You Passed!</h3>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-3xl font-bold mt-4 text-yellow-800">Not Quite This Time</h3>
                                </>
                            )}
                            <p className={`text-2xl font-semibold mt-4 ${result.passed ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'} inline-block px-4 py-2 rounded-lg`}>
                                Your Score: {result.score} / {result.total}
                            </p>
                            <p className={`mt-4 ${result.passed ? 'text-green-600' : 'text-yellow-600'}`}>{result.feedback}</p>
                        </div>
                        
                        <div>
                            <h4 className="text-xl font-bold text-slate-800 mb-4">Detailed Review</h4>
                            <div className="space-y-4">
                                {result.detailedResults.map((res, index) => (
                                    <div key={index} className="p-4 border rounded-lg bg-slate-50/50">
                                        <p className="font-semibold text-slate-800">{index + 1}. {res.question}</p>
                                        
                                        <div className={`mt-3 p-3 rounded-md flex items-start gap-x-3 ${res.isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                                            {res.isCorrect ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                                            )}
                                            <div>
                                                <p className={`text-sm font-medium ${res.isCorrect ? 'text-green-800' : 'text-red-800'}`}>Your answer:</p>
                                                <p className="text-slate-700 whitespace-pre-wrap">{res.userAnswer}</p>
                                            </div>
                                        </div>
                                        
                                        {!res.isCorrect && res.correctAnswer && (
                                            <div className="mt-2 p-3 rounded-md bg-green-100 border border-green-200 flex items-start gap-x-3">
                                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                <div>
                                                    <p className="text-sm font-medium text-green-800">Correct answer:</p>
                                                    <p className="text-slate-700 whitespace-pre-wrap">{res.correctAnswer}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="mt-2 text-sm text-sky-800 p-3 rounded-md bg-sky-100 border border-sky-200">
                                            <span className="font-semibold">Explanation: </span>
                                            {res.explanation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {result.passed ? (
                            <p className="mt-4 text-sm text-center text-slate-500">Your progress will be updated shortly.</p>
                        ) : (
                            <div className="text-center mt-6">
                                <button onClick={onClose} className="btn-grad">Review & Try Again Later</button>
                            </div>
                        )}
                    </div>
                );
            case 'ready':
                return (
                    <form onSubmit={handleSubmit} className="p-2 space-y-6">
                        {assessment?.mcqs.map((mcq, index) => (
                            <div key={index}>
                                <p className="font-semibold text-slate-800">{index + 1}. {mcq.question}</p>
                                <div className="mt-3 space-y-2">
                                    {mcq.options.map(option => (
                                        <label key={option} className="flex items-center p-3 rounded-lg border border-slate-300 has-[:checked]:bg-rose-100 has-[:checked]:border-rose-400 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={mcq.question}
                                                value={option}
                                                required
                                                onChange={(e) => handleAnswerChange(mcq.question, e.target.value)}
                                                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-400 bg-transparent"
                                            />
                                            <span className="ml-3 text-slate-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {assessment?.theoryQuestions.map((tq, index) => (
                             <div key={index}>
                                 <label htmlFor={`theory-${index}`} className="font-semibold text-slate-800 block">{assessment.mcqs.length + index + 1}. {tq.question}</label>
                                 <textarea
                                    id={`theory-${index}`}
                                    rows={4}
                                    required
                                    className="mt-2 w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 placeholder-slate-400 focus:ring-rose-500 focus:border-rose-500"
                                    placeholder="Your answer here..."
                                    onChange={(e) => handleAnswerChange(tq.question, e.target.value)}
                                />
                             </div>
                        ))}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={!isSubmittable}
                                className="btn-grad disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Assessment
                            </button>
                        </div>
                    </form>
                );
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800">Assessment: {skill.name}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                   {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AssessmentModal;