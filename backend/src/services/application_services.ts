import prisma from "../configs/prisma.js";
import { Prisma } from "@prisma/client";

class ApplicationService {
  async submitApplication(userId: string, data: any) {
   
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
  
  async updateApplicationStatus(id: string, status: string) {
    const application = await prisma.application.update({
      where: { id },
      data: { status: status },
      include: { user: true },
    });

    if (application.user?.email) {
      await sendStatusEmail(application.user.email, status);
    }
    return application;
  }
}

export default new ApplicationService();
