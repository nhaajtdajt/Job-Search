export default function SimpleJobCard({ job }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/95 p-4 shadow hover:border-brand-200 hover:shadow-lg transition">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-semibold">
          <img src= {job.image} alt="" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{job.title}</p>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
      </div>
      <div className="text-sm font-medium text-brand-600">{job.salary}</div>
      <div className="text-xs text-gray-500">{job.location}</div>
    </div>
  );
}
