import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Card, Table, Tag, Button, Form, Input,
  Select, Upload, message, Statistic, Row, Col, Avatar, Badge, Divider, Empty, Spin, Steps,
} from 'antd';
import {
  UserOutlined, FileTextOutlined, UploadOutlined, LogoutOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  BellOutlined, HomeOutlined, PlusOutlined, FileDoneOutlined, ArrowRightOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { submitApplication, getMyApplications, uploadDocument, removeToken } from '../../services/api';
import styles from './index.less';

const { Sider, Content, Header } = Layout;
const { Option } = Select;

const STATUS: Record<string, { color: string; icon: any; label: string }> = {
  pending:  { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  PENDING:  { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  rejected: { color: 'error',   icon: <CloseCircleOutlined />, label: 'Từ chối' },
  REJECTED: { color: 'error',   icon: <CloseCircleOutlined />, label: 'Từ chối' },
};

// Cấu hình các loại giấy tờ cần tải lên
const DOC_CATEGORIES = [
  { code: 'CCCD', name: 'Căn cước công dân (Mặt trước & sau)', required: true },
  { code: 'HOC_BA', name: 'Học bạ THPT', required: true },
  { code: 'UU_TIEN', name: 'Giấy tờ chứng minh ưu tiên', required: false },
  { code: 'KHAC', name: 'Các giấy tờ khác (Bằng khen, IELTS...)', required: false },
];

const formatDisplayDate = (value?: string) => {
  if (!value) return '---';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
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
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
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
  user, tab, setTab, apps, loading, submitLoading, uploadLoading,
  uploadedFiles, setUploadedFiles, form, currentStep, setCurrentStep,
  universities, majors, combinations, priorities, handleUpload, handleSubmit, handleLogout
}) => {
  const columns = [
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
        ? <a href={`http://localhost:5000${files[0].fileUrl}`} target="_blank" rel="noreferrer">Xem ↗</a>
        : <span>—</span>,
    },
  ];

  return (
    <Layout>
      <Sider width={240}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#dg)" />
              <path d="M10 26L18 10L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 20.5H23" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="dg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#667eea" /><stop offset="1" stopColor="#764ba2" />
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
            <div className={styles.userName}>{user.fullName || 'Sinh viên'}</div>
            <div className={styles.userId}>{user.email || '---'}</div>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[tab]}
          onClick={({ key }) => setTab(key)}
          className={styles.menu}
          items={[
            { key: 'overview', icon: <HomeOutlined />,     label: 'Tổng quan' },
            { key: 'apply',    icon: <PlusOutlined />,     label: 'Nộp hồ sơ' },
            { key: 'history',  icon: <FileTextOutlined />, label: 'Lịch sử nộp' },
            { key: 'profile',  icon: <UserOutlined />,     label: 'Hồ sơ cá nhân' },
          ]}
        />

        <div className={styles.logout}>
          <Button icon={<LogoutOutlined />} block className={styles.logoutBtn} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <span className={styles.pageTitle}>
            {{ overview: 'Tổng quan', apply: 'Nộp hồ sơ xét tuyển', history: 'Lịch sử nộp hồ sơ', profile: 'Hồ sơ cá nhân' }[tab]}
          </span>
          <div className={styles.headerRight}>
            <Badge count={apps.filter(a => a.status === 'pending' || a.status === 'PENDING').length} size="small">
              <Button icon={<BellOutlined />} className={styles.iconBtn} />
            </Badge>
            <Avatar icon={<UserOutlined />} className={styles.avatar} />
          </div>
        </Header>

        <Content className={styles.content}>
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <>
              <div className={styles.banner}>
                <div>
                  <h2 className={styles.bannerTitle}>Xin chào, {user.fullName || 'bạn'}! 👋</h2>
                  <p className={styles.bannerSub}>Theo dõi tình trạng hồ sơ xét tuyển của bạn tại đây.</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} className={styles.bannerBtn} onClick={() => setTab('apply')}>
                  Nộp hồ sơ mới
                </Button>
              </div>

              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                {[
                  { label: 'Tổng hồ sơ', val: apps.length, icon: <FileDoneOutlined />, color: '#1890ff' },
                  { label: 'Đã duyệt',   val: apps.filter(a => a.status === 'approved' || a.status === 'APPROVED').length,    icon: <CheckCircleOutlined />, color: '#52c41a' },
                  { label: 'Chờ duyệt',  val: apps.filter(a => a.status === 'pending' || a.status === 'PENDING').length,      icon: <ClockCircleOutlined />, color: '#faad14' },
                  { label: 'Từ chối',    val: apps.filter(a => a.status === 'rejected' || a.status === 'REJECTED').length,    icon: <CloseCircleOutlined />, color: '#f5222d' },
                ].map((s) => (
                  <Col xs={24} sm={12} lg={6} key={s.label}>
                    <Card className={styles.statCard}>
                      <div className={styles.statIconWrap}>{s.icon}</div>
                      <Statistic title={s.label} value={s.val} valueStyle={{ color: s.color, fontSize: 30, fontWeight: 700 }} />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card className={styles.card} title={<span>📁 Hồ sơ gần đây</span>}>
                {loading ? <div className={styles.center}><Spin /></div> : (
                  <Table dataSource={apps.slice(0, 3)} columns={columns} pagination={false} rowKey="id"
                    locale={{ emptyText: <Empty description="Chưa có hồ sơ. Hãy nộp hồ sơ đầu tiên!" /> }} />
                )}
              </Card>
            </>
          )}

          {/* APPLY */}
          {tab === 'apply' && (
            <Card className={styles.card} title={<span>📋 Nộp hồ sơ xét tuyển</span>}>
              <Steps
                current={currentStep}
                items={[
                  { title: 'Thông tin cá nhân', description: 'Đối tượng ưu tiên' },
                  { title: 'Xét tuyển', description: 'Chọn trường, ngành, điểm' },
                  { title: 'Minh chứng & Gửi', description: 'Phân loại tài liệu' },
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
                            {priorities.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
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
                            {universities.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="major" label="Ngành đăng ký" rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}>
                          <Select placeholder="Chọn ngành học" showSearch>
                            {majors.map(n => <Option key={n.id} value={n.id}>{n.name}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className={styles.sectionTitle}>📊 Thông tin xét tuyển</div>
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="combination" label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}>
                          <Select placeholder="Chọn tổ hợp môn" showSearch>
                            {combinations.map(t => <Option key={t.id} value={t.id}>{t.id} ({t.subjects})</Option>)}
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
                    <div className={styles.sectionTitle}>📎 Phân loại & Tải lên minh chứng</div>
                    <p style={{ marginBottom: 16 }}>Vui lòng tải lên đúng loại giấy tờ vào từng mục. Chấp nhận: PDF, JPEG, PNG.</p>

                    <Row gutter={[16, 16]}>
                      {DOC_CATEGORIES.map(cat => {
                        // Lọc các file thuộc category hiện tại để hiển thị
                        const currentFiles = uploadedFiles.filter(f => f.documentCategory === cat.code);
                        
                        return (
                          <Col xs={24} md={12} key={cat.code}>
                            <Card 
                              size="small" 
                              title={<span style={{ fontSize: 14 }}>{cat.name} {cat.required && <span style={{color: 'red'}}>*</span>}</span>}
                              style={{ height: '100%' }}
                            >
                              <Upload
                                accept=".pdf,.jpg,.jpeg,.png"
                                beforeUpload={(file) => handleUpload(file, cat.code)} // Truyền mã category vào hàm upload
                                showUploadList={false}
                                multiple
                                disabled={uploadLoading}
                              >
                                <Button icon={<UploadOutlined />} disabled={uploadLoading}>
                                  Chọn file
                                </Button>
                              </Upload>

                              {/* Danh sách file đã tải lên cho danh mục này */}
                              {currentFiles.length > 0 && (
                                <div style={{ marginTop: 12 }}>
                                  {currentFiles.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 4, background: '#f5f5f5', marginBottom: 6 }}>
                                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />
                                      <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={f.originalName}>
                                        {f.originalName}
                                      </span>
                                      <a href={`http://localhost:5000${f.fileUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>Xem</a>
                                      <a onClick={() => setUploadedFiles(prev => prev.filter(item => item.fileUrl !== f.fileUrl))} style={{ color: '#f5222d', fontSize: 13, cursor: 'pointer' }}>Xóa</a>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 32 }}>
                      <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(1)}>
                        Quay lại
                      </Button>
                      <Button type="primary" htmlType="submit" loading={submitLoading} icon={<UploadOutlined />}>
                        {submitLoading ? 'Đang gửi...' : '📤 Gửi hồ sơ xét tuyển'}
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </Card>
          )}

          {/* HISTORY */}
          {tab === 'history' && (
            <Card className={styles.card}
              title={<span>📁 Lịch sử nộp hồ sơ</span>}
              extra={<Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={() => setTab('apply')}>Nộp thêm</Button>}
            >
              {loading ? <div className={styles.center}><Spin /></div> : (
                <Table dataSource={apps} columns={columns} rowKey="id"
                  pagination={{ pageSize: 8, showTotal: t => `Tổng ${t} hồ sơ` }}
                  locale={{ emptyText: <Empty description="Chưa có hồ sơ nào" /> }}
                />
              )}
            </Card>
          )}

          {/* PROFILE */}
          {tab === 'profile' && (
            <Card className={styles.card} title={<span>👤 Hồ sơ cá nhân</span>}>
              <div className={styles.profileTop}>
                <Avatar size={80} icon={<UserOutlined />} className={styles.profileAvatar} />
                <div>
                  <h2 className={styles.profileName}>{user.fullName || 'Sinh viên'}</h2>
                  <p className={styles.profileId}>{user.email || '---'}</p>
                  <Tag color="blue">Thí sinh</Tag>
                </div>
              </div>
              <Divider className={styles.divider} />
              <Row gutter={[20, 16]}>
                {[
                  { label: 'Họ và tên',  val: user.fullName    || '---' },
                  { label: 'Email',      val: user.email       || '---' },
                  { label: 'SĐT',        val: user.phone       || '---' },
                  { label: 'Ngày sinh',  val: formatDisplayDate(user.dateOfBirth || user.dob) },
                ].map(f => (
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
                  { label: 'Tổng hồ sơ', val: apps.length, cls: '' },
                  { label: 'Đã duyệt',   val: apps.filter(a => a.status === 'approved' || a.status === 'APPROVED').length,    cls: styles.green },
                  { label: 'Chờ duyệt',  val: apps.filter(a => a.status === 'pending' || a.status === 'PENDING').length,      cls: styles.yellow },
                  { label: 'Từ chối',    val: apps.filter(a => a.status === 'rejected' || a.status === 'REJECTED').length,    cls: styles.red },
                ].map(s => (
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
};

// =====================================================================
// PHẦN 2: XỬ LÝ LOGIC (LOGIC/CONTAINER COMPONENT)
// =====================================================================

async function getUniversities() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/education/universities', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) throw new Error(`Lỗi Server: ${res.status}`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('Lỗi khi tải danh sách Trường:', error);
    return [
      { id: 'UNI_BKHN', code: 'BKHN', name: 'Đại học Bách Khoa Hà Nội' },
      { id: 'UNI_GTVT', code: 'GTVT', name: 'Đại học Giao thông Vận tải' }
    ];
  }
}

async function getMajors() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/education/majors', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) throw new Error(`Lỗi Server: ${res.status}`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('Lỗi khi tải danh sách Ngành:', error);
    return [
      { id: 'MAJ_BA', code: 'BA', name: 'Kỹ sư phân tích nghiệp vụ' },
      { id: 'MAJ_EE1', code: 'EE1', name: 'Kỹ thuật Điện' }
    ];
  }
}

async function getCombinations() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/education/combinations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) throw new Error(`Lỗi Server: ${res.status}`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('Lỗi khi tải danh sách Tổ hợp:', error);
    return [
      { id: 'A00', code: 'A00', subjects: 'Toán, Lý, Hóa' },
      { id: 'A01', code: 'A01', subjects: 'Toán, Lý, Anh' }
    ];
  }
}

async function getPriorities() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/education/priorities', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) throw new Error(`Lỗi Server: ${res.status}`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('Lỗi khi tải danh sách Ưu tiên:', error);
    return [
      { id: 'KV1', name: 'Ưu tiên 1 (Khu vực 1)' },
      { id: 'KV2', name: 'Ưu tiên 2 (Khu vực 2)' },
      { id: 'KV3', name: 'Không ưu tiên (KV3)' }
    ];
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
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

  // Cập nhật hàm handleUpload để nhận thêm mã phân loại giấy tờ (categoryCode)
  const handleUpload = async (file: File, categoryCode: string) => {
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
          documentCategory: categoryCode, // <--- THÊM NHÃN PHÂN LOẠI VÀO ĐÂY
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
    return false; // Ngăn chặn Ant Design tự động upload
  };

  const handleSubmit = async (values: any) => {
    // Ép buộc phải có CCCD và Học bạ
    const hasCCCD = uploadedFiles.some(f => f.documentCategory === 'CCCD');
    const hasHocBa = uploadedFiles.some(f => f.documentCategory === 'HOC_BA');

    if (!hasCCCD || !hasHocBa) {
      message.error('Vui lòng tải lên đầy đủ Căn cước công dân và Học bạ THPT!');
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
        files: uploadedFiles, // Cục mảng file này giờ đã có sẵn 'documentCategory' bên trong
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