import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Building2,
} from "lucide-react";

export default function EmployerForgotPassword() {
  const navigate = useNavigate();
  const tokenInputRefs = useRef([]);
  const [step, setStep] = useState(1); // 1: Email, 2: Token, 3: Reset Password
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto focus first token input when step 2 is shown
  useEffect(() => {
    if (step === 2 && tokenInputRefs.current[0]) {
      setTimeout(() => {
        tokenInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const validateEmail = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateToken = () => {
    const newErrors = {};
    if (!formData.token) {
      newErrors.token = "Vui lòng nhập mã xác nhận";
    } else if (!/^\d{6}$/.test(formData.token)) {
      newErrors.token = "Mã xác nhận phải là 6 chữ số";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
        formData.newPassword
      )
    ) {
      newErrors.newPassword =
        "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  // Handle token input change for individual boxes
  const handleTokenChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1); // Only allow 1 digit

    setFormData((prev) => {
      const tokenArray = prev.token.split("");
      tokenArray[index] = value;
      const newToken = tokenArray.join("").slice(0, 6);
      return { ...prev, token: newToken };
    });

    // Clear error
    if (errors.token) {
      setErrors((prev) => ({ ...prev, token: "" }));
    }
    setApiError("");

    // Auto focus next input if value entered
    if (value && index < 5) {
      tokenInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard events for token inputs
  const handleTokenKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!formData.token[index] && index > 0) {
        // If current box is empty, focus previous box and clear it
        tokenInputRefs.current[index - 1]?.focus();
        setFormData((prev) => {
          const tokenArray = prev.token.split("");
          tokenArray[index - 1] = "";
          return { ...prev, token: tokenArray.join("") };
        });
      } else {
        // Clear current box
        setFormData((prev) => {
          const tokenArray = prev.token.split("");
          tokenArray[index] = "";
          return { ...prev, token: tokenArray.join("") };
        });
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      tokenInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      tokenInputRefs.current[index + 1]?.focus();
    }
  };

  // Step 1: Send email with token
  const handleSendToken = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await authService.forgotPassword(formData.email);
      setSuccessMessage(
        "Mã xác nhận 6 số đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư."
      );
      setFormData((prev) => ({ ...prev, token: "" })); // Reset token
      setStep(2);
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể gửi mã xác nhận. Vui lòng thử lại.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify token
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!validateToken()) return;

    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await authService.verifyEmail(formData.token, formData.email);
      setSuccessMessage("Mã xác nhận hợp lệ. Vui lòng nhập mật khẩu mới.");
      setStep(3);
    } catch (error) {
      console.error("Verify token error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await authService.resetPassword(formData.email, formData.newPassword);
      setSuccessMessage("Đổi mật khẩu thành công!");
      // Redirect to employer login after 2 seconds
      setTimeout(() => {
        navigate("/employer/login", {
          state: {
            message: "Đổi mật khẩu thành công. Vui lòng đăng nhập.",
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setFormData((prev) => ({ ...prev, token: "" }));
    } else if (step === 3) {
      setStep(2);
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    }
    setErrors({});
    setApiError("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 p-12 flex-col justify-between text-white">
          <div>
            <Link to="/employer" className="inline-block cursor-pointer">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-4xl font-bold mb-0">viec24h</h1>
                  <p className="text-orange-100 text-sm uppercase tracking-widest">
                    Nhà tuyển dụng
                  </p>
                </div>
              </div>
            </Link>

            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-4">
                Quên mật khẩu? Đừng lo!
              </h2>
              <p className="text-orange-100 text-lg">
                Chúng tôi sẽ giúp bạn khôi phục mật khẩu một cách an toàn và
                nhanh chóng
              </p>
            </div>

            <div className="space-y-4 mt-8">
              {[
                "Nhập email doanh nghiệp đã đăng ký",
                "Nhận mã xác nhận 6 số qua email",
                "Xác nhận mã và đặt mật khẩu mới",
                "Đăng nhập lại với mật khẩu mới",
              ].map((stepText, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-orange-50">{stepText}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-orange-400/30">
              <p className="text-orange-100 text-sm mb-2">Nhớ mật khẩu rồi?</p>
              <Link
                to="/employer/login"
                className="inline-flex items-center space-x-2 text-white hover:text-orange-100 transition-colors cursor-pointer"
              >
                <span className="font-semibold">Quay lại đăng nhập</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="text-sm text-orange-100">
            © 2025 viec24h. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link
                to="/employer"
                className="inline-flex items-center justify-center gap-3"
              >
                <img src="/logo.png" alt="viec24h" className="h-10 w-auto" />
                <div>
                  <h1 className="text-3xl font-bold text-orange-600">
                    viec24h
                  </h1>
                  <p className="text-gray-600 text-sm">Nhà tuyển dụng</p>
                </div>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                {step === 1 && <Mail className="w-8 h-8 text-orange-600" />}
                {step === 2 && <KeyRound className="w-8 h-8 text-orange-600" />}
                {step === 3 && <Shield className="w-8 h-8 text-orange-600" />}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 1 && "Quên mật khẩu"}
                {step === 2 && "Xác nhận mã"}
                {step === 3 && "Đặt mật khẩu mới"}
              </h2>
              <p className="text-gray-600">
                {step === 1 &&
                  "Nhập email doanh nghiệp để nhận mã xác nhận 6 số"}
                {step === 2 &&
                  "Nhập mã xác nhận 6 số đã được gửi đến email của bạn"}
                {step === 3 && "Nhập mật khẩu mới cho tài khoản của bạn"}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        s === step
                          ? "bg-orange-600 text-white"
                          : s < step
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 transition-all ${
                          s < step ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={
                step === 1
                  ? handleSendToken
                  : step === 2
                  ? handleVerifyToken
                  : handleResetPassword
              }
              className="space-y-6"
            >
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Thành công
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* API Error Message */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Lỗi</p>
                    <p className="text-sm text-red-600 mt-1">{apiError}</p>
                  </div>
                </div>
              )}

              {/* Step 1: Email Input */}
              {step === 1 && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email doanh nghiệp
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition`}
                      placeholder="employer@company.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-1 flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Token Input - 6 separate input boxes */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    Mã xác nhận (6 số)
                  </label>
                  <div className="flex justify-center gap-3 mb-4">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (!tokenInputRefs.current) {
                            tokenInputRefs.current = [];
                          }
                          tokenInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={formData.token[index] || ""}
                        onChange={(e) => handleTokenChange(e, index)}
                        onKeyDown={(e) => handleTokenKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        className={`w-14 h-14 text-center text-2xl font-bold border-2 ${
                          errors.token
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-orange-500"
                        } rounded-lg focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-200`}
                      />
                    ))}
                  </div>
                  {/* Hidden input to maintain formData.token for validation */}
                  <input type="hidden" name="token" value={formData.token} />
                  {errors.token && (
                    <div className="mb-4 flex items-center justify-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.token}</span>
                    </div>
                  )}
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    Mã xác nhận đã được gửi đến:{" "}
                    <span className="font-semibold text-gray-700">
                      {formData.email}
                    </span>
                  </p>
                </div>
              )}

              {/* Step 3: Password Inputs */}
              {step === 3 && (
                <>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border ${
                          errors.newPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <div className="mt-1 flex items-center space-x-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.newPassword}</span>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                      thường, số và ký tự đặc biệt
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border ${
                          errors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="mt-1 flex items-center space-x-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.confirmPassword}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Đang xử lý...
                  </span>
                ) : step === 1 ? (
                  "Gửi mã xác nhận"
                ) : step === 2 ? (
                  "Xác nhận"
                ) : (
                  "Đổi mật khẩu"
                )}
              </button>

              {/* Back Button */}
              {(step === 2 || step === 3) && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
              )}

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Nhớ mật khẩu rồi?{" "}
                  <Link
                    to="/employer/login"
                    className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
