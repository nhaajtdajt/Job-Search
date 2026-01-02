import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard, Users, Building2, Briefcase, Bell, TrendingUp,
    Settings, LogOut, Menu, X, Search, ChevronDown
} from 'lucide-react';

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

const analyticsItems = [
    { icon: TrendingUp, label: 'Trends', path: '/admin/trends' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [checking, setChecking] = useState(true);
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

                    {sidebarOpen && (
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-6 mb-2 px-3">Analytics</p>
                    )}

                    {analyticsItems.map((item) => (
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
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search users, companies, or jobs..."
                                className="w-64 lg:w-96 bg-[#252d3d] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-white">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <span>Export Report</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                            <span className="hidden lg:block text-sm">{user?.email || 'Admin'}</span>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
