import Filters from '../../components/common/Filters.jsx'
import JobCard from '../../components/job/JobCard.jsx'

export default function Jobs() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-4">
          <Filters />
        </aside>
        <div className="md:col-span-3 space-y-3">
          {[...Array(10)].map((_, idx) => (
            <JobCard
              key={idx}
              id={idx + 1}
              title="Backend Engineer"
              company="Tech Corp"
              location="Hanoi"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
