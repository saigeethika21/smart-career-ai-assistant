import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthPage from './components/auth/AuthPage';
import AssessmentPage from './components/assessment/AssessmentPage';
import DashboardPage from './components/dashboard/DashboardPage';
import LearningPlanPage from './components/dashboard/LearningPlanPage';
import ProfilePage from './components/profile/ProfilePage';
import Header from './components/ui/Header';
import Sidebar from './components/ui/Sidebar';

export type View = 'dashboard' | 'assessment' | 'learningPlan' | 'profile';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const [activeView, setActiveView] = useState<View>('assessment');
    const [selectedLearningPlanIndex, setSelectedLearningPlanIndex] = useState<number>(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const mainContentRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // When a user logs in (i.e., the user object changes), this effect
        // determines the correct initial page. If they have a career plan,
        // it redirects them from the default 'assessment' view to their 'dashboard'.
        // This avoids interfering with manual navigation to the assessment page later.
        if (user && user.careerPlan && activeView === 'assessment') {
            setActiveView('dashboard');
        }
    }, [user]);

    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo(0, 0);
        }
    }, [activeView]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-rose-50">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-rose-400"></div>
            </div>
        );
    }
    
    if (!user) {
        return (
             <div className="min-h-screen text-slate-800 bg-rose-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <AuthPage />
                </main>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen text-slate-800 flex flex-col bg-rose-50">
            <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    activeView={activeView}
                    setActiveView={setActiveView}
                    hasCareerPlan={!!user.careerPlan}
                />
                <main ref={mainContentRef} className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    {activeView === 'assessment' && <AssessmentPage setView={setActiveView} />}
                    {activeView === 'dashboard' && user.careerPlan && <DashboardPage setView={setActiveView} setLearningPlanIndex={setSelectedLearningPlanIndex} />}
                    {activeView === 'learningPlan' && user.careerPlan && <LearningPlanPage suggestionIndex={selectedLearningPlanIndex} setView={setActiveView} />}
                    {activeView === 'profile' && <ProfilePage />}
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;