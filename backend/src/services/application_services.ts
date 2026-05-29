import prisma from "../configs/prisma.js";
import { Prisma } from "@prisma/client";
import crypto from "crypto"; // Import thư viện có sẵn của Node.js để sinh ID ngẫu nhiên

class ApplicationService {
  async submitApplication(userId: string, data: any) {
    // Transaction giúp lưu nhiều bảng cùng lúc an toàn
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Tạo bản ghi hồ sơ chính
      const application = await tx.applications.create({
        data: {
          id: crypto.randomUUID(),
          user_id: userId,
          university_id: data.universityId,
          major_id: data.majorId,
          combination_id: data.combinationId,
          round_id: data.roundId,
          score_subject_1: data.scoreSubject1,
          score_subject_2: data.scoreSubject2,
          score_subject_3: data.scoreSubject3,
          total_score: data.totalScore,
          priority_object: data.priorityObject,
          priority_score: data.priorityScore,
          status: "PENDING",
        },
      });

      // 2. Lưu danh sách file đính kèm nếu có (Đã chuyển đổi sang snake_case để tránh lỗi)
      if (data.files && data.files.length > 0) {
        const fileData = data.files.map((file: any) => ({
          id: crypto.randomUUID(), // Cấp ID cho file đính kèm
          application_id: application.id, // Khóa ngoại nối với bảng trên
          file_type: file.fileType || "DOCUMENT",
          original_name: file.originalName,
          file_url: file.fileUrl,
          mime_type: file.mimeType,
          file_size: file.fileSize,
        }));

        await tx.application_files.createMany({ data: fileData });
      }

      return application;
    });
  }

  // 3. Hàm lấy danh sách hồ sơ (Giải quyết triệt để lỗi 404 GET /me lúc nãy)
  async getMyApplications(userId: string) {
    return await prisma.applications.findMany({
      where: {
        user_id: userId, // Bắt buộc dùng user_id cho khớp với DB
      },
      // orderBy: { createdAt: 'desc' } // Bỏ // ở dòng này nếu DB có cột thời gian tạo
    });
  }
}

export default new ApplicationService();
