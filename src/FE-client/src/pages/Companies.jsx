import React, { useState } from "react";
import CompanyCard from "../components/CompanyCard.jsx";


export default function CompanyPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const companies = [
    {
      name: "Pizza 4P's Corporation",
      follows: 779,
      logo: "/images/4ps_logo.png",
      image: "/images/4ps_banner.jpg",
      jobs: [
        { position: "[HCM] HSE Engineer", salary: "Thương lượng", location: "Hồ Chí Minh" },
        { position: "[VN] Record-To-Report Lead", salary: "Thương lượng", location: "Hồ Chí Minh" },
      ],
    },
    {
      name: "Shinhan Vietnam Finance",
      follows: 1151,
      logo: "/images/shinhan.png",
      image: "/images/shinhan_banner.jpg",
      jobs: [
        { position: "Accounting Admin Associate", salary: "Thương lượng", location: "Hồ Chí Minh" },
        { position: "Team Head (Early Collection)", salary: "Thương lượng", location: "Hồ Chí Minh" },
      ],
    },
  ];

  
    const categories = [
    "Công nghệ",
    "Thực phẩm",
    "Tài chính",
    "Giáo dục",
    "Bất động sản",
    "Marketing",
  ];

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter(cat =>
  cat.toLowerCase().includes(dropdownSearch.toLowerCase())
);

  return (
    <div className="w-full min-h-screen bg-slate-100 py-10">
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Các Công Ty</h1>

      {/* Thanh tìm kiếm + nút */}
      <div className="inline-block w-[50%] bg-blue-100 p-4 rounded-xl mb-6 ">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm công ty..."
            className="w-full px-4 py-2 border bg-white rounded-lg shadow-sm 
                      focus:border-blue-500 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={() => setSearch(searchInput)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 cursor-pointer transition"
          >
            Search
          </button>
        </div>
      </div>

        <div className="bg-white shadow-xl p-4 rounded-xl">
          {/* Header + nút lọc */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
            <h3 className="text-xl font-bold text-gray-800">
              Công Ty Nổi Bật
            </h3>

            {/* Nhóm nút lọc */}
          <div className="relative">
                    <button
                      onClick={() => setOpen(!open)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
                    >
                      Lĩnh vực công ty
                      <span>{"▼"}</span>
                    </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border rounded-lg z-20 p-2">

                  <div className="relative mb-2">
                  <svg
                    className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                  </svg>

                  <input
                    type="text"
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                    placeholder="Tìm lĩnh vực..."
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                      {/* Danh sách mục */}
                      <div className="max-h-40 overflow-y-auto">
                        {filteredCategories.map((cat, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer rounded-lg
                              ${selectedCategory === cat 
                                ? "bg-blue-500 text-white" 
                                : "hover:bg-gray-100"}`}
                          >
                            {cat}
                          </div>
                        ))}

                        {filteredCategories.length === 0 && (
                          <p className="text-gray-500 text-sm px-2">Không có kết quả</p>
                        )}
                      </div>

                    </div>
                  )}
                  </div>
          </div>


          {/* Danh sách công ty */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((c, index) => (
              <CompanyCard key={index} {...c} />
            ))}

            {filteredCompanies.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center">
                Không tìm thấy công ty nào.
              </p>
            )}
          </div>
        </div>

    </section>
    </div>
  );
}
