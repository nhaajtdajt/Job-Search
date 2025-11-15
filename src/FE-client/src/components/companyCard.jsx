// src/components/CompanyCard.jsx
import React, { useState } from "react";

export default function CompanyCard({ logo, name, follows, jobs, image }) {
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <div className="w-[350px] bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
      {/* Banner */}
      <img src={image} className="w-full h-28 object-cover rounded-lg mb-3" />

      {/* Logo + Tên + Follow */}
      <div className="flex items-center gap-3">
        <img src={logo} className="w-12 h-12 rounded-lg" />

        <div className="flex-1">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-500 text-sm">{follows} lượt theo dõi</p>
        </div>

        {/* Button Theo dõi */}
        <button
          onClick={() => setIsFollowed(!isFollowed)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer ${
            isFollowed
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {isFollowed ? "Đã theo dõi" : "+ Theo dõi"}
        </button>
      </div>

      {/* Jobs */}
      <div className="mt-3">
        {jobs.map((job, index) => (
          <div key={index} className="border p-2 rounded-lg mb-2 text-sm ">
            <p className="font-semibold hover:text-orange-500 transition cursor-pointer">{job.position}</p>
            <p className="text-red-500">{job.salary}</p>
            <p className="text-gray-500">{job.location}</p>
          </div>
        ))}
      </div>

      <button className="w-full bg-orange-500 text-white rounded-lg py-2 mt-3 hover:bg-orange-400 transition hover:underline cursor-pointer">
        Xem công ty
      </button>
    </div>
  );
}
