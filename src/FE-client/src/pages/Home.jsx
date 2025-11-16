import SearchBar from "../components/SearchBar.jsx";
import heroImage from "../assets/logoAdvertise/teleper_hrbn.webp";
import mbBanner from "../assets/logoBank/MBbankBanner_136036.webp";
import boschImage from "../assets/logoAdvertise/BOSCH_GLOBAL.webp";
import { Dropdown } from "antd";
import { Menu } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import Card from "../components/Card.jsx";
import SimpleJobCard from "../components/SimpleJobCard";
import EmployerCard from "../components/EmployerCard";
import vinhome from "../assets/logocompanies/vinhomes.png";
import viec24h from "../assets/logocompanies/logoviec69.png";
import vinfast from "../assets/logocompanies/vinfast.jpg";
import vinsmart from "../assets/logocompanies/vinsmart.png";
import vincomretail from "../assets/logocompanies/vincomretail.png";
import techcombank from "../assets/logoBank/techcombank.jpg";
import shinhanbank from "../assets/logoBank/shinhanbank.jpg";
import { Link } from "react-router-dom";

const heroStats = [
  { value: "48.5K+", label: "Việc làm đang tuyển" },
  { value: "3.2K+", label: "Nhà tuyển dụng hoạt động" },
  { value: "1.1K+", label: "Việc làm công nghệ" },
];

const items = [
  {
    key: "1",
    label: (
      <a rel="noopener noreferrer" href="#">
        Khu vực miền nam
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a rel="noopener noreferrer" href="#">
        Khu vực miền bắc
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a rel="noopener noreferrer" href="#">
        Khu vực miền trung
      </a>
    ),
  },
];

const topJobs = [
  {
    title: "Chuyên Viên Phát Triển Kinh Doanh",
    company: "Vinhomes",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội", "Khánh Hòa"],
    hot: true,
    image: vinhome,
  },
  {
    title: "Trưởng Ban Nhân Sự",
    company: "viec24h Client",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội"],
    hot: true,
    image: viec24h,
  },
  {
    title: "Quality Engineering Expert",
    company: "VinFast Global",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội", "Hải Dương", "Hải Phòng"],
    hot: true,
    image: vinfast,
  },
  {
    title: "Process Engineer (10 vị trí)",
    company: "VinFast Global",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội", "Hải Phòng"],
    hot: true,
    image: vinfast,
  },
  {
    title: "Data Governance",
    company: "Vinsmart Future",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội", "Hồ Chí Minh"],
    hot: true,
    image: vinsmart,
  },
  {
    title: "Fixed Asset & Cost Specialist",
    company: "VinFast Global",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội", "Hải Phòng"],
    hot: true,
    image: vinfast,
  },
  {
    title: "Quản lý Kiểm soát chất lượng",
    company: "Vincom Retail",
    tags: ["$1,200 - 1,800/tháng"],
    locations: ["Hồ Chí Minh"],
    hot: false,
    image: vincomretail,
  },
  {
    title: "Quản lý Nghiên cứu & Phát triển",
    company: "Vinhomes",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội"],
    hot: true,
    image: vinhome,
  },
  {
    title: "Đội Trưởng Giám sát",
    company: "Vinhomes",
    tags: ["Thỏa thuận"],
    locations: ["Hà Nội"],
    hot: false,
    image: vinhome,
  },
];

