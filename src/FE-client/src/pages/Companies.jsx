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
      logo: "https://images.vietnamworks.com/pictureofcompany/5e/10843127.png",
      image: "https://images02.vietnamworks.com/companyprofile/Pizza4ps/en/coverfinal.jpg",
      jobs: [
        { position: "[HCM] HSE Engineer", salary: "Thương lượng", location: "Hồ Chí Minh" },
        { position: "[VN] Record-To-Report Lead", salary: "Thương lượng", location: "Hồ Chí Minh" },
      ],
    },
    {
      name: "Shinhan Vietnam Finance",
      follows: 1151,
      logo: "https://images02.vietnamworks.com/companyprofile/null/en/logo_vu%C3%B4ng_ch%E1%BB%AF_xanh_kh%C3%B4ng_n%E1%BB%81n.png",
      image: "https://images02.vietnamworks.com/companyprofile/null/en/MicrosoftTeams-image_94_.png",
      jobs: [
        { position: "Accounting Admin Associate", salary: "Thương lượng", location: "Hồ Chí Minh" },
        { position: "Team Head (Early Collection)", salary: "Thương lượng", location: "Hồ Chí Minh" },
      ],
    },

    {
      name: "SHINETSU MAGNETICS MATERIALS VIET NAM CO.,LTD",
      follows: 128,
      logo: "https://images02.vietnamworks.com//companyprofile/shinetsu-magnetics-materials-viet-nam-coltd/en/Logo.jpg",
      image: "https://images02.vietnamworks.com//companyprofile/shinetsu-magnetics-materials-viet-nam-coltd/en/cong_ty_1_1920x510-S2.jpg",
      jobs: [
        { position: "Kỹ Sư Quản Lí Môi Trường", salary: "10tr-13tr ₫/tháng", location: "Quảng Ninh" },
        { position: "Kỹ Sư Bảo Trì Bảo Dưỡng", salary: "10tr-12tr ₫/tháng", location: "Hải Phòng" },
      ],
    },


      {
      name: "MK Group",
      follows: 120,
      logo: "https://images.vietnamworks.com/pictureofcompany/fa/11259301.png",
      image: "https://images02.vietnamworks.com/companyprofile/mk-group/en/%E1%BA%A3nh_1._b%C3%ACa_final.jpg?v=1749441199",
      jobs: [
        { position: "Chuyên Viên Kiểm Toán Nội Bộ - Ethiopia", salary: "Tới $ 2,000 /tháng", location: "Quốc Tế" },
        { position: "NPI Engineer", salary: "$ 900-1,300 /tháng ", location: "Phú Thọ" },
      ],
    },

        {
      name: "Công ty Language Link Việt Nam",
      follows: 201,
      logo: "https://images.vietnamworks.com/pictureofcompany/b4/11234379.png",
      image: "https://images02.vietnamworks.com/companyprofile/language-link-vietnam/en/%E1%BA%A3nh_b%C3%ACa.jpg",
      jobs: [
        { position: "Sales B2B Manager (South Provinces)", salary: "$ 1,000-1,500 /tháng", location: "Hồ Chí Minh" },
        { position: "Brand Communication Team Leader", salary: "Thương Lượng", location: "Hà Nội" },
      ],
    },

            {
      name: "Công ty Cổ phần Chứng khoán SSI",
      follows: 1045,
      logo: "https://images02.vietnamworks.com/companyprofile/cong-ty-co-phan-chung-khoan-ssi/vi/logossi-01.jpg",
      image: "https://images02.vietnamworks.com/companyprofile/cong-ty-co-phan-chung-khoan-ssi/vi/SSI_anh_bia_dau_trang.jpg",
      jobs: [
        { position: "Chuyên Viên Hỗ Trợ Ứng Dụng", salary: "Thương Lượng", location: "Hồ Chí Minh" },
        { position: "Chuyên Viên Phát Triển Phần Mềm (.Net)", salary: "Thương Lượng", location: "Hà Nội" },
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
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 cursor-pointer transition duration-300"
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
                      className="px-4 py-2 border hover:border-blue-500 text-gray-700 rounded-lg flex items-center gap-2 cursor-pointer transition duration-300"
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
