import SearchBar from '../components/SearchBar.jsx'
import heroImage from '../assets/teleper_hrbn.webp'
import mbBanner from '../assets/MBbankBanner_136036.webp'
import boschImage from '../assets/BOSCH_GLOBAL.webp'

const heroStats = [
  { value: '48.5K+', label: 'Việc làm đang tuyển' },
  { value: '3.2K+', label: 'Nhà tuyển dụng hoạt động' },
  { value: '1.1K+', label: 'Việc làm công nghệ' },
]

const topJobs = [
  { title: 'Chuyên Viên Phát Triển Kinh Doanh', company: 'Vinhomes', tags: ['Thỏa thuận'], locations: ['Hà Nội', 'Khánh Hòa'], hot: true },
  { title: 'Trưởng Ban Nhân Sự', company: 'viec69 Client', tags: ['Thỏa thuận'], locations: ['Hà Nội'], hot: true },
  { title: 'Quality Engineering Expert', company: 'VinFast Global', tags: ['Thỏa thuận'], locations: ['Hà Nội', 'Hải Dương', 'Hải Phòng'], hot: true },
  { title: 'Process Engineer (10 vị trí)', company: 'VinFast Global', tags: ['Thỏa thuận'], locations: ['Hà Nội', 'Hải Phòng'], hot: true },
  { title: 'Data Governance', company: 'Vinsmart Future', tags: ['Thỏa thuận'], locations: ['Hà Nội', 'Hồ Chí Minh'], hot: true },
  { title: 'Fixed Asset & Cost Specialist', company: 'VinFast Global', tags: ['Thỏa thuận'], locations: ['Hà Nội', 'Hải Phòng'], hot: true },
  { title: 'Quản lý Kiểm soát chất lượng', company: 'Vincom Retail', tags: ['$1,200 - 1,800/tháng'], locations: ['Hồ Chí Minh'], hot: false },
  { title: 'Quản lý Nghiên cứu & Phát triển', company: 'Vinhomes', tags: ['Thỏa thuận'], locations: ['Hà Nội'], hot: true },
  { title: 'Đội Trưởng Giám sát', company: 'Vinhomes', tags: ['Thỏa thuận'], locations: ['Hà Nội'], hot: false },
]

const categories = [
  { name: 'Kinh doanh', jobs: 1326 },
  { name: 'Kiến trúc / Xây dựng', jobs: 936 },
  { name: 'Kế toán / Kiểm toán', jobs: 935 },
  { name: 'Công nghệ thông tin', jobs: 832 },
  { name: 'Sản xuất', jobs: 666 },
  { name: 'Marketing', jobs: 712 },
  { name: 'Ngân hàng', jobs: 640 },
  { name: 'Nhân sự', jobs: 514 },
]

const suggestedJobs = [
  { title: 'DevSecOps Engineer', company: 'Finviet', salary: '$45 - 75tr/tháng', location: 'Hồ Chí Minh' },
  { title: 'Accounting Interns', company: 'Egis Pharmaceuticals', salary: 'Thỏa thuận', location: 'Hồ Chí Minh' },
  { title: 'Thực tập sinh Quan hệ khách hàng', company: 'Chailease', salary: 'Đến $140/tháng', location: 'Bình Dương, Đồng Nai' },
  { title: 'Tech Lead (.NET, Angular)', company: 'Emesoft', salary: '$1,700 - 2,200/tháng', location: 'Hồ Chí Minh' },
  { title: 'Backend Engineer (Junior/Senior)', company: 'MB Bank', salary: '15tr - 35tr đ/tháng', location: 'Hà Nội' },
  { title: 'Thực tập sinh Kiểm toán nội bộ', company: 'SSI', salary: 'Thỏa thuận', location: 'Hà Nội' },
  { title: 'Business Analyst (Part-time)', company: 'CH Trading', salary: 'Thỏa thuận', location: 'Hồ Chí Minh' },
  { title: 'Internship Program 2026', company: 'MSIG Insurance', salary: 'Thỏa thuận', location: 'Hồ Chí Minh, Hà Nội' },
]

