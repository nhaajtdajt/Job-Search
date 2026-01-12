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
  // Check if URL is external (Overleaf, Google Docs, etc. that block iframe)
  const isExternalUrl = resumeUrl && (
    resumeUrl.includes('overleaf.com') ||
    resumeUrl.includes('docs.google.com') ||
    resumeUrl.includes('drive.google.com')
  );

  // Check if URL is a PDF that can be embedded
  const isEmbeddablePDF = resumeUrl && 
    !isExternalUrl && (
      resumeUrl.toLowerCase().endsWith('.pdf') || 
      resumeUrl.includes('application/pdf') ||
      resumeUrl.includes('supabase')
    );

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
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
          >
            <ExternalLink className="w-4 h-4" />
            Mở CV
          </a>
        </div>
      </div>

      {/* PDF Viewer or Preview */}
      {isEmbeddablePDF ? (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src={`${resumeUrl}#toolbar=0&navpanes=0`}
            title="Resume Viewer"
            className="w-full h-[500px] bg-gray-100"
          />
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-200">
          <FileText className="w-16 h-16 text-blue-400 mb-3" />
          <p className="font-medium text-gray-700">CV đã được đính kèm</p>
          <p className="text-sm text-gray-500 mb-4">Nhấn nút bên dưới để xem CV</p>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            Xem CV trên tab mới
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
