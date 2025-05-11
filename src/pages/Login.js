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

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left decorative section */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 to-black p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/public/images/placeholder-watch.svg')] bg-center bg-no-repeat bg-contain"></div>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <img src="/images/favicon-watch.svg" alt="Watch Logo" className="h-32 w-32 mx-auto" />
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-white"
                    >
                        <h1 className="text-4xl font-light tracking-wider mb-2">
                            <AnimatedGradientText 
                                colorFrom="#d4af37" 
                                colorTo="#e5c56b" 
                                className="font-serif font-bold"
                            >
                                HORLOGERIE PRESTIGE
                            </AnimatedGradientText>
                        </h1>
                        <p className="text-gray-400 text-sm tracking-widest uppercase mt-2">Swiss Excellence Since 1947</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-12 font-light"
                    >
                        <div className="border border-gray-800 p-6 rounded-lg bg-black/40 backdrop-blur-sm">
                            <div className="text-3xl font-mono text-gold text-center tracking-widest text-[#d4af37]">
                                {hours}:{minutes}:{seconds}
                            </div>
                            <div className="text-gray-500 text-xs text-center mt-2 uppercase tracking-wider">
                                Geneva Time
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right login section */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-900 p-4 md:p-0">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full px-6 py-8 md:p-8"
                >
                    <div className="text-center mb-8 md:hidden">
                        <img src="/images/favicon-watch.svg" alt="Watch Logo" className="h-20 w-20 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white">Horlogerie Prestige</h1>
                        <p className="text-gray-400 text-xs tracking-widest uppercase mt-1">Swiss Excellence Since 1947</p>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-xl text-white font-light uppercase tracking-wider">
                            Administration Portal
                        </h2>
                        <div className="h-0.5 w-16 bg-gradient-to-r from-[#d4af37] to-[#e5c56b] mx-auto mt-4"></div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-md text-sm flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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
                                className="form-input-luxury w-full bg-gray-800/50 border-gray-700 text-white focus:ring-[#d4af37]/30 focus:border-[#d4af37]"
                                placeholder=" "
                            />
                            <label htmlFor="email" className="text-gray-400">
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
                                className="form-input-luxury w-full bg-gray-800/50 border-gray-700 text-white focus:ring-[#d4af37]/30 focus:border-[#d4af37]"
                                placeholder=" "
                            />
                            <label htmlFor="password" className="text-gray-400">
                                Password
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`btn-modal-luxury w-full bg-gradient-to-r from-[#d4af37] to-[#e5c56b] text-gray-900 font-medium py-3 rounded-md transition-all shadow-lg hover:shadow-[#d4af37]/20 hover:scale-[1.02] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-gray-500 text-xs">
                        <p>© {new Date().getFullYear()} Horlogerie Prestige. All rights reserved.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login; 