const featuredEmployers = [
  {
    name: 'Teleperformance',
    description: 'Tạo dấu ấn sự nghiệp toàn cầu với môi trường trẻ trung, giàu năng lượng và vô vàn cơ hội phát triển.',
    badge: 'Dream Job',
    image: heroImage,
  },
  {
    name: 'BOSCH Global',
    description: 'Gia nhập tập đoàn công nghệ hàng đầu thế giới với hệ sinh thái sản phẩm đa dạng và sáng tạo.',
    badge: 'Top Tech',
    image: boschImage,
  },
  {
    name: 'Techcombank',
    description: 'Dẫn đầu chuyển đổi số ngành tài chính với chính sách phúc lợi cạnh tranh và lộ trình rõ ràng.',
    badge: 'Top Employer',
    image: null,
  },
  {
    name: 'Shinhan Bank Việt Nam',
    description: 'Ngân hàng Hàn Quốc với mạng lưới toàn quốc, môi trường song ngữ và nhiều vị trí đang tuyển.',
    badge: 'Hot',
    image: null,
  },
]

const financeJobs = [
  { title: 'Chuyên viên quan hệ khách hàng DN', company: 'Eximbank', salary: 'Tới 200tr đ/tháng', location: 'Hà Nội, Hồ Chí Minh, Đồng Nai' },
  { title: 'Chuyên viên phân tích đầu tư', company: 'HDCapital', salary: 'Thỏa thuận', location: 'Hồ Chí Minh' },
  { title: 'Senior Expert, Business Banking', company: 'Techcombank', salary: 'Thỏa thuận', location: 'Hà Nội' },
  { title: 'Chuyên viên cao cấp vận hành tín dụng', company: 'One Mount', salary: 'Thỏa thuận', location: 'Hà Nội' },
  { title: 'Senior Non-Bank Finance Advisor', company: 'BPCE IOM', salary: 'Thỏa thuận', location: 'Hồ Chí Minh' },
  { title: '[HN/HCM] Chuyên viên Quản lý quỹ', company: 'Emir Asset Management', salary: 'Tới 150tr đ/tháng', location: 'Hà Nội, Hồ Chí Minh' },
  { title: 'Chuyên gia quản lý khách hàng cá nhân', company: 'PVcomBank', salary: '$1,200 - 3,000/tháng', location: 'Hà Nội' },
  { title: 'Senior Analyst – Governance', company: 'Mattel Việt Nam', salary: 'Thỏa thuận', location: 'Hải Phòng' },
]

const careerTools = [
  {
    title: 'Tạo CV Wow với viec69',
    description: 'Mẫu CV ấn tượng, miễn phí để bạn nổi bật ngay từ vòng hồ sơ.',
    action: 'Tạo CV ngay',
    badge: 'WowCV',
  },
  {
    title: 'Nhân số học',
    description: 'Khám phá điểm mạnh và định hướng nghề nghiệp từ những con số của bạn.',
    action: 'Khám phá ngay',
    badge: 'Career Lab',
  },
  {
    title: 'Lộ trình sự nghiệp',
    description: 'Định vị bản thân, vạch kế hoạch phát triển sự nghiệp theo từng cột mốc.',
    action: 'Xem chi tiết',
    badge: 'Career Path',
  },
]

