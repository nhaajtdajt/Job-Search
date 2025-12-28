import { Link } from 'react-router-dom'

export default function JobCard({ id, title, company, location }) {
  return (
    <Link to={`/jobs/${id}`} className="block bg-white border rounded-lg p-4 hover:shadow">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded" />
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{company}</p>
          <p className="text-sm text-gray-500 mt-1">{location}</p>
        </div>
      </div>
    </Link>
  )
}
