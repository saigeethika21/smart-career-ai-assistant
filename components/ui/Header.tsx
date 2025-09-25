import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    isSidebarOpen?: boolean;
    toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <header className="shadow-sm header-grad">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-x-4">
                        {user && toggleSidebar && (
                             <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-500 focus:ring-white"
                                aria-label="Toggle sidebar"
                            >
                                {isSidebarOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        )}
                         <h1 className="text-2xl font-bold text-white">Smart Career AI</h1>
                    </div>

                    <div className="flex justify-end items-center space-x-4">
                        {user && (
                            <>
                                <span className="text-white hidden sm:block">Welcome, <span className="font-medium">{user.name || user.email}</span></span>
                                <button
                                    onClick={logout}
                                    className="btn-grad-sm"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;