const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const emailConfig = require('../configs/email.config');

// Register Handlebars helpers
handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b ? opts.fn(this) : opts.inverse(this);
});

/**
 * Email Service
 * Handles all transactional email sending for the application
 */
class EmailService {
    constructor() {
        this.transporter = null;
        this.templatesCache = new Map();
    }

    /**
     * Initialize email transporter
     * @returns {Object|null} Nodemailer transporter or null if not configured
     */
    initTransporter() {
        if (this.transporter) {
            return this.transporter;
        }

        const validation = emailConfig.validateConfig();
        if (!validation.valid) {
            return null;
        }

        this.transporter = nodemailer.createTransport({
            host: emailConfig.smtp.host,
            port: emailConfig.smtp.port,
            secure: emailConfig.smtp.secure,
            auth: emailConfig.smtp.auth
        });

        return this.transporter;
    }

    /**
     * Load and compile HTML template with Handlebars
     * @param {string} templateName - Template file name (without .html)
     * @returns {Function|null} Compiled Handlebars template
     */
    loadTemplate(templateName) {
        // Check cache first
        if (this.templatesCache.has(templateName)) {
            return this.templatesCache.get(templateName);
        }

        const templatePath = path.join(
            process.cwd(),
            emailConfig.templatesDir,
            `${templateName}.html`
        );

        try {
            const templateSource = fs.readFileSync(templatePath, 'utf-8');
            const compiledTemplate = handlebars.compile(templateSource);
            this.templatesCache.set(templateName, compiledTemplate);
            return compiledTemplate;
        } catch (error) {
            return null;
        }
    }

    /**
     * Send email using template
     * @param {Object} options - Email options
     * @param {string} options.to - Recipient email
     * @param {string} options.subject - Email subject
     * @param {string} options.template - Template name
     * @param {Object} options.data - Template data
     * @returns {Promise<boolean>} Success status
     */
    async sendEmail({ to, subject, template, data }) {
        const transporter = this.initTransporter();

        if (!transporter) {
            return false;
        }

        // Load and compile template
        const compiledTemplate = this.loadTemplate(template);
        if (!compiledTemplate) {
            return false;
        }

        // Generate HTML content
        const html = compiledTemplate({
            ...data,
            year: new Date().getFullYear()
        });

        // Plain text fallback
        const text = this.stripHtml(html);

        const mailOptions = {
            from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
            to,
            subject,
            html,
            text
        };

        try {
            // Verify connection
            await transporter.verify();

            // Send email
            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            // Silently handle email errors
            return false;
        }
    }

    /**
     * Strip HTML tags for plain text fallback
     * @param {string} html - HTML content
     * @returns {string} Plain text
     */
    stripHtml(html) {
        return html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // ==========================================
    // Application Email Methods
    // ==========================================

    /**
     * Send email to job seeker confirming their application was received
     * @param {string} email - Job seeker's email
     * @param {Object} data - { userName, jobTitle, companyName, applyDate }
     */
    async sendApplicationReceivedEmail(email, data) {
        return this.sendEmail({
            to: email,
            subject: `Đã nhận đơn ứng tuyển - ${data.jobTitle}`,
            template: 'application-received',
            data: {
                userName: data.userName || 'Ứng viên',
                jobTitle: data.jobTitle,
                companyName: data.companyName,
                applyDate: data.applyDate || new Date().toLocaleDateString('vi-VN')
            }
        });
    }

    /**
     * Send email to employer about new application
     * @param {string} email - Employer's email
     * @param {Object} data - { employerName, applicantName, jobTitle, resumeTitle, applyDate }
     */
    async sendNewApplicationEmail(email, data) {
        return this.sendEmail({
            to: email,
            subject: `Đơn ứng tuyển mới cho vị trí ${data.jobTitle}`,
            template: 'new-application',
            data: {
                employerName: data.employerName || 'Nhà tuyển dụng',
                applicantName: data.applicantName,
                jobTitle: data.jobTitle,
                resumeTitle: data.resumeTitle,
                applyDate: data.applyDate || new Date().toLocaleDateString('vi-VN')
            }
        });
    }

    /**
     * Send email to job seeker about application status change
     * @param {string} email - Job seeker's email
     * @param {Object} data - { userName, jobTitle, companyName, oldStatus, newStatus }
     */
    async sendStatusUpdateEmail(email, data) {
        const statusLabels = {
            'pending': 'Đang chờ xử lý',
            'reviewing': 'Đang xem xét',
            'interview': 'Mời phỏng vấn',
            'offer': 'Đề nghị làm việc',
            'accepted': 'Đã được nhận',
            'rejected': 'Không được chọn'
        };

        return this.sendEmail({
            to: email,
            subject: `Cập nhật trạng thái đơn ứng tuyển - ${data.jobTitle}`,
            template: 'application-status',
            data: {
                userName: data.userName || 'Ứng viên',
                jobTitle: data.jobTitle,
                companyName: data.companyName,
                oldStatus: statusLabels[data.oldStatus] || data.oldStatus,
                newStatus: statusLabels[data.newStatus] || data.newStatus,
                newStatusRaw: data.newStatus,
                isPositive: ['interview', 'offer', 'accepted'].includes(data.newStatus)
            }
        });
    }

    /**
     * Send password reset email
     * @param {string} email - User's email
     * @param {string} token - 6-digit reset token
     */
    async sendPasswordResetEmail(email, token) {
        return this.sendEmail({
            to: email,
            subject: 'Mã xác nhận đặt lại mật khẩu - Job Search',
            template: 'reset-password',
            data: {
                token,
                email
            }
        });
    }

    /**
     * Send email to job seeker about new job matching their saved search
     * @param {string} email - Job seeker's email
     * @param {Object} data - { userName, searchName, jobTitle, companyName, jobType, salaryMin, salaryMax, jobId }
     */
    async sendJobMatchEmail(email, data) {
        // Format salary for display
        const formatSalary = (amount) => {
            if (!amount) return null;
            return new Intl.NumberFormat('vi-VN').format(amount);
        };

        return this.sendEmail({
            to: email,
            subject: `🎯 Việc làm mới phù hợp: ${data.jobTitle}`,
            template: 'new-job-match',
            data: {
                userName: data.userName || 'Bạn',
                searchName: data.searchName || 'Tìm kiếm đã lưu',
                jobTitle: data.jobTitle,
                companyName: data.companyName,
                jobType: data.jobType,
                salaryMin: formatSalary(data.salaryMin),
                salaryMax: formatSalary(data.salaryMax),
                jobId: data.jobId
            }
        });
    }
}

// Export singleton instance
module.exports = new EmailService();