const categories = [
  {
    name: "Kinh doanh",
    jobs: 1326,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2F3095006ad19fe6c6b284e35dce25dda3.png&w=256&q=75",
  },
  {
    name: "Kiến trúc / Xây dựng",
    jobs: 936,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2F30ff7f69b62799a3898dc1cc73c8cdf4.png&w=256&q=75",
  },
  {
    name: "Kế toán / Kiểm toán",
    jobs: 935,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2F59d207e3791b33c89bc59bc870115187.png&w=256&q=75",
  },
  {
    name: "Công nghệ thông tin",
    jobs: 832,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2F025ee2ef5f56b6c602f58e11ffbca96f.png&w=256&q=75",
  },
  {
    name: "Sản xuất",
    jobs: 666,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2F7c4963d1362ccef9edfad58eb28d7b0a.png&w=256&q=75",
  },
  {
    name: "Marketing",
    jobs: 712,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2Ff4c5be6a1c28aeb6856455d4503da972.png&w=256&q=75",
  },
  {
    name: "Ngân hàng",
    jobs: 640,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2Fec4d97f5e0b225db38a01f2e363628b3.png&w=256&q=75",
  },
  {
    name: "Nhân sự",
    jobs: 514,
    image:
      "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fmobile_banner%2F21fd48d51c1f019b06cd7a9500ea6800.png&w=256&q=75",
  },
];

const suggestedJobs = [
  {
    title: "DevSecOps Engineer",
    company: "Finviet",
    salary: "$45 - 75tr/tháng",
    location: "Hồ Chí Minh",
    image:
      "https://www.finviet.com.vn/wp-content/uploads/2024/07/FV-V-21-1.png",
  },
  {
    title: "Accounting Interns",
    company: "Egis Pharmaceuticals",
    salary: "Thỏa thuận",
    location: "Hồ Chí Minh",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/23/Logo_of_EGIS.jpg",
  },
  {
    title: "Thực tập sinh Quan hệ khách hàng",
    company: "Chailease",
    salary: "Đến $140/tháng",
    location: "Bình Dương, Đồng Nai",
    image: "https://careerhub.vn/upload/company/ojl1713766719.jpg",
  },
  {
    title: "Tech Lead (.NET, Angular)",
    company: "Emesoft",
    salary: "$1,700 - 2,200/tháng",
    location: "Hồ Chí Minh",
    image:
      "https://danhbaict.vn/wp-content/uploads/2025/08/EMESOFT-logo-part01-1024x654.png",
  },
  {
    title: "Backend Engineer (Junior/Senior)",
    company: "MB Bank",
    salary: "15tr - 35tr đ/tháng",
    location: "Hà Nội",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png",
  },
  {
    title: "Thực tập sinh Kiểm toán nội bộ",
    company: "SSI",
    salary: "Thỏa thuận",
    location: "Hà Nội",
    image: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-SSI.png",
  },
  {
    title: "Business Analyst (Part-time)",
    company: "CH Trading",
    salary: "Thỏa thuận",
    location: "Hồ Chí Minh",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1JScQRJGhwYrQE4rxO6dLo0miDZrD6tlSqQ&s",
  },
  {
    title: "Internship Program 2026",
    company: "MSIG Insurance",
    salary: "Thỏa thuận",
    location: "Hồ Chí Minh, Hà Nội",
    image:
      "https://www.msig.com.vn/sites/default/files/inline-images/overview_01.jpg",
  },
];

const featuredEmployers = [
  {
    name: "Teleperformance",
    description:
      "Tạo dấu ấn sự nghiệp toàn cầu với môi trường trẻ trung, giàu năng lượng và vô vàn cơ hội phát triển.",
    badge: "Dream Job",
    image: heroImage,
  },
  {
    name: "BOSCH Global",
    description:
      "Gia nhập tập đoàn công nghệ hàng đầu thế giới với hệ sinh thái sản phẩm đa dạng và sáng tạo.",
    badge: "Top Tech",
    image: boschImage,
  },
  {
    name: "Techcombank",
    description:
      "Dẫn đầu chuyển đổi số ngành tài chính với chính sách phúc lợi cạnh tranh và lộ trình rõ ràng.",
    badge: "Top Employer",
    image: techcombank,
  },
  {
    name: "Shinhan Bank Việt Nam",
    description:
      "Ngân hàng Hàn Quốc với mạng lưới toàn quốc, môi trường song ngữ và nhiều vị trí đang tuyển.",
    badge: "Hot",
    image: shinhanbank,
  },
];

