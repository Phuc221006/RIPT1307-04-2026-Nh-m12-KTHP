import prisma from "../configs/prisma.js";
import { Prisma } from "@prisma/client";
import crypto from "crypto";

// 1. ĐÃ MỞ KHÓA: Import hàm gửi email của Trường
import { sendStatusEmail } from "./email_service.js";

class ApplicationService {
  // 1. Luồng nộp hồ sơ 
  async submitApplication(userId: string, data: any) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const application = await tx.applications.create({
        data: {
          id: crypto.randomUUID(),
          user_id: userId,
          university_id: data.universityId || "UNI_01",
          major_id: data.majorId || data.major || "MAJOR_01",
          combination_id: data.combinationId || "A00",
          round_id: data.roundId || "ROUND_1",
          score_subject_1: data.scoreSubject1 ? Number(data.scoreSubject1) : 0,
          score_subject_2: data.scoreSubject2 ? Number(data.scoreSubject2) : 0,
          score_subject_3: data.scoreSubject3 ? Number(data.scoreSubject3) : 0,
          total_score: data.totalScore ? Number(data.totalScore) : 0,
          priority_object: data.priorityObject || "NONE",
          priority_score: data.priorityScore
            ? Number(data.priorityScore)
            : Number(data.priority) || 0,
          status: "PENDING",
        },
      });

      // Hỗ trợ cả 2 luồng Frontend: Gửi mảng files hoặc gửi 1 documentUrl
      if (data.files && data.files.length > 0) {
        const fileData = data.files.map((file: any) => ({
          id: crypto.randomUUID(),
          application_id: application.id,
          file_type: file.fileType || ("DOCUMENT" as any),
          original_name: file.originalName,
          file_url: file.fileUrl,
          mime_type: file.mimeType,
          file_size: file.fileSize,
        }));
        await tx.application_files.createMany({ data: fileData });
      } else if (data.documentUrl) {
        await tx.application_files.create({
          data: {
            id: crypto.randomUUID(),
            application_id: application.id,
            file_type: "DOCUMENT" as any,
            original_name: "Ho_So_Minh_Chung",
            file_url: data.documentUrl,
            mime_type: "application/octet-stream",
            file_size: 0,
          },
        });
      }

      return application;
    });
  }

  // 2. Hàm của Kiên: Lấy danh sách hồ sơ
  async getMyApplications(userId: string) {
    return await prisma.applications.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  // 3. Hàm của Trường: Cập nhật trạng thái hồ sơ & Gửi Email
  async updateApplicationStatus(id: string, status: string) {
    const application = await prisma.applications.update({
      where: { id },
      data: { status: status as any },
      // 2. ĐÃ MỞ KHÓA: Lấy thông tin user để lấy email.
      // (Lưu ý: Nếu Prisma báo lỗi đỏ chữ 'users' ở đây, hãy thử đổi lại thành 'user')
      include: { users: true },
    });

    // 3. ĐÃ MỞ KHÓA: Gọi hàm gửi mail nếu lấy được email của user
    if (application.users?.email) {
      await sendStatusEmail(application.users.email, status);
    }

    return application;
  }
}

export default new ApplicationService();
