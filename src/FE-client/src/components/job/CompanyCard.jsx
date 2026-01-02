// src/components/CompanyCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CompanyCard({ id, logo, name, follows, jobs, image, industry }) {
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <div className="w-[350px] bg-white rounded-xl shadow p-4 hover:shadow-lg transition duration-300 delay-100">
      {/* Banner */}
      <img src={image} className="w-full h-28 object-cover rounded-lg mb-3" />

      {/* Logo + Tên + Follow */}
      <div className="flex items-center gap-3">
      <div className="w-20 h-20 overflow-hidden flex items-center justify-center shadow">
      <img src={logo} className="p-auto max-w-full max-h-full object-contain" />
      </div>


        <div className="flex-1 flex flex-col">
          <Link to={`/companies/${id}`} className="font-semibold truncate max-w-[200px] hover:text-orange-500 transition duration-300 cursor-pointer">{name}</Link>
          {industry && <p className="text-gray-500 text-xs mb-1">{industry}</p>}
          <p className="text-gray-500 text-sm">{follows} lượt theo dõi</p>
                  {/* Button Theo dõi */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                isFollowed
                  ? "bg-orange-600 text-white"
                  : " text-blue-700 hover:bg-blue-200 transition duration-300"
              }`}
            >
              {isFollowed ? "Đã theo dõi" : "+ Theo dõi"}
            </button>
          </div>
        </div>


      </div>

      {/* Jobs */}
      <div className="mt-3">
        {jobs.map((job, index) => (
          <div key={index} className="border p-2 rounded-lg mb-2 text-sm ">
            <p className="font-semibold hover:text-orange-500 transition duration-300 delay-100 cursor-pointer">{job.position}</p>
            <p className="text-red-500">{job.salary}</p>
            <p className="text-gray-500">{job.location}</p>
          </div>
        ))}
      </div>

      <Link to={`/companies/${id}`} className="block text-center w-full bg-orange-500 text-white rounded-lg py-2 mt-3 hover:bg-orange-400 transition duration-300 delay-100 hover:underline cursor-pointer">
        Xem công ty
      </Link>
    </div>
  );
}
