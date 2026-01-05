// src/components/CompanyCard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { companyService } from "../../services/companyService";

export default function CompanyCard({ id, logo, name, follows, jobs, image, industry, initialIsFollowed = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(follows || 0);

  // Check follow status and fetch follower count when component mounts
  useEffect(() => {
    const checkFollowStatusAndCount = async () => {
      if (id) {
        try {
          // Always fetch the latest follower count from server
          const count = await companyService.getFollowersCount(id);
          setFollowerCount(count);
          
          // Check follow status if user is logged in
          if (user) {
            const followed = await companyService.checkIsFollowed(id);
            setIsFollowed(followed);
          }
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      }
    };
    checkFollowStatusAndCount();
  }, [user, id]);

  const handleFollowClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await companyService.toggleFollow(id);
      setIsFollowed(result.is_following);
      // Update follower count
      setFollowerCount(prev => result.is_following ? prev + 1 : Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error toggling follow:', error);
      // Optionally show error toast/notification
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-gray-500 text-sm">{followerCount} lượt theo dõi</p>
                  {/* Button Theo dõi */}
          <div className="flex justify-end mt-2">
            <button
              onClick={handleFollowClick}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                isFollowed
                  ? "bg-orange-600 text-white"
                  : " text-blue-700 hover:bg-blue-200 transition duration-300"
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "..." : isFollowed ? "Đã theo dõi" : "+ Theo dõi"}
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
