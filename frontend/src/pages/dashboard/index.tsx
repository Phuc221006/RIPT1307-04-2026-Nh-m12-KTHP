import React, { useState, useEffect } from "react";
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
  Divider,
  Empty,
  Spin,
  Steps,
  Radio,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  UploadOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  PlusOutlined,
  FileDoneOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  submitApplication,
  getMyApplications,
  uploadDocument,
  removeToken,
} from "../../services/api";
import NotificationBell from "../../components/NotificationBell";
import StatusDetailModal from "../../components/StatusDetailModal";
import { getFileUrlFromRecord, resolveFileUrl } from "../../utils/fileUrl";
import {
  ASPIRATION_OPTIONS,
  DOC_CATEGORIES,
  GENDER_OPTIONS,
  PRIORITY_OBJECT_OPTIONS,
  type CombinationOption,
  type UploadedFilePayload,
} from "../../types/application";
import {
  addressRules,
  cccdRules,
  createScoreRules,
  genderRules,
  getSubjectLabels,
  phoneRules,
} from "../../utils/applicationHelpers";
import styles from "./index.less";

const { Sider, Content, Header } = Layout;
const { Option } = Select;

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

// Cấu hình các loại giấy tờ — dùng chung từ types/application.ts

const formatDisplayDate = (value?: string) => {
  if (!value) return "---";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

// =====================================================================
// PHẦN 1: GIAO DIỆN THUẦN (UI COMPONENT)
// =====================================================================

interface DashboardUIProps {
  user: any;
  tab: string;
  setTab: (val: string) => void;
  apps: any[];
  loading: boolean;
  submitLoading: boolean;
  uploadLoading: boolean;
  uploadedFiles: UploadedFilePayload[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFilePayload[]>>;
  form: any;
  currentStep: number;
  setCurrentStep: (val: number) => void;
  universities: any[];
  majors: any[];
  combinations: any[];
  priorities: any[];
  handleUpload: (file: File, categoryCode: string) => Promise<boolean>;
  handleSubmit: (values: any) => void;
  handleLogout: () => void;
}

const DashboardUI: React.FC<DashboardUIProps> = ({
  user,
  tab,
  setTab,
  apps,
  loading,
  submitLoading,
  uploadLoading,
  uploadedFiles,
  setUploadedFiles,
  form,
  currentStep,
  setCurrentStep,
  universities,
  majors,
  combinations,
  priorities,
  handleUpload,
  handleSubmit,
  handleLogout,
}) => {
  const watchedCombination = Form.useWatch("combination", form);
  const selectedCombination = combinations.find(
    (c) => c.id === watchedCombination,
  ) as CombinationOption | undefined;
  const [scoreLabel1, scoreLabel2, scoreLabel3] =
    getSubjectLabels(selectedCombination);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const openStatusModal = (app: any) => {
    setSelectedApp(app);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "STT",
      width: 60,
      render: (_: any, __: any, i: number) => <span>{i + 1}</span>,
    },
    {
      title: "Trường",
      dataIndex: "universityId",
      render: (v: string) => <span>{v || "---"}</span>,
    },
    {
      title: "Ngành đăng ký",
      dataIndex: "majorId",
      render: (v: string) => <strong>{v}</strong>,
    },
    {
      title: "Ngày nộp",
      dataIndex: "createdAt",
      render: (v: string) => (
        <span>{new Date(v).toLocaleDateString("vi-VN")}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string, record: any) => {
        const c = STATUS[s] || STATUS.PENDING;
        return (
          <Button type="link" onClick={() => openStatusModal(record)}>
            <Tag icon={c.icon} color={c.color} style={{ cursor: 'pointer' }}>
              {c.label}
            </Tag>
          </Button>
        );
      },
    },
    {
      title: "Hồ sơ",
      dataIndex: "applicationFiles",
      render: (files: any[]) => {
        if (!files || files.length === 0) return <span>—</span>;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {files.map((file, index) => {
              const url = getFileUrlFromRecord(file);
              const name = file.originalName || file.original_name || `File ${index + 1}`;
              return url ? (
                <a key={index} href={url} target="_blank" rel="noreferrer" title={name}>
                  {name.length > 15 ? name.substring(0, 15) + '...' : name} ↗
                </a>
              ) : null;
            })}
          </div>
        );
      },
    },
  ];

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
            onClick={handleLogout}
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
            <NotificationBell role="student" className={styles.iconBtn} />
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
                    color: "#1890ff",
                  },
                  {
                    label: "Đã duyệt",
                    val: apps.filter(
                      (a) => a.status === "approved" || a.status === "APPROVED",
                    ).length,
                    icon: <CheckCircleOutlined />,
                    color: "#52c41a",
                  },
                  {
                    label: "Chờ duyệt",
                    val: apps.filter(
                      (a) => a.status === "pending" || a.status === "PENDING",
                    ).length,
                    icon: <ClockCircleOutlined />,
                    color: "#faad14",
                  },
                  {
                    label: "Từ chối",
                    val: apps.filter(
                      (a) => a.status === "rejected" || a.status === "REJECTED",
                    ).length,
                    icon: <CloseCircleOutlined />,
                    color: "#f5222d",
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
                title={<span>📁 Hồ sơ gần đây</span>}
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
                    locale={{
                      emptyText: (
                        <Empty description="Chưa có hồ sơ. Hãy nộp hồ sơ đầu tiên!" />
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
              title={<span>📋 Nộp hồ sơ xét tuyển</span>}
            >
              <Steps
                current={currentStep}
                items={[
                  {
                    title: "Thông tin cá nhân",
                    description: "Đối tượng ưu tiên",
                  },
                  {
                    title: "Xét tuyển",
                    description: "Chọn trường, ngành, điểm",
                  },
                  {
                    title: "Minh chứng & Gửi",
                    description: "Phân loại tài liệu",
                  },
                ]}
                style={{ marginBottom: 32 }}
              />

              {/* THÊM preserve={true} VÀO THẺ FORM ĐỂ GIỮ DATA */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                preserve={true}
              >
                {/* STEP 1: Thông tin cá nhân & Đối tượng ưu tiên */}
                {/* THAY VÌ DÙNG &&, TA DÙNG display: none ĐỂ ẨN ĐI CHỨ KHÔNG XÓA */}
                <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                  <div className={styles.sectionTitle}>
                    👤 Thông tin cá nhân
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        initialValue={user.fullName || ""}
                        rules={[{ required: false }]}
                      >
                        <Input placeholder="Họ và tên" disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        initialValue={user.email || ""}
                        rules={[{ required: false }]}
                      >
                        <Input placeholder="Email" disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="dateOfBirth"
                        label="Ngày sinh"
                        rules={[{ required: false }]}
                      >
                        <Input
                          placeholder="Ngày sinh"
                          disabled
                          value={formatDisplayDate(
                            user.dateOfBirth || user.dob,
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="phone" label="Số điện thoại" rules={phoneRules}>
                        <Input placeholder="VD: 0912345678" maxLength={11} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="cccd" label="Số CCCD" rules={cccdRules}>
                        <Input placeholder="9 hoặc 12 chữ số" maxLength={12} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="gender" label="Giới tính" rules={genderRules}>
                        <Radio.Group>
                          {GENDER_OPTIONS.map((g) => (
                            <Radio key={g.value} value={g.value}>
                              {g.label}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="address" label="Địa chỉ cụ thể" rules={addressRules}>
                        <Input.TextArea
                          rows={2}
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className={styles.sectionTitle}>
                    🎯 Đối tượng ưu tiên
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item name="priorityType" label="Đối tượng ưu tiên">
                        <Select placeholder="Chọn đối tượng ưu tiên" showSearch>
                          {priorities.map((p) => (
                            <Option key={p.id} value={p.id}>
                              {p.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="gpa" label="Điểm học bạ THPT (GPA)">
                        <Input
                          placeholder="VD: 8.5"
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div style={{ textAlign: "right", marginTop: 24 }}>
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={async () => {
                        try {
                          await form.validateFields([
                            "phone",
                            "cccd",
                            "gender",
                            "address",
                          ]);
                          setCurrentStep(1);
                        } catch {
                          message.warning(
                            "Vui lòng điền đầy đủ thông tin cá nhân!",
                          );
                        }
                      }}
                    >
                      Tiếp tục
                    </Button>
                  </div>
                </div>

                {/* STEP 2: Thông tin xét tuyển */}
                <div style={{ display: currentStep === 1 ? "block" : "none" }}>
                  <div className={styles.sectionTitle}>
                    🏫 Chọn trường đại học
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="university"
                        label="Trường đăng ký"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn trường!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn trường đại học" showSearch>
                          {universities.map((t) => (
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
                        <Select placeholder="Chọn ngành học" showSearch>
                          {majors.map((n) => (
                            <Option key={n.id} value={n.id}>
                              {n.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className={styles.sectionTitle}>
                    📊 Thông tin xét tuyển
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="combination"
                        label="Tổ hợp xét tuyển"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn tổ hợp!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn tổ hợp môn" showSearch>
                          {combinations.map((t) => (
                            <Option key={t.id} value={t.id}>
                              {t.code} ({t.subjects})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="priority"
                        label="Nguyện vọng"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn nguyện vọng!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn nguyện vọng">
                          {ASPIRATION_OPTIONS.map((item) => (
                            <Option key={item.value} value={item.value}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className={styles.sectionTitle}>📈 Điểm thi</div>
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="score1"
                        label={`Điểm ${scoreLabel1}`}
                        rules={createScoreRules(scoreLabel1)}
                      >
                        <Input
                          placeholder="VD: 8.5"
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
                        label={`Điểm ${scoreLabel2}`}
                        rules={createScoreRules(scoreLabel2)}
                      >
                        <Input
                          placeholder="VD: 7.0"
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
                        label={`Điểm ${scoreLabel3}`}
                        rules={createScoreRules(scoreLabel3)}
                      >
                        <Input
                          placeholder="VD: 9.0"
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="note" label="Ghi chú thêm">
                    <Input.TextArea
                      rows={2}
                      placeholder="Thông tin bổ sung (nếu có)..."
                    />
                  </Form.Item>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "space-between",
                      marginTop: 24,
                    }}
                  >
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setCurrentStep(0)}
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={async () => {
                        try {
                          await form.validateFields([
                            "university",
                            "major",
                            "combination",
                            "priority",
                            "score1",
                            "score2",
                            "score3",
                          ]);
                          setCurrentStep(2);
                        } catch {
                          message.warning(
                            "Vui lòng hoàn thiện thông tin xét tuyển!",
                          );
                        }
                      }}
                    >
                      Tiếp tục
                    </Button>
                  </div>
                </div>

                {/* STEP 3: Tải lên minh chứng & Xác nhận */}
                <div style={{ display: currentStep === 2 ? "block" : "none" }}>
                  <div className={styles.sectionTitle}>
                    📎 Phân loại & Tải lên minh chứng
                  </div>
                  <p style={{ marginBottom: 16 }}>
                    Vui lòng tải lên đúng loại giấy tờ vào từng mục. Chấp nhận:
                    PDF, JPEG, PNG.
                  </p>

                  <Row gutter={[16, 16]}>
                    {DOC_CATEGORIES.map((cat) => {
                      const currentFiles = uploadedFiles.filter(
                        (f) => f.documentCategory === cat.code,
                      );

                      return (
                        <Col xs={24} md={12} key={cat.code}>
                          <Card
                            size="small"
                            title={
                              <span style={{ fontSize: 14 }}>
                                {cat.name}{" "}
                                {cat.required && (
                                  <span style={{ color: "red" }}>*</span>
                                )}
                              </span>
                            }
                            style={{ height: "100%" }}
                          >
                            <Upload
                              accept=".pdf,.jpg,.jpeg,.png"
                              beforeUpload={(file) =>
                                handleUpload(file, cat.code)
                              }
                              showUploadList={false}
                              multiple
                              disabled={uploadLoading}
                            >
                              <Button
                                icon={<UploadOutlined />}
                                disabled={uploadLoading}
                              >
                                Chọn file
                              </Button>
                            </Upload>

                            {currentFiles.length > 0 && (
                              <div style={{ marginTop: 12 }}>
                                {currentFiles.map((f, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      padding: "6px 8px",
                                      borderRadius: 4,
                                      background: "#f5f5f5",
                                      marginBottom: 6,
                                    }}
                                  >
                                    <CheckCircleOutlined
                                      style={{
                                        color: "#52c41a",
                                        fontSize: 14,
                                      }}
                                    />
                                    <span
                                      style={{
                                        flex: 1,
                                        fontSize: 13,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                      title={f.originalName}
                                    >
                                      {f.originalName}
                                    </span>
                                    <a
                                      href={resolveFileUrl(
                                        f.fileUrl,
                                        f.originalName,
                                      )}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ fontSize: 13 }}
                                    >
                                      Xem
                                    </a>
                                    <a
                                      onClick={() =>
                                        setUploadedFiles((prev) =>
                                          prev.filter(
                                            (item) =>
                                              item.fileUrl !== f.fileUrl,
                                          ),
                                        )
                                      }
                                      style={{
                                        color: "#f5222d",
                                        fontSize: 13,
                                        cursor: "pointer",
                                      }}
                                    >
                                      Xóa
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "space-between",
                      marginTop: 32,
                    }}
                  >
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setCurrentStep(1)}
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitLoading}
                      icon={<UploadOutlined />}
                    >
                      {submitLoading ? "Đang gửi..." : "📤 Gửi hồ sơ xét tuyển"}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <Card
              className={styles.card}
              title={<span>📁 Lịch sử nộp hồ sơ</span>}
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
                  pagination={{
                    pageSize: 8,
                    showTotal: (t) => `Tổng ${t} hồ sơ`,
                  }}
                  locale={{
                    emptyText: <Empty description="Chưa có hồ sơ nào" />,
                  }}
                />
              )}
            </Card>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <Card className={styles.card} title={<span>👤 Hồ sơ cá nhân</span>}>
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
                  <Tag color="blue">Thí sinh</Tag>
                </div>
              </div>
              <Divider className={styles.divider} />
              <Row gutter={[20, 16]}>
                {[
                  { label: "Họ và tên", val: user.fullName || "---" },
                  { label: "Email", val: user.email || "---" },
                  { label: "SĐT", val: user.phone || "---" },
                  {
                    label: "Ngày sinh",
                    val: formatDisplayDate(user.dateOfBirth || user.dob),
                  },
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
                  {
                    label: "Đã duyệt",
                    val: apps.filter(
                      (a) => a.status === "approved" || a.status === "APPROVED",
                    ).length,
                    cls: styles.green,
                  },
                  {
                    label: "Chờ duyệt",
                    val: apps.filter(
                      (a) => a.status === "pending" || a.status === "PENDING",
                    ).length,
                    cls: styles.yellow,
                  },
                  {
                    label: "Từ chối",
                    val: apps.filter(
                      (a) => a.status === "rejected" || a.status === "REJECTED",
                    ).length,
                    cls: styles.red,
                  },
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
          <StatusDetailModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            application={selectedApp}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

// =====================================================================
// PHẦN 2: XỬ LÝ LOGIC (LOGIC/CONTAINER COMPONENT) - BỘ LỌC ĐA CẤP THEO MÃ CODE
// =====================================================================

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1";

// 🏫 Nạp danh mục Trường học
async function getUniversities() {
  try {
    const res = await fetch(`${API_BASE_URL}/education/universities`);
    const json = await res.json();
    const rawList = json.data || (Array.isArray(json) ? json : []);

    return rawList.map((u: any) => ({
      ...u,
      id: u.id ? String(u.id) : u.code || "UNKNOWN",
      code: u.code ? String(u.code) : u.id || "UNKNOWN",
      name:
        u.name && String(u.name).trim()
          ? String(u.name)
          : u.code || "Trường chưa đặt tên",
    }));
  } catch {
    return [];
  }
}

// 📖 Nạp danh mục Ngành học
async function getMajors() {
  try {
    const res = await fetch(`${API_BASE_URL}/education/majors`);
    const json = await res.json();
    const rawList = json.data || (Array.isArray(json) ? json : []);

    return rawList.map((m: any) => ({
      ...m,
      id: m.id ? String(m.id) : m.code || "UNKNOWN",
      code: m.code ? String(m.code) : m.id || "UNKNOWN",
      name:
        m.name && String(m.name).trim()
          ? String(m.name)
          : m.code || "Ngành chưa đặt tên",
    }));
  } catch {
    return [];
  }
}

// 📊 Nạp danh mục Khối tổ hợp môn
async function getCombinations() {
  try {
    const res = await fetch(`${API_BASE_URL}/education/combinations`);
    const json = await res.json();
    const rawList = json.data || (Array.isArray(json) ? json : []);

    return rawList.map((c: any) => ({
      ...c,
      id: c.id ? String(c.id) : c.code || "UNKNOWN",
      code: c.code ? String(c.code) : c.id || "UNKNOWN",
      name:
        c.name && String(c.name).trim()
          ? String(c.name)
          : c.code
            ? `${c.code} (${c.subjects || ""})`
            : "Tổ hợp chưa đặt tên",
    }));
  } catch {
    return [];
  }
}

async function getPriorities() {
  return PRIORITY_OBJECT_OPTIONS.map((p) => ({
    id: p.id,
    code: p.id,
    name: p.name,
  }));
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [tab, setTab] = useState("overview");
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
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const birthDate = formatDisplayDate(user.dateOfBirth || user.dob || "");

  // 🕵️‍♂️ Lắng nghe trực tiếp Mã Code Trường và Mã Code Ngành từ Form của Phúc viết
  const watchedUniversityValue = Form.useWatch("university", form);
  const watchedMajorValue = Form.useWatch("major", form);

  // 🚀 Bước 1: Tìm đối tượng trường thật từ mã Code (Ví dụ: tìm ra object PTIT từ chữ "PTIT")
  const selectedUniObj = universities.find(
    (u) => u.code === watchedUniversityValue || u.id === watchedUniversityValue,
  );

  // Lọc ngành phụ thuộc: Chỉ lấy ngành có university_id trùng với ID hoặc CODE của trường đang chọn
  const displayMajors = watchedUniversityValue
    ? majors.filter(
        (m) =>
          m.university_id === selectedUniObj?.id ||
          m.universityId === selectedUniObj?.id ||
          m.university_id === selectedUniObj?.code ||
          m.universityId === selectedUniObj?.code ||
          m.university_id === watchedUniversityValue,
      )
    : [];

  // 🚀 Bước 2: Tìm đối tượng ngành thật từ mã Code Ngành (Ví dụ: tìm ra object IT từ chữ "CNTT")
  const selectedMajorObj = majors.find(
    (m) => m.code === watchedMajorValue || m.id === watchedMajorValue,
  );

  // Lọc tổ hợp phụ thuộc: Chỉ lấy khối môn ứng với ngành tuyển sinh đó
  const displayCombinations = watchedMajorValue
    ? combinations.filter(
        (c) =>
          c.major_id === selectedMajorObj?.id ||
          c.majorId === selectedMajorObj?.id ||
          c.major_id === selectedMajorObj?.code ||
          c.majorId === selectedMajorObj?.code ||
          c.major_id === watchedMajorValue,
      )
    : [];

  const fetchApps = async (loadedUnis: any[], loadedMajors: any[]) => {
    setLoading(true);
    try {
      const res = await getMyApplications();
      if (res.status === "success") {
        const mappedData = (res.data || []).map((app: any) => {
          let uId = app.university_id || app.universityId;
          let mId = app.major_id || app.majorId;

          if (uId && typeof uId === "object")
            uId = uId.name || uId.code || uId.id;
          if (mId && typeof mId === "object")
            mId = mId.name || mId.code || mId.id;

          const uniObj = loadedUnis.find((u) => u.id === uId || u.code === uId);
          const majorObj = loadedMajors.find(
            (m) => m.id === mId || m.code === mId,
          );

          return {
            ...app,
            universityId: uniObj ? uniObj.name : String(uId) || "---",
            majorId: majorObj ? majorObj.name : String(mId) || "---",
            createdAt:
              app.created_at || app.createdAt || new Date().toISOString(),
            applicationFiles: (app.application_files || app.applicationFiles || []).map(
              (f: any) => ({
                ...f,
                fileUrl: f.fileUrl || f.file_url,
                originalName: f.originalName || f.original_name,
              }),
            ),
          };
        });
        setApps(mappedData);
      }
    } catch (err) {
      console.error("Lỗi đồng bộ bảng hiển thị:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      const [u, m, c, p] = await Promise.all([
        getUniversities(),
        getMajors(),
        getCombinations(),
        getPriorities(),
      ]);
      setUniversities(u);
      setMajors(m);
      setCombinations(c);
      setPriorities(p);
      await fetchApps(u, m);
    };
    initData();
  }, []);

  // 🔄 Tự động reset ô Ngành và ô Khối khi thí sinh thay đổi chọn lại Trường đại học khác
  useEffect(() => {
    if (watchedUniversityValue) {
      form.setFieldsValue({ major: undefined, combination: undefined });
    }
  }, [watchedUniversityValue, form]);

  // 🔄 Tự động reset ô Khối khi thí sinh thay đổi chọn lại Ngành học khác
  useEffect(() => {
    if (watchedMajorValue) {
      form.setFieldsValue({ combination: undefined });
    }
  }, [watchedMajorValue, form]);

  useEffect(() => {
    if (tab === "apply") {
      form.setFieldsValue({
        fullName: user.fullName || "",
        email: user.email || "",
        dateOfBirth: birthDate,
        phone: user.phone || "",
        cccd: user.cccd || "",
        address: user.address || "",
      });
    }
  }, [tab, form, user.fullName, user.email, user.phone, user.cccd, user.address, birthDate]);

  // ĐÃ CẬP NHẬT: Nhận categoryCode và truyền vào state
  const handleUpload = async (file: File, categoryCode: string) => {
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
            fileType: file.type.includes("pdf") ? "PDF" : "IMAGE",
            documentCategory: categoryCode, // Đã được sửa để có nhãn
          },
        ]);
        message.success(`Tải lên "${file.name}" thành công!`);
      }
    } catch (error: any) {
      message.error(error?.message || "Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  // ĐÃ CẬP NHẬT: Bắt buộc chọn CCCD và Học bạ
  const handleSubmit = async () => {
    // Bỏ tham số values mặc định ở đây đi
    // 1. MÓC TOÀN BỘ DỮ LIỆU TỪ BỘ NHỚ FORM (Kể cả các bước đang bị ẩn)
    const values = form.getFieldsValue(true);

    // 2. Bắt buộc có minh chứng
    const hasCCCD = uploadedFiles.some((f) => f.documentCategory === "CCCD");
    const hasHocBa = uploadedFiles.some((f) => f.documentCategory === "HOC_BA");

    if (!hasCCCD || !hasHocBa) {
      message.error(
        "Vui lòng tải lên đầy đủ Căn cước công dân và Học bạ THPT!",
      );
      return;
    }

    setSubmitLoading(true);
    try {
      // 3. Đảm bảo điểm số không bao giờ bị null
      const score1 = parseFloat(values.score1 || 0);
      const score2 = parseFloat(values.score2 || 0);
      const score3 = parseFloat(values.score3 || 0);
      const totalScore = score1 + score2 + score3;

      const res = await submitApplication({
        universityId: values.university,
        majorId: values.major,
        combinationId: values.combination,
        aspiration: String(values.priority),
        scoreSubject1: score1,
        scoreSubject2: score2,
        scoreSubject3: score3,
        totalScore: totalScore,
        priorityObject: values.priorityType || "NONE",
        gpa: values.gpa ? parseFloat(values.gpa) : undefined,
        notes: values.note,
        phone: values.phone,
        cccd: values.cccd,
        address: values.address,
        gender: values.gender,
        files: uploadedFiles,
      });

      if (res.status === "success") {
        message.success("Nộp hồ sơ xét tuyển thành công!");
        form.resetFields();
        setUploadedFiles([]);
        setCurrentStep(0);
        const u = await getUniversities();
        const m = await getMajors();
        fetchApps(u, m);
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

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

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
      majors={displayMajors}
      combinations={displayCombinations}
      priorities={priorities}
      handleUpload={handleUpload}
      handleSubmit={handleSubmit}
      handleLogout={handleLogout}
    />
  );
}
