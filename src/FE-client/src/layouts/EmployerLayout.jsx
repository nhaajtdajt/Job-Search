import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import EmployerHeader from "../components/employer/EmployerHeader";
import { useAuth } from "../contexts/AuthContext";

function EmployerFooter() {
  return (
    <footer className="bg-[#ffe9d9]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-black">viec24h</p>
            <p className="mt-4 text-xs sm:text-sm text-brand-200/85">
              Nền tảng tuyển dụng hàng đầu Việt Nam - Kết nối nhà tuyển dụng
              với hàng triệu ứng viên tiềm năng.
            </p>
          </div>
          <div>
            <p className="text-base font-semibold uppercase tracking-wide text-black">
              Dịch vụ tuyển dụng
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Đăng tin tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Tìm ứng viên
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Gói dịch vụ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-base font-semibold uppercase tracking-wide text-black">
              Hỗ trợ nhà tuyển dụng
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Hướng dẫn đăng tin
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Quy trình tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Liên hệ tư vấn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-base font-semibold uppercase tracking-wide text-black">
              Kết nối
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="https://www.facebook.com"
                  className="transition hover:text-[#ccc]"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  className="transition hover:text-[#ccc]"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://chat.zalo.me/"
                  className="transition hover:text-[#ccc]"
                >
                  Zalo
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-brand-200/75">
          © {new Date().getFullYear()} viec24h. Đã đăng ký bản quyền. Một sản
          phẩm bởi đội ngũ viec24h.
        </div>
      </div>
    </footer>
  );
}

export default function EmployerLayout() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Allow access to login and register pages without authentication/role check
  const publicPaths = ['/employer/login', '/employer/register', '/employer'];
  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    // Don't redirect while loading authentication state
    if (loading) return;

    // Only check role for protected paths (not login, register, or landing page)
    if (!isPublicPath) {
      if (isAuthenticated && user && user.role !== 'employer') {
        // User is authenticated but not an employer - redirect to home
        navigate('/', { replace: true });
      } else if (!isAuthenticated) {
        // User is not authenticated - redirect to employer login
        navigate('/employer/login', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate, location.pathname, isPublicPath]);

  return (
    <div className="min-h-dvh flex flex-col bg-white text-slate-900">
      <EmployerHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <EmployerFooter />
    </div>
  );
}
