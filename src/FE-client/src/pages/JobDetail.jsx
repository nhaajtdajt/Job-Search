import { useParams } from 'react-router-dom'

export default function JobDetail() {
  const { id } = useParams()
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gray-200 rounded" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Senior React Developer</h1>
            <p className="text-gray-600">Great Company • District 1, HCMC</p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="font-semibold text-gray-900">Job Description</h2>
          <p className="mt-2 text-gray-700">
            This is a placeholder for job detail page (ID: {id}). Add responsibilities,
            requirements, benefits, and application button here.
          </p>
          <button className="mt-4 px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700">
            Apply now
          </button>
        </div>
      </div>
    </section>
  )
}

