import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Layouts
import EmployerLayout from './layouts/EmployerLayout.jsx'

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

// Public Pages
import Home from './pages/public/Home.jsx'
import Jobs from './pages/public/Jobs.jsx'
import JobDetail from './pages/public/JobDetail.jsx'
import Companies from './pages/public/Companies.jsx'
import CompanyDetail from './pages/public/CompanyDetail.jsx'
import Skills from './pages/public/Skills.jsx'

// Auth Pages
import JobSeekerLogin from './pages/auth/JobSeekerLogin.jsx'
import JobSeekerRegister from './pages/auth/JobSeekerRegister.jsx'
import AuthCallback from './pages/auth/AuthCallback.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import EmployerLogin from './pages/auth/EmployerLogin.jsx'
import EmployerRegister from './pages/auth/EmployerRegister.jsx'

// Employer Pages
import EmployerLanding from './pages/employer/EmployerLanding.jsx'
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx'
import EmployerProfile from './pages/employer/EmployerProfile.jsx'
import CompanyProfile from './pages/employer/CompanyProfile.jsx'
import JobList from './pages/employer/JobList.jsx'
import JobCreate from './pages/employer/JobCreate.jsx'
import JobEdit from './pages/employer/JobEdit.jsx'
import ApplicationList from './pages/employer/ApplicationList.jsx'
import ApplicationDetail from './pages/employer/ApplicationDetail.jsx'
import CandidateProfile from './pages/employer/CandidateProfile.jsx'
import SavedCandidates from './pages/employer/SavedCandidates.jsx'
import Analytics from './pages/employer/Analytics.jsx'
import EmployerNotifications from './pages/employer/EmployerNotifications.jsx'
import EmployerSettings from './pages/employer/EmployerSettings.jsx'

// User (Job Seeker) Pages
import Profile from './pages/user/ProfileComplete.jsx'
import Overview from './pages/user/Overview.jsx'
import AccountManagement from './pages/user/AccountManagement.jsx'
import MyJobs from './pages/user/MyJobs.jsx'
import JobNotifications from './pages/user/JobNotifications.jsx'
import ResumeList from './pages/user/ResumeList.jsx'
import ResumeCreate from './pages/user/ResumeCreate.jsx'
import ResumeEdit from './pages/user/ResumeEdit.jsx'
import ResumePreview from './pages/user/ResumePreview.jsx'
import SavedJobs from './pages/user/SavedJobs.jsx'
import SavedSearches from './pages/user/SavedSearches.jsx'
import UserApplicationDetail from './pages/user/ApplicationDetail.jsx'
import Notifications from './pages/user/Notifications.jsx'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import EmployerManagement from './pages/admin/EmployerManagement.jsx'
import CompanyManagement from './pages/admin/CompanyManagement.jsx'
import JobManagement from './pages/admin/JobManagement.jsx'
import NotificationManagement from './pages/admin/NotificationManagement.jsx'

const router = createBrowserRouter([
  // ============================================================
  // PUBLIC ROUTES (with App layout - Header/Footer)
  // ============================================================
  {
    path: '/',
    element: <App />,
    children: [
      // Home & Public Pages
      { index: true, element: <Home /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'jobs/:id', element: <JobDetail /> },
      { path: 'companies', element: <Companies /> },
      { path: 'companies/:id', element: <CompanyDetail /> },
      { path: 'skills', element: <Skills /> },
      
      // Auth Pages (public)
      { path: 'login', element: <JobSeekerLogin /> },
      { path: 'register', element: <JobSeekerRegister /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-email', element: <VerifyEmail /> },

      // ============================================================
      // USER ROUTES (Protected - with App layout Header/Footer)
      // ============================================================
      { path: 'user', element: <ProtectedRoute><Overview /></ProtectedRoute> },
      { path: 'user/dashboard', element: <ProtectedRoute><Overview /></ProtectedRoute> },
      { path: 'user/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'user/resumes', element: <ProtectedRoute><ResumeList /></ProtectedRoute> },
      { path: 'user/resumes/create', element: <ProtectedRoute><ResumeCreate /></ProtectedRoute> },
      { path: 'user/resumes/:resumeId', element: <ProtectedRoute><ResumePreview /></ProtectedRoute> },
      { path: 'user/resumes/:resumeId/edit', element: <ProtectedRoute><ResumeEdit /></ProtectedRoute> },
      { path: 'user/applications', element: <ProtectedRoute><MyJobs /></ProtectedRoute> },
      { path: 'user/applications/:applicationId', element: <ProtectedRoute><UserApplicationDetail /></ProtectedRoute> },
      { path: 'user/saved-jobs', element: <ProtectedRoute><SavedJobs /></ProtectedRoute> },
      { path: 'user/saved-searches', element: <ProtectedRoute><SavedSearches /></ProtectedRoute> },
      { path: 'user/notifications', element: <ProtectedRoute><Notifications /></ProtectedRoute> },
      { path: 'user/job-notifications', element: <ProtectedRoute><JobNotifications /></ProtectedRoute> },
      { path: 'user/settings', element: <ProtectedRoute><AccountManagement /></ProtectedRoute> },
    ],
  },

  // ============================================================
  // EMPLOYER ROUTES (with EmployerLayout)
  // ============================================================
  {
    path: '/employer',
    element: <EmployerLayout />,
    children: [
      // Public employer pages
      { index: true, element: <EmployerLanding /> },
      { path: 'login', element: <EmployerLogin /> },
      { path: 'register', element: <EmployerRegister /> },
      
      // Protected employer pages (wrapped individually for flexibility)
      { 
        path: 'dashboard', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'company', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <CompanyProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jobs', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <JobList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jobs/create', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <JobCreate />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jobs/:id/edit', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <JobEdit />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'applications', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <ApplicationList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'applications/:id', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <ApplicationDetail />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'candidates/:id', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <CandidateProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'saved-candidates', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <SavedCandidates />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'analytics', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <Analytics />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'notifications', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerNotifications />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'settings', 
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerSettings />
          </ProtectedRoute>
        ) 
      },
    ],
  },

  // ============================================================
  // ADMIN ROUTES
  // ============================================================
  {
    path: '/admin',
    children: [
      // Admin login (standalone, no layout)
      { index: true, element: <AdminLogin /> },
      { path: 'login', element: <AdminLogin /> },
      
      // Protected admin pages (with AdminLayout)
      {
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <UserManagement /> },
          { path: 'employers', element: <EmployerManagement /> },
          { path: 'companies', element: <CompanyManagement /> },
          { path: 'jobs', element: <JobManagement /> },
          { path: 'notifications', element: <NotificationManagement /> },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
