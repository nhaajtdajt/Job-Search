import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Check, X, Eye, Globe, MapPin } from 'lucide-react';
import adminService from '../../services/admin.service';

const statusStyles = {
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (search) params.search = search;
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await adminService.getCompanies(params);
            console.log('Companies API response:', response.data);
            if (response.data?.success) {
                // API returns { data: { data: [...], total, page, limit } }
                const result = response.data.data;
                setCompanies(result?.data || []);
                setTotal(result?.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [page, statusFilter]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchCompanies();
        }
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
                            placeholder="Search by company name (Press Enter)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full bg-[#252d3d] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
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
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : companies.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No companies found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#252d3d]">
                            <tr>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Company</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Location</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Jobs</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {companies.map((company) => (
                                <tr key={company.company_id} className="hover:bg-[#252d3d]/50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                                                {company.logo_url ? (
                                                    <img src={company.logo_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Building2 size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{company.company_name || company.name || 'N/A'}</p>
                                                {company.website && (
                                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                                                        <Globe size={12} />
                                                        {company.website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-400">
                                        {company.address ? (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {company.address}
                                            </span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="py-4 px-4 text-gray-300">{company.job_count || 0}</td>
                                    <td className="py-4 px-4">
                                        <Link
                                            to={`/companies/${company.company_id}`}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg inline-flex"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
                    <span className="text-sm text-gray-400">
                        Showing {companies.length} of {total} companies
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
                            disabled={companies.length < 10}
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
