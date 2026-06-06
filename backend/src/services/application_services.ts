import prisma from "../configs/prisma.js";
import { Prisma } from "@prisma/client";
import crypto from "crypto";

// 1. ĐÃ MỞ KHÓA: Import hàm gửi email của Trường
import { sendStatusEmail } from "./email_service.js";

class ApplicationService {
  // 🔹 HÀM HELPER BA: Tự động tính điểm ưu tiên chuẩn Quy chế Bộ Giáo dục (Tuyến tính hóa từ mốc 22.5)
  private calculatePriority(priorityObject: string, examScore: number): number {
    let baseScore = 0;
    if (priorityObject === "KV1") baseScore = 0.75;
    else if (priorityObject === "KV2_NT") baseScore = 0.5;
    else if (priorityObject === "KV2") baseScore = 0.25;

    let actualScore = baseScore;

    // Quy chế Bộ GD từ năm 2023: Nếu tổng điểm >= 22.5, điểm ưu tiên giảm dần theo thang 7.5
    if (examScore >= 22.5) {
      actualScore = baseScore * ((30 - examScore) / 7.5);
    }

    // Làm tròn đến 2 chữ số thập phân
    return Math.round(actualScore * 100) / 100;
  }

  // 1. Luồng nộp hồ sơ xét tuyển
  async submitApplication(userId: string, data: any) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Ép kiểu điểm 3 môn thi
      const score1 =
        data.scoreSubject1 !== undefined ? Number(data.scoreSubject1) : 0;
      const score2 =
        data.scoreSubject2 !== undefined ? Number(data.scoreSubject2) : 0;
      const score3 =
        data.scoreSubject3 !== undefined ? Number(data.scoreSubject3) : 0;
      const examScore = score1 + score2 + score3;

      // Xử lý logic điểm ưu tiên tự động ở Backend
      const priorityObjType =
        data.priorityObject || data.priority_object || "NONE";
      const calculatedPriorityScore = this.calculatePriority(
        priorityObjType,
        examScore,
      );

      // Tổng điểm xét tuyển cuối cùng = Điểm thi + Điểm ưu tiên đã qua xử lý tuyến tính
      const finalTotalScore =
        Math.round((examScore + calculatedPriorityScore) * 100) / 100;

      // 🔹 XỬ LÝ GPA: Gom điểm GPA của Phúc gửi lên nối chung vào cột notes dưới DB để tránh lỗi thiếu cột
      const frontendGpa = data.gpa ? `[GPA Học bạ: ${data.gpa}] ` : "";
      const userNotes = data.notes || data.note || "";
      const combinedNotes = `${frontendGpa}${userNotes}`.trim();

      const application = await tx.applications.create({
        data: {
          id: crypto.randomUUID(),
          user_id: userId,

          // Hỗ trợ linh hoạt mọi kiểu đặt tên trường từ FE của Phúc
          university_id: data.universityId || data.university_id || "UNI_01",
          major_id: data.majorId || data.major_id || data.major || "MAJOR_01",
          combination_id:
            data.combinationId ||
            data.combination_id ||
            data.combination ||
            "A00",
          round_id: data.roundId || data.round_id || "ROUND_1",

          score_subject_1: score1,
          score_subject_2: score2,
          score_subject_3: score3,
          total_score: finalTotalScore, // Điểm tổng cuối cùng bảo mật tuyệt đối

          priority_object: priorityObjType,
          priority_score: calculatedPriorityScore, // Điểm cộng chính xác do server tự tính
          notes: combinedNotes || null,
          status: "PENDING",
        },
      });

      // Hỗ trợ lưu thông tin tệp minh chứng (Đã đồng bộ sạch theo đúng schema.prisma của nhóm)
      if (data.files && data.files.length > 0) {
        const fileData = data.files.map((file: any) => {
          // Gác cổng: Chỉ cho phép 4 chữ chuẩn, nếu sai ép hết về OTHER
          const validTypes = ["CCCD", "HOC_BA", "GIAY_UU_TIEN", "OTHER"];
          const finalFileType = validTypes.includes(file.fileType) ? file.fileType : "OTHER";

          return {
            id: crypto.randomUUID(),
            application_id: application.id,
            file_type: finalFileType as any,
            original_name: file.originalName,
            file_url: file.fileUrl,
            mime_type: file.mimeType,
            file_size: file.fileSize,
          };
        });
        
        await tx.application_files.createMany({ data: fileData });
      } else if (data.documentUrl || data.document_url) {
        await tx.application_files.create({
          data: {
            id: crypto.randomUUID(),
            application_id: application.id,
            file_type: "OTHER" as any,
            original_name: "Ho_So_Minh_Chung",
            file_url: data.documentUrl || data.document_url,
            mime_type: "application/octet-stream",
            file_size: 0,
          },
        });
      }

      return application;
    });
  }

  // 2. Hàm lấy danh sách hồ sơ
  async getMyApplications(userId: string) {
    return await prisma.applications.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  // 3. Hàm cập nhật trạng thái hồ sơ & Gửi Email (Trường phụ trách)
  async updateApplicationStatus(id: string, status: string) {
    const application = await prisma.applications.update({
      where: { id },
      data: { status: status as any },
      include: { users: true },
    });

    // Gọi hàm gửi mail nếu lấy được email của user
    if (application.users?.email) {
      await sendStatusEmail(application.users.email, status);
    }

    return application;
  }

  // 4. Hàm lấy số liệu 4 ô thống kê Dashboard cá nhân
  async getDashboardStats(userId: string) {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.applications.count({ where: { user_id: userId } }),
      prisma.applications.count({
        where: { user_id: userId, status: "PENDING" },
      }),
      prisma.applications.count({
        where: { user_id: userId, status: "APPROVED" },
      }),
      prisma.applications.count({
        where: { user_id: userId, status: "REJECTED" },
      }),
    ]);

    return {
      totalApplications: total,
      pendingApplications: pending,
      approvedApplications: approved,
      rejectedApplications: rejected,
    };
  }
}

export default new ApplicationService();
