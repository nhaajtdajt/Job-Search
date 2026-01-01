import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Eye, Edit, Trash2, Download, Plus } from 'lucide-react';

// Mock data
const mockJobs = [
    { id: 8492, title: 'Senior UX Designer', company: 'TechSolutions Inc.', category: 'Design & Creative', postedAt: 'Oct 24, 2023', status: 'published' },
    { id: 8493, title: 'Backend Developer (Go)', company: 'Global Corp', category: 'Engineering', postedAt: 'Oct 23, 2023', status: 'pending' },
    { id: 8488, title: 'Marketing Manager', company: 'Innovate Ltd', category: 'Marketing', postedAt: 'Oct 20, 2023', status: 'rejected' },
    { id: 8465, title: 'Junior Accountant', company: 'TechSolutions Inc.', category: 'Finance', postedAt: 'Oct 18, 2023', status: 'expired' },
    { id: 8499, title: 'Product Manager', company: 'Productive Minds', category: 'Product', postedAt: 'Oct 26, 2023', status: 'published' },
];

const statusStyles = {
    published: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusLabels = {
    published: 'Published',
    pending: 'Pending Review',
    rejected: 'Rejected',
    expired: 'Expired',
};

export default function JobManagement() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [companyFilter, setCompanyFilter] = useState('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredJobs = mockJobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.id.toString().includes(search);
        const matchStatus = statusFilter === 'all' || job.status === statusFilter;
        const matchCategory = categoryFilter === 'all' || job.category === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
    });

    const categories = [...new Set(mockJobs.map(j => j.category))];
    const companies = [...new Set(mockJobs.map(j => j.company))];

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/admin" className="hover:text-white">Dashboard</Link>
                <span>›</span>
                <span className="text-white">Job Postings</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Job Postings Management</h1>
                    <p className="text-gray-400">Oversee, review, and manage all job listings across the platform.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-[#252d3d] hover:bg-[#2d3748] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Plus size={16} />
                        Create Job
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-700/50">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by job title, ID, or keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#252d3d] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                        >
                            <option value="all">Status: All</option>
                            <option value="published">Published</option>
                            <option value="pending">Pending Review</option>
                            <option value="rejected">Rejected</option>
                            <option value="expired">Expired</option>
                        </select>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                        >
                            <option value="all">Category: All</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
                        >
                            <option value="all">Company: All</option>
                            {companies.map(comp => (
                                <option key={comp} value={comp}>{comp}</option>
                            ))}
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
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Job Title / ID</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Company</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Category</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Posted Date</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {filteredJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-[#252d3d]/50">
                                <td className="py-4 px-4">
                                    <input type="checkbox" className="rounded" />
                                </td>
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="font-medium">{job.title}</p>
                                        <p className="text-sm text-gray-400">ID: #{job.id}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium">
                                            {job.company.charAt(0)}
                                        </div>
                                        <span>{job.company}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-gray-300">{job.category}</td>
                                <td className="py-4 px-4 text-gray-400">{job.postedAt}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[job.status]}`}>
                                        • {statusLabels[job.status]}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg" title="View">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="bg-[#252d3d] border border-gray-700 rounded px-2 py-1"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>1-{filteredJobs.length} of 248</span>
                        <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-[#252d3d] rounded">‹</button>
                            <button className="p-1.5 hover:bg-[#252d3d] rounded">›</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
