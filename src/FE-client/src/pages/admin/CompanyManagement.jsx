import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Check, X, Eye, Globe, MapPin } from 'lucide-react';

// Mock data
const mockCompanies = [
    { id: 1, name: 'TechFlow Inc.', industry: 'Technology', location: 'Ho Chi Minh City', website: 'techflow.io', status: 'approved', employeeCount: 150, jobs: 12 },
    { id: 2, name: 'StartupHub', industry: 'Consulting', location: 'Hanoi', website: 'startuphub.co', status: 'pending', employeeCount: 25, jobs: 0 },
    { id: 3, name: 'Global Corp', industry: 'Finance', location: 'Da Nang', website: 'globalcorp.com', status: 'approved', employeeCount: 500, jobs: 45 },
    { id: 4, name: 'Creative Minds', industry: 'Design', location: 'Ho Chi Minh City', website: 'creativeminds.design', status: 'rejected', employeeCount: 30, jobs: 3 },
];

const statusStyles = {
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function CompanyManagement() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companies, setCompanies] = useState(mockCompanies);

    const filteredCompanies = companies.filter(company => {
        const matchSearch = company.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || company.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleApprove = (id) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    };

    const handleReject = (id) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/admin" className="hover:text-white">Dashboard</Link>
                <span>›</span>
                <span className="text-white">Companies</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Company Management</h1>
                <p className="text-gray-400">Review and manage company profiles.</p>
            </div>

            {/* Filters */}
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-700/50">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#252d3d] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-700/50 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#252d3d]">
                        <tr>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Company</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Industry</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Location</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Employees</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Jobs</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {filteredCompanies.map((company) => (
                            <tr key={company.id} className="hover:bg-[#252d3d]/50">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium">{company.name}</p>
                                            <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                                                <Globe size={12} />
                                                {company.website}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-gray-300">{company.industry}</td>
                                <td className="py-4 px-4 text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {company.location}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-gray-300">{company.employeeCount}</td>
                                <td className="py-4 px-4 text-gray-300">{company.jobs}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[company.status]}`}>
                                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg" title="View">
                                            <Eye size={16} />
                                        </button>
                                        {company.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleApprove(company.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30" title="Approve">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => handleReject(company.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30" title="Reject">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
