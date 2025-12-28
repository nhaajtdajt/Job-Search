export default function SectionTitle({ title, action, tone = "light" }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2
        className={`text-xl sm:text-2xl font-semibold ${
          tone === "dark" ? "text-black" : "text-gray-900"
        }`}
      >
        {title}
      </h2>
      {action && (
        <a
          href="#"
          className={`flex items-center gap-2 text-sm font-semibold transition ${
            tone === "dark"
              ? "text-brand-50 hover:text-white"
              : "text-brand-600 hover:text-brand-500"
          }`}
        >
          {action}
          <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}
