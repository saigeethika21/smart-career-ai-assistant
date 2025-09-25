import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// A mock function to simulate email existence verification
const verifyEmailExists = async (email: string): Promise<boolean> => {
    // Simulate network delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 750));

    const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();

    // Blacklist of common typos and disposable email providers
    const disallowedDomains = [
        // Common Typos
        'gamil.com', 'gmai.com', 'gmal.com', 'gmil.com',
        'hotmal.com', 'hotmai.com', 'hotmial.com',
        'yaho.com', 'yahho.com', 'outlook.con',
        // Disposable Providers
        'mailinator.com', '10minutemail.com', 'temp-mail.org', 'guerrillamail.com',
        'maildrop.cc', 'getnada.com'
    ];

    if (disallowedDomains.includes(domain)) {
        return false; // Email domain is disallowed
    }

    return true; // Assume it exists for this simulation
};


const SignupForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        setLoading(true);
        try {
            setLoadingMessage('Verifying email...');
            const emailExists = await verifyEmailExists(email);
            if (!emailExists) {
                throw new Error('Email address does not exist or is not supported. Please check for typos.');
            }

            setLoadingMessage('Creating account...');
            await signup(email, password);
            setSuccess('Account created successfully! Please log in.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <div>
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                <h2 className="mt-4 text-3xl font-bold text-slate-900">Create Your Account</h2>
                <p className="text-slate-500 mt-2">Start your personalized career journey.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">{success}</p>}
                <div className="rounded-md shadow-sm">
                    <input
                        type="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm rounded-t-md"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                     <input
                        type="password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm rounded-b-md"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                 <p className="mt-2 text-xs text-slate-500 px-1">
                    Password must be 8+ characters and contain an uppercase & lowercase letter, a number, and a special character.
                </p>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-grad w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? loadingMessage : 'Sign up'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;