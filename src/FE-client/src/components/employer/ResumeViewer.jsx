import PropTypes from 'prop-types';
import { FileText, Download, ExternalLink, Loader2 } from 'lucide-react';

/**
 * ResumeViewer Component
 * Display resume/CV with PDF viewer or download option
 */
export default function ResumeViewer({ 
  resumeUrl, 
  resumeTitle,
  isLoading = false 
}) {
  // Check if URL is a PDF
  const isPDF = resumeUrl?.toLowerCase()?.endsWith('.pdf') || 
                resumeUrl?.includes('application/pdf');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="h-96 bg-gray-100 rounded animate-pulse flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!resumeUrl) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          CV / Hồ sơ
        </h3>
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 text-gray-300 mb-2" />
          <p>Không có CV đính kèm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          {resumeTitle || 'CV / Hồ sơ'}
        </h3>
        <div className="flex items-center gap-2">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
          >
            <ExternalLink className="w-4 h-4" />
            Mở tab mới
          </a>
          <a
            href={resumeUrl}
            download
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            Tải xuống
          </a>
        </div>
      </div>

      {/* PDF Viewer or Preview */}
      {isPDF ? (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src={`${resumeUrl}#toolbar=0&navpanes=0`}
            title="Resume Viewer"
            className="w-full h-[500px] bg-gray-100"
          />
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mb-3" />
          <p className="font-medium">Xem trước không khả dụng</p>
          <p className="text-sm">Vui lòng tải xuống để xem CV</p>
          <a
            href={resumeUrl}
            download
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Download className="w-4 h-4" />
            Tải CV
          </a>
        </div>
      )}
    </div>
  );
}

ResumeViewer.propTypes = {
  resumeUrl: PropTypes.string,
  resumeTitle: PropTypes.string,
  isLoading: PropTypes.bool,
};
