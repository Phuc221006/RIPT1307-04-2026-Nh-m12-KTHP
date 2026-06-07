export type NotificationType =
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "NEW_APPLICATION_ADMIN"
  | string;

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type?: NotificationType;
  referenceId?: string;
}

export function normalizeNotification(
  raw: Record<string, unknown>,
): NotificationItem {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "Thông báo"),
    description: String(raw.description ?? raw.content ?? raw.message ?? ""),
    time: String(
      raw.time ?? raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    ),
    isRead: Boolean(raw.isRead ?? raw.is_read ?? false),
    type: raw.type ? String(raw.type) : undefined,
    referenceId: raw.referenceId
      ? String(raw.referenceId)
      : raw.reference_id
        ? String(raw.reference_id)
        : undefined,
  };
}

export function formatRelativeTime(dateString: string): string {
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return "Vừa xong";

  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSeconds < 60) return "Vừa xong";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;

  return new Date(dateString).toLocaleDateString("vi-VN");
}

export function getUnreadCount(notifications: NotificationItem[]): number {
  return notifications.filter((item) => !item.isRead).length;
}

export function markNotificationAsRead(
  notifications: NotificationItem[],
  id: string,
): NotificationItem[] {
  return notifications.map((item) =>
    item.id === id ? { ...item, isRead: true } : item,
  );
}

export function markAllNotificationsAsRead(
  notifications: NotificationItem[],
): NotificationItem[] {
  return notifications.map((item) => ({ ...item, isRead: true }));
}

/* --- Unit tests (chỉ chạy khi vitest, không bundle vào production) --- */
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  const sampleNotifications: NotificationItem[] = [
    {
      id: "1",
      title: "Thông báo A",
      description: "Mô tả A",
      time: new Date().toISOString(),
      isRead: false,
    },
    {
      id: "2",
      title: "Thông báo B",
      description: "Mô tả B",
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "3",
      title: "Thông báo C",
      description: "Mô tả C",
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ];

  describe("notificationHelpers", () => {
    describe("normalizeNotification", () => {
      it("chuẩn hóa dữ liệu API với trường time", () => {
        const result = normalizeNotification({
          id: 42,
          title: "Test",
          description: "Nội dung",
          time: "2026-06-07T10:00:00.000Z",
          isRead: false,
        });

        expect(result).toEqual({
          id: "42",
          title: "Test",
          description: "Nội dung",
          time: "2026-06-07T10:00:00.000Z",
          isRead: false,
        });
      });

      it("fallback createdAt và is_read từ API legacy", () => {
        const result = normalizeNotification({
          id: "x",
          content: "Legacy content",
          created_at: "2026-01-01T00:00:00.000Z",
          is_read: true,
        });

        expect(result.description).toBe("Legacy content");
        expect(result.time).toBe("2026-01-01T00:00:00.000Z");
        expect(result.isRead).toBe(true);
      });
    });

    describe("getUnreadCount", () => {
      it("đếm đúng số thông báo chưa đọc", () => {
        expect(getUnreadCount(sampleNotifications)).toBe(2);
      });

      it("trả về 0 khi tất cả đã đọc", () => {
        expect(
          getUnreadCount(
            sampleNotifications.map((n) => ({ ...n, isRead: true })),
          ),
        ).toBe(0);
      });
    });

    describe("markNotificationAsRead", () => {
      it("chỉ đánh dấu item được chọn", () => {
        const updated = markNotificationAsRead(sampleNotifications, "1");

        expect(updated.find((n) => n.id === "1")?.isRead).toBe(true);
        expect(updated.find((n) => n.id === "3")?.isRead).toBe(false);
      });
    });

    describe("markAllNotificationsAsRead", () => {
      it("đánh dấu tất cả thông báo là đã đọc", () => {
        const updated = markAllNotificationsAsRead(sampleNotifications);

        expect(updated.every((n) => n.isRead)).toBe(true);
      });
    });

    describe("formatRelativeTime", () => {
      it('trả về "Vừa xong" cho thời gian gần đây', () => {
        expect(formatRelativeTime(new Date().toISOString())).toBe("Vừa xong");
      });

      it("trả về phút trước", () => {
        const fiveMinutesAgo = new Date(
          Date.now() - 5 * 60 * 1000,
        ).toISOString();
        expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 phút trước");
      });

      it("trả về giờ trước", () => {
        const twoHoursAgo = new Date(
          Date.now() - 2 * 60 * 60 * 1000,
        ).toISOString();
        expect(formatRelativeTime(twoHoursAgo)).toBe("2 giờ trước");
      });
    });
  });
}
