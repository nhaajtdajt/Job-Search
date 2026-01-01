import React, { useState, useEffect } from "react";
import CompanyCard from "../../components/job/CompanyCard.jsx";
import { companyService } from "../../services/companyService";
import { Loader2, Search } from "lucide-react";
import { message } from "antd";

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchInput]);

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

    setFilteredCompanies(result);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 py-10">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Các Công Ty</h1>

        {/* Thanh tìm kiếm + nút */}
        <div className="w-full md:w-2/3 lg:w-1/2 bg-blue-100 p-4 rounded-xl mb-6 mx-auto lg:mx-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm công ty theo tên..."
                className="w-full pl-10 pr-4 py-2 border bg-white rounded-lg shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

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
                    name={c.company_name}
                    logo={c.logo_url} 
                    image={c.banner_url || "https://via.placeholder.com/800x400"} 
                    follows={c.follower_count || 0} 
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
