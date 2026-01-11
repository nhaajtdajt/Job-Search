import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Target,
  Eye,
  Users,
  Building2,
  Briefcase,
  Award,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Scroll animation hook - Reset animation when out of view
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

// Statistics data
const statistics = [
  {
    icon: <Users className="w-8 h-8" />,
    number: "7M+",
    label: "Lượt truy cập mỗi tháng",
    description: "Ứng viên tiềm năng tìm kiếm cơ hội việc làm",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    number: "10,000+",
    label: "Doanh nghiệp tin dùng",
    description: "Từ startup đến tập đoàn đa quốc gia",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    number: "500,000+",
    label: "Việc làm đã đăng",
    description: "Cơ hội việc làm đa dạng ngành nghề",
  },
  {
    icon: <Award className="w-8 h-8" />,
    number: "15+",
    label: "Năm kinh nghiệm",
    description: "Đồng hành cùng thị trường lao động Việt Nam",
  },
];

// Core values data
const coreValues = [
  {
    icon: <Shield className="w-12 h-12" />,
    title: "Tin cậy",
    description:
      "Xây dựng niềm tin với đối tác qua chất lượng dịch vụ và cam kết bảo mật thông tin tuyệt đối.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: "Đổi mới",
    description:
      "Không ngừng cải tiến công nghệ AI và Big Data để mang lại trải nghiệm tuyển dụng vượt trội.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: <Heart className="w-12 h-12" />,
    title: "Tận tâm",
    description:
      "Đồng hành cùng doanh nghiệp với đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <TrendingUp className="w-12 h-12" />,
    title: "Hiệu quả",
    description:
      "Tối ưu hóa quy trình tuyển dụng, giúp doanh nghiệp tiết kiệm thời gian và chi phí.",
    gradient: "from-green-500 to-emerald-500",
  },
];

// Timeline milestones
const milestones = [
  {
    year: "2010",
    title: "Khởi đầu hành trình",
    description: "viec24h ra đời với sứ mệnh kết nối nhân tài và doanh nghiệp Việt Nam.",
  },
  {
    year: "2015",
    title: "Vươn tầm toàn quốc",
    description: "Mở rộng văn phòng tại Hà Nội, phục vụ hàng nghìn doanh nghiệp trên cả nước.",
  },
  {
    year: "2018",
    title: "Chuyển đổi số",
    description: "Áp dụng công nghệ AI trong matching ứng viên, nâng cao chất lượng tuyển dụng.",
  },
  {
    year: "2022",
    title: "Nền tảng SaaS",
    description: "Ra mắt hệ thống quản lý tuyển dụng toàn diện cho doanh nghiệp.",
  },
  {
    year: "2024",
    title: "Hướng tới tương lai",
    description: "Tiếp tục đổi mới với AI thế hệ mới, mở rộng khu vực Đông Nam Á.",
  },
];

// Service highlights
const serviceHighlights = [
  "Đăng tin tuyển dụng không giới hạn",
  "Truy cập kho hồ sơ 5 triệu+ ứng viên",
  "Công cụ sàng lọc AI thông minh",
  "Báo cáo & phân tích chi tiết",
  "Hỗ trợ tư vấn chuyên nghiệp 24/7",
  "Quảng bá thương hiệu nhà tuyển dụng",
];

export default function EmployerAbout() {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-orange-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Về chúng tôi
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Kết nối nhân tài,
              <br />
              <span className="text-orange-200">Kiến tạo tương lai</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              viec24h là nền tảng tuyển dụng hàng đầu Việt Nam, đồng hành cùng 
              hàng nghìn doanh nghiệp trong hành trình tìm kiếm và phát triển nhân tài.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/employer/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-full text-lg font-semibold hover:bg-orange-50 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/employer/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition shadow-xl"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-10 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Target className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Xây dựng cầu nối vững chắc giữa doanh nghiệp và nhân tài, 
                  góp phần phát triển nguồn nhân lực chất lượng cao cho Việt Nam 
                  thông qua công nghệ tiên tiến và dịch vụ tận tâm.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Eye className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tầm nhìn</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Trở thành nền tảng HR Tech hàng đầu Đông Nam Á, 
                  nơi mỗi doanh nghiệp đều tìm được nhân tài phù hợp và 
                  mỗi ứng viên đều có cơ hội phát triển sự nghiệp.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Con số ấn tượng
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hơn một thập kỷ đồng hành cùng thị trường lao động Việt Nam
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, idx) => (
              <AnimatedSection key={idx}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 text-center group hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    {stat.icon}
                  </div>
                  <p className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Từ startup Việt Nam đến nền tảng tuyển dụng hàng đầu
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500 rounded-full hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <AnimatedSection
                  key={idx}
                  direction={idx % 2 === 0 ? "left" : "right"}
                >
                  <div className={`flex items-center gap-8 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 shadow-lg border border-orange-100 inline-block">
                        <p className="text-orange-600 font-bold text-2xl mb-2">{milestone.year}</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Center dot */}
                    <div className="hidden md:flex items-center justify-center w-6 h-6 bg-white border-4 border-orange-500 rounded-full z-10 flex-shrink-0 shadow-lg"></div>
                    
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <AnimatedSection key={idx}>
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center group hover:-translate-y-2 border border-gray-100">
                  <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Giải pháp tuyển dụng
                <span className="text-orange-600"> toàn diện</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Chúng tôi cung cấp đầy đủ các công cụ và dịch vụ giúp doanh nghiệp 
                tối ưu hóa quy trình tuyển dụng, từ đăng tin đến quản lý ứng viên.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {serviceHighlights.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link
                  to="/employer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Khám phá dịch vụ
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                      <p className="text-4xl font-bold text-orange-600 mb-2">98%</p>
                      <p className="text-gray-600 text-sm">Khách hàng hài lòng</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                      <p className="text-4xl font-bold text-orange-600 mb-2">24/7</p>
                      <p className="text-gray-600 text-sm">Hỗ trợ khách hàng</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                      <p className="text-4xl font-bold text-orange-600 mb-2">5M+</p>
                      <p className="text-gray-600 text-sm">Hồ sơ ứng viên</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                      <p className="text-4xl font-bold text-orange-600 mb-2">72h</p>
                      <p className="text-gray-600 text-sm">Thời gian phản hồi TB</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu tuyển dụng?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Đăng ký ngay hôm nay và trải nghiệm nền tảng tuyển dụng hàng đầu Việt Nam
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
                to="/employer/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition shadow-xl"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
