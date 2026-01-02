import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import EmployerLayout from './layouts/EmployerLayout.jsx'
import Home from './pages/public/Home.jsx'
import Jobs from './pages/public/Jobs.jsx'
import JobDetail from './pages/public/JobDetail.jsx'
import Companies from './pages/public/Companies.jsx'
import CompanyDetail from './pages/public/CompanyDetail.jsx'
import JobSeekerLogin from './pages/auth/JobSeekerLogin.jsx'
import JobSeekerRegister from './pages/auth/JobSeekerRegister.jsx'
import AuthCallback from './pages/auth/AuthCallback.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
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
import EmployerLogin from './pages/auth/EmployerLogin.jsx'
import EmployerRegister from './pages/auth/EmployerRegister.jsx'
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
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

// Admin imports
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import EmployerManagement from './pages/admin/EmployerManagement.jsx'
import CompanyManagement from './pages/admin/CompanyManagement.jsx'
import JobManagement from './pages/admin/JobManagement.jsx'
import NotificationManagement from './pages/admin/NotificationManagement.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'jobs/:id', element: <JobDetail /> },
      { path: 'companies', element: <Companies /> },
      { path: 'companies/:id', element: <CompanyDetail /> },
      { path: 'login', element: <JobSeekerLogin /> },
      { path: 'register', element: <JobSeekerRegister /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-email', element: <VerifyEmail /> },
      { path: 'profile', element: <Profile /> },
      { path: 'overview', element: <Overview /> },
      { path: 'account-management', element: <AccountManagement /> },
      { path: 'my-jobs', element: <MyJobs /> },
      { path: 'job-notifications', element: <JobNotifications /> },
      // User dashboard routes
      { path: 'user/overview', element: <Overview /> },
      { path: 'user/profile', element: <Profile /> },
      { path: 'user/resumes', element: <ResumeList /> },
      { path: 'user/resumes/create', element: <ResumeCreate /> },
      { path: 'user/resumes/:resumeId', element: <ResumeEdit /> },
      { path: 'user/resumes/:resumeId/edit', element: <ResumeEdit /> },
      { path: 'user/resumes/:resumeId/preview', element: <ResumePreview /> },
      { path: 'user/my-jobs', element: <MyJobs /> },
      { path: 'user/saved-jobs', element: <SavedJobs /> },
      { path: 'user/saved-searches', element: <SavedSearches /> },
      { path: 'user/applications/:applicationId', element: <UserApplicationDetail /> },
      { path: 'user/job-notifications', element: <JobNotifications /> },
      { path: 'user/notifications', element: <Notifications /> },
      { path: 'user/account', element: <AccountManagement /> },
    ],
  },
  {
    path: '/employer',
    element: <EmployerLayout />,
    children: [
      { index: true, element: <EmployerLanding /> },
      { path: 'dashboard', element: <EmployerDashboard /> },
      { path: 'profile', element: <EmployerProfile /> },
      { path: 'company', element: <CompanyProfile /> },
      { path: 'jobs', element: <JobList /> },
      { path: 'jobs/create', element: <JobCreate /> },
      { path: 'jobs/:id/edit', element: <JobEdit /> },
      { path: 'applications', element: <ApplicationList /> },
      { path: 'applications/:id', element: <ApplicationDetail /> },
      { path: 'candidates/:id', element: <CandidateProfile /> },
      { path: 'saved-candidates', element: <SavedCandidates /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'notifications', element: <EmployerNotifications /> },
      { path: 'login', element: <EmployerLogin /> },
      { path: 'register', element: <EmployerRegister /> },
    ],
  },
  {
    path: '/admin',
    children: [
      // Login page (standalone, no layout)
      { index: true, element: <AdminLogin /> },
      // Protected admin pages (with layout)
      {
        element: <AdminLayout />,
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

