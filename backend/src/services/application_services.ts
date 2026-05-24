import prisma from "../configs/prisma.js";
import { Prisma } from "@prisma/client";

class ApplicationService {
  async submitApplication(userId: string, data: any) {
    // Transaction giúp lưu nhiều bảng cùng lúc an toàn
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Tạo bản ghi hồ sơ chính
      const application = await tx.application.create({
        data: {
          userId: userId,
          universityId: data.universityId,
          majorId: data.majorId,
          combinationId: data.combinationId,
          roundId: data.roundId,
          scoreSubject1: data.scoreSubject1,
          scoreSubject2: data.scoreSubject2,
          scoreSubject3: data.scoreSubject3,
          totalScore: data.totalScore,
          priorityObject: data.priorityObject,
          priorityScore: data.priorityScore,
          status: "PENDING",
        },
      });

      // 2. Lưu danh sách file đính kèm nếu có
      if (data.files && data.files.length > 0) {
        const fileData = data.files.map((file: any) => ({
          applicationId: application.id,
          fileType: file.fileType,
          originalName: file.originalName,
          fileUrl: file.fileUrl,
          mimeType: file.mimeType,
          fileSize: file.fileSize,
        }));

        await tx.applicationFile.createMany({ data: fileData });
      }

      return application;
    });
  }
}

export default new ApplicationService();
