import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="mt-4 text-3xl font-bold text-slate-900">Welcome to Career Assistant</h2>
                <p className="text-slate-500 mt-2">Log in to continue your journey.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm rounded-t-md"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm rounded-b-md"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-grad w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;