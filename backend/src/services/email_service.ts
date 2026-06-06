// src/services/email_service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendStatusEmail = async (to: string, status: string) => {
  await transporter.sendMail({
    from: '"Hệ thống Tuyển sinh" <no-reply@htqlts.com>',
    to,
    subject: 'Thông báo trạng thái hồ sơ',
    text: `Hồ sơ của bạn đã chuyển sang trạng thái: ${status}`,
  });
};