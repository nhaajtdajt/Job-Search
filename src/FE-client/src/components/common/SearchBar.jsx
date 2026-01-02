import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchBar({ onSearch, className = "" }) {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState({ jobs: [], skills: [], companies: [], locations: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const suggestionsRef = useRef(null);
    const navigate = useNavigate();

    // Debounce search suggestions
    useEffect(() => {
        if (keyword.length < 2) {
            setSuggestions({ jobs: [], skills: [], companies: [], locations: [] });
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8017'}/api/search/suggestions?q=${encodeURIComponent(keyword)}&limit=5`);
                const data = await response.json();
                if (data.success) {
                    setSuggestions(data.data);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword]);

    // Close suggestions on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setShowSuggestions(false);
        if (onSearch) {
            onSearch({ keyword, location });
        } else {
            // Navigate to jobs page with search params
            const params = new URLSearchParams();
            if (keyword) params.set('keyword', keyword);
            if (location) params.set('location', location);
            navigate(`/jobs?${params.toString()}`);
        }
    }

    function handleSuggestionClick(value) {
        setKeyword(value);
        setShowSuggestions(false);
    }

    const hasSuggestions = suggestions.jobs.length > 0 || suggestions.skills.length > 0 ||
        suggestions.companies.length > 0 || suggestions.locations.length > 0;

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full rounded-3xl border border-white/60 bg-white/95 p-4 shadow-glow sm:p-6 ${className}`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.2fr,auto] gap-3">
                {/* Keyword Input */}
                <div className="relative" ref={suggestionsRef}>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-500">
                        Công việc, kỹ năng
                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
                            <svg className="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h11M6 10h7m-7 4h4m5-2.5 4 4m0 0 1.5-1.5m-1.5 1.5L18 21" />
                            </svg>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onFocus={() => hasSuggestions && setShowSuggestions(true)}
                                className="w-full border-none bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                placeholder="Ví dụ: Product Manager, React, Marketing..."
                            />
                            {loading && (
                                <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                        </div>
                    </label>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && hasSuggestions && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
                            {suggestions.jobs.length > 0 && (
                                <div className="p-2">
                                    <div className="text-xs font-semibold text-gray-500 px-2 pb-1">Công việc</div>
                                    {suggestions.jobs.map((job, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSuggestionClick(job)}
                                            className="w-full text-left px-3 py-2 hover:bg-brand-50 rounded-lg text-gray-900 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {job}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {suggestions.skills.length > 0 && (
                                <div className="p-2 border-t border-gray-100">
                                    <div className="text-xs font-semibold text-gray-500 px-2 pb-1">Kỹ năng</div>
                                    {suggestions.skills.map((skill, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSuggestionClick(skill)}
                                            className="w-full text-left px-3 py-2 hover:bg-brand-50 rounded-lg text-gray-900 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {suggestions.companies.length > 0 && (
                                <div className="p-2 border-t border-gray-100">
                                    <div className="text-xs font-semibold text-gray-500 px-2 pb-1">Công ty</div>
                                    {suggestions.companies.map((company, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSuggestionClick(company.name)}
                                            className="w-full text-left px-3 py-2 hover:bg-brand-50 rounded-lg text-gray-900 flex items-center gap-2"
                                        >
                                            {company.logo ? (
                                                <img src={company.logo} alt="" className="w-4 h-4 rounded object-cover" />
                                            ) : (
                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            )}
                                            {company.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Location Input */}
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-500 lg:max-w-sm">
                    Địa điểm
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
                        <svg className="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-4.686 6-10a6 6 0 1 0-12 0c0 5.314 6 10 6 10z" />
                            <circle cx="12" cy="11" r="2.5" />
                        </svg>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border-none bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            placeholder="Hồ Chí Minh, Hà Nội, Đà Nẵng..."
                        />
                    </div>
                </label>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-2 h-14 rounded-xl bg-accent-500 px-6 text-base font-semibold text-white shadow-lg shadow-accent-500/40 transition hover:bg-accent-400 lg:mt-auto"
                >
                    Tìm kiếm ngay
                </button>
            </div>

            {/* Hot Keywords */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="font-semibold text-gray-900">Từ khóa hot:</span>
                {["Data Analyst", "UI/UX Designer", "Thực tập sinh", "Backend NodeJS", "Product Owner"].map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setKeyword(item)}
                        className="rounded-full border border-brand-100 bg-brand-50/80 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:border-brand-200 hover:bg-brand-100"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </form>
    );
}
