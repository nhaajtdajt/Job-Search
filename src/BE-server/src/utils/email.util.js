const nodemailer = require('nodemailer');
const environment = require('../configs/environment.config');

/**
 * Email Utility
 * Handles sending emails using nodemailer
 */
class EmailUtil {
  /**
   * Create email transporter
   * Supports Gmail, SMTP, or other email services
   */
  static createTransporter() {
    // For development, you can use Gmail or other SMTP services
    // For production, use a proper email service like SendGrid, AWS SES, etc.
    
    const emailConfig = {
      host: environment.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(environment.EMAIL_PORT) || 587,
      secure: environment.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: environment.EMAIL_USER?.trim(), // Remove leading/trailing spaces
        pass: environment.EMAIL_PASSWORD?.trim().replace(/\s/g, '') // Remove ALL spaces (Gmail App Password format)
      }
    };

    // If no email config, return null (email sending will be skipped)
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('⚠️  EMAIL_USER and EMAIL_PASSWORD not configured. Email sending will be skipped.');
      console.warn('⚠️  Current EMAIL_USER:', emailConfig.auth.user ? '✓ Set' : '✗ Not set');
      console.warn('⚠️  Current EMAIL_PASSWORD:', emailConfig.auth.pass ? '✓ Set' : '✗ Not set');
      return null;
    }

    // Check if EMAIL_USER is still placeholder
    if (emailConfig.auth.user.includes('your-email') || emailConfig.auth.user.includes('example.com')) {
      console.error('❌ ERROR: EMAIL_USER is still using placeholder value!');
      console.error('   Current value:', emailConfig.auth.user);
      console.error('   Please update .env.development with your real Gmail address');
      return null;
    }

    // Log email config (without password)
    console.log('📧 Email Config:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      user: emailConfig.auth.user
    });

    return nodemailer.createTransport(emailConfig);
  }

  /**
   * Send password reset email with token
   * @param {string} to - Recipient email
   * @param {string} token - 6-digit reset token
   * @returns {Promise<boolean>} Success status
   */
  static async sendPasswordResetEmail(to, token) {
    const transporter = this.createTransporter();
    
    if (!transporter) {
      console.log(`📧 [Email would be sent] Password reset token for ${to}: ${token}`);
      return false;
    }

    const mailOptions = {
      from: `"Job Search" <${environment.EMAIL_USER}>`,
      to: to,
      subject: 'Mã xác nhận đặt lại mật khẩu - Password Reset Token',
      html: this.getPasswordResetEmailTemplate(token),
      text: `Mã xác nhận đặt lại mật khẩu của bạn là: ${token}\n\nPassword reset token: ${token}`
    };

    try {
      console.log(`📧 Attempting to send email to: ${to}`);
      console.log(`📧 From: ${mailOptions.from}`);
      
      // Verify connection first
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully!');
      console.log('   Message ID:', info.messageId);
      console.log('   To:', to);
      console.log('   Response:', info.response);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:');
      console.error('   Error message:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Error command:', error.command);
      if (error.response) {
        console.error('   SMTP Response:', error.response);
      }
      if (error.responseCode) {
        console.error('   Response Code:', error.responseCode);
      }
      
      // Provide specific guidance for common errors
      if (error.code === 'EAUTH' || error.responseCode === 535) {
        console.error('\n🔧 GMAIL AUTHENTICATION ERROR - Solutions:');
        console.error('   1. Make sure you are using App Password, NOT regular password');
        console.error('   2. Enable 2-Step Verification on your Google Account');
        console.error('   3. Create App Password:');
        console.error('      - Go to: https://myaccount.google.com/security');
        console.error('      - Enable 2-Step Verification');
        console.error('      - Go to: https://myaccount.google.com/apppasswords');
        console.error('      - Create new App Password for "Mail"');
        console.error('      - Use the 16-character password (no spaces)');
        console.error('   4. Update .env.development:');
        console.error('      EMAIL_USER=your-actual-email@gmail.com');
        console.error('      EMAIL_PASSWORD=your-16-char-app-password');
      }
      
      console.error('   Full error:', error);
      return false;
    }
  }

  /**
   * Get HTML template for password reset email
   * Professional design inspired by Google's email style
   * @param {string} token - 6-digit reset token
   * @returns {string} HTML email template
   */
  static getPasswordResetEmailTemplate(token) {
    return `
<!DOCTYPE html>
<html lang="vi" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Password Reset - Job Search</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    /* Client-specific styles */
    .ReadMsgBody { width: 100%; }
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
      line-height: 100%;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f5f5f5; font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <!-- Wrapper table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main content table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e8eaed;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #4285f4 0%, #34a853 100%); border-radius: 24px; line-height: 48px; text-align: center;">
                      <span style="color: #ffffff; font-size: 24px; font-weight: 600;">JS</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; color: #202124; font-size: 24px; font-weight: 400; line-height: 32px; letter-spacing: 0;">
                      Đặt lại mật khẩu
                    </h1>
                    <p style="margin: 8px 0 0; color: #5f6368; font-size: 14px; line-height: 20px;">
                      Password Reset
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Greeting -->
              <p style="margin: 0 0 24px; color: #202124; font-size: 16px; line-height: 24px;">
                Xin chào,
              </p>
              
              <!-- Main message -->
              <p style="margin: 0 0 32px; color: #5f6368; font-size: 14px; line-height: 20px;">
                Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Job Search của mình. Vui lòng sử dụng mã xác nhận 6 chữ số bên dưới:
              </p>

              <!-- Token box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <div style="display: inline-block; padding: 24px 32px; background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 8px; min-width: 200px;">
                      <p style="margin: 0; font-size: 32px; font-weight: 500; color: #202124; letter-spacing: 12px; font-family: 'Roboto Mono', 'Courier New', monospace; text-align: center;">
                        ${token}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- English message -->
              <p style="margin: 0 0 8px; color: #5f6368; font-size: 14px; line-height: 20px;">
                <strong style="color: #202124;">Hello,</strong>
              </p>
              <p style="margin: 0 0 32px; color: #5f6368; font-size: 14px; line-height: 20px;">
                You have requested to reset your password for your Job Search account. Please use the 6-digit verification code above.
              </p>

              <!-- Security notice -->
              <div style="padding: 16px; background-color: #fef7e0; border-left: 4px solid #fbbc04; border-radius: 4px; margin-bottom: 32px;">
                <p style="margin: 0 0 8px; color: #202124; font-size: 13px; line-height: 18px; font-weight: 500;">
                  ⚠️ Lưu ý bảo mật / Security Notice
                </p>
                <p style="margin: 0; color: #5f6368; font-size: 13px; line-height: 18px;">
                  Mã này có hiệu lực trong 1 giờ. Vui lòng không chia sẻ mã này với bất kỳ ai. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                </p>
                <p style="margin: 8px 0 0; color: #5f6368; font-size: 13px; line-height: 18px;">
                  This code is valid for 1 hour. Please do not share this code with anyone. If you did not request a password reset, please ignore this email.
                </p>
              </div>

              <!-- Help text -->
              <p style="margin: 0; color: #5f6368; font-size: 13px; line-height: 18px;">
                Nếu bạn gặp vấn đề, vui lòng liên hệ với chúng tôi qua email hỗ trợ.
              </p>
              <p style="margin: 4px 0 0; color: #5f6368; font-size: 13px; line-height: 18px;">
                If you're having trouble, please contact our support team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8f9fa; border-top: 1px solid #e8eaed;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="margin: 0; color: #5f6368; font-size: 12px; line-height: 16px;">
                      Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                    <p style="margin: 4px 0 0; color: #5f6368; font-size: 12px; line-height: 16px;">
                      This is an automated email, please do not reply.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px; border-top: 1px solid #e8eaed;">
                    <p style="margin: 0; color: #9aa0a6; font-size: 11px; line-height: 16px;">
                      © ${new Date().getFullYear()} Job Search. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}

module.exports = EmailUtil;

