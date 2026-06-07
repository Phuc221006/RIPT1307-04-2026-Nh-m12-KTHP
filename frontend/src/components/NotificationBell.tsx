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
import {
  type NotificationItem,
  formatRelativeTime,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  normalizeNotification,
} from "../utils/notificationHelpers";

export type { NotificationItem };

interface NotificationBellProps {
  role: "admin" | "student";
  /** Tuỳ chỉnh style icon (VD: màu trắng trên header Admin) */
  iconStyle?: React.CSSProperties;
  /** Tuỳ chỉnh class cho nút chuông (VD: styles.iconBtn trên Dashboard) */
  className?: string;
  /** Điều hướng tới nội dung liên quan khi bấm một thông báo */
  onNotificationClick?: (item: NotificationItem) => void;
}

const NOTIFICATIONS_API =
  process.env.REACT_APP_NOTIFICATIONS_API_URL ||
  `${(process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1").replace(/\/api\/v1\/?$/, "")}/api/notifications`;

function getToken(): string | null {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );
}

const UNREAD_ITEM_BG = "#f0f5ff";
const READ_ITEM_BG = "transparent";

const NotificationBell: React.FC<NotificationBellProps> = ({
  role,
  iconStyle,
  className,
  onNotificationClick,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = useMemo(
    () => getUnreadCount(notifications),
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

      const fetched = rawList
        .map((item: Record<string, unknown>) => normalizeNotification(item))
        .filter((item: NotificationItem) => Boolean(item.id));

      setNotifications((prev) => {
        const locallyReadIds = new Set(
          prev.filter((item) => item.isRead).map((item) => item.id),
        );

        return fetched.map((item) =>
          locallyReadIds.has(item.id) ? { ...item, isRead: true } : item,
        );
      });
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
    setNotifications((prev) => markNotificationAsRead(prev, id));

    try {
      const token = getToken();
      const response = await fetch(`${NOTIFICATIONS_API}/${id}/read`, {
        method: "PUT",
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

  const markAllAsRead = useCallback(async () => {
    const hasUnread = notifications.some((item) => !item.isRead);
    if (!hasUnread) return;

    const previousNotifications = notifications;
    setMarkingAll(true);
    setNotifications((prev) => markAllNotificationsAsRead(prev));

    try {
      const token = getToken();
      const response = await fetch(`${NOTIFICATIONS_API}/read-all`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể đánh dấu tất cả đã đọc");
      }
    } catch (error) {
      console.error("[NotificationBell] markAllAsRead error:", error);
      setNotifications(previousNotifications);
      message.error("Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.");
    } finally {
      setMarkingAll(false);
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

  const handleItemClick = useCallback(
    async (item: NotificationItem) => {
      if (!item.isRead) {
        await markAsRead(item.id);
      }
      setOpen(false);
      onNotificationClick?.(item);
    },
    [markAsRead, onNotificationClick],
  );

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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {unreadCount > 0 && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {unreadCount} chưa đọc
            </Typography.Text>
          )}
          {unreadCount > 0 && (
            <Button
              type="link"
              size="small"
              loading={markingAll}
              onClick={markAllAsRead}
              style={{ padding: 0, height: "auto" }}
            >
              Đọc tất cả
            </Button>
          )}
        </div>
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
                  data-testid={`notification-item-${item.id}`}
                  data-is-read={String(item.isRead)}
                  onClick={() => handleItemClick(item)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 8px",
                    borderRadius: 8,
                    marginBottom: 4,
                    backgroundColor: isUnread ? UNREAD_ITEM_BG : READ_ITEM_BG,
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
                          {formatRelativeTime(item.time)}
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
      <Badge
        count={unreadCount}
        size="small"
        offset={[-2, 2]}
        data-testid="notification-badge"
      >
        <Button
          type="text"
          className={className}
          icon={<BellOutlined style={{ fontSize: 18, ...iconStyle }} />}
          aria-label="Thông báo"
          data-testid="notification-bell-button"
        />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;

/* --- Unit tests (chỉ chạy khi vitest, không bundle vào production) --- */
if (import.meta.vitest) {
  const { afterEach, beforeEach, describe, expect, it, vi } = import.meta.vitest;

  const mockNotifications: NotificationItem[] = [
    {
      id: "n1",
      title: "Hồ sơ đã được duyệt",
      description: "Hồ sơ của bạn đã qua vòng xét duyệt.",
      time: new Date().toISOString(),
      isRead: false,
    },
    {
      id: "n2",
      title: "Cập nhật lịch thi",
      description: "Lịch thi đã được cập nhật trên hệ thống.",
      time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "n3",
      title: "Thông báo cũ",
      description: "Thông báo đã đọc trước đó.",
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ];

  function createFetchMock(
    notifications: NotificationItem[] = mockNotifications,
  ) {
    return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.includes("/api/notifications") && !url.includes("/read")) {
        return {
          ok: true,
          json: async () => ({ data: notifications }),
        } as Response;
      }

      if (url.includes("/read") && init?.method === "PUT") {
        return {
          ok: true,
          json: async () => ({ status: "success" }),
        } as Response;
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response;
    });
  }

  describe("NotificationBell", () => {
    let render: typeof import("@testing-library/react").render;
    let screen: typeof import("@testing-library/react").screen;
    let waitFor: typeof import("@testing-library/react").waitFor;
    let within: typeof import("@testing-library/react").within;
    let cleanup: typeof import("@testing-library/react").cleanup;
    let userEvent: typeof import("@testing-library/user-event").default;

    beforeEach(async () => {
      const testingLibrary = await import("@testing-library/react");
      render = testingLibrary.render;
      screen = testingLibrary.screen;
      waitFor = testingLibrary.waitFor;
      within = testingLibrary.within;
      cleanup = testingLibrary.cleanup;
      userEvent = (await import("@testing-library/user-event")).default;
      vi.stubGlobal("fetch", createFetchMock());
    });

    afterEach(() => {
      cleanup();
      vi.unstubAllGlobals();
      vi.clearAllMocks();
    });

    async function openNotificationPopover(
      user: ReturnType<typeof userEvent.setup>,
    ) {
      await user.click(screen.getByTestId("notification-bell-button"));
      await waitFor(() => {
        expect(screen.getByText("Thông báo")).toBeInTheDocument();
      });
    }

    function expectItemReadState(id: string, isRead: boolean) {
      expect(screen.getByTestId(`notification-item-${id}`)).toHaveAttribute(
        "data-is-read",
        String(isRead),
      );
    }

    it("hiển thị Badge với số lượng thông báo chưa đọc", async () => {
      render(<NotificationBell role="student" />);

      await waitFor(() => {
        const badge = screen.getByTestId("notification-badge");
        expect(within(badge).getByText("2")).toBeInTheDocument();
      });
    });

    it("mở Popover và hiển thị danh sách thông báo khi click chuông", async () => {
      const user = userEvent.setup();
      render(<NotificationBell role="student" />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
      });

      await openNotificationPopover(user);

      expect(screen.getByText("Hồ sơ đã được duyệt")).toBeInTheDocument();
      expect(screen.getByText("Cập nhật lịch thi")).toBeInTheDocument();
      expect(screen.getByText("Thông báo cũ")).toBeInTheDocument();
      expect(screen.getByText("2 chưa đọc")).toBeInTheDocument();
    });

    it("đổi nền item từ xanh nhạt sang trong suốt khi click đánh dấu đã đọc", async () => {
      const user = userEvent.setup();
      render(<NotificationBell role="student" />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
      });

      await openNotificationPopover(user);
      expectItemReadState("n1", false);

      await user.click(screen.getByTestId("notification-item-n1"));

      await waitFor(() => {
        expectItemReadState("n1", true);
      });

      await waitFor(() => {
        const badge = screen.getByTestId("notification-badge");
        expect(within(badge).getByText("1")).toBeInTheDocument();
      });
    });

    it("gọi API PUT đánh dấu đã đọc khi click một item", async () => {
      const user = userEvent.setup();
      const fetchMock = createFetchMock();
      vi.stubGlobal("fetch", fetchMock);

      render(<NotificationBell role="student" />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
      });

      await openNotificationPopover(user);
      await user.click(screen.getByTestId("notification-item-n1"));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining("/api/notifications/n1/read"),
          expect.objectContaining({ method: "PUT" }),
        );
      });
    });

    it("không gọi API khi click item đã đọc", async () => {
      const user = userEvent.setup();
      const fetchMock = createFetchMock();
      vi.stubGlobal("fetch", fetchMock);

      render(<NotificationBell role="student" />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
      });

      await openNotificationPopover(user);

      const readCallsBefore = fetchMock.mock.calls.filter(([url]) =>
        String(url).includes("/read"),
      ).length;

      await user.click(screen.getByTestId("notification-item-n3"));

      const readCallsAfter = fetchMock.mock.calls.filter(([url]) =>
        String(url).includes("/read"),
      ).length;

      expect(readCallsAfter).toBe(readCallsBefore);
      expectItemReadState("n3", true);
    });

    it('đánh dấu tất cả đã đọc khi click nút "Đọc tất cả"', async () => {
      const user = userEvent.setup();
      const fetchMock = createFetchMock();
      vi.stubGlobal("fetch", fetchMock);

      render(<NotificationBell role="student" />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
      });

      await openNotificationPopover(user);
      await user.click(screen.getByRole("button", { name: "Đọc tất cả" }));

      await waitFor(() => {
        expectItemReadState("n1", true);
        expectItemReadState("n2", true);
      });

      await waitFor(() => {
        const badge = screen.getByTestId("notification-badge");
        expect(within(badge).queryByText("2")).not.toBeInTheDocument();
        expect(within(badge).queryByText("1")).not.toBeInTheDocument();
      });

      expect(
        screen.queryByRole("button", { name: "Đọc tất cả" }),
      ).not.toBeInTheDocument();

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining("/api/notifications/read-all"),
          expect.objectContaining({ method: "PUT" }),
        );
      });
    });

    it("hiển thị Empty khi không có thông báo", async () => {
      const user = userEvent.setup();
      vi.stubGlobal("fetch", createFetchMock([]));

      render(<NotificationBell role="admin" />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
      });

      await openNotificationPopover(user);

      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Đọc tất cả" }),
      ).not.toBeInTheDocument();
    });

    it("gửi role đúng khi fetch danh sách thông báo", async () => {
      const fetchMock = createFetchMock();
      vi.stubGlobal("fetch", fetchMock);

      render(<NotificationBell role="admin" />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining("role=admin"),
          expect.any(Object),
        );
      });
    });
  });
}
