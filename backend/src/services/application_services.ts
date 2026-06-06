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
  // 1. Luồng nộp hồ sơ xét tuyển
  async submitApplication(userId: string, data: any) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 🚀 BƯỚC 1: TÌM HOẶC TẠO ĐỢT TUYỂN SINH ĐỂ CHỐNG LỖI KHÓA NGOẠI
      let activeRound = await tx.admission_rounds.findFirst({
        where: { is_active: true },
      });

      // Nếu trong DB trắng trơn chưa có đợt nào, tự động tạo 1 đợt chuẩn UUID
      if (!activeRound) {
        activeRound = await tx.admission_rounds.create({
          data: {
            id: crypto.randomUUID(),
            title: "Đợt xét tuyển 2026 (Mặc định)",
            start_date: new Date(),
            end_date: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1),
            ), // Hạn 1 năm
            is_active: true,
          },
        });
      }

      // 🚀 BƯỚC 2: TÍNH TOÁN ĐIỂM
      const score1 =
        data.scoreSubject1 !== undefined ? Number(data.scoreSubject1) : 0;
      const score2 =
        data.scoreSubject2 !== undefined ? Number(data.scoreSubject2) : 0;
      const score3 =
        data.scoreSubject3 !== undefined ? Number(data.scoreSubject3) : 0;
      const examScore = score1 + score2 + score3;

      const priorityObjType =
        data.priorityObject || data.priority_object || "NONE";
      const calculatedPriorityScore = this.calculatePriority(
        priorityObjType,
        examScore,
      );
      const finalTotalScore =
        Math.round((examScore + calculatedPriorityScore) * 100) / 100;

      const frontendGpa = data.gpa ? `[GPA Học bạ: ${data.gpa}] ` : "";
      const userNotes = data.notes || data.note || "";

      // Ghi nhận Nguyện vọng (1, 2, 3) vào note luôn vì DB không có cột nguyện vọng
      const nguyenVong = data.roundId ? `[Nguyện vọng ${data.roundId}] ` : "";
      const combinedNotes = `${nguyenVong}${frontendGpa}${userNotes}`.trim();

      // 🚀 BƯỚC 3: LƯU HỒ SƠ VÀO DB
      const application = await tx.applications.create({
        data: {
          id: crypto.randomUUID(),
          user_id: userId, // Bắt buộc phải có userId từ token

          // Lấy đúng ID Trường, Ngành, Tổ hợp từ FE gửi lên
          university_id: data.universityId || data.university_id,
          major_id: data.majorId || data.major_id || data.major,
          combination_id:
            data.combinationId || data.combination_id || data.combination,

          // Gắn ID Đợt tuyển sinh chuẩn UUID (Không dùng số "1" của FE nữa)
          round_id: activeRound.id,

          score_subject_1: score1,
          score_subject_2: score2,
          score_subject_3: score3,
          total_score: finalTotalScore,

          priority_object: priorityObjType,
          priority_score: calculatedPriorityScore,
          notes: combinedNotes || null,
          status: "PENDING",
        },
      });

      // 🚀 BƯỚC 4: LƯU FILE MINH CHỨNG
      if (data.files && data.files.length > 0) {
        const fileData = data.files.map((file: any) => ({
          id: crypto.randomUUID(),
          application_id: application.id,
          // Chỉ cho phép các giá trị chuẩn của Database, nếu sai tự động đưa về "OTHER"
          file_type: ["CCCD", "HOC_BA", "GIAY_UU_TIEN", "OTHER"].includes(
            file.fileType,
          )
            ? file.fileType
            : "OTHER",
          original_name: file.originalName || "Tài liệu",
          file_url: file.fileUrl,
          mime_type: file.mimeType || "application/pdf",
          file_size: file.fileSize || 0,
        }));
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
