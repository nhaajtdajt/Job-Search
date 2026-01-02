import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Edit, Trash2, Download, Plus } from 'lucide-react';
import adminService from '../../services/admin.service';

const statusStyles = {
    published: 'bg-green-500/20 text-green-400 border-green-500/30',
    draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusLabels = {
    published: 'Đang tuyển',
    draft: 'Bản nháp',
    expired: 'Hết hạn',
};

export default function JobManagement() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [deleting, setDeleting] = useState(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (search) params.search = search;
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await adminService.getJobs(params);
            console.log('Jobs API response:', response.data);
            if (response.data?.success) {
                // API returns { data: { data: [...], total, page, limit } }
                const result = response.data.data;
                setJobs(result?.data || []);
                setTotal(result?.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, statusFilter]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchJobs();
        }
    };

    const handleDelete = async (jobId) => {
        if (!confirm('Bạn có chắc muốn xóa job này?')) return;

        setDeleting(jobId);
        try {
            await adminService.deleteJob(jobId);
            setJobs(prev => prev.filter(j => j.job_id !== jobId));
            setTotal(prev => prev - 1);
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Xóa job thất bại!');
        } finally {
            setDeleting(null);
        }
    };

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
                    <p className="text-gray-400">Oversee, review, and manage all job listings.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-[#252d3d] hover:bg-[#2d3748] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700">
                        <Download size={16} />
                        Export
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
                            placeholder="Search by job title (Press Enter)..."
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
                        <option value="all">Status: All</option>
                        <option value="published">Đang tuyển</option>
                        <option value="draft">Bản nháp</option>
                        <option value="expired">Hết hạn</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-700/50 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : jobs.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No jobs found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#252d3d]">
                            <tr>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Job Title / ID</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Company</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Category</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Posted Date</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {jobs.map((job) => (
                                <tr key={job.job_id} className="hover:bg-[#252d3d]/50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium">{job.job_title || job.title || 'N/A'}</p>
                                            <p className="text-sm text-gray-400">ID: {job.job_id}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium overflow-hidden">
                                                {job.company_logo ? (
                                                    <img src={job.company_logo} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    (job.company_name || 'C').charAt(0)
                                                )}
                                            </div>
                                            <span>{job.company_name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-300">{job.job_type || 'N/A'}</td>
                                    <td className="py-4 px-4 text-gray-400">
                                        {job.posted_at ? new Date(job.posted_at).toLocaleDateString('vi-VN') : 'N/A'}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[job.status] || statusStyles.active}`}>
                                            • {statusLabels[job.status] || job.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1">
                                            <Link
                                                to={`/jobs/${job.job_id}`}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(job.job_id)}
                                                disabled={deleting === job.job_id}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
                        Showing {jobs.length} of {total} jobs
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
                            disabled={jobs.length < 10}
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
