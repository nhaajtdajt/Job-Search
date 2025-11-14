export default function Card({ job }) {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow hover:-translate-y-1 hover:shadow-lg transition">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 font-semibold flex items-center justify-center">
          <img width="100%" src={job.image} alt="" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
        {job.hot && (
          <span className="rounded-full bg-accent-100 px-2 py-1 text-xs font-semibold text-accent-600">
            Hot
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-semibold text-brand-600">
        {job.locations.map((loc) => (
          <span key={loc} className="rounded-lg bg-brand-50 px-3 py-1">
            {loc}
          </span>
        ))}
      </div>
    </div>
  );
}
