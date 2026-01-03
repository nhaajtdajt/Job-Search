import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import EmployerUserDropdown from "./EmployerUserDropdown";

export default function EmployerHeader() {
  const { isAuthenticated, user } = useAuth();

  const primaryLinks = [
    { label: "Dashboard", to: "/employer/dashboard" },
    { label: "Đăng tin", to: "/employer/jobs/create" },
    { label: "Hồ sơ", to: "/employer/profile" },
    { label: "Công ty", to: "/employer/company" },
  ];

  const guestLinks = [
    { label: "Trang chủ", to: "/employer" },
    { label: "Về chúng tôi", to: "/employer/about" },
    { label: "Liên hệ", to: "/employer/contact" },
  ];

  const supportLinks = [
    { label: "Hướng dẫn sử dụng", href: "#" },
    { label: "Liên hệ hỗ trợ", href: "#" },
    { label: "Hotline: 1900 1234", href: "#" },
  ];

  const navLinks = isAuthenticated ? primaryLinks : guestLinks;

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-orange-200 text-gray-800">
        <div className="max-w-7xl mx-auto flex h-10 items-center justify-between px-4 text-[11px] uppercase tracking-widest sm:px-6 lg:px-8">
          <span className="font-semibold">Giải pháp tuyển dụng chuyên nghiệp</span>
          <div className="flex items-center gap-4">
            {supportLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hidden text-gray-700 transition hover:text-gray-900 sm:inline"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/employer/contact"
              className="hidden sm:inline rounded-full bg-orange-500 px-4 py-2 text-white font-semibold text-xs uppercase tracking-wider hover:bg-orange-600 transition-all duration-200 btn-smooth transform hover:scale-105 active:scale-95"
            >
              Liên hệ tư vấn
            </Link>
            <a
              href="#"
              className="text-gray-700 transition hover:text-gray-900 sm:hidden"
            >
              Hỗ trợ
            </a>
          </div>
        </div>
      </div>
      <div className="backdrop-blur bg-orange-500/15 shadow-md shadow-brand-950/40">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/employer" className="flex items-center gap-4 group">
            <div>
              <p className="text-4xl font-bold tracking-tight text-red-600 drop-shadow">
                viec24h
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Nhà tuyển dụng
              </p>
            </div>
          </Link>
          <div className="flex flex-1 flex-col items-start gap-4 text-sm font-medium text-brand-100/80 lg:flex-row lg:items-center lg:justify-end">
            <nav className="flex flex-wrap items-center gap-1 rounded-full bg-white/10 px-1 py-1 ring-1 ring-white/15 backdrop-blur">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-full px-4 py-2 text-sm text-brand-50/90 transition-all duration-200 hover:bg-white/15 hover:text-white link-smooth transform hover:scale-105"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/employer/notifications"
                  className="rounded-full px-4 py-2 text-sm text-brand-50/90 transition-all duration-200 hover:bg-white/15 hover:text-white link-smooth transform hover:scale-105"
                >
                  Thông báo
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-4">
              {/* Only show "Người tìm việc" button when NOT authenticated */}
              {!isAuthenticated && (
                <Link 
                  to="/" 
                  className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600 shadow-lg btn-smooth transform hover:scale-105 active:scale-95"
                >
                  Người tìm việc
                </Link>
              )}
              <div className="flex items-center gap-8">
                {isAuthenticated ? (
                  <EmployerUserDropdown />
                ) : (
                  <>
                    <Link to="/employer/login" className="text-brand-50 font-semibold transition-all duration-200 hover:text-white link-smooth">
                      Đăng nhập
                    </Link>
                    <Link to="/employer/register" className="text-sm font-semibold text-brand-50 transition-all duration-200 hover:text-white link-smooth">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

