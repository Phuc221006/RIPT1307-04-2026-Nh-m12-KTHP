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
  Popover, // <-- Thêm Popover
  List, // <-- Thêm List
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
  InboxOutlined,
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
const { Dragger } = Upload;

const TRUONG = [
  { id: "UNI_PTIT", name: "Học viện Công nghệ Bưu chính Viễn thông" },
  { id: "UNI_GTVT", name: "Đại học Giao thông Vận tải" },
  { id: "UNI_KT", name: "Đại học Kiến Trúc" },
  { id: "UNI_XD", name: "Đại học Xây dựng" },
  { id: "UNI_QGHN", name: "Đại học Quốc gia Hà Nội" },
  { id: "UNI_NEU", name: "Đại học Kinh tế Quốc dân" },
  { id: "UNI_FTU", name: "Đại học Ngoại thương" },
  { id: "UNI_YHN", name: "Đại học Y Hà Nội" },
  { id: "UNI_BKHCM", name: "Đại học Bách Khoa TP.HCM" },
  { id: "UNI_BKHN", name: "Đại học Bách Khoa Hà Nội" },
];

const NGANH = [
  { id: "MAJ_IT", name: "Công nghệ thông tin" },
  { id: "MAJ_SE", name: "Kỹ thuật phần mềm" },
  { id: "MAJ_CS", name: "Khoa học máy tính" },
  { id: "MAJ_IS", name: "An toàn thông tin" },
  { id: "MAJ_BA", name: "Quản trị kinh doanh" },
  { id: "MAJ_MKT", name: "Marketing" },
];

const TO_HOP = [
  { id: "A00", name: "A00 (Toán, Lý, Hóa)" },
  { id: "A01", name: "A01 (Toán, Lý, Anh)" },
  { id: "B00", name: "B00 (Toán, Hóa, Sinh)" },
  { id: "D01", name: "D01 (Toán, Văn, Anh)" },
];

const LOAI_GIAY_TO = [
  { id: "CCCD", name: "Căn cước công dân" },
  { id: "HOC_BA", name: "Học bạ THPT" },
  { id: "GIAY_UU_TIEN", name: "Giấy tờ ưu tiên" },
  { id: "OTHER", name: "Khác" },
];

const DOI_TUONG = [
  { id: "NONE", name: "Không có ưu tiên" },
  { id: "KV1", name: "Ưu tiên 1 (Khu vực 1)" },
  { id: "KV2", name: "Ưu tiên 2 (Khu vực 2)" },
];

