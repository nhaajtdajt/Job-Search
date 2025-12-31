import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the Excel sheet
 */
export function exportToExcel(data, filename = 'export', sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Auto-size columns
  const maxWidth = 50;
  const colWidths = Object.keys(data[0]).map(key => {
    const maxLength = Math.max(
      key.length,
      ...data.map(row => String(row[key] || '').length)
    );
    return { wch: Math.min(maxLength + 2, maxWidth) };
  });
  worksheet['!cols'] = colWidths;
  
  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export applications to Excel
 * @param {Array} applications - Array of application objects
 * @param {string} filename - Name of the file
 */
export function exportApplicationsToExcel(applications, filename = 'applications') {
  if (!applications || applications.length === 0) {
    return false;
  }

  // Transform data for export
  const exportData = applications.map((app, index) => ({
    'STT': index + 1,
    'Họ tên': app.user?.name || app.applicant_name || '',
    'Email': app.user?.email || app.email || '',
    'Số điện thoại': app.user?.phone || app.phone || '',
    'Vị trí ứng tuyển': app.job?.job_title || app.job_title || '',
    'Trạng thái': getStatusLabel(app.status),
    'Ngày ứng tuyển': formatDate(app.apply_date || app.applied_at),
    'Ghi chú': app.notes || app.employer_notes || '',
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(exportData, `${filename}_${timestamp}`, 'Danh sách ứng viên');
  
  return true;
}

/**
 * Get Vietnamese label for status
 */
function getStatusLabel(status) {
  const statusMap = {
    pending: 'Chờ xử lý',
    reviewing: 'Đang xem xét',
    shortlisted: 'Danh sách ngắn',
    interview: 'Phỏng vấn',
    offer: 'Đã đề nghị',
    hired: 'Đã tuyển',
    rejected: 'Từ chối',
  };
  return statusMap[status] || status || '';
}

/**
 * Format date to Vietnamese format
 */
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}
