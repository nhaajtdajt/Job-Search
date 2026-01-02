import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard, Users, Building2, Briefcase, Bell, TrendingUp,
    Settings, LogOut, Menu, X, Download, FileText
} from 'lucide-react';
import adminService from '../../services/admin.service';
import { jsonToCSV, downloadCSV, formatDate } from '../../utils/exportCSV';

// Admin emails (must match BE config)
const ADMIN_EMAILS = [
    'admin@jobsearch.com',
    'admin2@jobsearch.com',
    'superadmin@jobsearch.com'
];

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Job Seekers', path: '/admin/users' },
    { icon: Building2, label: 'Employers', path: '/admin/employers' },
    { icon: Briefcase, label: 'Companies', path: '/admin/companies' },
    { icon: Briefcase, label: 'Job Postings', path: '/admin/jobs' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [checking, setChecking] = useState(true);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exporting, setExporting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, loading } = useAuth();

    // Check if user is admin
    useEffect(() => {
        if (loading) return;

        const isAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase());

        if (!isAuthenticated || !isAdmin) {
            // Not logged in or not admin - redirect to admin login
            navigate('/admin', { replace: true });
        } else {
            setChecking(false);
        }
    }, [user, isAuthenticated, loading, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/admin');
    };

    const handleExport = async (type) => {
        setExporting(true);
        try {
            let data, headers, filename;

            switch (type) {
                case 'users':
                    // Fetch all users
                    const usersRes = await adminService.getUsers({ page: 1, limit: 10000 });
                    data = usersRes.data?.data?.data || [];
                    headers = ['name', 'email', 'phone', 'gender', 'date_of_birth', 'status'];
                    filename = `job_seekers_${new Date().toISOString().split('T')[0]}.csv`;
                    // Format data
                    data = data.map(u => ({
                        name: u.name || '',
                        email: u.email || '',
                        phone: u.phone || '',
                        gender: u.gender || '',
                        date_of_birth: formatDate(u.date_of_birth),
                        status: u.status || ''
                    }));
                    break;

                case 'employers':
                    const employersRes = await adminService.getEmployers({ page: 1, limit: 10000 });
                    data = employersRes.data?.data?.data || [];
                    headers = ['full_name', 'email', 'company_name', 'status', 'job_count'];
                    filename = `employers_${new Date().toISOString().split('T')[0]}.csv`;
                    data = data.map(e => ({
                        full_name: e.full_name || '',
                        email: e.email || '',
                        company_name: e.company_name || '',
                        status: e.status || '',
                        job_count: e.job_count || 0
                    }));
                    break;

                case 'companies':
                    const companiesRes = await adminService.getCompanies({ page: 1, limit: 10000 });
                    data = companiesRes.data?.data?.data || [];
                    headers = ['company_name', 'industry', 'address', 'website', 'job_count'];
                    filename = `companies_${new Date().toISOString().split('T')[0]}.csv`;
                    data = data.map(c => ({
                        company_name: c.company_name || '',
                        industry: c.industry || '',
                        address: c.address || '',
                        website: c.website || '',
                        job_count: c.job_count || 0
                    }));
                    break;

                case 'jobs':
                    const jobsRes = await adminService.getJobs({ page: 1, limit: 10000 });
                    data = jobsRes.data?.data?.data || [];
                    headers = ['job_title', 'company_name', 'status', 'job_type', 'posted_at', 'salary'];
                    filename = `job_postings_${new Date().toISOString().split('T')[0]}.csv`;
                    data = data.map(j => ({
                        job_title: j.job_title || '',
                        company_name: j.company_name || '',
                        status: j.status || '',
                        job_type: j.job_type || '',
                        posted_at: formatDate(j.posted_at),
                        salary: j.salary || ''
                    }));
                    break;

                default:
                    return;
            }

            const csv = jsonToCSV(data, headers);
            downloadCSV(filename, csv);
            setShowExportModal(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    // Show loading while checking auth
    if (loading || checking) {
        return (
            <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1419] text-white flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1f2e] border-r border-gray-700/50 flex flex-col transition-all duration-300 hidden lg:flex`}>
                {/* Logo */}
                <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-lg font-bold">A</span>
                        </div>
                        {sidebarOpen && (
                            <div>
                                <p className="font-semibold">Admin Panel</p>
                                <p className="text-xs text-gray-400">JobPortal Master</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-700/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full transition-colors"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-[#1a1f2e] z-50 transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
                    <span className="font-semibold">Admin Panel</span>
                    <button onClick={() => setMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-[#1a1f2e] border-b border-gray-700/50 flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold">Admin Panel</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download size={18} />
                            <span>Export Report</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => !exporting && setShowExportModal(false)}>
                    <div className="bg-[#1a1f2e] rounded-xl p-6 w-full max-w-md border border-gray-700/50" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="text-blue-400" size={24} />
                            <h2 className="text-xl font-semibold">Export Data</h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">Select the type of data you want to export as CSV:</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleExport('users')}
                                disabled={exporting}
                                className="w-full flex items-center justify-between p-4 bg-[#252d3d] hover:bg-[#2d3548] rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Users size={20} className="text-blue-400" />
                                    <span>Job Seekers</span>
                                </div>
                                <Download size={16} className="text-gray-400" />
                            </button>

                            <button
                                onClick={() => handleExport('employers')}
                                disabled={exporting}
                                className="w-full flex items-center justify-between p-4 bg-[#252d3d] hover:bg-[#2d3548] rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Users size={20} className="text-purple-400" />
                                    <span>Employers</span>
                                </div>
                                <Download size={16} className="text-gray-400" />
                            </button>

                            <button
                                onClick={() => handleExport('companies')}
                                disabled={exporting}
                                className="w-full flex items-center justify-between p-4 bg-[#252d3d] hover:bg-[#2d3548] rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Building2 size={20} className="text-orange-400" />
                                    <span>Companies</span>
                                </div>
                                <Download size={16} className="text-gray-400" />
                            </button>

                            <button
                                onClick={() => handleExport('jobs')}
                                disabled={exporting}
                                className="w-full flex items-center justify-between p-4 bg-[#252d3d] hover:bg-[#2d3548] rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Briefcase size={20} className="text-green-400" />
                                    <span>Job Postings</span>
                                </div>
                                <Download size={16} className="text-gray-400" />
                            </button>
                        </div>

                        {exporting && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-blue-400">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />
                                <span className="text-sm">Exporting...</span>
                            </div>
                        )}

                        <button
                            onClick={() => setShowExportModal(false)}
                            disabled={exporting}
                            className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
