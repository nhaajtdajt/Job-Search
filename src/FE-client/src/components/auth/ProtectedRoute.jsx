import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * 
 * Usage:
 * <Route element={<ProtectedRoute><YourComponent /></ProtectedRoute>} />
 * 
 * Or with explicit role requirement:
 * <Route element={<ProtectedRoute requiredRole="employer"><Dashboard /></ProtectedRoute>} />
 * 
 * Role is auto-detected from path if not specified:
 * - /user/* → requires 'job_seeker'
 * - /employer/* → requires 'employer'  
 * - /admin/* → requires 'admin'
 * 
 * Pass requiredRole={null} explicitly to allow any authenticated user.
 */
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Auto-detect required role from path if not explicitly specified
  const getDefaultRole = () => {
    const path = location.pathname;
    if (path.startsWith('/user')) return 'job_seeker';
    if (path.startsWith('/employer')) return 'employer';
    if (path.startsWith('/admin')) return 'admin';
    return null; // No role requirement for other paths
  };

  // Use explicit requiredRole if provided, otherwise auto-detect
  // undefined = auto-detect, null = no role check, string = specific role
  const effectiveRole = requiredRole === undefined ? getDefaultRole() : requiredRole;

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

  // Check role if required
  if (effectiveRole && user?.role !== effectiveRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = {
      'job_seeker': '/user/dashboard',
      'employer': '/employer/dashboard',
      'admin': '/admin/dashboard'
    }[user?.role] || '/';
    
    console.log(`[ProtectedRoute] Role mismatch: required=${effectiveRole}, actual=${user?.role}, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;

