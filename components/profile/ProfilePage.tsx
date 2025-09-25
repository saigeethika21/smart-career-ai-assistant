import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [nameFeedback, setNameFeedback] = useState({ type: '', message: '' });
    const [nameLoading, setNameLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
        }
    }, [user]);

    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNameFeedback({ type: '', message: '' });
        setNameLoading(true);
        try {
            updateUser({ name });
            setNameFeedback({ type: 'success', message: 'Name updated successfully!' });
        } catch (error) {
            setNameFeedback({ type: 'error', message: 'Failed to update name.' });
        } finally {
            setNameLoading(false);
            setTimeout(() => setNameFeedback({ type: '', message: '' }), 3000);
        }
    };
    
    if (!user) return null;

    return (
        <div className="space-y-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-rose-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">Your Profile</h1>
                    <p className="mt-1 text-lg text-slate-600">Manage your account settings and personal information.</p>
                </div>
            </div>

            {/* User Details Form */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4">Personal Information</h2>
                <form onSubmit={handleNameSubmit} className="mt-6 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input type="email" name="email" id="email" value={user.email} disabled
                               className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm bg-slate-100 text-slate-500 cursor-not-allowed"/>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)}
                               className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm bg-white"/>
                    </div>
                    <div className="flex items-center justify-between">
                        {nameFeedback.message && (
                            <p className={`text-sm ${nameFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{nameFeedback.message}</p>
                        )}
                        <button type="submit" disabled={nameLoading}
                                className="btn-grad-sm ml-auto disabled:opacity-50 disabled:cursor-not-allowed">
                            {nameLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;