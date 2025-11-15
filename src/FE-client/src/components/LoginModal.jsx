import { useState } from "react";
import { Eye, EyeClosed  } from 'lucide-react';
import  facebook  from "../assets/facebook.png";
import google from "../assets/google.png";
export default function LoginModal({ open = false, onClose }) {
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        // For now just close the modal - replace with real auth later
        onClose?.();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => onClose?.()}
            />

            <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white shadow-xl">
                <div className="flex items-start justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-semibold">Đăng nhập để tiếp tục</h3>
                    <button
                        aria-label="close"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => onClose?.()}
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-center gap-3">
                            <button className="flex w-[35%] text-center bg-amber-100 rounded-md border px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
                                <span className="mr-2">
                                    <img src={google} className="w-6 h-6"/>
                                </span> 
                                <div className="p-0.5">với tài khoản Google</div>
                            </button>
                            <button className="flex w-[35%] text-center bg-amber-100 rounded-md border px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
                                <span className="mr-2 ">
                                    <img src={facebook} className="w-6 h-6" />   
                                </span> 
                                <div className="p-0.5">với tài khoản Facebook</div>
                            </button>
                        </div>

                        <div className="text-center text-xl font-extrabold text-gray-600">hoặc đăng nhập bằng email</div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm  font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-2 top-2 text-sm text-gray-500"
                                    >
                                        {showPassword ? <EyeClosed /> : <Eye />}
                                    </button>
                                </div>
                                <div className="mt-2 text-right text-sm">
                                    <a href="#" className="text-blue-600 text-[15px]">Quên mật khẩu?</a>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[15px]">
                                <div className=" text-gray-600">Chưa có tài khoản? <a href="#" className="text-blue-600">Đăng Ký</a></div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => onClose?.()} className="rounded-md border px-4 py-2 text-sm">Hủy</button>
                                    <button type="submit" className="rounded-md bg-orange-400 px-4 py-2 text-sm font-semibold text-white">Đăng nhập</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

