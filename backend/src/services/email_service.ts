// src/services/email_service.ts
import nodemailer from 'nodemailer';

export interface SubmissionConfirmationParams {
  to: string;
  candidateName: string;
  majorName: string;
}

export interface ResultNotificationParams {
  to: string;
  candidateName: string;
  majorName: string;
  status: 'Đã duyệt' | 'Từ chối';
}

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM || '"Hệ thống Tuyển sinh" <no-reply@htqlts.com>';

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailService = process.env.EMAIL_SERVICE || 'gmail';

if (!emailUser || !emailPass) {
  throw new Error('EMAIL_USER và EMAIL_PASS phải được cấu hình để gửi mail bằng Nodemailer.');
}

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const sendMail = async (options: SendEmailOptions) => {
  return await transporter.sendMail({
    from: DEFAULT_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};

export const sendSubmissionConfirmation = async (
  params: SubmissionConfirmationParams,
) => {
  const { to, candidateName, majorName } = params;
  const subject = 'Hồ sơ của bạn đã được nhận thành công';
  const text = `Xin chào ${candidateName},\n\nHồ sơ xét tuyển ngành ${majorName} của bạn đã được nhận thành công. Chúng tôi sẽ liên hệ bạn khi có kết quả.
\nTrân trọng,\nBan tổ chức tuyển sinh`;
  const html = `
    <p>Xin chào <strong>${candidateName}</strong>,</p>
    <p>Hồ sơ xét tuyển ngành <strong>${majorName}</strong> của bạn đã được nhận thành công.</p>
    <p>Chúng tôi sẽ liên hệ bạn khi có kết quả.</p>
    <p>Trân trọng,<br/>Ban tổ chức tuyển sinh</p>
  `;

  return await sendMail({ to, subject, text, html });
};

export const sendResultNotification = async (
  params: ResultNotificationParams,
) => {
  const { to, candidateName, majorName, status } = params;
  const decisionText =
    status === 'Đã duyệt'
      ? 'Chúc mừng bạn đã trúng tuyển.'
      : 'Rất tiếc bạn chưa trúng tuyển.';

  const subject = `Kết quả xét tuyển ngành ${majorName}`;
  const text = `Xin chào ${candidateName},\n\nHồ sơ xét tuyển ngành ${majorName} của bạn đã có kết quả: ${status}. ${decisionText}\n\nTrân trọng,\nBan tổ chức tuyển sinh`;
  const html = `
    <p>Xin chào <strong>${candidateName}</strong>,</p>
    <p>Hồ sơ xét tuyển ngành <strong>${majorName}</strong> của bạn đã có kết quả: <strong>${status}</strong>.</p>
    <p>${decisionText}</p>
    <p>Trân trọng,<br/>Ban tổ chức tuyển sinh</p>
  `;

  return await sendMail({ to, subject, text, html });
};