const financeJobs = [
  {
    title: "Chuyên viên quan hệ khách hàng DN",
    company: "Eximbank",
    salary: "Tới 200tr đ/tháng",
    location: "Hà Nội, Hồ Chí Minh, Đồng Nai",
    image:
      "https://static.wixstatic.com/media/9d8ed5_c662c7d071d3477589ef3a2b31c173d6~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
  },
  {
    title: "Chuyên viên phân tích đầu tư",
    company: "HDCapital",
    salary: "Thỏa thuận",
    location: "Hồ Chí Minh",
    image: "https://hdcap.hanzo.finance/static/image/hdcap.png",
  },
  {
    title: "Senior Expert, Business Banking",
    company: "Techcombank",
    salary: "Thỏa thuận",
    location: "Hà Nội",
    image:
      "https://inkythuatso.com/uploads/images/2021/09/logo-techcombank-inkythuatso-10-15-11-46.jpg",
  },
  {
    title: "Chuyên viên cao cấp vận hành tín dụng",
    company: "One Mount",
    salary: "Thỏa thuận",
    location: "Hà Nội",
    image: "https://finance.vietstock.vn/image/OneMount",
  },
  {
    title: "Senior Non-Bank Finance Advisor",
    company: "BPCE IOM",
    salary: "Thỏa thuận",
    location: "Hồ Chí Minh",
    image:
      "https://cdn.vietnambiz.vn/stores/news_dataimages/hanhtt/062017/12/16/1221_bpce.jpg?width=600",
  },
  {
    title: "[HN/HCM] Chuyên viên Quản lý quỹ",
    company: "Emir Asset Management",
    salary: "Tới 150tr đ/tháng",
    location: "Hà Nội, Hồ Chí Minh",
    image:
      "https://play-lh.googleusercontent.com/J64-6m1KgV1VrXUlDQDcPl-AHGVIcgoizK599j6dB6pPi_Q076w3ILnEqaBJURiV_3ml",
  },
  {
    title: "Chuyên gia quản lý khách hàng cá nhân",
    company: "PVcomBank",
    salary: "$1,200 - 3,000/tháng",
    location: "Hà Nội",
    image:
      "https://static.wixstatic.com/media/9d8ed5_44951ce6c7f44afdb8c126fe9eebf511~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
  },
  {
    title: "Senior Analyst – Governance",
    company: "Mattel Việt Nam",
    salary: "Thỏa thuận",
    location: "Hải Phòng",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Mattel_logo.svg/2042px-Mattel_logo.svg.png",
  },
];

const careerTools = [
  {
    title: "Tạo CV Wow với viec24h",
    description: "Mẫu CV ấn tượng, miễn phí để bạn nổi bật ngay từ vòng hồ sơ.",
    action: "Tạo CV ngay",
    badge: "WowCV",
  },
  {
    title: "Nhân số học",
    description:
      "Khám phá điểm mạnh và định hướng nghề nghiệp từ những con số của bạn.",
    action: "Khám phá ngay",
    badge: "Career Lab",
  },
  {
    title: "Lộ trình sự nghiệp",
    description:
      "Định vị bản thân, vạch kế hoạch phát triển sự nghiệp theo từng cột mốc.",
    action: "Xem chi tiết",
    badge: "Career Path",
  },
];

