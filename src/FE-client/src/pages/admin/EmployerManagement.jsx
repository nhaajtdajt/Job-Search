import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, Briefcase, Search, ChevronDown, Check, X, RotateCcw } from 'lucide-react';

// Mock data
const mockEmployers = [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah@techflow.io', avatar: null, company: 'TechFlow Inc.', status: 'verified', activeJobs: 12, joinedAt: 'Oct 24, 2023' },
    { id: 2, name: 'Michael Chen', email: 'm.chen@startuphub.co', avatar: null, company: 'StartupHub', status: 'pending', activeJobs: 0, joinedAt: 'Nov 02, 2023' },
    { id: 3, name: 'Alex Doe', email: 'alex@scam.net', avatar: null, company: 'Unknown LLC', status: 'suspended', activeJobs: 0, joinedAt: 'Sep 15, 2023' },
    { id: 4, name: 'Emily Watson', email: 'emily.w@globalcorp.com', avatar: null, company: 'Global Corp', status: 'verified', activeJobs: 45, joinedAt: 'Aug 10, 2023' },
    { id: 5, name: 'David Kim', email: 'david@creativeminds.design', avatar: null, company: 'Creative Minds', status: 'verified', activeJobs: 3, joinedAt: 'Dec 05, 2023' },
];

const stats = [
    { label: 'Total Employers', value: '1,245', change: '+5%', color: 'blue', icon: Users },
    { label: 'Pending Verification', value: '42', subtitle: 'Action Needed', color: 'orange', icon: AlertCircle },
    { label: 'Active Jobs', value: '8,903', change: '+12%', color: 'green', icon: Briefcase },
];

const statusStyles = {
    verified: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function EmployerManagement() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [employers, setEmployers] = useState(mockEmployers);

    const filteredEmployers = employers.filter(emp => {
        const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase()) ||
            emp.company.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || emp.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleVerify = (id) => {
        setEmployers(prev => prev.map(emp =>
            emp.id === id ? { ...emp, status: 'verified' } : emp
        ));
    };

    const handleSuspend = (id) => {
        setEmployers(prev => prev.map(emp =>
            emp.id === id ? { ...emp, status: 'suspended' } : emp
        ));
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/admin" className="hover:text-white">Dashboard</Link>
                <span>›</span>
                <span className="text-white">Employers</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Employer Management</h1>
                    <p className="text-gray-400">Manage, verify, and monitor employer accounts.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <span>+ Add New Employer</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                    {stat.change && <span className="text-green-400 text-sm">{stat.change}</span>}
                                    {stat.subtitle && <span className="text-orange-400 text-sm">{stat.subtitle}</span>}
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                    stat.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-green-500/20 text-green-400'
                                }`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-700/50">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#252d3d] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <button className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                            Date <ChevronDown size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-700/50 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#252d3d]">
                        <tr>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                                <input type="checkbox" className="rounded" />
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Employer</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Company</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Active Jobs</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Joined</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {filteredEmployers.map((employer) => (
                            <tr key={employer.id} className="hover:bg-[#252d3d]/50">
                                <td className="py-4 px-4">
                                    <input type="checkbox" className="rounded" />
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-medium">
                                            {employer.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium">{employer.name}</p>
                                            <p className="text-sm text-gray-400">{employer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-[#252d3d] flex items-center justify-center">
                                            <Briefcase size={16} className="text-gray-400" />
                                        </div>
                                        <span>{employer.company}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[employer.status]}`}>
                                        • {employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">{employer.activeJobs || '--'}</td>
                                <td className="py-4 px-4 text-gray-400">{employer.joinedAt}</td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        {employer.status === 'pending' && (
                                            <button
                                                onClick={() => handleVerify(employer.id)}
                                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                                title="Verify"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        {employer.status !== 'suspended' && (
                                            <button
                                                onClick={() => handleSuspend(employer.id)}
                                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                                title="Suspend"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                        {employer.status === 'suspended' && (
                                            <button
                                                onClick={() => handleVerify(employer.id)}
                                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                                title="Restore"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
                    <span className="text-sm text-gray-400">
                        Showing 1 to {filteredEmployers.length} of {mockEmployers.length} results
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white">Previous</button>
                        <button className="px-3 py-1.5 bg-blue-600 rounded-lg text-sm">1</button>
                        <button className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white">2</button>
                        <button className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white">3</button>
                        <span className="text-gray-400">...</span>
                        <button className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
