import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Users,
  Search,
  Megaphone,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import banner1 from "../assets/banner/banner_vietnamworks_1.png";
import banner2 from "../assets/banner/banner_vietnamworks_2.png";
import banner3 from "../assets/banner/banner_vietnamworks_3.png";
import dangTuyenImg from "../assets/employer/dang_tuyen.svg";
import timHoSoImg from "../assets/employer/tim_ho_so.svg";
import quangBaImg from "../assets/employer/quang_ba_thuong_hieu.svg";
import prudentialLogo from "../assets/logo/Prudential.png";
import vingroupLogo from "../assets/logo/vingroup.png";
import vnptLogo from "../assets/logo/vnpt.png";
import vngLogo from "../assets/logo/vng.png";
import fossilLogo from "../assets/logo/fossil.png";
import fptLogo from "../assets/logo/FPT.png";
import lgLogo from "../assets/logo/LG.png";
import lazadaLogo from "../assets/logo/lazada.png";
import boschLogo from "../assets/logo/Bosch.png";
import vpbankLogo from "../assets/logo/vpbank.jpg";

function BannerSlider() {
  const banners = [banner1, banner2, banner3];
  const [current, setCurrent] = useState(0);
  const handlePrev = () =>
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  const handleNext = () => setCurrent((prev) => (prev + 1) % banners.length);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="relative w-full overflow-hidden">
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-orange-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
        aria-label="Xem banner trước"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, idx) => (
          <img
            key={idx}
            src={banner}
            alt={`Banner ${idx + 1}`}
            className="w-full h-auto object-cover flex-shrink-0"
          />
        ))}
      </div>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-orange-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
        aria-label="Xem banner tiếp"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-3 h-3 rounded-full ${
              current === idx ? "bg-white" : "bg-white/50"
            } transition`}
          />
        ))}
      </div>
    </section>
  );
}

const benefits = [
  {
    icon: <Users className="w-10 h-10" />,
    title: "Tiếp cận hàng triệu ứng viên",
    description:
      "Kết nối với hơn 7 triệu lượt truy cập mỗi tháng từ các ứng viên tiềm năng",
  },
  {
    icon: <Clock className="w-10 h-10" />,
    title: "Tiết kiệm thời gian",
    description:
      "Quản lý toàn bộ quy trình tuyển dụng trên một nền tảng duy nhất",
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "Uy tín & Chuyên nghiệp",
    description:
      "Được tin dùng bởi hàng nghìn doanh nghiệp hàng đầu tại Việt Nam",
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "Hiệu quả cao",
    description:
      "Tỷ lệ tìm được ứng viên phù hợp cao nhờ công nghệ AI và dữ liệu lớn",
  },
];

const testimonials = [
  {
    company: "Ngân hàng TMCP Kỹ thương Việt Nam",
    logo: "https://images.vietnamworks.com/logo/techcombank_95929_210811173811.png",
    quote:
      "Rất ấn tượng vì sự tận tâm và phục vụ khách hàng của viec69, chúng tôi đã thu hút được rất nhiều nhân tài từ đây!",
    author: "Phòng Nhân sự",
  },
  {
    company: "Công ty TNHH Nước Giải Khát Suntory Pepsico Việt Nam",
    logo: "https://images.vietnamworks.com/logo/suntory-pepsico-vietnam-beverage-company-limited-suntory-pepsico-vietnam-beverage-e3508027.png",
    quote:
      "viec69 tư vấn nhiệt tình, hỗ trợ tận tâm, đồng hành cùng doanh nghiệp.",
    author: "HR Manager",
  },
  {
    company: "Công ty TNHH BHNT Prudential Việt Nam",
    logo: "https://images.vietnamworks.com/logo/prudential-vietnam-assurance-private-limited-branch-in-ho-chi-minh-city-e5077532.png",
    quote:
      "Nhân viên tư vấn viec69 hỗ trợ tốt, bất kỳ yêu cầu qua mail hay qua call đều được hỗ trợ nhanh chóng.",
    author: "Trưởng phòng Tuyển dụng",
  },
];

const topCompanies = [
  { name: "Prudential", logo: prudentialLogo },
  { name: "Vingroup", logo: vingroupLogo },
  { name: "VNPT", logo: vnptLogo },
  { name: "VNG", logo: vngLogo },
  { name: "Fossil", logo: fossilLogo },
  { name: "FPT", logo: fptLogo },
  { name: "LG", logo: lgLogo },
  { name: "Lazada", logo: lazadaLogo },
  { name: "Bosch", logo: boschLogo },
  { name: "VPBank", logo: vpbankLogo },
];

// ServiceSection Component
function ServiceSection({
  id,
  icon,
  title,
  price,
  originalPrice,
  discount,
  features,
  note,
  buttonText,
  direction,
  bgColor,
  image,
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section
      id={id}
      className={`py-20 bg-gradient-to-br ${bgColor} overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-x-0"
              : direction === "left"
              ? "opacity-0 -translate-x-20"
              : "opacity-0 translate-x-20"
          }`}
        >
          {/* Content */}
          <div className={direction === "right" ? "md:order-2" : ""}>
            <div className="text-orange-500 mb-6">{icon}</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-5xl md:text-6xl font-bold text-orange-600">
                  {price}
                </span>
                <span className="text-2xl text-gray-600">VND</span>
              </div>
              {originalPrice && discount && (
                <div className="text-gray-500">
                  <span className="line-through text-lg">
                    {originalPrice} VND
                  </span>
                  <span className="ml-3 text-green-600 font-semibold text-lg">
                    {discount}
                  </span>
                </div>
              )}
            </div>
            <ul className="space-y-4 mb-8">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">{feature}</span>
                </li>
              ))}
            </ul>
            {note && (
              <p className="text-sm text-gray-500 italic mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {note}
              </p>
            )}
            <button className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-xl hover:shadow-2xl">
              {buttonText}
            </button>
          </div>

          {/* Image/Illustration */}
          <div className={direction === "right" ? "md:order-1" : ""}>
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Scroll animation hook - Reset animation when out of view
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set visibility based on whether element is intersecting
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
}

// CompanyLogoGrid: hiện logo với hiệu ứng hiện ra khi scroll tới
function CompanyLogoGrid({ companies }) {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 items-center justify-items-center transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {companies.map((company, idx) => (
        <div
          key={idx}
          className="w-full h-24 flex items-center justify-center p-4 cursor-pointer"
          title={company.name}
        >
          <img
            src={company.logo}
            alt={company.name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function EmployerLanding() {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Quick Access Bar - Employer Dashboard Link */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm md:text-base">
            Đã có tài khoản nhà tuyển dụng?
          </p>
          <Link
            to="/employer/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-full text-sm font-semibold hover:bg-orange-50 transition shadow-md"
          >
            <Building2 className="w-4 h-4" />
            Vào Dashboard
          </Link>
        </div>
      </div>

      {/* Banner Slider - Hero Section */}
      <BannerSlider />

      {/* Benefits Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn viec69?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nền tảng tuyển dụng hàng đầu với công nghệ tiên tiến và dịch vụ
            chuyên nghiệp
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-orange-100"
            >
              <div className="text-orange-500 mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            DỊCH VỤ CỦA CHÚNG TÔI
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Chúng tôi cung cấp nhiều dịch vụ giúp nhà tuyển dụng kết nối với
            nhiều nhân tài hơn, để họ có thể kết nối với ứng cử viên nhanh hơn
          </p>
          <button
            onClick={() => {
              document.getElementById("service-dang-tuyen")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all hover:scale-110 shadow-lg hover:shadow-xl animate-bounce"
            aria-label="Cuộn xuống các dịch vụ"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Service 1: Đăng Tuyển */}
      <ServiceSection
        id="service-dang-tuyen"
        icon={<Megaphone className="w-16 h-16" />}
        title="Đăng Tuyển"
        price="2,160,000"
        originalPrice="2,400,000"
        discount="-10% khi mua online"
        features={[
          "Đảm bảo hài lòng 100%",
          "Đăng tuyển nhanh chóng và nhận hồ sơ ngay lập tức",
          "Quản lý hồ sơ trực tuyến của bạn dễ dàng",
        ]}
        note="Chương trình chỉ áp dụng cho đơn hàng trực tuyến, không áp dụng đồng thời với các chương trình khuyến mãi khác"
        buttonText="Mua ngay"
        direction="left"
        bgColor="from-orange-100 to-white"
        image={dangTuyenImg}
      />

      {/* Service 2: Tìm hồ sơ */}
      <ServiceSection
        icon={<Search className="w-16 h-16" />}
        title="Tìm hồ sơ"
        price="4,644,000"
        originalPrice="5,160,000"
        discount="-10% khi mua online"
        features={[
          "30 ngày truy cập không giới hạn hệ thống dữ liệu chuyên nghiệp",
          "Tìm ứng viên hiệu quả và nhanh chóng",
          "Chủ động tìm kiếm ứng viên ngay hôm nay",
        ]}
        note="Chương trình chỉ áp dụng cho đơn hàng trực tuyến, không áp dụng đồng thời với các chương trình khuyến mãi khác"
        buttonText="Mua ngay"
        direction="right"
        bgColor="from-blue-50 to-white"
        image={timHoSoImg}
      />

      {/* Service 3: Quảng bá thương hiệu */}
      <ServiceSection
        icon={<TrendingUp className="w-16 h-16" />}
        title="Quảng bá thương hiệu"
        price="23,200,000"
        features={[
          "Trang chủ viec69 nhận được hơn 7 triệu lượt truy cập mỗi tháng từ các ứng viên và chuyên gia giỏi nhất tại Việt Nam",
          "Đặt Logo và Banner tại trang chủ sẽ là vị trí chiến lược để thu hút nhân tài",
        ]}
        buttonText="Liên Hệ"
        direction="left"
        bgColor="from-purple-50 to-white"
        image={quangBaImg}
      />

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center justify-center mb-6 h-20">
                  <img
                    src={testimonial.logo}
                    alt={testimonial.company}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <p className="text-gray-700 italic mb-6 text-center">
                  "{testimonial.quote}"
                </p>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.company}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              CÁC DOANH NGHIỆP HÀNG ĐẦU LỰA CHỌN VIEC69
            </h2>
            <p className="text-lg text-gray-600">
              Được tin dùng bởi hàng nghìn doanh nghiệp lớn tại Việt Nam
            </p>
          </div>
          <CompanyLogoGrid companies={topCompanies} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng tìm kiếm nhân tài?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Hàng nghìn ứng viên tiềm năng đang chờ đợi cơ hội từ bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/employer/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-full text-lg font-semibold hover:bg-orange-50 transition shadow-xl"
            >
              <Building2 className="w-6 h-6" />
              Vào Dashboard
            </Link>
            <Link
              to="/employer/post-job"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition shadow-xl"
            >
              Đăng tuyển ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Thông tin liên hệ
              </h3>
              <p className="text-gray-600 text-sm">
                <a href="tel:+84393258456" className="hover:text-orange-600">
                  Hồ Chí Minh: (84 28) 3925 8456
                </a>
              </p>
              <p className="text-gray-600 text-sm">
                <a href="tel:+84393440568" className="hover:text-orange-600">
                  Hà Nội: (84 24) 3944 0568
                </a>
              </p>
              <p className="text-gray-600 text-sm">
                <a
                  href="mailto:employer@viec69.com"
                  className="hover:text-orange-600"
                >
                  employer@viec69.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Giờ làm việc</h3>
              <p className="text-gray-600 text-sm">
                Thứ 2 - Thứ 6: 8:00 - 17:30
              </p>
              <p className="text-gray-600 text-sm">Thứ 7: 8:00 - 12:00</p>
              <p className="text-gray-600 text-sm">Chủ nhật: Nghỉ</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Hỗ trợ</h3>
              <p className="text-gray-600 text-sm">
                <Link to="/faq" className="hover:text-orange-600">
                  Câu hỏi thường gặp
                </Link>
              </p>
              <p className="text-gray-600 text-sm">
                <Link to="/guide" className="hover:text-orange-600">
                  Hướng dẫn sử dụng
                </Link>
              </p>
              <p className="text-gray-600 text-sm">
                <Link to="/terms" className="hover:text-orange-600">
                  Điều khoản sử dụng
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
