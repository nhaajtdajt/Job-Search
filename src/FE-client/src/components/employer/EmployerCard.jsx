export default function EmployerCard({ employer }) {
  return (
    <div className="cursor-pointer group flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-lg transition hover:-translate-y-1 hover:shadow-glow">
      {employer.image && (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={employer.image}
            alt={employer.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {employer.name}
            </p>
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
  );
}
