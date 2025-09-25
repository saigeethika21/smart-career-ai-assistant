
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    updateUser: (updatedData: Partial<User>) => void;
    changePassword: (currentPass: string, newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // CRITICAL SECURITY FIX: Ensure password is not held in the application state
                delete parsedUser.password;
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, pass: string): Promise<void> => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: User) => u.email === email && u.password === pass);
        if (foundUser) {
            const userToStore = { ...foundUser };
            // CRITICAL SECURITY FIX: Remove password from the object before storing in session/state
            delete userToStore.password;
            setUser(userToStore);
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const signup = async (email: string, pass: string): Promise<void> => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some((u: User) => u.email === email)) {
            throw new Error('User with this email already exists');
        }
        const newUser: User = { 
            email, 
            password: pass,
            name: email.split('@')[0] || 'User' // Default name from email
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateUser = useCallback((updatedData: Partial<User>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex((u: User) => u.email === prevUser.email);
            
            if (userIndex === -1) {
                console.error("Could not find user to update");
                return prevUser;
            }

            // Merge updates, but ensure password from the 'DB' is preserved
            const updatedUserInDb = { ...users[userIndex], ...updatedData };
            // Ensure this function cannot change the password
            updatedUserInDb.password = users[userIndex].password;
            users[userIndex] = updatedUserInDb;
            localStorage.setItem('users', JSON.stringify(users));

            // Prepare the user object for the session (without password)
            const updatedUserForSession = { ...updatedUserInDb };
            delete updatedUserForSession.password;
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUserForSession));
            
            return updatedUserForSession;
        });
    }, []);

    const changePassword = async (currentPass: string, newPass: string): Promise<void> => {
        if (!user) throw new Error("No user is logged in.");

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(newPass)) {
            throw new Error('New password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
        }

        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);

        if (userIndex === -1) throw new Error("Could not find user data.");
        
        const userData = users[userIndex];
        if (userData.password !== currentPass) {
            throw new Error("Current password does not match.");
        }

        userData.password = newPass;
        users[userIndex] = userData;
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update session user, ensuring password is not included
        const userToStore = { ...userData };
        delete userToStore.password;
        localStorage.setItem('currentUser', JSON.stringify(userToStore));

        setUser(userToStore);
    };


    // Fix: Replaced JSX with React.createElement to be compatible with a .ts file extension.
    // The TypeScript compiler cannot parse JSX in .ts files by default, which caused all reported errors.
    return React.createElement(AuthContext.Provider, { value: { user, loading, login, signup, logout, updateUser, changePassword } }, children);
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
