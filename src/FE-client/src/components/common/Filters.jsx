export default function Filters() {
  return (
    <div className="bg-white p-4 border rounded">
      <h2 className="font-medium mb-2">Filters</h2>
      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" /> Remote only
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" /> Full-time
        </label>
      </div>
    </div>
  )
}
