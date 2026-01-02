import { useState, useEffect } from 'react';
import {
    Users, Building2, Briefcase, AlertCircle,
    TrendingUp, TrendingDown, MoreVertical
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import adminService from '../../services/admin.service';

const timeRangeMap = {
    '7 Days': '7d',
    '30 Days': '30d',
    '3 Months': '3m',
    'Year': '1y'
};

const timeRanges = ['7 Days', '30 Days', '3 Months', 'Year'];

export default function AdminDashboard() {
    const [selectedRange, setSelectedRange] = useState('7 Days');
    const [loading, setLoading] = useState(true);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEmployers: 0,
        totalJobs: 0,
        pendingApprovals: 0
    });
    const [analytics, setAnalytics] = useState({
        userGrowth: [],
        applicationTrends: [],
        jobCategories: [],
        topCompanies: []
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [selectedRange]);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await adminService.getStatistics();
            if (response.data?.success) {
                const data = response.data.data;
                setStats({
                    totalUsers: data.totalUsers || data.users || 0,
                    totalEmployers: data.totalEmployers || data.employers || 0,
                    totalJobs: data.totalJobs || data.jobs || 0,
                    pendingApprovals: data.pendingApplications || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
            setStats({
                totalUsers: 0,
                totalEmployers: 0,
                totalJobs: 0,
                pendingApprovals: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            setAnalyticsLoading(true);
            const timeRange = timeRangeMap[selectedRange] || '7d';
            const response = await adminService.getAnalytics(timeRange);
            if (response.data?.success) {
                setAnalytics(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'blue' },
        { label: 'Active Employers', value: stats.totalEmployers.toLocaleString(), icon: Building2, color: 'purple' },
        { label: 'Published Jobs', value: stats.totalJobs.toLocaleString(), icon: Briefcase, color: 'orange' },
        { label: 'Pending Applications', value: stats.pendingApprovals.toString(), icon: AlertCircle, color: 'yellow', subtitle: stats.pendingApprovals > 0 ? 'Awaiting review' : 'All reviewed' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    <p className="text-gray-400">Real-time insight into platform performance.</p>
                </div>
                <div className="flex bg-[#252d3d] rounded-lg p-1">
                    {timeRanges.map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRange === range ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-sm">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                stat.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                    stat.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            {loading ? (
                                <span className="text-2xl font-bold text-gray-500">...</span>
                            ) : (
                                <span className="text-2xl font-bold">{stat.value}</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{stat.subtitle || 'Current total'}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* User Growth Chart */}
                <div className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold">Activity Trends</h3>
                            <p className="text-sm text-gray-400">Jobs posted over the period</p>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                    <div className="h-64">
                        {analyticsLoading ? (
                            <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.userGrowth || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="day" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Job Posting Trends */}
                <div className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold">Job Categories</h3>
                            <p className="text-sm text-gray-400">Distribution by job type</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {analyticsLoading ? (
                            <div className="h-32 flex items-center justify-center text-gray-400">Loading...</div>
                        ) : (
                            (analytics.jobCategories || []).map((trend) => (
                                <div key={trend.category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{trend.category}</span>
                                        <span className="text-gray-400">{trend.percentage}% ({trend.count} jobs)</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${trend.percentage}%`, backgroundColor: trend.color }} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Application Trends */}
            <div className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Application Trends</h3>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            Total Applications
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            Interviewed
                        </span>
                    </div>
                </div>
                <div className="h-64">
                    {analyticsLoading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.applicationTrends || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f680" />
                                <Area type="monotone" dataKey="interviewed" stroke="#22c55e" fill="#22c55e80" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Top Companies */}
            <div className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Top Companies</h3>
                    <p className="text-sm text-gray-400">By job postings & applications</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                                <th className="pb-3">Company</th>
                                <th className="pb-3 text-center">Jobs</th>
                                <th className="pb-3 text-center">Applications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsLoading ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : (
                                (analytics.topCompanies || []).map((company, index) => (
                                    <tr key={index} className="border-b border-gray-700/50">
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                                                    {company.logo ? (
                                                        <img src={company.logo} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold">{company.name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <span className="font-medium">{company.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                {company.jobs}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                                {company.applications}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
