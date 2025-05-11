import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { AnimatedGradientText } from '../components/ui/animated-gradient-text';
import { motion } from 'framer-motion';

/**
 * Login page component - Handles user authentication
 * Provides login form with email and password fields
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [forgotPassword, setForgotPassword] = useState(false);

    const { login, isAuthenticated } = useAuth();

    // Update clock time
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time for display in a luxury watch style
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');

    // Format date in luxury watch style
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = currentTime.toLocaleDateString('en-US', dateOptions);

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { success, error } = await login(email, password);

            if (!success && error) {
                setError(error.message || 'Failed to login');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setForgotPassword(true);
        // In a real application, this would trigger password reset flow
        setTimeout(() => {
            setError("Password reset functionality is not available in this demo.");
            setForgotPassword(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left decorative section */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 to-black p-8 relative overflow-hidden">
                {/* Background pattern with watch motif */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/public/images/placeholder-watch.svg')] bg-center bg-no-repeat bg-contain"></div>
                </div>
                
                {/* Subtle decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
                
                {/* Centered content container */}
                <div className="relative z-10 flex flex-col h-full justify-center items-center text-center max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <img src="/images/favicon-watch.svg" alt="Watch Logo" className="h-32 w-32 mx-auto filter drop-shadow-lg" />
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-white mb-6"
                    >
                        <h1 className="text-4xl font-light tracking-wider mb-3">
                            <AnimatedGradientText 
                                colorFrom="#d4af37" 
                                colorTo="#e5c56b" 
                                className="font-serif font-bold"
                            >
                                HORLOGERIE PRESTIGE
                            </AnimatedGradientText>
                        </h1>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mx-auto my-4"></div>
                        <p className="text-gray-400 text-sm tracking-widest uppercase mt-2">Swiss Excellence Since 1947</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-8 font-light"
                    >
                        <div className="border border-gray-800 p-6 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg mx-auto max-w-xs">
                            <div className="text-3xl font-mono text-center tracking-widest text-[#d4af37]">
                                {hours}:{minutes}:{seconds}
                            </div>
                            <div className="text-gray-500 text-xs text-center mt-2 uppercase tracking-wider">
                                Geneva Time
                            </div>
                            <div className="text-gray-400 text-xs text-center mt-1 font-light italic">
                                {formattedDate}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right login section */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-6 md:p-8">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full px-6 py-8 md:p-8 bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800"
                >
                    {/* Mobile logo */}
                    <div className="text-center mb-8 md:hidden">
                        <img src="/images/favicon-watch.svg" alt="Watch Logo" className="h-20 w-20 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Horlogerie Prestige</h1>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-3"></div>
                        <p className="text-gray-400 text-xs tracking-widest uppercase mt-1">Swiss Excellence Since 1947</p>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl text-white font-light uppercase tracking-wider">
                            Administration Portal
                        </h2>
                        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-md text-sm flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </motion.div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="floating-label">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input-luxury w-full h-14 px-4 py-2 bg-gray-800/50 border border-gray-700 text-white focus:ring-[#d4af37]/30 focus:border-[#d4af37] rounded-md shadow-inner text-center"
                                placeholder=" "
                                defaultValue="admin@test.com"
                            />
                            <label htmlFor="email" className="text-gray-400 text-sm">
                                Email address
                            </label>
                        </div>

                        <div className="floating-label">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input-luxury w-full h-14 px-4 py-2 bg-gray-800/50 border border-gray-700 text-white focus:ring-[#d4af37]/30 focus:border-[#d4af37] rounded-md shadow-inner text-center"
                                placeholder=" "
                                defaultValue="123123"
                            />
                            <label htmlFor="password" className="text-gray-400 text-sm">
                                Password
                            </label>
                        </div>
                        
                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                onClick={handleForgotPassword}
                                disabled={forgotPassword || isLoading}
                                className="text-xs text-gray-400 hover:text-[#d4af37] transition-colors duration-200"
                            >
                                {forgotPassword ? 'Processing...' : 'Forgot password?'}
                            </button>
                        </div>

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-[#d4af37] to-[#e5c56b] text-gray-900 font-medium py-3 px-5 rounded-md transition-all duration-300 shadow-lg hover:shadow-[#d4af37]/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center justify-center w-full">
                            <hr className="w-full h-px my-5 bg-gray-800 border-0" />
                            <span className="absolute px-3 text-xs font-medium text-gray-500 -translate-x-1/2 bg-gray-900 left-1/2">secured access</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-3">
                            © {new Date().getFullYear()} Horlogerie Prestige. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login; 