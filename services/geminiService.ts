// Fix: Implemented the geminiService to provide career guidance using the Gemini API.
import { GoogleGenAI, Type } from "@google/genai";
import { CareerPlan, Assessment, EvaluationResult } from '../types';

// Per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const careerPlanSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 3 tailored job suggestions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    jobRole: { type: Type.STRING, description: "The title of the suggested job role." },
                    reason: { type: Type.STRING, description: "A detailed explanation of why this role is a good fit based on the user's input." },
                    matchPercentage: { type: Type.INTEGER, description: "A percentage score (0-100) indicating how good a match this role is." },
                    skills: {
                        type: Type.ARRAY,
                        description: "A list of 5-7 key skills required for this job role.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "The name of the skill." },
                                description: { type: Type.STRING, description: "A brief, one-sentence description of the skill." },
                            },
                            required: ["name", "description"]
                        }
                    },
                    marketInsight: { type: Type.STRING, description: "A brief insight into the current market demand for this role." }
                },
                required: ["jobRole", "reason", "matchPercentage", "skills", "marketInsight"]
            }
        }
    },
    required: ["suggestions"]
};

export const getCareerGuidance = async (
    userInput: Record<string, string> | { skillsLearnt: string; projects: string; achievements: string },
    userType: 'software' | 'hardware' | 'experienced'
): Promise<CareerPlan> => {
    
    let prompt = '';
    if (userType === 'experienced') {
        const { skillsLearnt, projects, achievements } = userInput as { skillsLearnt: string; projects: string; achievements: string };
        prompt = `Analyze the following professional profile to generate a personalized career plan. Here are the details: Key Skills: "${skillsLearnt}", Notable Projects: "${projects}", Key Achievements: "${achievements}". Based on this information, provide 3 advanced or specialized job suggestions that represent a logical next step in their career. For each suggestion, include a detailed reason for the fit, a match percentage, 5-7 key skills to learn or improve upon with descriptions, and a current market insight. The skills should be actionable and specific. Format the response as JSON.`;
    } else {
        const answers = JSON.stringify(userInput, null, 2);
        prompt = `Based on the following assessment answers, generate a personalized career plan for a ${userType} development fresher. The user provided these answers: ${answers}. Provide 3 job suggestions with a detailed reason, a match percentage, 5-7 key skills to learn with descriptions, and a market insight for each role. The skills should be actionable and specific. Format the response as JSON.`;
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: careerPlanSchema
        },
    });

    const jsonText = response.text.trim();
    if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
        throw new Error("Received an invalid response from the AI. Please try again.");
    }

    try {
        const careerPlan = JSON.parse(jsonText) as CareerPlan;

        if (careerPlan.suggestions) {
            careerPlan.suggestions.forEach(suggestion => {
                suggestion.skills = suggestion.skills.map(skill => ({ ...skill, completed: false }));
            });
        }

        return careerPlan;
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        throw new Error("There was an issue processing the career guidance. Please try again.");
    }
};

const assessmentSchema = {
    type: Type.OBJECT,
    properties: {
        mcqs: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswer"],
            },
        },
        theoryQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                },
                required: ["question"],
            },
        },
    },
    required: ["mcqs", "theoryQuestions"],
};

export const generateAssessment = async (skillName: string): Promise<Assessment> => {
    const prompt = `You are an expert tech educator. Generate a short assessment to test proficiency in the skill: "${skillName}". The assessment should be challenging enough to verify a foundational understanding. Provide 3 multiple-choice questions and 2 theory questions. For each MCQ, provide the question, 4 distinct options, and the correct answer text. For the theory question, provide a question that requires a short explanation. Respond ONLY with a JSON object that adheres to the provided schema.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: assessmentSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Assessment;
};


const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        passed: { type: Type.BOOLEAN },
        feedback: { type: Type.STRING },
        score: { type: Type.INTEGER },
        total: { type: Type.INTEGER },
        detailedResults: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    userAnswer: { type: Type.STRING },
                    correctAnswer: { type: Type.STRING, description: "The correct answer for incorrect MCQs. Can be omitted otherwise." },
                    isCorrect: { type: Type.BOOLEAN },
                    explanation: { type: Type.STRING, description: "A brief explanation for why the user's answer was right or wrong." },
                },
                required: ["question", "userAnswer", "isCorrect", "explanation"],
            }
        }
    },
    required: ["passed", "feedback", "score", "total", "detailedResults"],
};

export const evaluateAssessment = async (
    skillName: string,
    questions: Assessment,
    userAnswers: { [key: string]: string }
): Promise<EvaluationResult> => {
    const prompt = `As an expert tech instructor, evaluate the following assessment answers for the skill "${skillName}". The user must answer at least 50% of the total questions correctly to pass.

Here are the questions that were asked:
${JSON.stringify(questions, null, 2)}

Here are the user's submitted answers:
${JSON.stringify(userAnswers, null, 2)}

Perform the following steps:
1. For each question, compare the user's answer to the correct one.
2. Determine if each answer is correct or incorrect. For theory questions, evaluate the substance of the answer.
3. For each question, provide a brief explanation for why the user's answer is correct or incorrect.
4. For incorrect MCQ answers, you MUST provide the 'correctAnswer'. For correct answers or theory questions, the 'correctAnswer' field can be omitted.
5. Calculate the user's final score (the number of correctly answered questions) and the total number of questions.
6. Determine if the user has passed (if their score is 50% or more).
7. Provide overall constructive feedback on their performance.

Respond ONLY with a JSON object that adheres to the provided schema. The 'detailedResults' array must contain an entry for every question in the assessment.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: evaluationSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};