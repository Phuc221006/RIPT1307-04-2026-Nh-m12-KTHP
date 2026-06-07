import prisma from "../configs/prisma.js";
import { notifications_type, users_role } from "@prisma/client";
import crypto from "crypto";

type CreateNotificationInput = {
  userId: string;
  title: string;
  description: string;
  type: notifications_type;
  referenceId?: string;
};

class NotificationService {
  private async createIfNotExists(input: CreateNotificationInput) {
    const existing = await prisma.notifications.findFirst({
      where: {
        user_id: input.userId,
        type: input.type,
        reference_id: input.referenceId ?? null,
      },
    });

    if (existing) return existing;

    return prisma.notifications.create({
      data: {
        id: crypto.randomUUID(),
        user_id: input.userId,
        title: input.title,
        description: input.description,
        type: input.type,
        reference_id: input.referenceId,
        is_read: false,
      },
    });
  }

  private formatUniMajor(
    universityName?: string | null,
    majorName?: string | null,
  ) {
    return [universityName, majorName].filter(Boolean).join(" - ") || "hồ sơ";
  }

  async notifyApplicationSubmitted(applicationId: string, userId: string) {
    const app = await prisma.applications.findUnique({
      where: { id: applicationId },
      include: {
        universities: true,
        majors: true,
        users: true,
      },
    });

    if (!app) return;

    const label = this.formatUniMajor(app.universities?.name, app.majors?.name);

    await this.createIfNotExists({
      userId,
      title: "Nộp hồ sơ thành công",
      description: `Hồ sơ xét tuyển ${label} đã được gửi và đang chờ duyệt.`,
      type: "APPLICATION_SUBMITTED",
      referenceId: applicationId,
    });

    const admins = await prisma.users.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    const candidateName = app.users?.full_name || "Thí sinh";

    await Promise.all(
      admins.map((admin) =>
        this.createIfNotExists({
          userId: admin.id,
          title: "Hồ sơ mới cần xét duyệt",
          description: `${candidateName} vừa nộp hồ sơ ${label}.`,
          type: "NEW_APPLICATION_ADMIN",
          referenceId: applicationId,
        }),
      ),
    );
  }

  async notifyApplicationStatusChange(
    applicationId: string,
    newStatus: string,
  ) {
    const app = await prisma.applications.findUnique({
      where: { id: applicationId },
      include: {
        universities: true,
        majors: true,
      },
    });

    if (!app) return;

    const label = this.formatUniMajor(app.universities?.name, app.majors?.name);
    const status = String(newStatus).toUpperCase();

    if (status === "APPROVED") {
      await this.createIfNotExists({
        userId: app.user_id,
        title: "Hồ sơ được phê duyệt",
        description: `Hồ sơ ${label} đã được phê duyệt thành công.`,
        type: "APPLICATION_APPROVED",
        referenceId: applicationId,
      });
      return;
    }

    if (status === "REJECTED") {
      const note = app.notes?.includes("[LÝ DO TỪ CHỐI]")
        ? app.notes
        : app.notes || "";
      await this.createIfNotExists({
        userId: app.user_id,
        title: "Hồ sơ bị từ chối",
        description: `Hồ sơ ${label} đã bị từ chối.${note ? ` ${note}` : ""}`,
        type: "APPLICATION_REJECTED",
        referenceId: applicationId,
      });
    }
  }

  private async backfillIfEmpty(userId: string, userRole: users_role) {
    const count = await prisma.notifications.count({
      where: { user_id: userId },
    });
    if (count > 0) return;

    if (userRole === "CANDIDATE") {
      const apps = await prisma.applications.findMany({
        where: { user_id: userId },
        include: { universities: true, majors: true },
        orderBy: { created_at: "desc" },
        take: 30,
      });

      for (const app of apps) {
        const label = this.formatUniMajor(
          app.universities?.name,
          app.majors?.name,
        );

        await this.createIfNotExists({
          userId,
          title: "Nộp hồ sơ thành công",
          description: `Hồ sơ xét tuyển ${label} đã được gửi và đang chờ duyệt.`,
          type: "APPLICATION_SUBMITTED",
          referenceId: app.id,
        });

        if (app.status === "APPROVED") {
          await this.createIfNotExists({
            userId,
            title: "Hồ sơ được phê duyệt",
            description: `Hồ sơ ${label} đã được phê duyệt thành công.`,
            type: "APPLICATION_APPROVED",
            referenceId: app.id,
          });
        }

        if (app.status === "REJECTED") {
          await this.createIfNotExists({
            userId,
            title: "Hồ sơ bị từ chối",
            description: `Hồ sơ ${label} đã bị từ chối.`,
            type: "APPLICATION_REJECTED",
            referenceId: app.id,
          });
        }
      }
      return;
    }

    const recentApps = await prisma.applications.findMany({
      orderBy: { created_at: "desc" },
      take: 30,
      include: {
        universities: true,
        majors: true,
        users: true,
      },
    });

    for (const app of recentApps) {
      const label = this.formatUniMajor(
        app.universities?.name,
        app.majors?.name,
      );
      const candidateName = app.users?.full_name || "Thí sinh";

      await this.createIfNotExists({
        userId,
        title: "Hồ sơ mới cần xét duyệt",
        description: `${candidateName} vừa nộp hồ sơ ${label}.`,
        type: "NEW_APPLICATION_ADMIN",
        referenceId: app.id,
      });
    }
  }

  async getUserNotifications(userId: string, userRole: users_role) {
    await this.backfillIfEmpty(userId, userRole);

    const rows = await prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    return rows.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      time: item.created_at?.toISOString() ?? new Date().toISOString(),
      isRead: item.is_read,
      type: item.type,
      referenceId: item.reference_id ?? undefined,
    }));
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notifications.findFirst({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new Error("Không tìm thấy thông báo.");
    }

    if (!notification.is_read) {
      await prisma.notifications.update({
        where: { id: notificationId },
        data: { is_read: true },
      });
    }
  }

  async markAllAsRead(userId: string) {
    await prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }
}

export default new NotificationService();