export default function Home() {
  const [mainTool, ...otherTools] = careerTools;

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 text-black">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at top right, rgba(255, 0, 0, 0.77), transparent 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest">
                <span className="inline-block h-2 w-2" />
                Viec24h Talent Launch • 2025
              </span>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Phát triển thanh niên triển vọng cùng viec24h
              </h1>
              <p className="text-base text-brand-50/85 sm:text-lg">
                Khám phá cơ hội nghề nghiệp nổi bật và chương trình tuyển dụng
                độc quyền từ các doanh nghiệp hàng đầu Việt Nam.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Dropdown menu={{ items }} placement="bottomLeft">
                  <button className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/10">
                    {" "}
                    <Menu />
                    Danh mục khu vực{" "}
                  </button>
                </Dropdown>
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/10">
                  <a href="#">Khám phá ngay</a>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/10">
                  <a href="#">Tư vấn 1-1</a>
                </button>
              </div>
              <div className="mt-8 max-w-3xl">
                <SearchBar className="bg-white/95" />
              </div>
              <dl className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/10 px-6 py-4 text-center backdrop-blur"
                  >
                    <dt className="text-sm text-brand-100/80">{stat.label}</dt>
                    <dd className="mt-2 text-2xl font-bold text-black">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <div className="absolute -left-10 -top-10 h-60 w-60 rounded-full bg-accent-500/30 blur-3xl" />
              <div className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/5 shadow-glow-strong backdrop-blur">
                <img
                  src={heroImage}
                  alt="Teleperformance"
                  className="h-80 w-full object-cover lg:h-[420px]"
                />
                <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/10 px-6 py-4 text-sm backdrop-blur">
                  <div>
                    <p className="text-base font-semibold text-white">
                      Teleperformance
                    </p>
                    <p className="text-xs text-brand-100/85">
                      Get Your Dream Job!
                    </p>
                  </div>
                  <button className="rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/30">
                    Join us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-16 sm:-mt-20 lg:-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white/95 p-6 shadow-2xl ring-1 ring-white/60 backdrop-blur">
            <SectionTitle title="Việc làm tốt nhất" action="Xem tất cả" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topJobs.map((job) => (
                <Card key={`${job.title}-${job.company}`} job={job} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Ngành nghề trọng điểm" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/95 p-6 shadow hover:border-brand-200 hover:shadow-glow transition"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-600 group-hover:bg-brand-100">
                  <img src={category.image} alt="" />
                </div>
                <p className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition">
                  {category.name}
                </p>
                <p className="text-sm text-gray-500">
                  {category.jobs.toLocaleString("vi-VN")} việc làm
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Việc làm gợi ý" action="Xem tất cả" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {suggestedJobs.map((job) => (
              <SimpleJobCard key={`${job.title}-${job.company}`} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-glow">
            <img
              src={mbBanner}
              alt="MB Bank Talent Program"
              className="h-56 w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Nhà tuyển dụng nổi bật" />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {featuredEmployers.map((employer) => (
              <EmployerCard key={employer.name} employer={employer} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 bg-white/10 py-12 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Việc làm nổi bật • Tài chính đầu tư"
            action="Xem tất cả"
            tone="dark"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financeJobs.map((job) => (
              <SimpleJobCard key={`${job.title}-${job.company}`} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-5 relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-950 via-brand-800 to-brand-600 p-8 text-black shadow-glow">
              <div className="max-w-md space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-lg uppercase tracking-widest">
                  {mainTool.badge ?? mainTool.title}
                </span>
                <h3 className="text-4xl font-bold">{mainTool.title}</h3>
                <p className="text-md text-brand-100/90">
                  {mainTool.description}
                </p>
                <Link
                  to="#"
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#ccc] px-4 py-2 text-sm font-semibold text-brand-700 transition hover:opacity-70"
                >
                  {mainTool.action}
                </Link>
              </div>
              <img
                className="rounded-xl"
                src="https://govi.vn/wp-content/uploads/2023/09/bai-dang-tuyen-dung-1.jpg"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-5 justify-center">
              {otherTools.map((tool) => (
                <Link
                  to="#"
                  key={tool.title}
                  className="rounded-3xl border-2  bg-[#ffdac0] p-6 shadow hover:border-brand-200 hover:shadow-glow transition hover:bg-white/70"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-600">
                    {tool.badge}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {tool.description}
                  </p>
                  <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-500">
                    {tool.action}
                    <span aria-hidden>→</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
