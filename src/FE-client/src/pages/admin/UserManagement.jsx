import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, UserCheck, UserX, User, Mail, Calendar } from 'lucide-react';

// Mock data
const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'job_seeker', status: 'active', joinedAt: 'Jan 15, 2024' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', role: 'job_seeker', status: 'active', joinedAt: 'Jan 10, 2024' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@company.com', role: 'employer', status: 'blocked', joinedAt: 'Dec 20, 2023' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@work.vn', role: 'job_seeker', status: 'active', joinedAt: 'Feb 01, 2024' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@test.com', role: 'admin', status: 'active', joinedAt: 'Nov 05, 2023' },
];

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
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [users, setUsers] = useState(mockUsers);

    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || user.role === roleFilter;
        const matchStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    const handleToggleBlock = (id) => {
        setUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } : user
        ));
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/admin" className="hover:text-white">Dashboard</Link>
                <span>›</span>
                <span className="text-white">Users</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-gray-400">Manage all user accounts on the platform.</p>
                </div>
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
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                        >
                            <option value="all">All Roles</option>
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
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
                <table className="w-full">
                    <thead className="bg-[#252d3d]">
                        <tr>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                                <input type="checkbox" className="rounded" />
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">User</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Role</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Joined</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-[#252d3d]/50">
                                <td className="py-4 px-4">
                                    <input type="checkbox" className="rounded" />
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-medium">
                                            {user.name.split(' ').slice(-1)[0].charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleLabels[user.role].color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                            roleLabels[user.role].color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-orange-500/20 text-orange-400'
                                        }`}>
                                        {roleLabels[user.role].label}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[user.status]}`}>
                                        • {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-gray-400">{user.joinedAt}</td>
                                <td className="py-4 px-4">
                                    <button
                                        onClick={() => handleToggleBlock(user.id)}
                                        className={`p-2 rounded-lg transition-colors ${user.status === 'active'
                                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                            }`}
                                        title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                                    >
                                        {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
                    <span className="text-sm text-gray-400">
                        Showing 1 to {filteredUsers.length} of {mockUsers.length} users
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white">Previous</button>
                        <button className="px-3 py-1.5 bg-blue-600 rounded-lg text-sm">1</button>
                        <button className="px-3 py-1.5 bg-[#252d3d] rounded-lg text-sm text-gray-400 hover:text-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
