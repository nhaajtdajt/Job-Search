export default function Companies() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, idx) => (
          <a key={idx} href={`/companies/${idx + 1}`} className="block bg-white border rounded-lg p-4 hover:shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded" />
              <div>
                <h3 className="font-medium text-gray-900">Company {idx + 1}</h3>
                <p className="text-sm text-gray-600">Industry</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

