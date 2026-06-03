import { Prisma } from "@prisma/client";
import prisma from "../configs/prisma.js";
import crypto from "crypto";

class ApplicationService {
  async submitApplication(userId: string, data: any) {
    const {
      universityId,
      majorId,
      combinationId,
      roundId,
      scoreSubject1,
      scoreSubject2,
      scoreSubject3,
      totalScore,
      priorityObject,
      priorityScore,
      gpa, // Bật lại GPA vì Database đã có cột gpa rồi!
      note,
      files,
    } = data;

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 1. KIỂM TRA TRÙNG LẶP: Chỉ chặn nếu nộp trùng cả Ngành, Tổ hợp và Nguyện vọng
        const existingApp = await tx.applications.findFirst({
          where: {
            user_id: userId,
            major_id: majorId,
            combination_id: combinationId,
            round_id: roundId,
          },
        });

        if (existingApp) {
          throw new Error(
            "Bạn đã nộp một hồ sơ xét tuyển y hệt như thế này trước đó rồi.",
          );
        }

        // 2. Tạo hồ sơ mới khớp hoàn toàn các tên cột trong Schema
        const newApp = await tx.applications.create({
          data: {
            id: crypto.randomUUID(),
            user_id: userId,
            university_id: universityId,
            major_id: majorId,
            combination_id: combinationId,
            round_id: roundId,
            score_subject_1: parseFloat(scoreSubject1) || 0,
            score_subject_2: parseFloat(scoreSubject2) || 0,
            score_subject_3: parseFloat(scoreSubject3) || 0,
            total_score: parseFloat(totalScore) || 0,
            priority_object: priorityObject,
            priority_score: parseFloat(priorityScore) || 0,
            gpa: parseFloat(gpa) || 0, // Lưu gpa mượt mà
            notes: note || "",
            status: "PENDING",
          },
        });

        // 3. Lưu mảng file minh chứng
        if (files && files.length > 0) {
          const fileRecords = files.map((file: any) => ({
            id: crypto.randomUUID(),
            application_id: newApp.id,
            file_url: file.fileUrl,
            file_type: file.fileType || "OTHER", // Khớp với enum CCCD, HOC_BA, GIAY_UU_TIEN, OTHER
            original_name: file.originalName || "unnamed_file", // Thêm trường bắt buộc của schema
            mime_type: file.mimeType || "application/octet-stream", // Thêm trường bắt buộc của schema
            file_size: parseInt(file.fileSize) || 0, // Thêm trường bắt buộc của schema
          }));

          await tx.application_files.createMany({
            data: fileRecords,
          });
        }

        return newApp;
      },
    );

    return result;
  }

  async getMyApplications(userId: string) {
    const applications = await prisma.applications.findMany({
      where: { user_id: userId },
      include: {
        application_files: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return applications;
  }
}

export default new ApplicationService();
