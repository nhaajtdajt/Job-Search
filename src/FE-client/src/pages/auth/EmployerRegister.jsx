import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Vui lòng nhập tên công ty";
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Vui lòng nhập tên người liên hệ";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ công ty";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải có chữ hoa, chữ thường và số";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Vui lòng đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare registration data for employer
      const registerData = {
        email: formData.email,
        password: formData.password,
        name: formData.contactPerson,
        role: 'employer',
        phone: formData.phone,
        // Company info - will be linked after registration
        company_name: formData.companyName,
        company_address: formData.address,
      };

      // Use AuthContext register to properly update state
      await register(registerData);

      // Navigate to employer dashboard
      navigate('/employer/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="text-2xl font-bold">
                viec24h
              </Link>
              <Link
                to="/employer/login"
                className="text-sm px-4 py-2 border border-white/30 rounded-full hover:bg-white/10 transition"
              >
                Đã có tài khoản?
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">Đăng ký nhà tuyển dụng</h1>
            <p className="text-orange-100">
              Tạo tài khoản để bắt đầu tìm kiếm nhân tài cho doanh nghiệp
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Error Alert */}
              {apiError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              )}

              {/* Company Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  Thông tin công ty
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tên công ty <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.companyName
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } rounded-lg focus:outline-none focus:ring-2 transition`}
                        placeholder="Công ty TNHH ABC"
                      />
                    </div>
                    {errors.companyName && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.companyName}
                      </div>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label
                      htmlFor="contactPerson"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Người liên hệ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="contactPerson"
                        name="contactPerson"
                        type="text"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.contactPerson
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } rounded-lg focus:outline-none focus:ring-2 transition`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errors.contactPerson && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.contactPerson}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.phone
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } rounded-lg focus:outline-none focus:ring-2 transition`}
                        placeholder="0123456789"
                      />
                    </div>
                    {errors.phone && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Địa chỉ công ty <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.address
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } rounded-lg focus:outline-none focus:ring-2 transition resize-none`}
                        placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                      />
                    </div>
                    {errors.address && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-600" />
                  Thông tin tài khoản
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.email
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } rounded-lg focus:outline-none focus:ring-2 transition`}
                        placeholder="company@example.com"
                      />
                    </div>
                    {errors.email && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-12 py-3 border ${
                          errors.password
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } rounded-lg focus:outline-none focus:ring-2 transition`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ
                      thường và số
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-12 py-3 border ${
                          errors.confirmPassword
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } rounded-lg focus:outline-none focus:ring-2 transition`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className={`mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer ${
                      errors.agreeTerms ? "border-red-500" : ""
                    }`}
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-3 text-sm text-gray-700 cursor-pointer"
                  >
                    Tôi đồng ý với{" "}
                    <Link
                      to="/terms"
                      className="text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link
                      to="/privacy"
                      className="text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Chính sách bảo mật
                    </Link>{" "}
                    của viec24h
                  </label>
                </div>
                {errors.agreeTerms && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.agreeTerms}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Đăng ký tài khoản
                    </>
                  )}
                </button>
              </div>

              {/* Back to Home */}
              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  ← Quay về trang chủ
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
