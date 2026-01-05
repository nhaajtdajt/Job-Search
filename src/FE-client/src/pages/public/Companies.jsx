import React, { useState, useEffect } from "react";
import CompanyCard from "../../components/job/CompanyCard.jsx";
import { companyService } from "../../services/companyService";
import { Loader2, Search } from "lucide-react";
import { message } from "antd";

const INDUSTRIES = [
  "Công nghệ thông tin",
  "Thương mại điện tử",
  "Viễn thông",
  "Fintech",
  "Tài chính - Ngân hàng",
  "Bán lẻ - Thương mại",
  "Sản xuất - Chế tạo",
  "Y tế - Sức khỏe",
  "Giáo dục - Đào tạo",
  "Bất động sản",
  "Khách sạn - Du lịch",
  "Truyền thông - Quảng cáo",
  "Tư vấn",
  "Vận tải - Logistics",
  "Đa ngành",
  "Khác",
];

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchInput, selectedIndustry]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data || []);
      setFilteredCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      message.error("Không thể tải danh sách công ty");
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let result = [...companies];

    // Filter by name
    if (searchInput) {
      result = result.filter(c => 
        c.company_name?.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Filter by industry
    if (selectedIndustry) {
      result = result.filter(c => c.industry === selectedIndustry);
    }

    setFilteredCompanies(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header - Premium glassmorphism design (synced with Jobs page) */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-6 overflow-hidden">
        {/* Animated background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title with fade animation */}
          <h1 className="text-xl md:text-2xl font-bold text-white mb-5 animate-fadeInUp">
            <span className="inline-block">Khám phá</span>{' '}
            <span className="inline-block bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
              Công ty hàng đầu
            </span>
          </h1>
          
          {/* Search Bar - Glassmorphism container */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-2 md:p-3 border border-white/20 shadow-2xl animate-fadeInUp stagger-1">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              {/* Search input */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm công ty theo tên..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 border-2 border-transparent 
                    text-gray-900 placeholder-gray-400
                    transition-all duration-300 ease-out
                    focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white
                    hover:bg-white hover:shadow-md"
                />
              </div>
              
              {/* Industry select */}
              <div className="md:w-56 relative group">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-white/95 border-2 border-transparent 
                    text-gray-900 appearance-none cursor-pointer
                    transition-all duration-300 ease-out
                    focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white
                    hover:bg-white hover:shadow-md"
                >
                  <option value="">Tất cả lĩnh vực</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl p-6 rounded-xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
            <h3 className="text-xl font-bold text-gray-800">
              Công Ty Nổi Bật ({filteredCompanies.length})
            </h3>
          </div>

          {/* Danh sách công ty */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((c) => (
                  <CompanyCard 
                    key={c.company_id} 
                    id={c.company_id}
                    name={c.company_name}
                    logo={c.logo_url} 
                    image={c.banner_url || "https://via.placeholder.com/800x400"} 
                    follows={c.follower_count || 0}
                    industry={c.industry}
                    jobs={[]} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Không tìm thấy công ty nào phù hợp.</p>
                  <button 
                    onClick={() => setSearchInput("")}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              )}
            </div>
          )}
        </div>  
      </section>
    </div>
  );
}
