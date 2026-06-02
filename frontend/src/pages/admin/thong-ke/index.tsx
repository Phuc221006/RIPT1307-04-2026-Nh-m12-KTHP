import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, Empty } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAdminStatistics } from "../../../services/api";
import AdminLayout from "../_layout";
import styles from "./index.less";

const COLORS = [
  "#667eea",
  "#4ade80",
  "#fbbf24",
  "#f87171",
  "#a78bfa",
  "#34d399",
];

export default function ThongKePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStatistics()
      .then((res) => {
        if (res.status === "success") {
          setStats(res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Thống kê tổng quan">
        <div className={styles.center}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  // 1. Đồng bộ 100% với Enum của Database (PENDING, APPROVED, REJECTED)
  // Hàm lấy số lượng an toàn chống sập web
  const getStatusCount = (statusCode: string) => {
    const item = stats?.byStatus?.find((s: any) => s.status === statusCode);
    // Hỗ trợ cả 2 chuẩn trả về: item._count.status (Prisma group) hoặc item.count (SQL raw)
    return item?._count?.status || item?.count || 0;
  };

  const pendingCount = getStatusCount("PENDING");
  const approvedCount = getStatusCount("APPROVED");
  const rejectedCount = getStatusCount("REJECTED");

  const statusData = [
    { name: "Chờ duyệt", value: pendingCount, color: "#fbbf24" },
    { name: "Đã duyệt", value: approvedCount, color: "#4ade80" },
    { name: "Từ chối", value: rejectedCount, color: "#f87171" },
  ];

  // 2. Chống lỗi undefined và hỗ trợ cả snake_case / camelCase cho mã Ngành
  const majorData =
    stats?.byMajor?.map((m: any) => {
      const mId = m.major_id || m.majorId || "Khác";
      const mName = mId.length > 15 ? mId.substring(0, 15) + "..." : mId;
      const mCount = m._count?.major_id || m._count?.majorId || m.count || 0;

      return {
        name: mName,
        "Số hồ sơ": mCount,
      };
    }) || [];

  return (
    <AdminLayout title="Thống kê tổng quan - Quản trị">
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Thống kê tổng quan - Quản trị</h1>

        <Row gutter={[20, 20]} className={styles.statsRow}>
          {[
            {
              label: "Tổng số Hồ sơ",
              val: stats?.totalApplications || 0,
              icon: <FileTextOutlined />,
              color: "#667eea",
            },
            {
              label: "Người dùng",
              val: stats?.totalUsers || 0,
              icon: <UserOutlined />,
              color: "#a78bfa",
            },
            {
              label: "Đã duyệt",
              val: approvedCount,
              icon: <CheckCircleOutlined />,
              color: "#4ade80",
            },
            {
              label: "Chờ duyệt",
              val: pendingCount,
              icon: <ClockCircleOutlined />,
              color: "#fbbf24",
            },
          ].map((s) => (
            <Col xs={24} sm={12} lg={6} key={s.label}>
              <Card className={styles.statCard}>
                <div className={styles.statIcon} style={{ color: s.color }}>
                  {s.icon}
                </div>
                <Statistic
                  title={<span className={styles.statLabel}>{s.label}</span>}
                  value={s.val}
                  valueStyle={{ fontSize: 32, fontWeight: 700, color: s.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={12}>
            <Card
              className={styles.chartCard}
              title={<span className={styles.cardTitle}>Hồ sơ theo ngành</span>}
            >
              {majorData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={majorData}
                      dataKey="Số hồ sơ"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {majorData.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Chưa có dữ liệu" />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              className={styles.chartCard}
              title={
                <span className={styles.cardTitle}>Hồ sơ theo trạng thái</span>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1535",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" name="Số hồ sơ" radius={[6, 6, 0, 0]}>
                    {statusData.map((s, i) => (
                      <Cell key={i} fill={s.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
