import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../layout/Loader';

/**
 * ProtectedRoute component - Ensures routes are only accessible to authenticated users
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Show loader while authentication state is being determined
    if (loading) {
        return <Loader />;
    }

    // Redirect to login if not authenticated, otherwise render the child route
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 