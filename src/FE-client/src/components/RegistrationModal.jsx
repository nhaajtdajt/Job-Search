import { useState } from "react";
import { Eye, EyeClosed } from 'lucide-react' 
import  facebook  from "../assets/facebook.png";
import google from "../assets/google.png";
export default function RegistrationModal({ open = false, onClose }) {
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        // Replace with real registration logic later
        onClose?.();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => onClose?.()}
            />

            <div className="relative z-10 w-full max-w-2xl rounded-md bg-white shadow-xl">
                <div className="border-b px-6 py-4 text-center">
                    <h2 className="text-2xl font-semibold">Đăng Ký Thành Viên!</h2>
                </div>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <button className="flex items-center bg-amber-100 justify-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
                            <img src={facebook} alt="Facebook" className="w-5 h-5" />
                            với tài khoản Facebook
                        </button>
                        <button className="flex items-center bg-amber-100 justify-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
                            <img src={google} alt="Google" className="w-5 h-5" />
                                với tài khoản Google
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                <input name="firstName" className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ</label>
                                <input name="lastName" className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <div className="mt-1 flex gap-2">
        
                                <input name="phone" className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input name="email" type="email" className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300" />
                            <p className="mt-1 text-xs text-gray-500">Sử dụng email có thật để xác thực.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mật Khẩu</label>
                            <div className="relative mt-1">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-2 top-2 text-sm text-gray-500"
                                >
                                    {showPassword ? <Eye /> : <EyeClosed />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Từ 6 đến 50 ký tự, 1 chữ hoa, 1 số.</p>
                        </div>

                        <div className="flex items-start gap-3">
                            <input type="checkbox" id="agree" className="mt-1" />
                            <label htmlFor="agree" className="text-sm text-gray-700">Tôi đồng ý với <a href="#" className="text-blue-600">Thỏa thuận sử dụng</a> và <a href="#" className="text-blue-600">Quy định bảo mật</a> của viec69.</label>
                        </div>

                        <div className="mt-4 flex flex-col items-stretch gap-3">
                            <button type="submit" className="rounded-md bg-orange-400 px-4 py-3 text-sm font-semibold text-white">Đăng Ký</button>
                            <div className="text-center text-sm text-gray-600">Bạn là thành viên viec69? <button type="button" onClick={() => onClose?.()} className="text-blue-600 font-semibold">Đăng Nhập</button></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
