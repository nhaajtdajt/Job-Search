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
import JobSeekerLogin from './pages/auth/JobSeekerLogin.jsx'
import JobSeekerRegister from './pages/auth/JobSeekerRegister.jsx'
import AuthCallback from './pages/auth/AuthCallback.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
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
import EmployerLogin from './pages/auth/EmployerLogin.jsx'
import EmployerRegister from './pages/auth/EmployerRegister.jsx'
import Profile from './pages/user/ProfileComplete.jsx'
import Overview from './pages/user/Overview.jsx'
import AccountManagement from './pages/user/AccountManagement.jsx'
import MyJobs from './pages/user/MyJobs.jsx'
import JobNotifications from './pages/user/JobNotifications.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'jobs/:id', element: <JobDetail /> },
      { path: 'companies', element: <Companies /> },
      { path: 'login', element: <JobSeekerLogin /> },
      { path: 'register', element: <JobSeekerRegister /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'profile', element: <Profile /> },
      { path: 'overview', element: <Overview /> },
      { path: 'account-management', element: <AccountManagement /> },
      { path: 'my-jobs', element: <MyJobs /> },
      { path: 'job-notifications', element: <JobNotifications /> },
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
      { path: 'login', element: <EmployerLogin /> },
      { path: 'register', element: <EmployerRegister /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
