import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Table,
  Tag,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Statistic,
  Row,
  Col,
  Avatar,
  Badge,
  Divider,
  Empty,
  Spin,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  UploadOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  BellOutlined,
  HomeOutlined,
  PlusOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  submitApplication,
  getMyApplications,
  uploadDocument,
  removeToken,
} from "../../services/api";
import styles from "./index.less";
const { Sider, Content, Header } = Layout;
const { Option } = Select;

const MAJORS = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Khoa học máy tính",
  "An toàn thông tin",
  "Hệ thống thông tin",
  "Trí tuệ nhân tạo",
  "Kỹ thuật điện tử",
  "Quản trị kinh doanh",
  "Kế toán",
  "Marketing",
];

const STATUS: Record<string, { color: string; icon: any; label: string }> = {
  pending: {
    color: "warning",
    icon: <ClockCircleOutlined />,
    label: "Đang xử lý",
  },
  approved: {
    color: "success",
    icon: <CheckCircleOutlined />,
    label: "Đã duyệt",
  },
  rejected: { color: "error", icon: <CloseCircleOutlined />, label: "Từ chối" },
};

const MOCK_DATA = [
  {
    id: 1,
    major: "Công nghệ thông tin",
    createdAt: "2024-03-15",
    status: "approved",
    documentUrl: "",
  },
  {
    id: 2,
    major: "Kỹ thuật phần mềm",
    createdAt: "2024-03-20",
    status: "pending",
    documentUrl: "",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = Form.useForm();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await getMyApplications();
      if (res.status === "success") setApps(res.data || []);
      else setApps(MOCK_DATA);
    } catch {
      setApps(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const res = await uploadDocument(file);
      if (res.status === "success") {
        setUploadedFile(res.data);
        message.success("Tải file lên thành công!");
      } else message.error(res.message || "Tải file thất bại.");
    } catch {
      message.error("Lỗi kết nối.");
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    if (!uploadedFile) {
      message.warning("Vui lòng tải lên hồ sơ!");
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await submitApplication({
        ...values,
        documentUrl: uploadedFile.fileUrl,
      });
      if (res.status === "success") {
        message.success("Nộp hồ sơ thành công!");
        form.resetFields();
        setUploadedFile(null);
        fetchApps();
        setTab("history");
      } else message.error(res.message || "Nộp hồ sơ thất bại.");
    } catch {
      message.error("Lỗi kết nối.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const approved = apps.filter((a) => a.status === "approved").length;
  const pending = apps.filter((a) => a.status === "pending").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;

  const columns = [
    {
      title: "STT",
      width: 60,
      render: (_: any, __: any, i: number) => (
        <span className={styles.muted}>{i + 1}</span>
      ),
    },
    {
      title: "Ngành đăng ký",
      dataIndex: "major",
      render: (v: string) => <strong style={{ color: "#fff" }}>{v}</strong>,
    },
    {
      title: "Ngày nộp",
      dataIndex: "createdAt",
      render: (v: string) => (
        <span className={styles.muted}>
          {new Date(v).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) => {
        const c = STATUS[s] || STATUS.pending;
        return (
          <Tag icon={c.icon} color={c.color}>
            {c.label}
          </Tag>
        );
      },
    },
    {
      title: "Hồ sơ",
      dataIndex: "documentUrl",
      render: (url: string) =>
        url ? (
          <a
            href={`http://localhost:5000${url}`}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Xem ↗
          </a>
        ) : (
          <span className={styles.muted}>—</span>
        ),
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider width={240} className={styles.sider}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#dg)" />
              <path
                d="M10 26L18 10L26 26"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 20.5H23"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="dg"
                  x1="0"
                  y1="0"
                  x2="36"
                  y2="36"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#667eea" />
                  <stop offset="1" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className={styles.brandName}>Tuyển Sinh</div>
            <div className={styles.brandSub}>Cổng thông tin</div>
          </div>
        </div>

        <Divider className={styles.divider} />

        <div className={styles.userInfo}>
          <Avatar size={40} icon={<UserOutlined />} className={styles.avatar} />
          <div>
            <div className={styles.userName}>
              {user.fullName || "Sinh viên"}
            </div>
            <div className={styles.userId}>MSSV: {user.studentId || "---"}</div>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[tab]}
          onClick={({ key }) => setTab(key)}
          className={styles.menu}
          items={[
            { key: "overview", icon: <HomeOutlined />, label: "Tổng quan" },
            { key: "apply", icon: <PlusOutlined />, label: "Nộp hồ sơ" },
            {
              key: "history",
              icon: <FileTextOutlined />,
              label: "Lịch sử nộp",
            },
            { key: "profile", icon: <UserOutlined />, label: "Hồ sơ cá nhân" },
          ]}
        />

        <div className={styles.logout}>
          <Button
            icon={<LogoutOutlined />}
            block
            className={styles.logoutBtn}
            onClick={() => {
              removeToken();
              navigate("/login");
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <span className={styles.pageTitle}>
            {
              {
                overview: "Tổng quan",
                apply: "Nộp hồ sơ xét tuyển",
                history: "Lịch sử nộp hồ sơ",
                profile: "Hồ sơ cá nhân",
              }[tab]
            }
          </span>
          <div className={styles.headerRight}>
            <Badge count={pending} size="small">
              <Button icon={<BellOutlined />} className={styles.iconBtn} />
            </Badge>
            <Avatar icon={<UserOutlined />} className={styles.avatar} />
          </div>
        </Header>

        <Content className={styles.content}>
          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              <div className={styles.banner}>
                <div>
                  <h2 className={styles.bannerTitle}>
                    Xin chào, {user.fullName || "bạn"}! 👋
                  </h2>
                  <p className={styles.bannerSub}>
                    Theo dõi tình trạng hồ sơ xét tuyển của bạn tại đây.
                  </p>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.bannerBtn}
                  onClick={() => setTab("apply")}
                >
                  Nộp hồ sơ mới
                </Button>
              </div>

              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                {[
                  {
                    label: "Tổng hồ sơ",
                    val: apps.length,
                    icon: <FileDoneOutlined />,
                    color: "#fff",
                  },
                  {
                    label: "Đã duyệt",
                    val: approved,
                    icon: <CheckCircleOutlined />,
                    color: "#4ade80",
                  },
                  {
                    label: "Đang xử lý",
                    val: pending,
                    icon: <ClockCircleOutlined />,
                    color: "#fbbf24",
                  },
                  {
                    label: "Từ chối",
                    val: rejected,
                    icon: <CloseCircleOutlined />,
                    color: "#f87171",
                  },
                ].map((s) => (
                  <Col xs={24} sm={12} lg={6} key={s.label}>
                    <Card className={styles.statCard}>
                      <div className={styles.statIconWrap}>{s.icon}</div>
                      <Statistic
                        title={s.label}
                        value={s.val}
                        valueStyle={{
                          color: s.color,
                          fontSize: 30,
                          fontWeight: 700,
                        }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card
                className={styles.card}
                title={<span className={styles.cardTitle}>Hồ sơ gần đây</span>}
              >
                {loading ? (
                  <div className={styles.center}>
                    <Spin />
                  </div>
                ) : (
                  <Table
                    dataSource={apps.slice(0, 3)}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                    className={styles.table}
                    locale={{
                      emptyText: (
                        <Empty
                          description={
                            <span className={styles.muted}>Chưa có hồ sơ</span>
                          }
                        />
                      ),
                    }}
                  />
                )}
              </Card>
            </>
          )}

          {/* APPLY */}
          {tab === "apply" && (
            <Card
              className={styles.card}
              title={
                <span className={styles.cardTitle}>📋 Nộp hồ sơ xét tuyển</span>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.applyForm}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="major"
                      label="Ngành đăng ký"
                      rules={[
                        { required: true, message: "Vui lòng chọn ngành!" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn ngành học"
                        className={styles.formSelect}
                      >
                        {MAJORS.map((m) => (
                          <Option key={m} value={m}>
                            {m}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="priority"
                      label="Nguyện vọng"
                      rules={[{ required: true, message: "Vui lòng chọn!" }]}
                    >
                      <Select
                        placeholder="Chọn nguyện vọng"
                        className={styles.formSelect}
                      >
                        <Option value="1">Nguyện vọng 1</Option>
                        <Option value="2">Nguyện vọng 2</Option>
                        <Option value="3">Nguyện vọng 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="gpa" label="Điểm trung bình (GPA)">
                  <Input placeholder="VD: 8.5" className={styles.formInput} />
                </Form.Item>
                <Form.Item name="note" label="Ghi chú thêm">
                  <Input.TextArea
                    rows={3}
                    placeholder="Thông tin bổ sung (nếu có)..."
                    className={styles.formInput}
                  />
                </Form.Item>
                <Form.Item label="Tải lên hồ sơ (PDF/DOC)" required>
                  <Upload
                    accept=".pdf,.doc,.docx"
                    beforeUpload={handleUpload}
                    showUploadList={false}
                    maxCount={1}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className={styles.uploadBtn}
                      loading={uploadLoading}
                    >
                      {uploadedFile
                        ? `✓ ${uploadedFile.originalName}`
                        : "Chọn file hồ sơ"}
                    </Button>
                  </Upload>
                  {uploadedFile && (
                    <div className={styles.uploadedInfo}>
                      <CheckCircleOutlined style={{ color: "#4ade80" }} />
                      <span>
                        Đã tải: <strong>{uploadedFile.originalName}</strong>
                      </span>
                    </div>
                  )}
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  className={styles.submitBtn}
                  block
                >
                  {submitLoading ? "Đang nộp..." : "Nộp hồ sơ xét tuyển"}
                </Button>
              </Form>
            </Card>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <Card
              className={styles.card}
              title={
                <span className={styles.cardTitle}>📁 Lịch sử nộp hồ sơ</span>
              }
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.addBtn}
                  onClick={() => setTab("apply")}
                >
                  Nộp thêm
                </Button>
              }
            >
              {loading ? (
                <div className={styles.center}>
                  <Spin />
                </div>
              ) : (
                <Table
                  dataSource={apps}
                  columns={columns}
                  rowKey="id"
                  className={styles.table}
                  pagination={{
                    pageSize: 8,
                    showTotal: (t) => `Tổng ${t} hồ sơ`,
                  }}
                  locale={{
                    emptyText: (
                      <Empty
                        description={
                          <span className={styles.muted}>Chưa có hồ sơ</span>
                        }
                      />
                    ),
                  }}
                />
              )}
            </Card>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <Card
              className={styles.card}
              title={<span className={styles.cardTitle}>👤 Hồ sơ cá nhân</span>}
            >
              <div className={styles.profileTop}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  className={styles.profileAvatar}
                />
                <div>
                  <h2 className={styles.profileName}>
                    {user.fullName || "Sinh viên"}
                  </h2>
                  <p className={styles.profileId}>
                    MSSV: {user.studentId || "---"}
                  </p>
                  <Tag color="purple">Thí sinh</Tag>
                </div>
              </div>
              <Divider className={styles.divider} />
              <Row gutter={[20, 16]}>
                {[
                  { label: "Họ và tên", val: user.fullName || "---" },
                  { label: "Email", val: user.email || "---" },
                  { label: "MSSV", val: user.studentId || "---" },
                  { label: "SĐT", val: user.phone || "---" },
                ].map((f) => (
                  <Col xs={24} md={12} key={f.label}>
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>{f.label}</span>
                      <span className={styles.fieldVal}>{f.val}</span>
                    </div>
                  </Col>
                ))}
              </Row>
              <Divider className={styles.divider} />
              <Row gutter={[16, 16]}>
                {[
                  { label: "Tổng hồ sơ", val: apps.length, cls: "" },
                  { label: "Đã duyệt", val: approved, cls: styles.green },
                  { label: "Đang xử lý", val: pending, cls: styles.yellow },
                  { label: "Từ chối", val: rejected, cls: styles.red },
                ].map((s) => (
                  <Col xs={12} md={6} key={s.label}>
                    <div className={styles.pStat}>
                      <span className={`${styles.pNum} ${s.cls}`}>{s.val}</span>
                      <span className={styles.pLabel}>{s.label}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
