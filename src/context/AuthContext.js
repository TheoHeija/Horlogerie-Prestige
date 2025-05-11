import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, signIn, signOut } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Create the AuthContext
const AuthContext = createContext();

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component for the AuthContext
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load the user session on initial render
    useEffect(() => {
        const loadSession = async () => {
            try {
                const { session, error } = await getSession();
                if (error) throw error;

                setUser(session?.user || null);
            } catch (error) {
                console.error('Error loading session:', error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    // Function to handle user login
    const login = async (email, password) => {
        try {
            setLoading(true);
            const { data, error } = await signIn(email, password);

            if (error) throw error;

            setUser(data.user);
            toast.success('Successfully logged in!');
            navigate('/dashboard');

            return { success: true };
        } catch (error) {
            console.error('Error signing in:', error.message);
            toast.error(error.message || 'Failed to sign in');

            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    // Function to handle user logout
    const logout = async () => {
        try {
            setLoading(true);
            const { error } = await signOut();

            if (error) throw error;

            setUser(null);
            toast.success('Successfully logged out!');
            navigate('/login');

            return { success: true };
        } catch (error) {
            console.error('Error signing out:', error.message);
            toast.error(error.message || 'Failed to sign out');

            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    // Value object to be provided to consumers
    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 