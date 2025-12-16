import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EmployerLayout from './layouts/EmployerLayout.jsx'
import Home from './pages/Home.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Companies from './pages/Companies.jsx'
import JobSeekerLogin from './pages/JobSeekerLogin.jsx'
import JobSeekerRegister from './pages/JobSeekerRegister.jsx'
import EmployerLanding from './pages/EmployerLanding.jsx'
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import EmployerLogin from './pages/EmployerLogin.jsx'
import EmployerRegister from './pages/EmployerRegister.jsx'

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
    ],
  },
  {
    path: '/employer',
    element: <EmployerLayout />,
    children: [
      { index: true, element: <EmployerLanding /> },
      { path: 'dashboard', element: <EmployerDashboard /> },
      { path: 'login', element: <EmployerLogin /> },
      { path: 'register', element: <EmployerRegister /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
