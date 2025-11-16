import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

// Dữ liệu mẫu thống kê
const stats = [
  {
    icon: <Briefcase className="w-8 h-8" />,
    label: "Tin tuyển dụng",
    value: "24",
    change: "+3 tuần này",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Users className="w-8 h-8" />,
    label: "Ứng viên",
    value: "156",
    change: "+12 mới",
    color: "from-green-500 to-green-600",
  },
  {
    icon: <Eye className="w-8 h-8" />,
    label: "Lượt xem",
    value: "3,247",
    change: "+18% so với tuần trước",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    label: "Tỷ lệ phản hồi",
    value: "68%",
    change: "+5% tháng này",
    color: "from-purple-500 to-purple-600",
  },
];

// Dữ liệu mẫu tin tuyển dụng
const jobPostings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "Hồ Chí Minh",
    salary: "20-30 triệu",
    status: "active",
    applications: 45,
    views: 892,
    postedDate: "2024-11-01",
    expiryDate: "2024-12-01",
  },
  {
    id: 2,
    title: "Product Manager",
    location: "Hà Nội",
    salary: "25-35 triệu",
    status: "active",
    applications: 32,
    views: 654,
    postedDate: "2024-11-05",
    expiryDate: "2024-12-05",
  },
  {
    id: 3,
    title: "Backend Developer (Node.js)",
    location: "Remote",
    salary: "18-28 triệu",
    status: "active",
    applications: 28,
    views: 523,
    postedDate: "2024-11-08",
    expiryDate: "2024-12-08",
  },
  {
    id: 4,
    title: "UX/UI Designer",
    location: "Đà Nẵng",
    salary: "15-22 triệu",
    status: "pending",
    applications: 0,
    views: 0,
    postedDate: "2024-11-14",
    expiryDate: "2024-12-14",
  },
  {
    id: 5,
    title: "Marketing Executive",
    location: "Hồ Chí Minh",
    salary: "12-18 triệu",
    status: "expired",
    applications: 67,
    views: 1234,
    postedDate: "2024-10-01",
    expiryDate: "2024-11-01",
  },
];

// Component trạng thái
function StatusBadge({ status }) {
  const statusConfig = {
    active: {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Đang tuyển",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    pending: {
      icon: <Clock className="w-4 h-4" />,
      text: "Chờ duyệt",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    expired: {
      icon: <XCircle className="w-4 h-4" />,
      text: "Đã hết hạn",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
}

// Component hành động
function ActionMenu({ job }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
              <Copy className="w-4 h-4" />
              Nhân bản
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
              <Eye className="w-4 h-4" />
              Xem tin
            </button>
            <hr className="my-2" />
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function EmployerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý tuyển dụng
              </h1>
              <p className="text-gray-600 mt-1">
                Xin chào! Chào mừng trở lại với bảng điều khiển của bạn
              </p>
            </div>
            <Link
              to="/employer/post-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Đăng tin tuyển dụng
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
                >
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-green-600 font-medium">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Job Postings Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tin tuyển dụng của bạn
            </h2>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên công việc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "active"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Đang tuyển
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "pending"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Chờ duyệt
                </button>
                <button
                  onClick={() => setFilterStatus("expired")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "expired"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Hết hạn
                </button>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="divide-y divide-gray-200">
            {filteredJobs.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy tin tuyển dụng
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi bộ lọc hoặc tìm kiếm khác
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 hover:bg-gray-50 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition">
                          {job.title}
                        </h3>
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          📍 {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          💰 {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          📅 Đăng ngày:{" "}
                          {new Date(job.postedDate).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="flex items-center gap-1">
                          ⏰ Hết hạn:{" "}
                          {new Date(job.expiryDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <span className="flex items-center gap-1 text-gray-700">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold">
                            {job.applications}
                          </span>{" "}
                          ứng viên
                        </span>
                        <span className="flex items-center gap-1 text-gray-700">
                          <Eye className="w-4 h-4 text-green-500" />
                          <span className="font-semibold">{job.views}</span>{" "}
                          lượt xem
                        </span>
                      </div>
                    </div>
                    <ActionMenu job={job} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold">1-5</span> trong{" "}
                <span className="font-semibold">{filteredJobs.length}</span> tin
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Trước
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
