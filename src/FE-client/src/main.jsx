import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Companies from './pages/Companies.jsx'
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
      { path: 'employer', element: <EmployerLanding /> },
      { path: 'employer/dashboard', element: <EmployerDashboard /> },
      { path: 'employer/login', element: <EmployerLogin /> },
      { path: 'employer/register', element: <EmployerRegister /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
