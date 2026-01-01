import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Send, Users } from 'lucide-react';

export default function NotificationManagement() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetRole, setTargetRole] = useState('all');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);

    const handleSend = async () => {
        if (!message.trim()) {
            alert('Vui lòng nhập nội dung thông báo');
            return;
        }

        setSending(true);
        setResult(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/admin/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title.trim() || null,
                    message: message.trim(),
                    target_role: targetRole
                })
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ success: true, message: `Đã gửi thông báo đến ${data.data?.recipients || 0} người dùng!` });
                setTitle('');
                setMessage('');
            } else {
                setResult({ success: false, message: data.message || 'Gửi thông báo thất bại' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Lỗi kết nối server' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link to="/admin" className="hover:text-white">Dashboard</Link>
                <span>›</span>
                <span className="text-white">Notifications</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Broadcast Notification</h1>
                <p className="text-gray-400">Gửi thông báo đến người dùng trên hệ thống.</p>
            </div>

            {/* Form */}
            <div className="bg-[#1a1f2e] rounded-xl p-6 border border-gray-700/50 max-w-2xl">
                <div className="space-y-5">
                    {/* Target Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Đối tượng nhận
                        </label>
                        <div className="flex gap-3">
                            {[
                                { value: 'all', label: 'Tất cả', icon: Users },
                                { value: 'job_seeker', label: 'Job Seekers', icon: Users },
                                { value: 'employer', label: 'Employers', icon: Users },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setTargetRole(option.value)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${targetRole === option.value
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-[#252d3d] border-gray-700 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <option.icon size={16} />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tiêu đề (tùy chọn)
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="VD: Thông báo quan trọng"
                            className="w-full bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nội dung thông báo *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhập nội dung thông báo..."
                            rows={5}
                            className="w-full bg-[#252d3d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Result */}
                    {result && (
                        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {result.message}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSend}
                        disabled={sending || !message.trim()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                        {sending ? (
                            <>Đang gửi...</>
                        ) : (
                            <>
                                <Send size={16} />
                                Gửi thông báo
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
