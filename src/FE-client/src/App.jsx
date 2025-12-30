import { Outlet, Link } from "react-router-dom";
import "./App.css";

function Header() {
  const primaryLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Việc làm", to: "/jobs" },
    { label: "Công ty", to: "/companies" },
    { label: "Kỹ năng", to: "#" },
  ];

  const supportLinks = [
    { label: "Hướng dẫn sử dụng", href: "#" },
    { label: "Liên hệ hỗ trợ", href: "#" },
    { label: "Hotline: 1900 1234", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-blue-200 text-gray-800">
        <div className="max-w-7xl mx-auto flex h-10 items-center justify-between px-4 text-[11px] uppercase tracking-widest sm:px-6 lg:px-8">
          <span className="font-semibold">Empower your growth</span>
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
              to="/contact"
              className="hidden sm:inline rounded-full bg-blue-500 px-4 py-2 text-white font-semibold text-xs uppercase tracking-wider hover:bg-blue-600 transition"
            >
              Liên hệ hỗ trợ
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
      <div className="backdrop-blur bg-blue-500/15 shadow-md shadow-brand-950/40">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div>
              <p className="text-4xl font-bold tracking-tight text-red-600 drop-shadow">
                viec24h
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
                Nâng tầm sự nghiệp
              </p>
            </div>
          </Link>
          <div className="flex flex-1 flex-col items-start gap-4 text-sm font-medium text-brand-100/80 lg:flex-row lg:items-center lg:justify-end">
            <nav className="flex flex-wrap items-center gap-1 rounded-full bg-white/10 px-1 py-1 ring-1 ring-white/15 backdrop-blur">
              {primaryLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-full px-4 py-2 text-sm text-brand-50/90 transition hover:bg-white/15 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <button className="rounded-full px-4 py-2 text-sm text-brand-50/90 transition hover:bg-white/15 hover:text-white">
                Thông báo
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <Link 
                to="/employer" 
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 shadow-lg"
              >
                Nhà tuyển dụng
              </Link>
              <div className="flex items-center gap-8">
                <Link to="/login" className="text-brand-50 font-semibold transition hover:text-white">
                  Đăng nhập
                </Link>
                <Link to="/register" className="text-sm font-semibold text-brand-50 transition hover:text-white">
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-black">viec24h</p>
            <p className="mt-4 text-xs sm:text-sm text-brand-200/85">
              Kết nối nhân tài và doanh nghiệp tại Việt Nam với nền tảng việc
              làm trực quan, thông minh và cá nhân hóa.
            </p>
          </div>
          <div>
            <p className="text-base font-semibold uppercase tracking-wide text-black">
              Viec24h Platform
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Về viec24h
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Tin tức &amp; sự kiện
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Trung tâm trợ giúp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-base font-semibold uppercase tracking-wide text-black">
              Dành cho ứng viên
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Tạo CV Wow
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Lộ trình sự nghiệp
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-[#ccc]">
                  Cẩm nang nghề nghiệp
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

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
