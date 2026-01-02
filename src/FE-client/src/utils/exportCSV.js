/**
 * CSV Export Utilities
 * Client-side CSV generation and download
 */

/**
 * Convert JSON array to CSV string
 * @param {Array} data - Array of objects
 * @param {Array} headers - Array of column headers
 * @returns {string} CSV string
 */
export function jsonToCSV(data, headers) {
    if (!data || data.length === 0) {
        return headers.join(',');
    }

    // CSV header row
    const csvHeaders = headers.join(',');

    // CSV data rows
    const csvRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            // Handle null/undefined
            if (value === null || value === undefined) return '';
            // Escape quotes and wrap in quotes if contains comma or quote
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Trigger CSV file download
 * @param {string} filename - Name of the file
 * @param {string} csvContent - CSV content
 */
export function downloadCSV(filename, csvContent) {
    // Add BOM for UTF-8 to support special characters in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date object or string
 * @returns {string} Formatted date
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
