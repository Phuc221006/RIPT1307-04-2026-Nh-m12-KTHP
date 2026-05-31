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
=======
import { useState, useEffect } from 'react';
import {
  Layout, Menu, Card, Table, Tag, Button, Form, Input,
  Select, Upload, message, Statistic, Row, Col, Avatar, Badge, Divider, Empty, Spin,
} from 'antd';
import {
  UserOutlined, FileTextOutlined, UploadOutlined, LogoutOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  BellOutlined, HomeOutlined, PlusOutlined, FileDoneOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { submitApplication, getMyApplications, uploadDocument, removeToken } from '../../services/api';
import styles from './index.less';

const { Sider, Content, Header } = Layout;
const { Option } = Select;
const { Dragger } = Upload;

const TRUONG = [
  'Đại học Bách Khoa Hà Nội', 'Đại học Quốc gia Hà Nội', 'Đại học Kinh tế Quốc dân',
  'Đại học Ngoại thương', 'Đại học Y Hà Nội', 'Đại học Bách Khoa TP.HCM',
  'Đại học Quốc gia TP.HCM', 'Đại học Cần Thơ', 'Đại học Đà Nẵng',
];

const NGANH = [
  'Công nghệ thông tin', 'Kỹ thuật phần mềm', 'Khoa học máy tính',
  'An toàn thông tin', 'Hệ thống thông tin', 'Trí tuệ nhân tạo',
  'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Kế toán', 'Marketing',
  'Y đa khoa', 'Dược học', 'Luật', 'Ngôn ngữ Anh',
];

const TO_HOP = [
  'A00 (Toán, Lý, Hóa)', 'A01 (Toán, Lý, Anh)', 'B00 (Toán, Hóa, Sinh)',
  'C00 (Văn, Sử, Địa)', 'D01 (Toán, Văn, Anh)', 'D07 (Toán, Hóa, Anh)',
];

const DOI_TUONG = [
  'Không có ưu tiên', 'Ưu tiên 1 (Khu vực 1)', 'Ưu tiên 2 (Khu vực 2)',
  'Ưu tiên 3 (Khu vực 3)', 'Đối tượng ưu tiên 1', 'Đối tượng ưu tiên 2',
];

const STATUS: Record<string, { color: string; icon: any; label: string }> = {
  pending:  { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  PENDING:  { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  rejected: { color: 'error',   icon: <CloseCircleOutlined />, label: 'Từ chối' },
  REJECTED: { color: 'error',   icon: <CloseCircleOutlined />, label: 'Từ chối' },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
>>>>>>> origin/suadashboard
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = Form.useForm();

  const user = (() => {
<<<<<<< HEAD
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
=======
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
>>>>>>> origin/suadashboard
  })();

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await getMyApplications();
<<<<<<< HEAD
      if (res.status === "success") setApps(res.data || []);
      else setApps(MOCK_DATA);
    } catch {
      setApps(MOCK_DATA);
=======
      if (res.status === 'success') setApps(res.data || []);
      else setApps([]);
    } catch {
      setApps([]);
>>>>>>> origin/suadashboard
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchApps();
  }, []);
=======
  useEffect(() => { fetchApps(); }, []);
>>>>>>> origin/suadashboard

  const handleUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const res = await uploadDocument(file);
<<<<<<< HEAD
      if (res.status === "success") {
        setUploadedFile(res.data);
        message.success("Tải file lên thành công!");
      } else message.error(res.message || "Tải file thất bại.");
    } catch {
      message.error("Lỗi kết nối.");
=======
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
>>>>>>> origin/suadashboard
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
<<<<<<< HEAD
    if (!uploadedFile) {
      message.warning("Vui lòng tải lên hồ sơ!");
=======
    if (uploadedFiles.length === 0) {
      message.warning('Vui lòng tải lên ít nhất 1 minh chứng!');
>>>>>>> origin/suadashboard
      return;
    }
    setSubmitLoading(true);
    try {
<<<<<<< HEAD
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
=======
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
        priorityObject: values.priorityType || 'Không có ưu tiên',
        priorityScore: 0,
        files: uploadedFiles,
      });

      if (res.status === 'success') {
        message.success('Nộp hồ sơ thành công!');
        form.resetFields();
        setUploadedFiles([]);
        fetchApps();
        setTab('history');
      } else {
        message.error(res.message || 'Nộp hồ sơ thất bại.');
      }
    } catch {
      message.error('Lỗi kết nối.');
>>>>>>> origin/suadashboard
    } finally {
      setSubmitLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  const approved = apps.filter(a => a.status === 'approved' || a.status === 'APPROVED').length;
  const pending  = apps.filter(a => a.status === 'pending'  || a.status === 'PENDING').length;
  const rejected = apps.filter(a => a.status === 'rejected' || a.status === 'REJECTED').length;

  const columns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => <span className={styles.muted}>{i + 1}</span> },
    { title: 'Trường', dataIndex: 'universityId', render: (v: string) => <span style={{ color: '#fff' }}>{v || '---'}</span> },
    { title: 'Ngành đăng ký', dataIndex: 'majorId', render: (v: string) => <strong style={{ color: '#fff' }}>{v}</strong> },
    {
      title: 'Ngày nộp', dataIndex: 'createdAt',
      render: (v: string) => <span className={styles.muted}>{new Date(v).toLocaleDateString('vi-VN')}</span>,
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
        ? <a href={`http://localhost:3000${files[0].fileUrl}`} target="_blank" rel="noreferrer" className={styles.link}>Xem ↗</a>
        : <span className={styles.muted}>—</span>,
>>>>>>> origin/suadashboard
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider width={240} className={styles.sider}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#dg)" />
<<<<<<< HEAD
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
=======
              <path d="M10 26L18 10L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 20.5H23" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="dg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#667eea" /><stop offset="1" stopColor="#764ba2" />
>>>>>>> origin/suadashboard
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
            <div className={styles.userId}>MSSV: {user.studentId || "---"}</div>
=======
            <div className={styles.userName}>{user.fullName || 'Sinh viên'}</div>
            <div className={styles.userId}>{user.email || '---'}</div>
>>>>>>> origin/suadashboard
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[tab]}
          onClick={({ key }) => setTab(key)}
          className={styles.menu}
          items={[
<<<<<<< HEAD
            { key: "overview", icon: <HomeOutlined />, label: "Tổng quan" },
            { key: "apply", icon: <PlusOutlined />, label: "Nộp hồ sơ" },
            {
              key: "history",
              icon: <FileTextOutlined />,
              label: "Lịch sử nộp",
            },
            { key: "profile", icon: <UserOutlined />, label: "Hồ sơ cá nhân" },
=======
            { key: 'overview', icon: <HomeOutlined />,     label: 'Tổng quan' },
            { key: 'apply',    icon: <PlusOutlined />,     label: 'Nộp hồ sơ' },
            { key: 'history',  icon: <FileTextOutlined />, label: 'Lịch sử nộp' },
            { key: 'profile',  icon: <UserOutlined />,     label: 'Hồ sơ cá nhân' },
>>>>>>> origin/suadashboard
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
          <Button icon={<LogoutOutlined />} block className={styles.logoutBtn}
            onClick={() => { removeToken(); navigate('/login'); }}>
>>>>>>> origin/suadashboard
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <span className={styles.pageTitle}>
<<<<<<< HEAD
            {
              {
                overview: "Tổng quan",
                apply: "Nộp hồ sơ xét tuyển",
                history: "Lịch sử nộp hồ sơ",
                profile: "Hồ sơ cá nhân",
              }[tab]
            }
=======
            {{ overview: 'Tổng quan', apply: 'Nộp hồ sơ xét tuyển', history: 'Lịch sử nộp hồ sơ', profile: 'Hồ sơ cá nhân' }[tab]}
>>>>>>> origin/suadashboard
          </span>
          <div className={styles.headerRight}>
            <Badge count={pending} size="small">
              <Button icon={<BellOutlined />} className={styles.iconBtn} />
            </Badge>
            <Avatar icon={<UserOutlined />} className={styles.avatar} />
          </div>
        </Header>

        <Content className={styles.content}>
<<<<<<< HEAD
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
=======

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <>
              <div className={styles.banner}>
                <div>
                  <h2 className={styles.bannerTitle}>Xin chào, {user.fullName || 'bạn'}! 👋</h2>
                  <p className={styles.bannerSub}>Theo dõi tình trạng hồ sơ xét tuyển của bạn tại đây.</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} className={styles.bannerBtn} onClick={() => setTab('apply')}>
>>>>>>> origin/suadashboard
                  Nộp hồ sơ mới
                </Button>
              </div>

              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                {[
<<<<<<< HEAD
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
=======
                  { label: 'Tổng hồ sơ', val: apps.length, icon: <FileDoneOutlined />, color: '#fff' },
                  { label: 'Đã duyệt',   val: approved,    icon: <CheckCircleOutlined />, color: '#4ade80' },
                  { label: 'Chờ duyệt',  val: pending,     icon: <ClockCircleOutlined />, color: '#fbbf24' },
                  { label: 'Từ chối',    val: rejected,    icon: <CloseCircleOutlined />, color: '#f87171' },
>>>>>>> origin/suadashboard
                ].map((s) => (
                  <Col xs={24} sm={12} lg={6} key={s.label}>
                    <Card className={styles.statCard}>
                      <div className={styles.statIconWrap}>{s.icon}</div>
<<<<<<< HEAD
                      <Statistic
                        title={s.label}
                        value={s.val}
                        valueStyle={{
                          color: s.color,
                          fontSize: 30,
                          fontWeight: 700,
                        }}
                      />
=======
                      <Statistic title={s.label} value={s.val} valueStyle={{ color: s.color, fontSize: 30, fontWeight: 700 }} />
>>>>>>> origin/suadashboard
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
                            <span className={styles.muted}>Chưa có hồ sơ</span>
                          }
                        />
                      ),
                    }}
                  />
=======
              <Card className={styles.card} title={<span className={styles.cardTitle}>Hồ sơ gần đây</span>}>
                {loading ? <div className={styles.center}><Spin /></div> : (
                  <Table dataSource={apps.slice(0, 3)} columns={columns} pagination={false} rowKey="id" className={styles.table}
                    locale={{ emptyText: <Empty description={<span className={styles.muted}>Chưa có hồ sơ. Hãy nộp hồ sơ đầu tiên!</span>} /> }} />
>>>>>>> origin/suadashboard
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
=======
          {tab === 'apply' && (
            <Card className={styles.card} title={<span className={styles.cardTitle}>📋 Nộp hồ sơ xét tuyển</span>}>
              <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.applyForm}>

                <div className={styles.sectionTitle}>🏫 Thông tin xét tuyển</div>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="university" label="Trường đăng ký" rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}>
                      <Select placeholder="Chọn trường đại học" className={styles.formSelect} showSearch>
                        {TRUONG.map(t => <Option key={t} value={t}>{t}</Option>)}
>>>>>>> origin/suadashboard
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
<<<<<<< HEAD
                    <Form.Item
                      name="priority"
                      label="Nguyện vọng"
                      rules={[{ required: true, message: "Vui lòng chọn!" }]}
                    >
                      <Select
                        placeholder="Chọn nguyện vọng"
                        className={styles.formSelect}
                      >
=======
                    <Form.Item name="major" label="Ngành đăng ký" rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}>
                      <Select placeholder="Chọn ngành học" className={styles.formSelect} showSearch>
                        {NGANH.map(n => <Option key={n} value={n}>{n}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="combination" label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}>
                      <Select placeholder="Chọn tổ hợp môn" className={styles.formSelect}>
                        {TO_HOP.map(t => <Option key={t} value={t}>{t}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="priority" label="Nguyện vọng" rules={[{ required: true, message: 'Vui lòng chọn!' }]}>
                      <Select placeholder="Chọn nguyện vọng" className={styles.formSelect}>
>>>>>>> origin/suadashboard
                        <Option value="1">Nguyện vọng 1</Option>
                        <Option value="2">Nguyện vọng 2</Option>
                        <Option value="3">Nguyện vọng 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
<<<<<<< HEAD
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
=======

                <div className={styles.sectionTitle}>📊 Thông tin điểm thi</div>
                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <Form.Item name="score1" label="Điểm môn 1" rules={[{ required: true, message: 'Nhập điểm!' }]}>
                      <Input placeholder="VD: 8.5" className={styles.formInput} type="number" min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="score2" label="Điểm môn 2" rules={[{ required: true, message: 'Nhập điểm!' }]}>
                      <Input placeholder="VD: 7.0" className={styles.formInput} type="number" min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="score3" label="Điểm môn 3" rules={[{ required: true, message: 'Nhập điểm!' }]}>
                      <Input placeholder="VD: 9.0" className={styles.formInput} type="number" min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="priorityType" label="Đối tượng ưu tiên">
                      <Select placeholder="Chọn đối tượng ưu tiên" className={styles.formSelect}>
                        {DOI_TUONG.map(d => <Option key={d} value={d}>{d}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="gpa" label="Điểm học bạ THPT (GPA)">
                      <Input placeholder="VD: 8.5" className={styles.formInput} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="note" label="Ghi chú thêm">
                  <Input.TextArea rows={2} placeholder="Thông tin bổ sung (nếu có)..." className={styles.formInput} />
                </Form.Item>

                <div className={styles.sectionTitle}>📎 Tải lên minh chứng</div>
                <p className={styles.uploadHint}>Chấp nhận: PDF, JPEG, PNG — Ảnh chụp học bạ, CCCD, chứng chỉ...</p>

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
                      <InboxOutlined style={{ color: '#667eea', fontSize: 40 }} />
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      Kéo thả file vào đây hoặc <span style={{ color: '#a78bfa' }}>click để chọn</span>
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      PDF, JPEG, PNG — Học bạ, CCCD, minh chứng ưu tiên
                    </p>
                  </Dragger>
                </Form.Item>

                {uploadedFiles.length > 0 && (
                  <div className={styles.fileList}>
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className={styles.fileItem}>
                        <CheckCircleOutlined style={{ color: '#4ade80' }} />
                        <span style={{ flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{f.originalName}</span>
                        <a href={`http://localhost:3000${f.fileUrl}`} target="_blank" rel="noreferrer" className={styles.link}>Xem</a>
                        <span className={styles.removeFile} onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}>✕</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button type="primary" htmlType="submit" loading={submitLoading} className={styles.submitBtn} block>
                  {submitLoading ? 'Đang gửi hồ sơ...' : '📤 Gửi hồ sơ đăng ký'}
>>>>>>> origin/suadashboard
                </Button>
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
                          <span className={styles.muted}>Chưa có hồ sơ</span>
                        }
                      />
                    ),
                  }}
=======
          {tab === 'history' && (
            <Card className={styles.card}
              title={<span className={styles.cardTitle}>📁 Lịch sử nộp hồ sơ</span>}
              extra={<Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={() => setTab('apply')}>Nộp thêm</Button>}
            >
              {loading ? <div className={styles.center}><Spin /></div> : (
                <Table dataSource={apps} columns={columns} rowKey="id" className={styles.table}
                  pagination={{ pageSize: 8, showTotal: t => `Tổng ${t} hồ sơ` }}
                  locale={{ emptyText: <Empty description={<span className={styles.muted}>Chưa có hồ sơ nào</span>} /> }}
>>>>>>> origin/suadashboard
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
=======
          {tab === 'profile' && (
            <Card className={styles.card} title={<span className={styles.cardTitle}>👤 Hồ sơ cá nhân</span>}>
              <div className={styles.profileTop}>
                <Avatar size={80} icon={<UserOutlined />} className={styles.profileAvatar} />
                <div>
                  <h2 className={styles.profileName}>{user.fullName || 'Sinh viên'}</h2>
                  <p className={styles.profileId}>{user.email || '---'}</p>
>>>>>>> origin/suadashboard
                  <Tag color="purple">Thí sinh</Tag>
                </div>
              </div>
              <Divider className={styles.divider} />
              <Row gutter={[20, 16]}>
                {[
<<<<<<< HEAD
                  { label: "Họ và tên", val: user.fullName || "---" },
                  { label: "Email", val: user.email || "---" },
                  { label: "MSSV", val: user.studentId || "---" },
                  { label: "SĐT", val: user.phone || "---" },
                ].map((f) => (
=======
                  { label: 'Họ và tên',  val: user.fullName    || '---' },
                  { label: 'Email',      val: user.email       || '---' },
                  { label: 'SĐT',        val: user.phone       || '---' },
                  { label: 'Ngày sinh',  val: user.dateOfBirth || '---' },
                ].map(f => (
>>>>>>> origin/suadashboard
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
                  { label: "Tổng hồ sơ", val: apps.length, cls: "" },
                  { label: "Đã duyệt", val: approved, cls: styles.green },
                  { label: "Đang xử lý", val: pending, cls: styles.yellow },
                  { label: "Từ chối", val: rejected, cls: styles.red },
                ].map((s) => (
=======
                  { label: 'Tổng hồ sơ', val: apps.length, cls: '' },
                  { label: 'Đã duyệt',   val: approved,    cls: styles.green },
                  { label: 'Chờ duyệt',  val: pending,     cls: styles.yellow },
                  { label: 'Từ chối',    val: rejected,    cls: styles.red },
                ].map(s => (
>>>>>>> origin/suadashboard
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
}
>>>>>>> origin/suadashboard