const STATUS: Record<string, { color: string; icon: any; label: string }> = {
  pending: {
    color: "warning",
    icon: <ClockCircleOutlined />,
    label: "Chờ duyệt",
  },
  PENDING: {
    color: "warning",
    icon: <ClockCircleOutlined />,
    label: "Chờ duyệt",
  },
  approved: {
    color: "success",
    icon: <CheckCircleOutlined />,
    label: "Đã duyệt",
  },
  APPROVED: {
    color: "success",
    icon: <CheckCircleOutlined />,
    label: "Đã duyệt",
  },
  rejected: { color: "error", icon: <CloseCircleOutlined />, label: "Từ chối" },
  REJECTED: { color: "error", icon: <CloseCircleOutlined />, label: "Từ chối" },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
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
      else setApps([]);
    } catch {
      setApps([]);
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
        setUploadedFiles((prev) => [
          ...prev,
          {
            originalName: res.data.originalName,
            fileUrl: res.data.fileUrl,
            mimeType: file.type,
            fileSize: file.size,
            fileType: "OTHER",
          },
        ]);
        message.success(`Tải lên "${file.name}" thành công!`);
      } else {
        message.error(res.message || "Tải file thất bại.");
      }
    } catch {
      message.error("Lỗi kết nối.");
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    if (uploadedFiles.length === 0) {
      message.warning("Vui lòng tải lên ít nhất 1 minh chứng!");
      return;
    }
    setSubmitLoading(true);
    try {
      const totalScore =
        parseFloat(values.score1 || 0) +
        parseFloat(values.score2 || 0) +
        parseFloat(values.score3 || 0);

      const res = await submitApplication({
        universityId: values.university,
        majorId: values.major,
        combinationId: values.combination,
        roundId: values.priority,
        scoreSubject1: parseFloat(values.score1),
        scoreSubject2: parseFloat(values.score2),
        scoreSubject3: parseFloat(values.score3),
        totalScore: totalScore,
        priorityObject: values.priorityType || "Không có ưu tiên",
        priorityScore: 0,
        files: uploadedFiles,
      });

      if (res.status === "success") {
        message.success("Nộp hồ sơ thành công!");
        form.resetFields();
        setUploadedFiles([]);
        fetchApps();
        setTab("history");
      } else {
        message.error(res.message || "Nộp hồ sơ thất bại.");
      }
    } catch {
      message.error("Lỗi kết nối.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileTypeChange = (index: number, newType: string) => {
    setUploadedFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles[index].fileType = newType;
      return updatedFiles;
    });
  };

  const approved = apps.filter(
    (a) => a.status === "approved" || a.status === "APPROVED",
  ).length;
  const pending = apps.filter(
    (a) => a.status === "pending" || a.status === "PENDING",
  ).length;
  const rejected = apps.filter(
    (a) => a.status === "rejected" || a.status === "REJECTED",
  ).length;

  const columns = [
    {
      title: "STT",
      width: 60,
      render: (_: any, __: any, i: number) => (
        <span className={styles.muted}>{i + 1}</span>
      ),
    },
    {
      title: "Trường",
      dataIndex: "university_id",
      render: (v: string) => (
        <span style={{ color: "#fff" }}>{v || "---"}</span>
      ),
    },
    {
      title: "Ngành đăng ký",
      dataIndex: "major_id",
      render: (v: string) => <strong style={{ color: "#fff" }}>{v}</strong>,
    },
    {
      title: "Ngày nộp",
      dataIndex: "createdAt",
      render: (v: string) => (
        <span className={styles.muted}>
          {v ? new Date(v).toLocaleDateString("vi-VN") : "---"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) => {
        const c = STATUS[s] || STATUS.PENDING;
        return (
          <Tag icon={c.icon} color={c.color}>
            {c.label}
          </Tag>
        );
      },
    },
    {
      title: "Hồ sơ",
      dataIndex: "application_files",
      render: (_: any, record: any) => {
        const files = record.application_files || record.applicationFiles;
        return files && files.length > 0 ? (
          <a
            href={`http://localhost:5000${files[0].file_url || files[0].fileUrl}`}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Xem ↗
          </a>
        ) : (
          <span className={styles.muted}>—</span>
        );
      },
    },
  ];

  // ==========================================
  // KHỐI GIAO DIỆN THÔNG BÁO (NOTIFICATION)
  // ==========================================
  const notificationContent = (
    <div style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
      {apps.length === 0 ? (
        <Empty
          description="Bạn chưa có thông báo nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={apps}
          renderItem={(app) => {
            let statusText = "";
            let color = "";
            if (app.status === "APPROVED" || app.status === "approved") {
              statusText = "đã được duyệt thành công";
              color = "#4ade80"; // Xanh lá
            } else if (app.status === "REJECTED" || app.status === "rejected") {
              statusText = "đã bị từ chối";
              color = "#f87171"; // Đỏ
            } else {
              statusText = "đang trong quá trình chờ duyệt";
              color = "#fbbf24"; // Vàng
            }

            return (
              <List.Item
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <BellOutlined
                      style={{ color, fontSize: 18, marginTop: 4 }}
                    />
                  }
                  title={
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1f2937",
                      }}
                    >
                      Cập nhật hồ sơ
                    </span>
                  }
                  description={
                    <span style={{ fontSize: 13, color: "#4b5563" }}>
                      Hồ sơ xét tuyển vào ngành{" "}
                      <strong>{app.major_id || app.majorId}</strong> của bạn{" "}
                      {statusText}.
                    </span>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );

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
            <div className={styles.userId}>{user.email || "---"}</div>
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
            {/* TÍCH HỢP POPOVER VÀO NÚT CHUÔNG */}
            <Popover
              placement="bottomRight"
              title={
                <span style={{ fontWeight: "bold" }}>🔔 Thông báo của bạn</span>
              }
              content={notificationContent}
              trigger="click"
            >
              <Badge
                count={apps.length}
                size="small"
                style={{ cursor: "pointer" }}
              >
                <Button icon={<BellOutlined />} className={styles.iconBtn} />
              </Badge>
            </Popover>

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
                    label: "Chờ duyệt",
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
                            <span className={styles.muted}>
                              Chưa có hồ sơ. Hãy nộp hồ sơ đầu tiên!
                            </span>
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
                <div className={styles.sectionTitle}>
                  🏫 Thông tin xét tuyển
                </div>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="university"
                      label="Trường đăng ký"
                      rules={[
                        { required: true, message: "Vui lòng chọn trường!" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn trường đại học"
                        className={styles.formSelect}
                        showSearch
                      >
                        {TRUONG.map((t) => (
                          <Option key={t.id} value={t.id}>
                            {t.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
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
                        showSearch
                      >
                        {NGANH.map((n) => (
                          <Option key={n.id} value={n.id}>
                            {n.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="combination"
                      label="Tổ hợp xét tuyển"
                      rules={[
                        { required: true, message: "Vui lòng chọn tổ hợp!" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn tổ hợp môn"
                        className={styles.formSelect}
                      >
                        {TO_HOP.map((t) => (
                          <Option key={t.id} value={t.id}>
                            {t.name}
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

                <div className={styles.sectionTitle}>📊 Thông tin điểm thi</div>
                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="score1"
                      label="Điểm môn 1"
                      rules={[{ required: true, message: "Nhập điểm!" }]}
                    >
                      <Input
                        placeholder="VD: 8.5"
                        className={styles.formInput}
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="score2"
                      label="Điểm môn 2"
                      rules={[{ required: true, message: "Nhập điểm!" }]}
                    >
                      <Input
                        placeholder="VD: 7.0"
                        className={styles.formInput}
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="score3"
                      label="Điểm môn 3"
                      rules={[{ required: true, message: "Nhập điểm!" }]}
                    >
                      <Input
                        placeholder="VD: 9.0"
                        className={styles.formInput}
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="priorityType" label="Đối tượng ưu tiên">
                      <Select
                        placeholder="Chọn đối tượng ưu tiên"
                        className={styles.formSelect}
                      >
                        {DOI_TUONG.map((d) => (
                          <Option key={d.id} value={d.id}>
                            {d.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="gpa" label="Điểm học bạ THPT (GPA)">
                      <Input
                        placeholder="VD: 8.5"
                        className={styles.formInput}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="note" label="Ghi chú thêm">
                  <Input.TextArea
                    rows={2}
                    placeholder="Thông tin bổ sung (nếu có)..."
                    className={styles.formInput}
                  />
                </Form.Item>

                <div className={styles.sectionTitle}>📎 Tải lên minh chứng</div>
                <p className={styles.uploadHint}>
                  Chấp nhận: PDF, JPEG, PNG — Ảnh chụp học bạ, CCCD, chứng
                  chỉ...
                </p>

                <Form.Item>
                  <Dragger
                    accept=".pdf,.jpg,.jpeg,.png"
                    beforeUpload={handleUpload}
                    showUploadList={false}
                    multiple
                    className={styles.dragger}
                    disabled={uploadLoading}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined
                        style={{ color: "#667eea", fontSize: 40 }}
                      />
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                      Kéo thả file vào đây hoặc{" "}
                      <span style={{ color: "#a78bfa" }}>click để chọn</span>
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                      PDF, JPEG, PNG — Học bạ, CCCD, minh chứng ưu tiên
                    </p>
                  </Dragger>
                </Form.Item>

                {uploadedFiles.length > 0 && (
                  <div className={styles.fileList}>
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className={styles.fileItem}>
                        <CheckCircleOutlined style={{ color: "#4ade80" }} />

                        {/* 1. Tên file gốc */}
                        <span
                          style={{
                            flex: 1,
                            color: "rgba(255,255,255,0.7)",
                            fontSize: 13,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            paddingRight: "8px",
                          }}
                          title={f.originalName}
                        >
                          {f.originalName}
                        </span>

                        {/* 2. Dropdown phân loại giấy tờ */}
                        <Select
                          value={f.fileType}
                          onChange={(val) => handleFileTypeChange(i, val)}
                          size="small"
                          style={{ width: 160 }}
                          className={styles.formSelect}
                        >
                          {LOAI_GIAY_TO.map((type) => (
                            <Option key={type.id} value={type.id}>
                              {type.name}
                            </Option>
                          ))}
                        </Select>

                        {/* 3. Nút Xem file */}
                        <a
                          href={`http://localhost:5000${f.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          Xem
                        </a>

                        {/* 4. Nút Xóa file */}
                        <span
                          className={styles.removeFile}
                          onClick={() =>
                            setUploadedFiles((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                        >
                          ✕
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  className={styles.submitBtn}
                  block
                >
                  {submitLoading ? "Đang gửi hồ sơ..." : "📤 Gửi hồ sơ đăng ký"}
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
                          <span className={styles.muted}>
                            Chưa có hồ sơ nào
                          </span>
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
                  <p className={styles.profileId}>{user.email || "---"}</p>
                  {user.role === "ADMIN" ? (
                    <Tag color="red">Quản trị viên</Tag>
                  ) : (
                    <Tag color="purple">Thí sinh</Tag>
                  )}
                </div>
              </div>
              <Divider className={styles.divider} />
              <Row gutter={[20, 16]}>
                {[
                  { label: "Họ và tên", val: user.fullName || "---" },
                  { label: "Email", val: user.email || "---" },
                  { label: "SĐT", val: user.phone || "---" },
                  { label: "Ngày sinh", val: user.dateOfBirth || "---" },
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
                  { label: "Chờ duyệt", val: pending, cls: styles.yellow },
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
