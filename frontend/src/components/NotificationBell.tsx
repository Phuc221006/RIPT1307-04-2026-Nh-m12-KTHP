import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Empty,
  List,
  Popover,
  Spin,
  Typography,
  message,
} from "antd";
import { BellOutlined } from "@ant-design/icons";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  role: "admin" | "student";
  /** Tuỳ chỉnh style icon (VD: màu trắng trên header Admin) */
  iconStyle?: React.CSSProperties;
  /** Tuỳ chỉnh class cho nút chuông (VD: styles.iconBtn trên Dashboard) */
  className?: string;
}

const NOTIFICATIONS_API =
  process.env.REACT_APP_NOTIFICATIONS_API_URL ||
  `${(process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1").replace(/\/api\/v1\/?$/, "")}/api/notifications`;

function getToken(): string | null {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );
}

function normalizeNotification(raw: Record<string, unknown>): NotificationItem {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "Thông báo"),
    description: String(raw.description ?? raw.content ?? raw.message ?? ""),
    isRead: Boolean(raw.isRead ?? raw.is_read ?? false),
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
  };
}

function formatRelativeTime(dateString: string): string {
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

const NotificationBell: React.FC<NotificationBellProps> = ({
  role,
  iconStyle,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${NOTIFICATIONS_API}?role=${encodeURIComponent(role)}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Không thể tải thông báo (${response.status})`);
      }

      const payload = await response.json();
      const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setNotifications(
        rawList
          .map((item: Record<string, unknown>) => normalizeNotification(item))
          .filter((item: NotificationItem) => Boolean(item.id)),
      );
    } catch (error) {
      console.error("[NotificationBell] fetch error:", error);
      message.error("Không thể tải danh sách thông báo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [role]);

  const markAsRead = useCallback(async (id: string) => {
    const target = notifications.find((item) => item.id === id);
    if (!target || target.isRead) return;

    setMarkingId(id);
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    );

    try {
      const token = getToken();
      const response = await fetch(`${NOTIFICATIONS_API}/${id}/read`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Không thể cập nhật trạng thái (${response.status})`);
      }
    } catch (error) {
      console.error("[NotificationBell] markAsRead error:", error);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: false } : item,
        ),
      );
      message.error("Không thể đánh dấu đã đọc. Vui lòng thử lại.");
    } finally {
      setMarkingId(null);
    }
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleOpenChange = (visible: boolean) => {
    setOpen(visible);
    if (visible) {
      fetchNotifications();
    }
  };

  const popoverContent = (
    <div style={{ width: 360 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Typography.Text strong>Thông báo</Typography.Text>
        {unreadCount > 0 && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {unreadCount} chưa đọc
          </Typography.Text>
        )}
      </div>

      <Spin spinning={loading}>
        {notifications.length === 0 && !loading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có thông báo nào"
            style={{ margin: "16px 0" }}
          />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={notifications}
            style={{
              maxHeight: 400,
              overflowY: "auto",
              margin: 0,
            }}
            renderItem={(item) => {
              const isUnread = !item.isRead;
              return (
                <List.Item
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 8px",
                    borderRadius: 8,
                    marginBottom: 4,
                    backgroundColor: isUnread ? "#f0f5ff" : "transparent",
                    transition: "background-color 0.2s ease",
                    opacity: markingId === item.id ? 0.7 : 1,
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Typography.Text strong={isUnread}>
                        {item.title}
                      </Typography.Text>
                    }
                    description={
                      <>
                        <Typography.Paragraph
                          type="secondary"
                          ellipsis={{ rows: 2 }}
                          style={{
                            marginBottom: 4,
                            fontWeight: isUnread ? 500 : 400,
                          }}
                        >
                          {item.description}
                        </Typography.Paragraph>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 12 }}
                        >
                          {formatRelativeTime(item.createdAt)}
                        </Typography.Text>
                      </>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Spin>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      title={null}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
      overlayStyle={{ paddingTop: 8 }}
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <Button
          type="text"
          className={className}
          icon={<BellOutlined style={{ fontSize: 18, ...iconStyle }} />}
          aria-label="Thông báo"
        />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;
