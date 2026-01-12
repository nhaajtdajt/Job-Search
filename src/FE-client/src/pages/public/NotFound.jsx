import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, Briefcase } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-8">
          <span className="text-3xl font-bold text-blue-600">viec24h</span>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[180px] sm:text-[220px] font-bold text-blue-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-6 shadow-xl">
              <Search className="w-16 h-16 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Oops! Trang không tồn tại
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          khả dụng.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang trước
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-full text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Có thể bạn muốn tìm:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/jobs"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Tìm việc làm
                </p>
                <p className="text-sm text-gray-500">Khám phá cơ hội mới</p>
              </div>
            </Link>

            <Link
              to="/companies"
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Công ty
                </p>
                <p className="text-sm text-gray-500">Tìm hiểu nhà tuyển dụng</p>
              </div>
            </Link>

            <Link
              to="/employer"
              className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Nhà tuyển dụng
                </p>
                <p className="text-sm text-gray-500">Đăng tin tuyển dụng</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-gray-500">
          Nếu bạn tin rằng đây là lỗi, vui lòng{" "}
          <a
            href="mailto:support@viec24h.vn"
            className="text-blue-600 hover:underline"
          >
            liên hệ hỗ trợ
          </a>
        </p>
      </div>
    </div>
  );
}