function SectionTitle({ title, action, tone = 'light' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className={`text-xl sm:text-2xl font-semibold ${tone === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {action && (
        <a
          href="#"
          className={`flex items-center gap-2 text-sm font-semibold transition ${
            tone === 'dark' ? 'text-brand-50 hover:text-white' : 'text-brand-600 hover:text-brand-500'
          }`}
        >
          {action}
          <span aria-hidden>→</span>
        </a>
      )}
    </div>
  )
}

function JobCard({ job }) {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow hover:-translate-y-1 hover:shadow-lg transition">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 font-semibold flex items-center justify-center">🏢</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
        {job.hot && (
          <span className="rounded-full bg-accent-100 px-2 py-1 text-xs font-semibold text-accent-600">Hot</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {job.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-semibold text-brand-600">
        {job.locations.map((loc) => (
          <span key={loc} className="rounded-lg bg-brand-50 px-3 py-1">{loc}</span>
        ))}
      </div>
    </div>
  )
}

function SimpleJobCard({ job }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/95 p-4 shadow hover:border-brand-200 hover:shadow-lg transition">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-semibold">🏙️</div>
        <div>
          <p className="font-semibold text-gray-900">{job.title}</p>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
      </div>
      <div className="text-sm font-medium text-brand-600">{job.salary}</div>
      <div className="text-xs text-gray-500">{job.location}</div>
    </div>
  )
}

function EmployerCard({ employer }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-lg transition hover:-translate-y-1 hover:shadow-glow">
      {employer.image && (
        <div className="h-40 w-full overflow-hidden">
          <img src={employer.image} alt={employer.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-gray-900">{employer.name}</p>
            <p className="mt-2 text-sm text-gray-500">{employer.description}</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
            {employer.badge}
          </span>
        </div>
        <button className="self-start rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
          Xem thêm
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [mainTool, ...otherTools] = careerTools

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-black">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(255, 0, 0, 0.77), transparent 100%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest">
                <span className="inline-block h-2 w-2" />
                Viec69 Talent Launch • 2025
              </span>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Phát triển thanh niên triển vọng cùng viec69
              </h1>
              <p className="text-base text-brand-50/85 sm:text-lg">
                Khám phá cơ hội nghề nghiệp nổi bật và chương trình tuyển dụng độc quyền từ các doanh nghiệp hàng đầu Việt Nam.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/10">
                  <a href='#'>
                    Khu vực Miền Nam
                  </a>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/10">
                  <a href='#'>
                    Khám phá ngay
                  </a>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/10">
                  <a href='#'>
                    Tư vấn 1-1
                  </a>
                </button>
              </div>
              <div className="mt-8 max-w-3xl">
                <SearchBar className="bg-white/95" />
              </div>
              <dl className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/10 px-6 py-4 text-center backdrop-blur">
                    <dt className="text-sm text-brand-100/80">{stat.label}</dt>
                    <dd className="mt-2 text-2xl font-bold text-white">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <div className="absolute -left-10 -top-10 h-60 w-60 rounded-full bg-accent-500/30 blur-3xl" />
              <div className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/5 shadow-glow-strong backdrop-blur">
                <img src={heroImage} alt="Teleperformance" className="h-80 w-full object-cover lg:h-[420px]" />
                <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/10 px-6 py-4 text-sm backdrop-blur">
                  <div>
                    <p className="text-base font-semibold text-white">Teleperformance</p>
                    <p className="text-xs text-brand-100/85">Get Your Dream Job!</p>
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
                <JobCard key={`${job.title}-${job.company}`} job={job} />
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
                  📌
                </div>
                <p className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition">{category.name}</p>
                <p className="text-sm text-gray-500">{category.jobs.toLocaleString('vi-VN')} việc làm</p>
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
            <img src={mbBanner} alt="MB Bank Talent Program" className="h-56 w-full object-cover" />
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
          <SectionTitle title="Việc làm nổi bật • Tài chính đầu tư" action="Xem tất cả" tone="dark" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financeJobs.map((job) => (
              <SimpleJobCard key={`${job.title}-${job.company}`} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-950 via-brand-800 to-brand-600 p-8 text-white shadow-glow">
              <div className="max-w-md space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest">
                  {mainTool.badge ?? mainTool.title}
                </span>
                <h3 className="text-2xl font-bold">{mainTool.title}</h3>
                <p className="text-sm text-brand-100/90">{mainTool.description}</p>
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                  {mainTool.action}
                </button>
              </div>
              <div className="absolute -right-10 top-6 hidden h-48 w-48 rounded-full bg-white/20 blur-3xl lg:block" />
            </div>
            <div className="grid gap-4">
              {otherTools.map((tool) => (
                <div key={tool.title} className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow hover:border-brand-200 hover:shadow-glow transition">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-600">
                    {tool.badge}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">{tool.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{tool.description}</p>
                  <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-500">
                    {tool.action}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
