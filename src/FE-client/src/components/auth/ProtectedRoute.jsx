import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * 
 * Usage:
 * <Route element={<ProtectedRoute><YourComponent /></ProtectedRoute>} />
 * 
 * Or with role requirement:
 * <Route element={<ProtectedRoute requiredRole="employer"><Dashboard /></ProtectedRoute>} />
 */
function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    // Determine which login page based on current path
    let loginPath = '/login';
    if (location.pathname.startsWith('/employer')) {
      loginPath = '/employer/login';
    } else if (location.pathname.startsWith('/admin')) {
      loginPath = '/admin/login';
    }
    
    // Save the attempted URL for redirecting after login
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check role if specified
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = {
      'job_seeker': '/user/dashboard',
      'employer': '/employer/dashboard',
      'admin': '/admin/dashboard'
    }[user?.role] || '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
