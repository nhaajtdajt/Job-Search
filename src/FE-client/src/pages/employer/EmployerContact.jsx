import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  Building2,
  Briefcase,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Scroll animation hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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

// Animated Section Component
function AnimatedSection({ children, className = "", direction = "up" }) {
  const [ref, isVisible] = useScrollAnimation();

  const directionClasses = {
    up: isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
    down: isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10",
    left: isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
    right: isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${directionClasses[direction]} ${className}`}
    >
      {children}
    </div>
  );
}

// Office locations data
const offices = [
  {
    city: "Hồ Chí Minh",
    address: "Tầng 12, Tòa nhà Vincom Center, 72 Lê Thánh Tôn, Quận 1",
    phone: "(84 28) 3925 8456",
    email: "hcm@viec24h.com",
    hours: "Thứ 2 - Thứ 6: 8:00 - 17:30",
    mapUrl: "https://maps.google.com/?q=72+Le+Thanh+Ton+District+1+HCMC",
  },
  {
    city: "Hà Nội",
    address: "Tầng 8, Tòa nhà Lotte Center, 54 Liễu Giai, Ba Đình",
    phone: "(84 24) 3944 0568",
    email: "hanoi@viec24h.com",
    hours: "Thứ 2 - Thứ 6: 8:00 - 17:30",
    mapUrl: "https://maps.google.com/?q=54+Lieu+Giai+Ba+Dinh+Hanoi",
  },
];

// Recruitment needs options
const recruitmentNeeds = [
  { value: "", label: "Chọn nhu cầu tuyển dụng" },
  { value: "dang-tuyen", label: "Đăng tin tuyển dụng" },
  { value: "tim-ung-vien", label: "Tìm kiếm hồ sơ ứng viên" },
  { value: "quang-ba", label: "Quảng bá thương hiệu nhà tuyển dụng" },
  { value: "goi-dich-vu", label: "Gói dịch vụ tuyển dụng trọn gói" },
  { value: "headhunt", label: "Dịch vụ Headhunt cao cấp" },
  { value: "khac", label: "Nhu cầu khác" },
];

// FAQ data
const faqs = [
  {
    question: "Làm thế nào để đăng tin tuyển dụng trên viec24h?",
    answer:
      "Bạn chỉ cần đăng ký tài khoản nhà tuyển dụng miễn phí, sau đó chọn mua gói dịch vụ phù hợp và bắt đầu đăng tin. Tin tuyển dụng sẽ được hiển thị ngay sau khi được duyệt (thường trong vòng 2-4 giờ làm việc).",
  },
  {
    question: "Chi phí đăng tin tuyển dụng là bao nhiêu?",
    answer:
      "Chúng tôi cung cấp nhiều gói dịch vụ với mức giá linh hoạt từ 2.160.000 VND/tin. Bạn cũng có thể liên hệ để nhận báo giá gói dịch vụ tùy chỉnh theo nhu cầu cụ thể của doanh nghiệp.",
  },
  {
    question: "Tôi có thể truy cập kho hồ sơ ứng viên như thế nào?",
    answer:
      "Với gói 'Tìm hồ sơ', bạn sẽ có quyền truy cập không giới hạn vào cơ sở dữ liệu hơn 5 triệu hồ sơ ứng viên trong 30 ngày, kèm theo công cụ lọc thông minh giúp tìm kiếm ứng viên phù hợp nhanh chóng.",
  },
  {
    question: "viec24h có hỗ trợ tuyển dụng cho các vị trí cao cấp không?",
    answer:
      "Có, chúng tôi cung cấp dịch vụ Headhunt chuyên biệt cho các vị trí quản lý cấp cao và chuyên gia. Đội ngũ tư vấn sẽ làm việc trực tiếp để tìm kiếm và sàng lọc ứng viên phù hợp.",
  },
  {
    question: "Thời gian xử lý đơn hàng và kích hoạt dịch vụ mất bao lâu?",
    answer:
      "Đơn hàng online sẽ được kích hoạt ngay sau khi thanh toán thành công. Với đơn hàng qua tư vấn viên, dịch vụ sẽ được kích hoạt trong vòng 24 giờ làm việc sau khi xác nhận.",
  },
  {
    question: "Làm sao để được hỗ trợ nếu gặp sự cố?",
    answer:
      "Bạn có thể liên hệ hotline 1900 1234 (24/7), gửi email đến employer@viec24h.com, hoặc sử dụng chat hỗ trợ trực tiếp trên website. Đội ngũ CSKH cam kết phản hồi trong vòng 2 giờ.",
  },
];

// FAQ Item component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

// Contact Form component
function ContactForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    need: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Vui lòng nhập tên công ty";
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Vui lòng nhập họ tên";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9+\-\s()]{9,15}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.need) {
      newErrors.need = "Vui lòng chọn nhu cầu tuyển dụng";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-orange-100 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Gửi thành công!
        </h3>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã liên hệ. Đội ngũ tư vấn của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              companyName: "",
              contactName: "",
              email: "",
              phone: "",
              need: "",
              message: "",
            });
          }}
          className="text-orange-600 font-semibold hover:text-orange-700 transition"
        >
          Gửi yêu cầu khác →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-orange-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Gửi yêu cầu tư vấn</h3>
      <p className="text-gray-600 mb-8">Chúng tôi sẽ liên hệ trong vòng 24 giờ</p>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên công ty <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Công ty ABC"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.companyName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.contactName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-500">{errors.contactName}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@company.com"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0912 345 678"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhu cầu tuyển dụng <span className="text-red-500">*</span>
          </label>
          <select
            name="need"
            value={formData.need}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.need ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white`}
          >
            {recruitmentNeeds.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.need && (
            <p className="mt-1 text-sm text-red-500">{errors.need}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung tin nhắn
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Mô tả chi tiết nhu cầu tuyển dụng của bạn..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-lg font-semibold transition shadow-lg ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:from-orange-600 hover:to-red-600 hover:shadow-xl transform hover:scale-[1.02]"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Gửi yêu cầu
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function EmployerContact() {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-orange-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Liên hệ
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Chúng tôi sẵn sàng
              <br />
              <span className="text-orange-200">hỗ trợ bạn</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Đội ngũ tư vấn chuyên nghiệp của viec24h luôn sẵn sàng lắng nghe 
              và hỗ trợ mọi nhu cầu tuyển dụng của doanh nghiệp bạn.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Contact Stats */}
      <section className="py-8 bg-white shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Hotline</p>
                <a href="tel:19001234" className="text-xl font-bold text-gray-900 hover:text-orange-600 transition">
                  1900 1234
                </a>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Email</p>
                <a href="mailto:employer@viec24h.com" className="text-xl font-bold text-gray-900 hover:text-orange-600 transition">
                  employer@viec24h.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Hỗ trợ</p>
                <p className="text-xl font-bold text-gray-900">24/7 Online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimatedSection direction="left">
              <ContactForm />
            </AnimatedSection>

            {/* Office Information */}
            <AnimatedSection direction="right">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Văn phòng</h3>
                  <p className="text-gray-600">Ghé thăm chúng tôi tại</p>
                </div>
                
                {offices.map((office, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          Văn phòng {office.city}
                        </h4>
                        <p className="text-gray-600 mt-1">{office.address}</p>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mt-4 pl-16">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-orange-500" />
                        <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="hover:text-orange-600 transition">
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-orange-500" />
                        <a href={`mailto:${office.email}`} className="hover:text-orange-600 transition">
                          {office.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                    
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 ml-16 text-orange-600 font-semibold hover:text-orange-700 transition"
                    >
                      Xem trên Google Maps
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                ))}

                {/* Additional Contact Methods */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Các kênh hỗ trợ khác
                  </h4>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <MessageSquare className="w-5 h-5 text-orange-500" />
                      </div>
                      <span>Chat trực tuyến trên website</span>
                    </a>
                    <a
                      href="https://zalo.me/viec24h"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <span>Zalo Official Account</span>
                    </a>
                    <a
                      href="https://facebook.com/viec24h"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span>Facebook Fanpage</span>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-lg text-gray-600">
              Giải đáp nhanh các thắc mắc phổ biến của nhà tuyển dụng
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="text-center mt-10">
            <p className="text-gray-600 mb-4">Không tìm thấy câu trả lời bạn cần?</p>
            <a
              href="mailto:employer@viec24h.com"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition"
            >
              Gửi email cho chúng tôi
              <ArrowRight className="w-4 h-4" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bắt đầu tuyển dụng ngay hôm nay
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Đăng ký tài khoản miễn phí và khám phá các giải pháp tuyển dụng của viec24h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/employer/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-full text-lg font-semibold hover:bg-orange-50 transition shadow-xl"
              >
                <Building2 className="w-6 h-6" />
                Đăng ký miễn phí
              </Link>
              <Link
                to="/employer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition shadow-xl"
              >
                Xem dịch vụ
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
