<<<<<<< HEAD
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
  Popover,
  List,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
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
  getUniversities,
  getMajors,
  getCombinations,
  getDashboardStats,
} from "../../services/api";
import styles from "./index.less";
=======
import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Card, Table, Tag, Button, Form, Input,
  Select, Upload, message, Statistic, Row, Col, Avatar, Badge, Divider, Empty, Spin, Steps,
} from 'antd';
import {
  UserOutlined, FileTextOutlined, UploadOutlined, LogoutOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  BellOutlined, HomeOutlined, PlusOutlined, FileDoneOutlined,
  InboxOutlined, ArrowRightOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// Các hàm này backend sẽ viết thực tế ở file services/api
import { submitApplication, getMyApplications, uploadDocument, removeToken } from '../../services/api';
import styles from './index.less';
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9

const { Sider, Content, Header } = Layout;
const { Option } = Select;
const { Dragger } = Upload;
<<<<<<< HEAD

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

  const [stats, setStats] = useState<any>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [universities, setUniversities] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);

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

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.status === "success") setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEducationData = async () => {
    try {
      const [resUni, resMajor, resCombo] = await Promise.all([
        getUniversities(),
        getMajors(),
        getCombinations(),
      ]);
      setUniversities(Array.isArray(resUni) ? resUni : resUni?.data || []);
      setMajors(Array.isArray(resMajor) ? resMajor : resMajor?.data || []);
      setCombinations(
        Array.isArray(resCombo) ? resCombo : resCombo?.data || [],
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApps();
    fetchStats();
    fetchEducationData();
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
        priorityObject: values.priorityType || "NONE",
        priorityScore: 0,
        files: uploadedFiles,
      });

      if (res.status === "success") {
        message.success("Nộp hồ sơ thành công!");
        form.resetFields();
        setUploadedFiles([]);
        fetchApps();
        fetchStats();
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
=======

const STATUS: Record<string, { color: string; icon: any; label: string }> = {
  pending:  { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  PENDING:  { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  rejected: { color: 'error',   icon: <CloseCircleOutlined />, label: 'Từ chối' },
  REJECTED: { color: 'error',   icon: <CloseCircleOutlined />, label: 'Từ chối' },
};

const formatDisplayDate = (value?: string) => {
  if (!value) return '---';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('vi-VN');
};

// =====================================================================
// PHẦN 1: GIAO DIỆN THUẦN (UI COMPONENT)
// Frontend (Bạn) chỉ làm việc ở nửa này, tự do chỉnh sửa UI/CSS
// =====================================================================

interface DashboardUIProps {
  user: any;
  tab: string;
  setTab: (val: string) => void;
  apps: any[];
  loading: boolean;
  submitLoading: boolean;
  uploadLoading: boolean;
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
  form: any;
  currentStep: number;
  setCurrentStep: (val: number) => void;
  universities: any[];
  majors: any[];
  combinations: any[];
  priorities: any[];
  handleUpload: (file: File) => Promise<boolean>;
  handleSubmit: (values: any) => void;
  handleLogout: () => void;
}
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9

const DashboardUI: React.FC<DashboardUIProps> = ({
  user, tab, setTab, apps, loading, submitLoading, uploadLoading,
  uploadedFiles, setUploadedFiles, form, currentStep, setCurrentStep,
  universities, majors, combinations, priorities, handleUpload, handleSubmit, handleLogout
}) => {
  const columns = [
<<<<<<< HEAD
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
      render: (v: string) => {
        const item = universities.find((u) => u.id === v || u.code === v);
        return (
          <span style={{ color: "#fff" }}>{item ? item.name : v || "---"}</span>
        );
      },
    },
    {
      title: "Ngành đăng ký",
      dataIndex: "major_id",
      render: (v: string) => {
        const item = majors.find((m) => m.id === v || m.code === v);
        return (
          <strong style={{ color: "#fff" }}>{item ? item.name : v}</strong>
        );
      },
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
=======
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => <span>{i + 1}</span> },
    { title: 'Trường', dataIndex: 'universityId', render: (v: string) => <span>{v || '---'}</span> },
    { title: 'Ngành đăng ký', dataIndex: 'majorId', render: (v: string) => <strong>{v}</strong> },
    {
      title: 'Ngày nộp', dataIndex: 'createdAt',
      render: (v: string) => <span>{new Date(v).toLocaleDateString('vi-VN')}</span>,
    },
    {
      title: 'Trạng thái', dataIndex: 'status',
      render: (s: string) => {
        const c = STATUS[s] || STATUS.PENDING;
        return <Tag icon={c.icon} color={c.color}>{c.label}</Tag>;
      },
    },
    {
      title: 'Hồ sơ', dataIndex: 'applicationFiles',
      render: (files: any[]) => files && files.length > 0
        ? <a href={`http://localhost:3000${files[0].fileUrl}`} target="_blank" rel="noreferrer">Xem ↗</a>
        : <span>—</span>,
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
    },
  ];

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
              color = "#4ade80";
            } else if (app.status === "REJECTED" || app.status === "rejected") {
              statusText = "đã bị từ chối";
              color = "#f87171";
            } else {
              statusText = "đang trong quá trình chờ duyệt";
              color = "#fbbf24";
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
    <Layout>
      <Sider width={240}>
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
                strokeLinejoin="round"
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
<<<<<<< HEAD
            <div className={styles.userName}>
              {user.fullName || "Sinh viên"}
            </div>
            <div className={styles.userId}>{user.email || "---"}</div>
=======
            <div className={styles.userName}>{user.fullName || 'Sinh viên'}</div>
            <div className={styles.userId}>{user.email || '---'}</div>
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
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
<<<<<<< HEAD
          <Button
            icon={<LogoutOutlined />}
            block
            className={styles.logoutBtn}
            onClick={() => {
              removeToken();
              navigate("/login");
            }}
          >
=======
          <Button icon={<LogoutOutlined />} block className={styles.logoutBtn} onClick={handleLogout}>
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
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
<<<<<<< HEAD
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
=======
            <Badge count={apps.filter(a => a.status === 'pending' || a.status === 'PENDING').length} size="small">
              <Button icon={<BellOutlined />} className={styles.iconBtn} />
            </Badge>
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
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
<<<<<<< HEAD
                  {
                    label: "Tổng hồ sơ",
                    val: stats.totalApplications || 0,
                    icon: <FileDoneOutlined />,
                    color: "#fff",
                  },
                  {
                    label: "Đã duyệt",
                    val: stats.approvedApplications || 0,
                    icon: <CheckCircleOutlined />,
                    color: "#4ade80",
                  },
                  {
                    label: "Chờ duyệt",
                    val: stats.pendingApplications || 0,
                    icon: <ClockCircleOutlined />,
                    color: "#fbbf24",
                  },
                  {
                    label: "Từ chối",
                    val: stats.rejectedApplications || 0,
                    icon: <CloseCircleOutlined />,
                    color: "#f87171",
                  },
=======
                  { label: 'Tổng hồ sơ', val: apps.length, icon: <FileDoneOutlined />, color: '#1890ff' },
                  { label: 'Đã duyệt',   val: apps.filter(a => a.status === 'approved' || a.status === 'APPROVED').length,    icon: <CheckCircleOutlined />, color: '#52c41a' },
                  { label: 'Chờ duyệt',  val: apps.filter(a => a.status === 'pending' || a.status === 'PENDING').length,      icon: <ClockCircleOutlined />, color: '#faad14' },
                  { label: 'Từ chối',    val: apps.filter(a => a.status === 'rejected' || a.status === 'REJECTED').length,    icon: <CloseCircleOutlined />, color: '#f5222d' },
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
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

<<<<<<< HEAD
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
=======
              <Card className={styles.card} title={<span>📁 Hồ sơ gần đây</span>}>
                {loading ? <div className={styles.center}><Spin /></div> : (
                  <Table dataSource={apps.slice(0, 3)} columns={columns} pagination={false} rowKey="id"
                    locale={{ emptyText: <Empty description="Chưa có hồ sơ. Hãy nộp hồ sơ đầu tiên!" /> }} />
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
                )}
              </Card>
            </>
          )}

          {/* APPLY */}
<<<<<<< HEAD
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
                        filterOption={(input, option) =>
                          ((option?.children as any) ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {universities.map((t) => (
                          <Option key={t.id} value={t.id || t.code}>
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
                        filterOption={(input, option) =>
                          ((option?.children as any) ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {majors.map((n) => (
                          <Option key={n.id} value={n.id || n.code}>
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
                        {combinations.map((t) => (
                          <Option key={t.id} value={t.id || t.code}>
                            {t.name || t.code}
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
                        <a
                          href={`http://localhost:5000${f.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          Xem
                        </a>
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
=======
          {tab === 'apply' && (
            <Card className={styles.card} title={<span>📋 Nộp hồ sơ xét tuyển</span>}>
              <Steps
                current={currentStep}
                items={[
                  { title: 'Thông tin cá nhân', description: 'Đối tượng ưu tiên' },
                  { title: 'Xét tuyển', description: 'Chọn trường, ngành, điểm' },
                  { title: 'Minh chứng & Gửi', description: 'Tải file & xác nhận' },
                ]}
                style={{ marginBottom: 32 }}
              />

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {/* STEP 1: Thông tin cá nhân & Đối tượng ưu tiên */}
                {currentStep === 0 && (
                  <div>
                    <div className={styles.sectionTitle}>👤 Thông tin cá nhân</div>
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="fullName" label="Họ và tên" initialValue={user.fullName || ''} rules={[{ required: false }]}>
                          <Input placeholder="Họ và tên" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="email" label="Email" initialValue={user.email || ''} rules={[{ required: false }]}>
                          <Input placeholder="Email" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: false }]}>
                          <Input placeholder="Ngày sinh" disabled value={formatDisplayDate(user.dateOfBirth || user.dob)} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className={styles.sectionTitle}>🎯 Đối tượng ưu tiên</div>
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="priorityType" label="Đối tượng ưu tiên">
                          <Select placeholder="Chọn đối tượng ưu tiên" showSearch>
                            {priorities.map(p => <Option key={p.id || p} value={p.code || p}>{p.name || p}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="gpa" label="Điểm học bạ THPT (GPA)">
                          <Input placeholder="VD: 8.5" type="number" min={0} max={10} step={0.1} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                      <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => setCurrentStep(1)}>
                        Tiếp tục
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Thông tin xét tuyển */}
                {currentStep === 1 && (
                  <div>
                    <div className={styles.sectionTitle}>🏫 Chọn trường đại học</div>
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="university" label="Trường đăng ký" rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}>
                          <Select placeholder="Chọn trường đại học" showSearch>
                            {universities.map(t => <Option key={t.id || t} value={t.code || t}>{t.name || t}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="major" label="Ngành đăng ký" rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}>
                          <Select placeholder="Chọn ngành học" showSearch>
                            {majors.map(n => <Option key={n.id || n} value={n.code || n}>{n.name || n}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className={styles.sectionTitle}>📊 Thông tin xét tuyển</div>
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="combination" label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}>
                          <Select placeholder="Chọn tổ hợp môn" showSearch>
                            {combinations.map(t => <Option key={t.id || t} value={t.code || t}>{t.name || t}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="priority" label="Nguyện vọng" rules={[{ required: true, message: 'Vui lòng chọn nguyện vọng!' }]}>
                          <Select placeholder="Chọn nguyện vọng">
                            <Option value="1">Nguyện vọng 1</Option>
                            <Option value="2">Nguyện vọng 2</Option>
                            <Option value="3">Nguyện vọng 3</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className={styles.sectionTitle}>📈 Điểm thi</div>
                    <Row gutter={24}>
                      <Col xs={24} md={8}>
                        <Form.Item name="score1" label="Điểm môn 1" rules={[{ required: true, message: 'Nhập điểm!' }]}>
                          <Input placeholder="VD: 8.5" type="number" min={0} max={10} step={0.1} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item name="score2" label="Điểm môn 2" rules={[{ required: true, message: 'Nhập điểm!' }]}>
                          <Input placeholder="VD: 7.0" type="number" min={0} max={10} step={0.1} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item name="score3" label="Điểm môn 3" rules={[{ required: true, message: 'Nhập điểm!' }]}>
                          <Input placeholder="VD: 9.0" type="number" min={0} max={10} step={0.1} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="note" label="Ghi chú thêm">
                      <Input.TextArea rows={2} placeholder="Thông tin bổ sung (nếu có)..." />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 24 }}>
                      <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(0)}>
                        Quay lại
                      </Button>
                      <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => setCurrentStep(2)}>
                        Tiếp tục
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Tải lên minh chứng & Xác nhận */}
                {currentStep === 2 && (
                  <div>
                    <div className={styles.sectionTitle}>📎 Tải lên minh chứng</div>
                    <p style={{ marginBottom: 16 }}>Chấp nhận: PDF, JPEG, PNG — Ảnh chụp học bạ, CCCD, chứng chỉ...</p>

                    <Form.Item>
                      <Dragger
                        accept=".pdf,.jpg,.jpeg,.png"
                        beforeUpload={handleUpload}
                        showUploadList={false}
                        multiple
                        disabled={uploadLoading}
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                        </p>
                        <p style={{ fontSize: 14 }}>
                          Kéo thả file vào đây hoặc <span style={{ color: '#1890ff', fontWeight: 500 }}>click để chọn</span>
                        </p>
                        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                          PDF, JPEG, PNG — Học bạ, CCCD, minh chứng ưu tiên
                        </p>
                      </Dragger>
                    </Form.Item>

                    {uploadedFiles.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <h4>Tệp đã tải lên:</h4>
                        {uploadedFiles.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: '#fafafa', marginBottom: 8 }}>
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                            <span style={{ flex: 1, fontSize: 13 }}>{f.originalName}</span>
                            <a href={`http://localhost:3000${f.fileUrl}`} target="_blank" rel="noreferrer">Xem</a>
                            <a onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ color: '#f5222d', cursor: 'pointer' }}>Xóa</a>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 24 }}>
                      <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(1)}>
                        Quay lại
                      </Button>
                      <Button type="primary" htmlType="submit" loading={submitLoading} icon={<UploadOutlined />}>
                        {submitLoading ? 'Đang gửi...' : '📤 Gửi hồ sơ'}
                      </Button>
                    </div>
                  </div>
                )}
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
              </Form>
            </Card>
          )}

          {/* HISTORY */}
<<<<<<< HEAD
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
=======
          {tab === 'history' && (
            <Card className={styles.card}
              title={<span>📁 Lịch sử nộp hồ sơ</span>}
              extra={<Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={() => setTab('apply')}>Nộp thêm</Button>}
            >
              {loading ? <div className={styles.center}><Spin /></div> : (
                <Table dataSource={apps} columns={columns} rowKey="id"
                  pagination={{ pageSize: 8, showTotal: t => `Tổng ${t} hồ sơ` }}
                  locale={{ emptyText: <Empty description="Chưa có hồ sơ nào" /> }}
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
                />
              )}
            </Card>
          )}

          {/* PROFILE */}
<<<<<<< HEAD
          {tab === "profile" && (
            <Card
              className={styles.card}
              title={<span className={styles.cardTitle}>👤 Hồ sơ cá nhân</span>}
            >
=======
          {tab === 'profile' && (
            <Card className={styles.card} title={<span>👤 Hồ sơ cá nhân</span>}>
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
              <div className={styles.profileTop}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  className={styles.profileAvatar}
                />
                <div>
<<<<<<< HEAD
                  <h2 className={styles.profileName}>
                    {user.fullName || "Sinh viên"}
                  </h2>
                  <p className={styles.profileId}>{user.email || "---"}</p>
                  {user.role === "ADMIN" ? (
                    <Tag color="red">Quản trị viên</Tag>
                  ) : (
                    <Tag color="purple">Thí sinh</Tag>
                  )}
=======
                  <h2 className={styles.profileName}>{user.fullName || 'Sinh viên'}</h2>
                  <p className={styles.profileId}>{user.email || '---'}</p>
                  <Tag color="blue">Thí sinh</Tag>
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
                </div>
              </div>
              <Divider className={styles.divider} />
              <Row gutter={[20, 16]}>
                {[
<<<<<<< HEAD
                  { label: "Họ và tên", val: user.fullName || "---" },
                  { label: "Email", val: user.email || "---" },
                  { label: "SĐT", val: user.phone || "---" },
                  { label: "Ngày sinh", val: user.dateOfBirth || "---" },
                ].map((f) => (
=======
                  { label: 'Họ và tên',  val: user.fullName    || '---' },
                  { label: 'Email',      val: user.email       || '---' },
                  { label: 'SĐT',        val: user.phone       || '---' },
                  { label: 'Ngày sinh',  val: formatDisplayDate(user.dateOfBirth || user.dob) },
                ].map(f => (
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
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
<<<<<<< HEAD
                  {
                    label: "Tổng hồ sơ",
                    val: stats.totalApplications || 0,
                    cls: "",
                  },
                  {
                    label: "Đã duyệt",
                    val: stats.approvedApplications || 0,
                    cls: styles.green,
                  },
                  {
                    label: "Chờ duyệt",
                    val: stats.pendingApplications || 0,
                    cls: styles.yellow,
                  },
                  {
                    label: "Từ chối",
                    val: stats.rejectedApplications || 0,
                    cls: styles.red,
                  },
                ].map((s) => (
=======
                  { label: 'Tổng hồ sơ', val: apps.length, cls: '' },
                  { label: 'Đã duyệt',   val: apps.filter(a => a.status === 'approved' || a.status === 'APPROVED').length,    cls: styles.green },
                  { label: 'Chờ duyệt',  val: apps.filter(a => a.status === 'pending' || a.status === 'PENDING').length,      cls: styles.yellow },
                  { label: 'Từ chối',    val: apps.filter(a => a.status === 'rejected' || a.status === 'REJECTED').length,    cls: styles.red },
                ].map(s => (
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
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
<<<<<<< HEAD
}
=======
};

// =====================================================================
// PHẦN 2: XỬ LÝ LOGIC (LOGIC/CONTAINER COMPONENT)
// Backend sẽ vào phần này để viết các hàm fetch, logic submit...
// =====================================================================

// Hàm gọi API lấy dữ liệu (Backend sửa link ở đây)
async function getUniversities() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/universities');
    const data = await res.json();
    return data.data || [];
  } catch {
    return ['Đại học Bách Khoa Hà Nội', 'Đại học Quốc gia Hà Nội', 'Đại học Kinh tế Quốc dân',
            'Đại học Ngoại thương', 'Đại học Y Hà Nội', 'Đại học Bách Khoa TP.HCM'];
  }
}
async function getMajors() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/majors');
    const data = await res.json();
    return data.data || [];
  } catch {
    return ['Công nghệ thông tin', 'Kỹ thuật phần mềm', 'Khoa học máy tính',
            'An toàn thông tin', 'Hệ thống thông tin'];
  }
}
async function getCombinations() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/combinations');
    const data = await res.json();
    return data.data || [];
  } catch {
    return ['A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'B00 (Toán, Hóa, Sinh)',
            'C00 (Văn, Sử, Địa)', 'D01 (Toán, Văn, Anh)', 'D07 (Toán, Hóa, Anh)'];
  }
}
async function getPriorities() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/priorities');
    const data = await res.json();
    return data.data || [];
  } catch {
    return ['Không có ưu tiên', 'Ưu tiên 1 (Khu vực 1)', 'Ưu tiên 2 (Khu vực 2)',
            'Ưu tiên 3 (Khu vực 3)', 'Đối tượng ưu tiên 1', 'Đối tượng ưu tiên 2'];
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State quản lý UI và dữ liệu
  const [tab, setTab] = useState('overview');
  const [apps, setApps] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();
  const birthDate = formatDisplayDate(user.dateOfBirth || user.dob || '');

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await getMyApplications();
      if (res.status === 'success') setApps(res.data || []);
      else setApps([]);
    } catch {
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [univs, majors_, combos, prios] = await Promise.all([
        getUniversities(),
        getMajors(),
        getCombinations(),
        getPriorities(),
      ]);
      setUniversities(univs);
      setMajors(majors_);
      setCombinations(combos);
      setPriorities(prios);
    } catch (error) {
      console.error('Lỗi khi tải metadata:', error);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      fullName: user.fullName || '',
      email: user.email || '',
      dateOfBirth: birthDate,
    });
  }, [form, user.fullName, user.email, birthDate]);

  useEffect(() => {
    fetchApps();
    fetchMetadata();
  }, []);

  const handleUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const res = await uploadDocument(file);
      if (res.status === 'success') {
        setUploadedFiles(prev => [...prev, {
          originalName: res.data.originalName,
          fileUrl: res.data.fileUrl,
          mimeType: file.type,
          fileSize: file.size,
          fileType: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
        }]);
        message.success(`Tải lên "${file.name}" thành công!`);
      } else {
        message.error(res.message || 'Tải file thất bại.');
      }
    } catch {
      message.error('Lỗi kết nối.');
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    if (uploadedFiles.length === 0) {
      message.warning('Vui lòng tải lên ít nhất 1 minh chứng!');
      return;
    }
    setSubmitLoading(true);
    try {
      const totalScore = parseFloat(values.score1 || 0) + parseFloat(values.score2 || 0) + parseFloat(values.score3 || 0);
      const res = await submitApplication({
        universityId: values.university,
        majorId: values.major,
        combinationId: values.combination,
        roundId: values.priority,
        scoreSubject1: parseFloat(values.score1),
        scoreSubject2: parseFloat(values.score2),
        scoreSubject3: parseFloat(values.score3),
        totalScore: totalScore,
        priorityObject: values.priorityType || 'Không có ưu tiên',
        priorityScore: 0,
        files: uploadedFiles,
      });

      if (res.status === 'success') {
        message.success('Nộp hồ sơ thành công!');
        form.resetFields();
        setUploadedFiles([]);
        setCurrentStep(0);
        fetchApps();
        setTab('history');
      } else {
        message.error(res.message || 'Nộp hồ sơ thất bại.');
      }
    } catch {
      message.error('Lỗi kết nối.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Render ra UI và ném hết dữ liệu vào
  return (
    <DashboardUI 
      user={user}
      tab={tab}
      setTab={setTab}
      apps={apps}
      loading={loading}
      submitLoading={submitLoading}
      uploadLoading={uploadLoading}
      uploadedFiles={uploadedFiles}
      setUploadedFiles={setUploadedFiles}
      form={form}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      universities={universities}
      majors={majors}
      combinations={combinations}
      priorities={priorities}
      handleUpload={handleUpload}
      handleSubmit={handleSubmit}
      handleLogout={handleLogout}
    />
  );
}
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
