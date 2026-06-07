import crypto from "crypto";
import prisma from "../configs/prisma.js";
import EmailService from "./email_service.js";
import { applications_status } from "@prisma/client";

class ApplicationStatusService {
  private validStatuses = ["PENDING", "APPROVED", "REJECTED"] as const;

  async changeStatus(
    applicationId: string,
    changedBy: string,
    newStatus: applications_status,
    note?: string,
  ) {
    if (!this.validStatuses.includes(newStatus)) {
      throw new Error("Trạng thái hồ sơ không hợp lệ.");
    }

    const existingApplication = await prisma.applications.findUnique({
      where: { id: applicationId },
      include: { users: true },
    });

    if (!existingApplication) {
      throw new Error("Không tìm thấy hồ sơ xét tuyển.");
    }

    if (existingApplication.status === newStatus) {
      throw new Error("Hồ sơ đã ở trạng thái đang chọn.");
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      await tx.application_status_logs.create({
        data: {
          id: crypto.randomUUID(),
          application_id: applicationId,
          changed_by: changedBy,
          old_status: existingApplication.status,
          new_status: newStatus,
          note,
        },
      });

      return tx.applications.update({
        where: { id: applicationId },
        data: { status: newStatus },
      });
    });

    const emailResult = {
      success: false,
      info: null as any,
      error: null as string | null,
    };

    try {
      if (existingApplication.users?.email) {
        const info = await EmailService.sendApplicationStatusEmail(
          existingApplication.users.email,
          existingApplication.users.full_name,
          updatedApplication.status,
          note,
        );
        emailResult.success = true;
        emailResult.info = info;
      }
    } catch (error: any) {
      emailResult.error = error.message || "Lỗi khi gửi email thông báo.";
    }

    return {
      application: updatedApplication,
      emailResult,
    };
  }
}

export default new ApplicationStatusService();
