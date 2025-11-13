export default function SearchBar({ onSearch, className = '' }) {
  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = {
      keyword: formData.get('keyword')?.toString() || '',
      location: formData.get('location')?.toString() || '',
    }
    onSearch?.(query)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full rounded-3xl border border-white/60 bg-white/95 p-4 shadow-glow sm:p-6 ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.2fr,auto] gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-500">
          Công việc, kỹ năng
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
            <svg className="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h11M6 10h7m-7 4h4m5-2.5 4 4m0 0 1.5-1.5m-1.5 1.5L18 21" />
            </svg>
            <input
              name="keyword"
              className="w-full border-none bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
              placeholder="Ví dụ: Product Manager, React, Marketing..."
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-500 lg:max-w-sm">
          Địa điểm
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
            <svg className="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-4.686 6-10a6 6 0 1 0-12 0c0 5.314 6 10 6 10z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
            <input
              name="location"
              className="w-full border-none bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
              placeholder="Hồ Chí Minh, Hà Nội, Đà Nẵng..."
            />
          </div>
        </label>
        <button
          type="submit"
          className="mt-2 h-14 rounded-xl bg-accent-500 px-6 text-base font-semibold text-white shadow-lg shadow-accent-500/40 transition hover:bg-accent-400 lg:mt-auto"
        >
          Tìm kiếm ngay
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-900">Từ khóa hot:</span>
        {['Data Analyst', 'UI/UX Designer', 'Thực tập sinh', 'Backend NodeJS', 'Product Owner'].map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-brand-100 bg-brand-50/80 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:border-brand-200 hover:bg-white"
          >
            {item}
          </button>
        ))}
      </div>
    </form>
  )
}

