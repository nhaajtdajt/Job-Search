import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Building2, Briefcase, AlertCircle,
    TrendingUp, TrendingDown, MoreVertical
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

// Mock data
const userGrowthData = [
    { day: 'M', users: 120 },
    { day: 'T', users: 180 },
    { day: 'W', users: 150 },
    { day: 'T', users: 220 },
    { day: 'F', users: 280 },
    { day: 'S', users: 200 },
    { day: 'S', users: 160 },
];

const applicationData = [
    { month: 'Jan', total: 4000, interviewed: 2400 },
    { month: 'Feb', total: 5000, interviewed: 3000 },
    { month: 'Mar', total: 6000, interviewed: 3500 },
    { month: 'Apr', total: 5500, interviewed: 3200 },
    { month: 'May', total: 7000, interviewed: 4000 },
    { month: 'Jun', total: 8000, interviewed: 5000 },
];

const jobTrends = [
    { category: 'Software Development', percentage: 45, color: '#3b82f6' },
    { category: 'Marketing & Sales', percentage: 25, color: '#22c55e' },
    { category: 'Design & Creative', percentage: 18, color: '#f97316' },
    { category: 'Customer Support', percentage: 12, color: '#ef4444' },
];

const stats = [
    { label: 'Total Users', value: '142,050', change: '+12%', trend: 'up', icon: Users, color: 'blue' },
    { label: 'Active Employers', value: '3,200', change: '+5%', trend: 'up', icon: Building2, color: 'purple' },
    { label: 'Active Job Postings', value: '8,450', change: '-2%', trend: 'down', icon: Briefcase, color: 'orange' },
    { label: 'Pending Approvals', value: '45', change: '0%', trend: 'neutral', icon: AlertCircle, color: 'yellow', subtitle: 'Require immediate action' },
];

const timeRanges = ['7 Days', '30 Days', '3 Months', 'Year'];

export default function AdminDashboard() {
    const [selectedRange, setSelectedRange] = useState('7 Days');

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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
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
                            <span className="text-2xl font-bold">{stat.value}</span>
                            <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' :
                                    stat.trend === 'down' ? 'text-red-400' :
                                        'text-gray-400'
                                }`}>
                                {stat.trend === 'up' && <TrendingUp size={14} className="inline mr-1" />}
                                {stat.trend === 'down' && <TrendingDown size={14} className="inline mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{stat.subtitle || 'vs. last month'}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* User Growth Chart */}
                <div className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold">User Growth</h3>
                            <p className="text-sm text-gray-400">New sign-ups over the week</p>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Job Posting Trends */}
                <div className="bg-[#1a1f2e] rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold">Job Posting Trends</h3>
                            <p className="text-sm text-gray-400">Categories with most activity</p>
                        </div>
                        <select className="bg-[#252d3d] text-sm border border-gray-700 rounded-lg px-3 py-1.5">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        {jobTrends.map((trend) => (
                            <div key={trend.category}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{trend.category}</span>
                                    <span className="text-gray-400">{trend.percentage}%</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${trend.percentage}%`, backgroundColor: trend.color }}
                                    />
                                </div>
                            </div>
                        ))}
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
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={applicationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            />
                            <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f680" />
                            <Area type="monotone" dataKey="interviewed" stroke="#22c55e" fill="#22c55e80" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
