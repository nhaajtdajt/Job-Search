import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, Briefcase, Search, Check, X, RotateCcw } from 'lucide-react';
import adminService from '../../services/admin.service';

const statusStyles = {
    verified: 'bg-green-500/20 text-green-400 border-green-500/30',
    suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function EmployerManagement() {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState({ total: 0, pending: 0, activeJobs: 0 });
    const [updating, setUpdating] = useState(null);

    const fetchEmployers = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (search) params.search = search;
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await adminService.getEmployers(params);
            console.log('Employers API response:', response.data);
            if (response.data?.success) {
                // API returns { data: { data: [...], total, page, limit } }
                const result = response.data.data;
                setEmployers(result?.data || []);
                setTotal(result?.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch employers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployers();
    }, [page, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchEmployers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleVerify = async (employerId) => {
        setUpdating(employerId);
        try {
            await adminService.verifyEmployer(employerId, 'verified');
            setEmployers(prev => prev.map(e =>
                e.employer_id === employerId ? { ...e, status: 'verified' } : e
            ));
        } catch (error) {
            console.error('Failed to verify:', error);
            alert('Xác minh thất bại!');
        } finally {
            setUpdating(null);
        }
    };

    const handleSuspend = async (employerId) => {
        setUpdating(employerId);
        try {
            await adminService.verifyEmployer(employerId, 'suspended');
            setEmployers(prev => prev.map(e =>
                e.employer_id === employerId ? { ...e, status: 'suspended' } : e
            ));
        } catch (error) {
            console.error('Failed to suspend:', error);
            alert('Tạm ngưng thất bại!');
        } finally {
            setUpdating(null);
        }
    };

    const statCards = [
        { label: 'Total Employers', value: total.toLocaleString(), change: '', color: 'blue', icon: Users },
        { label: 'Suspended', value: employers.filter(e => e.status === 'suspended').length.toString(), subtitle: 'Blocked from posting', color: 'red', icon: AlertCircle },
    ];

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
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-2xl font-bold">{stat.value}</span>
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

            {/* Filters */}
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
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-700/50 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : employers.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No employers found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#252d3d]">
                            <tr>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Employer</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Company</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Joined</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {employers.map((emp) => (
                                <tr key={emp.employer_id} className="hover:bg-[#252d3d]/50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-medium overflow-hidden">
                                                {emp.avatar_url ? (
                                                    <img src={emp.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    (emp.full_name || emp.email || '?').charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{emp.full_name || 'N/A'}</p>
                                                <p className="text-sm text-gray-400">{emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-[#252d3d] flex items-center justify-center">
                                                <Briefcase size={16} className="text-gray-400" />
                                            </div>
                                            <span>{emp.company_name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[emp.status] || statusStyles.verified}`}>
                                            • {(emp.status || 'verified').charAt(0).toUpperCase() + (emp.status || 'verified').slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-400">
                                        {emp.created_at ? new Date(emp.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            {emp.status === 'suspended' ? (
                                                <button
                                                    onClick={() => handleVerify(emp.employer_id)}
                                                    disabled={updating === emp.employer_id}
                                                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 disabled:opacity-50"
                                                    title="Restore (Verify)"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSuspend(emp.employer_id)}
                                                    disabled={updating === emp.employer_id}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                                                    title="Suspend"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
                    <span className="text-sm text-gray-400">
                        Showing {employers.length} of {total} employers
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1.5 bg-blue-600 rounded-lg text-sm">{page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={employers.length < 10}
                            className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
