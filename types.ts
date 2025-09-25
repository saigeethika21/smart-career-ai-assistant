export interface MCQ {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface TheoryQuestion {
    question: string;
}

export interface Assessment {
    mcqs: MCQ[];
    theoryQuestions: TheoryQuestion[];
}

export interface Skill {
    name: string;
    description: string;
    completed: boolean;
}

export interface JobSuggestion {
    jobRole: string;
    reason: string;
    matchPercentage: number;
    skills: Skill[];
    marketInsight?: string;
}

export interface CareerPlan {
    suggestions: JobSuggestion[];
}

export interface User {
    email: string;
    name?: string;
    password?: string; // Should not be stored long term in a real app
    careerPlan?: CareerPlan;
}

export interface DetailedResult {
    question: string;
    userAnswer: string;
    correctAnswer?: string;
    isCorrect: boolean;
    explanation: string;
}

export interface EvaluationResult {
    passed: boolean;
    feedback: string;
    score: number;
    total: number;
    detailedResults: DetailedResult[];
}