import { CheckCircle, Clock, XCircle, FileEdit } from 'lucide-react';

const statusConfig = {
  draft: {
    label: 'Bản nháp',
    icon: FileEdit,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  published: {
    label: 'Đang tuyển',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  expired: {
    label: 'Hết hạn',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  closed: {
    label: 'Đã đóng',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

export default function JobStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
