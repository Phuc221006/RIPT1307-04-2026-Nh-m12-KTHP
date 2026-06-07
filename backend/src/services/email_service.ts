// src/services/email_service.ts
import nodemailer from 'nodemailer';
import prisma from '../configs/prisma.js';

interface EmailLogData {
  recipient_email: string;
  application_id?: string;
  status: string;
  template_name: string;
  subject: string;
  sent_at: Date;
  is_sent: boolean;
  error_message?: string;
}

interface StatusTransitionData {
  applicationId: string;
  oldStatus?: string;
  newStatus: string;
  userEmail: string;
  userName: string;
  universityName?: string;
  majorName?: string;
  notes?: string;
}

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===== EMAIL TEMPLATES =====

/**
 * Template HTML cho email thông báo trạng thái APPROVED (Chấp nhận)
 */
const getApprovedEmailTemplate = (
  userName: string,
  universityName?: string,
  majorName?: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .status-badge { display: inline-block; background-color: #4CAF50; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
        .info-box { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #ddd; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Hồ sơ được chấp nhận</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Chúc mừng! Hồ sơ xét tuyển của bạn đã được <span class="status-badge">CHẤP NHẬN</span></p>
          
          <div class="info-box">
            <h3>📋 Thông tin hồ sơ:</h3>
            <p><strong>Trạng thái:</strong> ✅ Được chấp nhận</p>
            ${universityName ? `<p><strong>Đại học:</strong> ${universityName}</p>` : ''}
            ${majorName ? `<p><strong>Chuyên ngành:</strong> ${majorName}</p>` : ''}
          </div>

          <p>Bạn có thể đăng nhập vào hệ thống để xem chi tiết hồ sơ và các bước tiếp theo.</p>
          
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Xem hồ sơ của bạn</a></p>

          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với phòng tuyển sinh.</p>
          <p>Cảm ơn bạn!</p>
        </div>
        <div class="footer">
          <p>Đây là email tự động từ hệ thống tuyển sinh. Vui lòng không trả lời email này.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template HTML cho email thông báo trạng thái REJECTED (Từ chối)
 */
const getRejectedEmailTemplate = (
  userName: string,
  notes?: string,
  universityName?: string,
  majorName?: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #f44336 0%, #da190b 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .status-badge { display: inline-block; background-color: #f44336; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
        .info-box { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #f44336; }
        .notes-box { background-color: #fff3cd; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #ddd; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 Thông báo kết quả xét tuyển</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Hồ sơ xét tuyển của bạn đã được xem xét. Kết quả là <span class="status-badge">KHÔNG ĐẠT</span></p>
          
          <div class="info-box">
            <h3>📋 Thông tin hồ sơ:</h3>
            <p><strong>Trạng thái:</strong> ❌ Không được chấp nhận</p>
            ${universityName ? `<p><strong>Đại học:</strong> ${universityName}</p>` : ''}
            ${majorName ? `<p><strong>Chuyên ngành:</strong> ${majorName}</p>` : ''}
          </div>

          ${notes ? `
          <div class="notes-box">
            <h3>📌 Ghi chú:</h3>
            <p>${notes}</p>
          </div>
          ` : ''}

          <p>Cảm ơn bạn đã nộp hồ sơ. Bạn có thể chuẩn bị tốt hơn và nộp hồ sơ lại ở các kỳ tuyển sinh tiếp theo.</p>
          
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Xem chi tiết</a></p>

          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với phòng tuyển sinh.</p>
        </div>
        <div class="footer">
          <p>Đây là email tự động từ hệ thống tuyển sinh. Vui lòng không trả lời email này.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template HTML cho email thông báo trạng thái PENDING (Đang xử lý)
 */
const getPendingEmailTemplate = (
  userName: string,
  universityName?: string,
  majorName?: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #2196F3 0%, #0b7dda 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .status-badge { display: inline-block; background-color: #2196F3; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
        .info-box { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #2196F3; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #ddd; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏳ Hồ sơ đang được xử lý</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Hồ sơ xét tuyển của bạn hiện đang được xem xét. Trạng thái: <span class="status-badge">ĐANG XỬ LÝ</span></p>
          
          <div class="info-box">
            <h3>📋 Thông tin hồ sơ:</h3>
            <p><strong>Trạng thái:</strong> ⏳ Đang xử lý</p>
            ${universityName ? `<p><strong>Đại học:</strong> ${universityName}</p>` : ''}
            ${majorName ? `<p><strong>Chuyên ngành:</strong> ${majorName}</p>` : ''}
          </div>

          <p>Chúng tôi sẽ sớm hoàn thành quá trình xét tuyển. Bạn sẽ được thông báo kết quả qua email này.</p>
          
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Kiểm tra hồ sơ</a></p>

          <p>Cảm ơn bạn!</p>
        </div>
        <div class="footer">
          <p>Đây là email tự động từ hệ thống tuyển sinh. Vui lòng không trả lời email này.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ===== EMAIL SENDING FUNCTIONS =====

/**
 * Hàm gửi email thông báo trạng thái chấp nhận
 */
export const sendApprovedEmail = async (
  to: string,
  userName: string,
  universityName?: string,
  majorName?: string,
): Promise<void> => {
  try {
    const htmlContent = getApprovedEmailTemplate(userName, universityName, majorName);
    
    await transporter.sendMail({
      from: '"Hệ thống Tuyển sinh" <no-reply@htqlts.com>',
      to,
      subject: '🎉 Chúc mừng - Hồ sơ xét tuyển của bạn được chấp nhận',
      html: htmlContent,
      text: `Chúc mừng ${userName}! Hồ sơ xét tuyển của bạn được chấp nhận.`,
    });

    console.log(`✅ Email APPROVED sent to ${to}`);
  } catch (error) {
    console.error(`❌ Lỗi gửi email APPROVED đến ${to}:`, error);
    throw error;
  }
};

/**
 * Hàm gửi email thông báo trạng thái từ chối
 */
export const sendRejectedEmail = async (
  to: string,
  userName: string,
  notes?: string,
  universityName?: string,
  majorName?: string,
): Promise<void> => {
  try {
    const htmlContent = getRejectedEmailTemplate(userName, notes, universityName, majorName);
    
    await transporter.sendMail({
      from: '"Hệ thống Tuyển sinh" <no-reply@htqlts.com>',
      to,
      subject: '📝 Thông báo kết quả xét tuyển',
      html: htmlContent,
      text: `${userName}, hồ sơ xét tuyển của bạn không được chấp nhận.`,
    });

    console.log(`✅ Email REJECTED sent to ${to}`);
  } catch (error) {
    console.error(`❌ Lỗi gửi email REJECTED đến ${to}:`, error);
    throw error;
  }
};

/**
 * Hàm gửi email thông báo trạng thái đang xử lý
 */
export const sendPendingEmail = async (
  to: string,
  userName: string,
  universityName?: string,
  majorName?: string,
): Promise<void> => {
  try {
    const htmlContent = getPendingEmailTemplate(userName, universityName, majorName);
    
    await transporter.sendMail({
      from: '"Hệ thống Tuyển sinh" <no-reply@htqlts.com>',
      to,
      subject: '⏳ Hồ sơ của bạn đang được xét tuyển',
      html: htmlContent,
      text: `${userName}, hồ sơ của bạn đang được xét tuyển.`,
    });

    console.log(`✅ Email PENDING sent to ${to}`);
  } catch (error) {
    console.error(`❌ Lỗi gửi email PENDING đến ${to}:`, error);
    throw error;
  }
};

// ===== STATUS TRANSITION HANDLER =====

/**
 * Hàm xử lý logic ghép nối chuyển trạng thái và tự động gửi email
 * Hàm này được gọi khi có sự thay đổi trạng thái hồ sơ
 * 
 * @param data - Dữ liệu về sự chuyển đổi trạng thái
 * @returns Promise<void>
 */
export const handleStatusTransition = async (
  data: StatusTransitionData,
): Promise<void> => {
  try {
    const {
      applicationId,
      oldStatus,
      newStatus,
      userEmail,
      userName,
      universityName,
      majorName,
      notes,
    } = data;

    console.log(`📨 Xử lý chuyển trạng thái: ${oldStatus} → ${newStatus}`);

    // Xử lý logic dựa trên trạng thái mới
    switch (newStatus.toUpperCase()) {
      case 'APPROVED':
        await sendApprovedEmail(
          userEmail,
          userName,
          universityName,
          majorName,
        );
        break;

      case 'REJECTED':
        await sendRejectedEmail(
          userEmail,
          userName,
          notes,
          universityName,
          majorName,
        );
        break;

      case 'PENDING':
        // Chỉ gửi email PENDING nếu chuyển từ trạng thái khác (không phải lần đầu)
        if (oldStatus && oldStatus !== 'PENDING') {
          await sendPendingEmail(
            userEmail,
            userName,
            universityName,
            majorName,
          );
        }
        break;

      default:
        console.warn(`⚠️ Trạng thái không được nhận diện: ${newStatus}`);
    }

    console.log(`✅ Xử lý chuyển trạng thái thành công`);
  } catch (error) {
    console.error('❌ Lỗi khi xử lý chuyển trạng thái:', error);
    throw error;
  }
};

/**
 * Hàm gửi email với thông tin chi tiết từ application ID
 * Tự động lấy thông tin từ database và gửi email phù hợp
 * 
 * @param applicationId - ID của hồ sơ
 * @param newStatus - Trạng thái mới
 * @param notes - Ghi chú (tuỳ chọn)
 * @returns Promise<void>
 */
export const sendStatusEmailByApplicationId = async (
  applicationId: string,
  newStatus: string,
  notes?: string,
): Promise<void> => {
  try {
    // Lấy thông tin hồ sơ từ database
    const application = await prisma.applications.findUnique({
      where: { id: applicationId },
      include: {
        users: {
          select: { email: true, full_name: true },
        },
        universities: {
          select: { name: true },
        },
        majors: {
          select: { name: true },
        },
      },
    });

    if (!application) {
      throw new Error(`Hồ sơ không tìm thấy: ${applicationId}`);
    }

    // Chuẩn bị dữ liệu chuyển đổi trạng thái
    const transitionData: StatusTransitionData = {
      applicationId,
      oldStatus: application.status,
      newStatus,
      userEmail: application.users.email,
      userName: application.users.full_name,
      universityName: application.universities?.name,
      majorName: application.majors?.name,
      notes,
    };

    // Gọi handler xử lý chuyển trạng thái
    await handleStatusTransition(transitionData);
  } catch (error) {
    console.error('❌ Lỗi gửi email theo application ID:', error);
    throw error;
  }
};

/**
 * Hàm gửi email thông báo chung (không phân biệt trạng thái)
 * Giữ để tương thích với code cũ
 */
export const sendStatusEmail = async (to: string, status: string): Promise<void> => {
  try {
    const subject = `Thông báo trạng thái hồ sơ - ${status}`;
    const text = `Hồ sơ của bạn đã chuyển sang trạng thái: ${status}`;

    await transporter.sendMail({
      from: '"Hệ thống Tuyển sinh" <no-reply@htqlts.com>',
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Lỗi gửi email đến ${to}:`, error);
    throw error;
  }
};