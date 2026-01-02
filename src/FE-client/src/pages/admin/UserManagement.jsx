import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, UserX } from 'lucide-react';
import adminService from '../../services/admin.service';

const statusStyles = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    blocked: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const roleLabels = {
    job_seeker: { label: 'Job Seeker', color: 'blue' },
    employer: { label: 'Employer', color: 'purple' },
    admin: { label: 'Admin', color: 'orange' },
};

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [updating, setUpdating] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (search) params.search = search;
            if (roleFilter !== 'all') params.role = roleFilter;
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await adminService.getUsers(params);
            console.log('Users API response:', response.data);
            if (response.data?.success) {
                // API returns { data: { data: [...], total, page, limit } }
                const result = response.data.data;
                setUsers(result?.data || []);
                setTotal(result?.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, roleFilter, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        setUpdating(userId);
        try {
            await adminService.updateUserStatus(userId, newStatus);
            setUsers(prev => prev.map(u =>
                u.user_id === userId ? { ...u, status: newStatus } : u
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Cập nhật trạng thái thất bại!');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/admin" className="hover:text-white">Dashboard</Link>
                <span>›</span>
                <span className="text-white">Job Seekers</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Job Seeker Management</h1>
                <p className="text-gray-400">Manage all job seeker accounts on the platform.</p>
            </div>

            {/* Filters */}
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-700/50">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#252d3d] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                            className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                        >
                            <option value="all">All Roles</option>
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-700/50 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No users found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#252d3d]">
                            <tr>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">User</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Gender</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Birthday</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Phone</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {users.map((user) => (
                                <tr key={user.user_id} className="hover:bg-[#252d3d]/50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-medium overflow-hidden">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    (user.name || 'U').charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name || 'Chưa cập nhật'}</p>
                                                <p className="text-sm text-gray-400">{user.user_id?.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-300">
                                        {user.gender ? (user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : user.gender) : 'N/A'}
                                    </td>
                                    <td className="py-4 px-4 text-gray-300">
                                        {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('vi-VN') : 'N/A'}
                                    </td>
                                    <td className="py-4 px-4 text-gray-300">
                                        {user.phone || 'N/A'}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[user.status] || statusStyles.active}`}>
                                            • {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => handleToggleStatus(user.user_id, user.status || 'active')}
                                            disabled={updating === user.user_id}
                                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${(user.status || 'active') === 'active'
                                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                }`}
                                            title={(user.status || 'active') === 'active' ? 'Block User' : 'Unblock User'}
                                        >
                                            {(user.status || 'active') === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
                    <span className="text-sm text-gray-400">
                        Showing {users.length} of {total} users
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
                            disabled={users.length < 10}
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
