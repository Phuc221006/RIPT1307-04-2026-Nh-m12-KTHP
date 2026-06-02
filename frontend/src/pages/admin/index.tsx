import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Layout,
  Menu,
  Table,
  Card,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Drawer,
  Tabs,
  Row,
  Col,
  Badge,
  Avatar,
  Tag,
  Statistic,
  Tooltip,
  Space,
  Dropdown,
  Switch,
  Collapse,
  message,
} from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  MailOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import './index.less';

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

// Types
interface University {
  id: string;
  code: string;
  name: string;
  majors: string[];
}

interface Major {
  id: string;
  code: string;
  name: string;
  universities: string[];
  studyTime: number;
  subjectCombos: string[];
}

interface SubjectCombo {
  id: string;
  code: string;
  name: string;
  subjects: string[];
}

interface Application {
  id: string;
  studentId: string;
  studentName: string;
  cccd: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  university: string;
  major: string;
  enrollmentPeriod: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  transcriptScore: number;
  transcriptSubjects: string;
  documents: Array<{ name: string; type: string; url: string }>;
  submissionDate: string;
}

interface EmailTemplate {
  id: string;
  scenario: 'registration' | 'approved' | 'rejected';
  subject: string;
  content: string;
}

interface EmailLog {
  id: string;
  timestamp: string;
  studentName: string;
  email: string;
  subject: string;
  status: 'success' | 'failed';
}

// Admin Page Component
const AdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchText, setSearchText] = useState('');
  const [searchUniText, setSearchUniText] = useState('');
  const [searchMajorText, setSearchMajorText] = useState('');
  const [searchComboText, setSearchComboText] = useState('');
  const [filterUniversity, setFilterUniversity] = useState<string>('');
  const [filterMajor, setFilterMajor] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<string>('');
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(true);

  // API Data States (Khởi tạo mảng rỗng để đợi tải từ Backend)
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [subjectCombos, setSubjectCombos] = useState<SubjectCombo[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Loading UI States giúp nâng cao trải nghiệm người dùng
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [isUniversityModalVisible, setIsUniversityModalVisible] = useState(false);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [isApplicationDrawerVisible, setIsApplicationDrawerVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [universityForm] = Form.useForm();
  const [majorForm] = Form.useForm();
  const [comboForm] = Form.useForm();
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [editingCombo, setEditingCombo] = useState<SubjectCombo | null>(null);

  // Hàm Fetch Data chính để đồng bộ toàn bộ dữ liệu từ Backend về
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [uniRes, majorRes, comboRes, appRes, templateRes, logRes] = await Promise.all([
        fetch('/api/universities').then(res => res.json()),
        fetch('/api/majors').then(res => res.json()),
        fetch('/api/subject-combos').then(res => res.json()),
        fetch('/api/applications').then(res => res.json()),
        fetch('/api/email-templates').then(res => res.json()),
        fetch('/api/email-logs').then(res => res.json()),
      ]);

      setUniversities(Array.isArray(uniRes) ? uniRes : []);
      setMajors(Array.isArray(majorRes) ? majorRes : []);
      setSubjectCombos(Array.isArray(comboRes) ? comboRes : []);
      setApplications(Array.isArray(appRes) ? appRes : []);
      setEmailTemplates(Array.isArray(templateRes) ? templateRes : []);
      setEmailLogs(Array.isArray(logRes) ? logRes : []);
    } catch (error) {
      message.error('Không thể tải dữ liệu từ máy chủ API!');
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Tự động gọi API lấy dữ liệu ngay khi vừa tải trang
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dashboard calculations
  const dashboardStats = useMemo(() => {
    const totalApplications = applications.length;
    const approvedCount = applications.filter(a => a.status === 'approved').length;
    const pendingCount = applications.filter(a => a.status === 'pending').length;
    const rejectedCount = applications.filter(a => a.status === 'rejected').length;
    const submittedCount = applications.filter(a => a.status === 'submitted').length;

    const byMajor = majors.map(m => ({
      name: m.name,
      value: applications.filter(a => a.major === m.code).length,
    })).filter(m => m.value > 0);

    const byUniversity = universities.map(u => ({
      name: u.code,
      value: applications.filter(a => a.university === u.code).length,
    })).filter(u => u.value > 0);

    const byStatus = [
      { name: 'Đã nộp', value: submittedCount, color: '#1890ff' },
      { name: 'Chờ duyệt', value: pendingCount, color: '#faad14' },
      { name: 'Đã duyệt', value: approvedCount, color: '#52c41a' },
      { name: 'Từ chối', value: rejectedCount, color: '#f5222d' },
    ];

    return {
      totalApplications,
      approvedCount,
      pendingCount,
      rejectedCount,
      submittedCount,
      universities: universities.length,
      majors: majors.length,
      totalUsers: 52100,
      totalUsersGrowth: 3.25,
      byMajor,
      byUniversity,
      byStatus,
    };
  }, [applications, universities, majors]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const studentName = app.studentName || '';
      const studentId = app.studentId || '';
      const email = app.email || '';
      
      const matchesSearch = studentName.toLowerCase().includes(searchText.toLowerCase()) ||
                            studentId.toLowerCase().includes(searchText.toLowerCase()) ||
                            email.toLowerCase().includes(searchText.toLowerCase());
      const matchesUniversity = !filterUniversity || app.university === filterUniversity;
      const matchesMajor = !filterMajor || app.major === filterMajor;
      const matchesStatus = filterStatus.length === 0 || filterStatus.includes(app.status);
      const matchesPeriod = !filterPeriod || app.enrollmentPeriod === filterPeriod;
      return matchesSearch && matchesUniversity && matchesMajor && matchesStatus && matchesPeriod;
    });
  }, [applications, searchText, filterUniversity, filterMajor, filterStatus, filterPeriod]);

  // Filtered universities for catalog
  const filteredUniversities = useMemo(() => {
    return universities.filter(u =>
      (u.code || '').toLowerCase().includes(searchUniText.toLowerCase()) ||
      (u.name || '').toLowerCase().includes(searchUniText.toLowerCase())
    );
  }, [universities, searchUniText]);

  // Filtered majors for catalog
  const filteredMajors = useMemo(() => {
    return majors.filter(m =>
      (m.code || '').toLowerCase().includes(searchMajorText.toLowerCase()) ||
      (m.name || '').toLowerCase().includes(searchMajorText.toLowerCase())
    );
  }, [majors, searchMajorText]);

  // Filtered combos for catalog
  const filteredCombos = useMemo(() => {
    return subjectCombos.filter(c =>
      (c.code || '').toLowerCase().includes(searchComboText.toLowerCase()) ||
      (c.name || '').toLowerCase().includes(searchComboText.toLowerCase())
    );
  }, [subjectCombos, searchComboText]);

  // Handlers gọi API Thêm / Sửa Trường Đại học
  const handleAddUniversity = () => {
    setEditingUniversity(null);
    universityForm.resetFields();
    setIsUniversityModalVisible(true);
  };

  const handleSaveUniversity = async (values: any) => {
    if (!values.code || !values.name) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...values, majors: values.majors || [] };
      if (editingUniversity) {
        await fetch(`/api/universities/${editingUniversity.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('Cập nhật trường đại học thành công');
      } else {
        await fetch('/api/universities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('Thêm trường đại học thành công');
      }
      setIsUniversityModalVisible(false);
      universityForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra trong quá trình lưu dữ liệu!');
    } finally {
      setSubmitting(false);
    }
  };

  // Handlers gọi API Thêm / Sửa Ngành Học
  const handleAddMajor = () => {
    setEditingMajor(null);
    majorForm.resetFields();
    setIsMajorModalVisible(true);
  };

  const handleSaveMajor = async (values: any) => {
    if (!values.code || !values.name || !values.studyTime) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...values, subjectCombos: values.subjectCombos || [] };
      if (editingMajor) {
        await fetch(`/api/majors/${editingMajor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        message.success('Cập nhật ngành học thành công');
      } else {
        await fetch('/api/majors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, universities: [] }),
        });
        message.success('Thêm ngành học thành công');
      }
      setIsMajorModalVisible(false);
      majorForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra trong quá trình lưu dữ liệu!');
    } finally {
      setSubmitting(false);
    }
  };

  // Handlers gọi API Thêm / Sửa Tổ hợp môn
  const handleAddCombo = () => {
    setEditingCombo(null);
    comboForm.resetFields();
    setIsComboModalVisible(true);
  };

  const handleSaveCombo = async (values: any) => {
    if (!values.code || !values.name || !values.subjects || values.subjects.length === 0) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCombo) {
        await fetch(`/api/subject-combos/${editingCombo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('Cập nhật tổ hợp môn thành công');
      } else {
        await fetch('/api/subject-combos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('Thêm tổ hợp môn thành công');
      }
      setIsComboModalVisible(false);
      comboForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra trong quá trình lưu dữ liệu!');
    } finally {
      setSubmitting(false);
    }
  };

  // Các hàm gọi API xóa (DELETE) danh mục hệ thống
  const handleDeleteUniversity = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa trường đại học này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await fetch(`/api/universities/${id}`, { method: 'DELETE' });
          message.success('Xóa trường đại học thành công');
          fetchData();
        } catch (error) {
          message.error('Không thể xóa danh mục này!');
        }
      },
    });
  };

  const handleDeleteMajor = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ngành học này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await fetch(`/api/majors/${id}`, { method: 'DELETE' });
          message.success('Xóa ngành học thành công');
          fetchData();
        } catch (error) {
          message.error('Không thể xóa danh mục này!');
        }
      },
    });
  };

  const handleDeleteCombo = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tổ hợp môn này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await fetch(`/api/subject-combos/${id}`, { method: 'DELETE' });
          message.success('Xóa tổ hợp môn thành công');
          fetchData();
        } catch (error) {
          message.error('Không thể xóa danh mục này!');
        }
      },
    });
  };

  const handleViewApplication = (record: Application) => {
    setSelectedApplication(record);
    setIsApplicationDrawerVisible(true);
  };

  // API Phê duyệt hồ sơ thí sinh
  const handleApproveApplication = () => {
    if (!selectedApplication) return;

    Modal.confirm({
      title: 'Phê duyệt hồ sơ',
      content: `Bạn có chắc chắn muốn phê duyệt hồ sơ của ${selectedApplication.studentName}?`,
      okText: 'Phê duyệt',
      cancelText: 'Hủy',
      okButtonProps: { style: { background: '#52c41a' } },
      onOk: async () => {
        try {
          // Gửi PATCH request cập nhật trạng thái
          await fetch(`/api/applications/${selectedApplication.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' }),
          });

          // Nếu tính năng tự động gửi email bật, gọi API gửi mail từ Backend
          if (autoEmailEnabled) {
            await fetch(`/api/applications/${selectedApplication.id}/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ scenario: 'approved' }),
            });
          }

          message.success('Phê duyệt hồ sơ thành công');
          setIsApplicationDrawerVisible(false);
          fetchData();
        } catch (error) {
          message.error('Phê duyệt hồ sơ thất bại!');
        }
      },
    });
  };

  const handleRejectApplication = () => {
    setIsRejectModalVisible(true);
  };

  // API Từ chối hồ sơ kèm lý do
  const handleConfirmReject = () => {
    if (!selectedApplication || !rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }

    Modal.confirm({
      title: 'Từ chối hồ sơ',
      content: `Bạn có chắc chắn muốn từ chối hồ sơ của ${selectedApplication.studentName}?\n\nLý do: ${rejectReason}`,
      okText: 'Từ chối',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await fetch(`/api/applications/${selectedApplication.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'rejected', rejectReason }),
          });

          if (autoEmailEnabled) {
            await fetch(`/api/applications/${selectedApplication.id}/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ scenario: 'rejected', rejectReason }),
            });
          }

          message.success('Từ chối hồ sơ thành công. Email thông báo đã được gửi');
          setRejectReason('');
          setIsRejectModalVisible(false);
          setIsApplicationDrawerVisible(false);
          fetchData();
        } catch (error) {
          message.error('Thao tác từ chối hồ sơ thất bại!');
        }
      },
    });
  };

  const handleExportExcel = () => {
    message.info('Tính năng xuất Excel sẽ được triển khai trong phiên bản tiếp theo');
  };

  // API Cập nhật mẫu template Email thông báo
  const handleSaveEmailTemplate = async (index: number) => {
    setSavingTemplate(true);
    try {
      const targetTemplate = emailTemplates[index];
      if (!targetTemplate) return;

      await fetch(`/api/email-templates/${targetTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetTemplate),
      });
      message.success('Lưu mẫu email thành công');
    } catch (error) {
      message.error('Không thể lưu cấu hình email mới!');
    } finally {
      setSavingTemplate(false);
    }
  };

  // Table columns
  const universityColumns = [
    { title: 'Mã Trường', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Tên Trường', dataIndex: 'name', key: 'name', width: 250 },
    {
      title: 'Ngành Tuyển sinh',
      dataIndex: 'majors',
      key: 'majors',
      render: (majorsData: string[]) => (
        <Space wrap>
          {(majorsData || []).map(m => (
            <Tag key={m} color="blue">{m}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: University) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUniversity(record);
              universityForm.setFieldsValue(record);
              setIsUniversityModalVisible(true);
            }}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUniversity(record.id)}
          />
        </Space>
      ),
    },
  ];

  const majorColumns = [
    { title: 'Mã Ngành', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Tên Ngành', dataIndex: 'name', key: 'name', width: 220 },
    { title: 'Thời gian ĐT (năm)', dataIndex: 'studyTime', key: 'studyTime', width: 150 },
    {
      title: 'Tổ hợp xét tuyển',
      dataIndex: 'subjectCombos',
      key: 'subjectCombos',
      render: (combos: string[]) => (
        <Space wrap>
          {(combos || []).map(c => (
            <Tag key={c} color="cyan">{c}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Major) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingMajor(record);
              majorForm.setFieldsValue(record);
              setIsMajorModalVisible(true);
            }}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMajor(record.id)}
          />
        </Space>
      ),
    },
  ];

  const comboColumns = [
    { title: 'Mã Tổ hợp', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Tên Tổ hợp', dataIndex: 'name', key: 'name', width: 250 },
    {
      title: 'Các môn',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <Space wrap>
          {(subjects || []).map(s => (
            <Tag key={s} color="green">{s}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: SubjectCombo) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCombo(record);
              comboForm.setFieldsValue(record);
              setIsComboModalVisible(true);
            }}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCombo(record.id)}
          />
        </Space>
      ),
    },
  ];

  const applicationColumns = [
    { title: 'Mã HS', dataIndex: 'studentId', key: 'studentId', width: 100 },
    { title: 'Họ và Tên', dataIndex: 'studentName', key: 'studentName', width: 150 },
    {
      title: 'Trường ĐK',
      dataIndex: 'university',
      key: 'university',
      width: 120,
      render: (code: string) => universities.find(u => u.code === code)?.code || code,
    },
    { title: 'Ngành', dataIndex: 'major', key: 'major', width: 100 },
    { title: 'Đợt tuyển sinh', dataIndex: 'enrollmentPeriod', key: 'enrollmentPeriod', width: 140 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap = {
          submitted: { color: 'blue', label: 'Đã nộp' },
          pending: { color: 'orange', label: 'Chờ duyệt' },
          approved: { color: 'green', label: 'Đã duyệt' },
          rejected: { color: 'red', label: 'Từ chối' },
        };
        const s = statusMap[status as keyof typeof statusMap] || { color: 'default', label: 'Không rõ' };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: Application) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewApplication(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const emailLogColumns = [
    { title: 'Thời gian gửi', dataIndex: 'timestamp', key: 'timestamp', width: 150 },
    { title: 'Tên thí sinh', dataIndex: 'studentName', key: 'studentName', width: 150 },
    { title: 'Email nhận', dataIndex: 'email', key: 'email', width: 180 },
    { title: 'Chủ đề', dataIndex: 'subject', key: 'subject', width: 300 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? 'Thành công' : 'Thất bại'}
        </Tag>
      ),
    },
  ];

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Thống kê tổng quan' },
    { key: 'catalog', icon: <AppstoreOutlined />, label: 'Quản lý danh mục' },
    { key: 'applications', icon: <FileTextOutlined />, label: 'Quản lý hồ sơ' },
    { key: 'email', icon: <MailOutlined />, label: 'Cấu hình Email' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header
        style={{
          background: '#002140',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            style={{ color: 'white', fontSize: 18 }}
            onClick={() => setCollapsed(!collapsed)}
          />
          <h2 style={{ color: 'white', margin: 0, fontSize: 16, fontWeight: 600 }}>
            Cổng thông tin Xét tuyển Đại học Trực tuyến
          </h2>
        </div>

        <Space style={{ color: 'white' }} size={20}>
          <Badge count={5} style={{ backgroundColor: '#ff4d4f' }}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 20, color: 'white' }} />}
            />
          </Badge>

          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: 'Hồ sơ cá nhân' },
                { key: 'settings', label: 'Cài đặt' },
                { type: 'divider' },
                { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined /> },
              ],
            }}
          >
            <Button type="text" style={{ color: 'white', padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <span>Users Quản trị</span>
            </Button>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          style={{ background: '#fff' }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            items={menuItems}
            onClick={(e) => setActiveMenu(e.key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        {/* Content */}
        <Content style={{ padding: 24, background: '#f5f5f5', overflow: 'auto' }}>
          {/* Dashboard */}
          {activeMenu === 'dashboard' && (
            <div>
              <h1 style={{ marginBottom: 24 }}>📊 Thống kê tổng quan</h1>

              {/* KPI Cards */}
              <Row gutter={24} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <Statistic
                      title="Tổng số Hồ sơ"
                      value={dashboardStats.totalApplications}
                      prefix="📋"
                      valueStyle={{ color: '#1890ff', fontSize: 32, fontWeight: 'bold' }}
                      suffix={
                        <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 'bold' }}>
                          ↑ 1.75%
                        </span>
                      }
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <Statistic
                      title="Số Trường Đại học"
                      value={dashboardStats.universities}
                      prefix="🏫"
                      valueStyle={{ color: '#faad14', fontSize: 32, fontWeight: 'bold' }}
                      suffix={
                        <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 'bold' }}>
                          ↑ 0.16%
                        </span>
                      }
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <Statistic
                      title="Ngành Tuyển sinh"
                      value={dashboardStats.majors}
                      prefix="📚"
                      valueStyle={{ color: '#eb2f96', fontSize: 32, fontWeight: 'bold' }}
                      suffix={
                        <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 'bold' }}>
                          ↑ 1.38%
                        </span>
                      }
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <Statistic
                      title="Người dùng"
                      value={dashboardStats.totalUsers}
                      prefix="👥"
                      valueStyle={{ color: '#13c2c2', fontSize: 32, fontWeight: 'bold' }}
                      suffix={
                        <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 'bold' }}>
                          ↑ {dashboardStats.totalUsersGrowth}%
                        </span>
                      }
                    />
                  </Card>
                </Col>
              </Row>

              {/* Charts */}
              <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                  <Card title="📊 Hồ sơ theo ngành" bordered={false} style={{ height: 'auto' }} loading={loadingData}>
                    <div style={{ padding: '16px 0' }}>
                      {dashboardStats.byMajor.length > 0 ? (
                        dashboardStats.byMajor.map((entry, index) => {
                          const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#eb2f96', '#13c2c2'];
                          const maxVal = Math.max(...dashboardStats.byMajor.map(m => m.value)) || 1;
                          const percent = Math.round((entry.value / maxVal) * 100);
                          return (
                            <div key={index} style={{ marginBottom: 20 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 500 }}>
                                <span style={{ flex: 1 }}>{entry.name}</span>
                                <span style={{ minWidth: 80, textAlign: 'right', color: colors[index % colors.length], fontWeight: 'bold' }}>{entry.value} hồ sơ</span>
                              </div>
                              <div style={{ width: '100%', height: 24, backgroundColor: '#f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${percent}%`, height: '100%', backgroundColor: colors[index % colors.length], borderRadius: 6, transition: 'width 0.3s' }}></div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ textAlign: 'center', color: '#999' }}>Không có dữ liệu</p>
                      )}
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card title="📈 Hồ sơ theo trạng thái" bordered={false} style={{ height: 'auto' }} loading={loadingData}>
                    <div style={{ padding: '16px 0' }}>
                      {dashboardStats.byStatus.map((entry, index) => {
                        const maxVal = Math.max(...dashboardStats.byStatus.map(s => s.value)) || 1;
                        const percent = Math.round((entry.value / maxVal) * 100);
                        return (
                          <div key={index} style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 500 }}>
                              <span style={{ flex: 1 }}>{entry.name}</span>
                              <span style={{ minWidth: 80, textAlign: 'right', color: entry.color, fontWeight: 'bold' }}>{entry.value} hồ sơ</span>
                            </div>
                            <div style={{ width: '100%', height: 24, backgroundColor: '#f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
                              <div style={{ width: `${percent}%`, height: '100%', backgroundColor: entry.color, borderRadius: 6, transition: 'width 0.3s' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* University Stats */}
              <Card title="🏢 Phân bổ hồ sơ theo trường" loading={loadingData}>
                <Row gutter={16}>
                  {dashboardStats.byUniversity.map((entry, index) => (
                    <Col xs={12} sm={8} lg={6} key={index}>
                      <Card size="small" style={{ textAlign: 'center', background: '#fafafa' }}>
                        <Statistic
                          title={entry.name}
                          value={entry.value}
                          valueStyle={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          )}

          {/* Catalog Management */}
          {activeMenu === 'catalog' && (
            <div>
              <h1 style={{ marginBottom: 24 }}>Quản lý danh mục hệ thống</h1>

              <Card>
                <Tabs
                  items={[
                    {
                      key: 'university',
                      label: 'Trường Đại học',
                      children: (
                        <div>
                          <Row style={{ marginBottom: 16 }} gutter={16}>
                            <Col flex="auto">
                              <Input.Search
                                placeholder="Tìm kiếm theo tên hoặc mã..."
                                prefix={<SearchOutlined />}
                                value={searchUniText}
                                onChange={(e) => setSearchUniText(e.target.value)}
                                allowClear
                              />
                            </Col>
                            <Col>
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddUniversity}
                              >
                                Thêm mới
                              </Button>
                            </Col>
                          </Row>
                          <Table
                            columns={universityColumns}
                            dataSource={filteredUniversities}
                            rowKey="id"
                            loading={loadingData}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                          />
                        </div>
                      ),
                    },
                    {
                      key: 'major',
                      label: 'Ngành học',
                      children: (
                        <div>
                          <Row style={{ marginBottom: 16 }} gutter={16}>
                            <Col flex="auto">
                              <Input.Search
                                placeholder="Tìm kiếm theo tên hoặc mã..."
                                prefix={<SearchOutlined />}
                                value={searchMajorText}
                                onChange={(e) => setSearchMajorText(e.target.value)}
                                allowClear
                              />
                            </Col>
                            <Col>
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddMajor}
                              >
                                Thêm mới
                              </Button>
                            </Col>
                          </Row>
                          <Table
                            columns={majorColumns}
                            dataSource={filteredMajors}
                            rowKey="id"
                            loading={loadingData}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1000 }}
                          />
                        </div>
                      ),
                    },
                    {
                      key: 'combo',
                      label: 'Tổ hợp môn',
                      children: (
                        <div>
                          <Row style={{ marginBottom: 16 }} gutter={16}>
                            <Col flex="auto">
                              <Input.Search
                                placeholder="Tìm kiếm theo tên hoặc mã..."
                                prefix={<SearchOutlined />}
                                value={searchComboText}
                                onChange={(e) => setSearchComboText(e.target.value)}
                                allowClear
                              />
                            </Col>
                            <Col>
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddCombo}
                              >
                                Thêm mới
                              </Button>
                            </Col>
                          </Row>
                          <Table
                            columns={comboColumns}
                            dataSource={filteredCombos}
                            rowKey="id"
                            loading={loadingData}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 900 }}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>

              {/* University Modal */}
              <Modal
                title={editingUniversity ? '✏️ Sửa trường đại học' : '➕ Thêm trường đại học'}
                open={isUniversityModalVisible}
                onOk={() => universityForm.submit()}
                confirmLoading={submitting}
                onCancel={() => {
                  setIsUniversityModalVisible(false);
                  universityForm.resetFields();
                }}
                okText={editingUniversity ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                width={600}
              >
                <Form
                  form={universityForm}
                  layout="vertical"
                  onFinish={handleSaveUniversity}
                  autoComplete="off"
                >
                  <Form.Item
                    name="code"
                    label="Mã Trường"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mã trường' },
                      { min: 2, message: 'Mã trường phải có ít nhất 2 ký tự' },
                    ]}
                  >
                    <Input placeholder="VD: HUST, VNU, FPT" />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Tên Trường"
                    rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
                  >
                    <Input placeholder="VD: Đại học Bách khoa Hà Nội" />
                  </Form.Item>
                  <Form.Item name="majors" label="Ngành Tuyển sinh">
                    <Select
                      mode="multiple"
                      placeholder="Chọn ngành"
                      options={majors.map(m => ({ label: `${m.code} - ${m.name}`, value: m.code }))}
                    />
                  </Form.Item>
                </Form>
              </Modal>

              {/* Major Modal */}
              <Modal
                title={editingMajor ? '✏️ Sửa ngành học' : '➕ Thêm ngành học'}
                open={isMajorModalVisible}
                onOk={() => majorForm.submit()}
                confirmLoading={submitting}
                onCancel={() => {
                  setIsMajorModalVisible(false);
                  majorForm.resetFields();
                }}
                okText={editingMajor ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                width={600}
              >
                <Form
                  form={majorForm}
                  layout="vertical"
                  onFinish={handleSaveMajor}
                  autoComplete="off"
                >
                  <Form.Item
                    name="code"
                    label="Mã Ngành"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mã ngành' },
                      { min: 2, message: 'Mã ngành phải có ít nhất 2 ký tự' },
                    ]}
                  >
                    <Input placeholder="VD: KHMT, Y, KTDT" />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Tên Ngành"
                    rules={[{ required: true, message: 'Vui lòng nhập tên ngành' }]}
                  >
                    <Input placeholder="VD: Khoa học Máy tính" />
                  </Form.Item>
                  <Form.Item
                    name="studyTime"
                    label="Thời gian đào tạo (năm)"
                    rules={[
                      { required: true, message: 'Vui lòng nhập thời gian đào tạo' },
                      {
                        pattern: /^[0-9]+$/,
                        message: 'Vui lòng nhập số',
                      },
                    ]}
                  >
                    <Input type="number" min={1} max={10} placeholder="VD: 4" />
                  </Form.Item>
                  <Form.Item name="subjectCombos" label="Tổ hợp xét tuyển">
                    <Select
                      mode="multiple"
                      placeholder="Chọn tổ hợp"
                      options={subjectCombos.map(c => ({ label: c.code, value: c.code }))}
                    />
                  </Form.Item>
                </Form>
              </Modal>

              {/* Subject Combo Modal */}
              <Modal
                title={editingCombo ? '✏️ Sửa tổ hợp môn' : '➕ Thêm tổ hợp môn'}
                open={isComboModalVisible}
                onOk={() => comboForm.submit()}
                confirmLoading={submitting}
                onCancel={() => {
                  setIsComboModalVisible(false);
                  comboForm.resetFields();
                }}
                okText={editingCombo ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                width={600}
              >
                <Form
                  form={comboForm}
                  layout="vertical"
                  onFinish={handleSaveCombo}
                  autoComplete="off"
                >
                  <Form.Item
                    name="code"
                    label="Mã Tổ hợp"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mã tổ hợp' },
                      { min: 1, message: 'Mã tổ hợp phải có ít nhất 1 ký tự' },
                    ]}
                  >
                    <Input placeholder="VD: A00, B00, C00, D01" />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Tên Tổ hợp"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp' }]}
                  >
                    <Input placeholder="VD: Toán, Vật lý, Hóa học" />
                  </Form.Item>
                  <Form.Item
                    name="subjects"
                    label="Các môn thi"
                    rules={[
                      { required: true, message: 'Vui lòng chọn ít nhất một môn' },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn môn"
                      options={[
                        { label: 'Toán', value: 'Toán' },
                        { label: 'Vật lý', value: 'Vật lý' },
                        { label: 'Hóa học', value: 'Hóa học' },
                        { label: 'Sinh học', value: 'Sinh học' },
                        { label: 'Tiếng Anh', value: 'Tiếng Anh' },
                        { label: 'Lịch sử', value: 'Lịch sử' },
                        { label: 'Địa lý', value: 'Địa lý' },
                        { label: 'Tiếng Pháp', value: 'Tiếng Pháp' },
                        { label: 'Tin học', value: 'Tin học' },
                        { label: 'Văn học', value: 'Văn học' },
                      ]}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          )}

          {/* Applications Management */}
          {activeMenu === 'applications' && (
            <div>
              <h1 style={{ marginBottom: 24 }}>Quản lý Hồ sơ Đăng ký</h1>

              <Card style={{ marginBottom: 24 }}>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      placeholder="Chọn Trường"
                      style={{ width: '100%' }}
                      value={filterUniversity}
                      onChange={setFilterUniversity}
                      allowClear
                      options={universities.map(u => ({ label: u.code, value: u.code }))}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      placeholder="Chọn Ngành"
                      style={{ width: '100%' }}
                      value={filterMajor}
                      onChange={setFilterMajor}
                      allowClear
                      options={majors.map(m => ({ label: m.code, value: m.code }))}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      placeholder="Đợt tuyển sinh"
                      style={{ width: '100%' }}
                      value={filterPeriod}
                      onChange={setFilterPeriod}
                      allowClear
                      options={[
                        { label: 'Đợt 1 - 2024', value: 'Đợt 1 - 2024' },
                        { label: 'Đợt 2 - 2024', value: 'Đợt 2 - 2024' },
                      ]}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      mode="multiple"
                      placeholder="Trạng thái"
                      style={{ width: '100%' }}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      options={[
                        { label: 'Đã nộp', value: 'submitted' },
                        { label: 'Chờ duyệt', value: 'pending' },
                        { label: 'Đã duyệt', value: 'approved' },
                        { label: 'Từ chối', value: 'rejected' },
                      ]}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Button
                      type="primary"
                      style={{ width: '100%' }}
                      icon={<SearchOutlined />}
                      onClick={fetchData}
                    >
                      Tìm kiếm
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Button
                      type="primary"
                      style={{ width: '100%', background: '#1890ff' }}
                      icon={<DownloadOutlined />}
                      onClick={handleExportExcel}
                    >
                      Xuất Excel
                    </Button>
                  </Col>
                </Row>

                <Input.Search
                  placeholder="Tìm kiếm theo tên hoặc mã hồ sơ..."
                  prefix={<SearchOutlined />}
                  style={{ marginBottom: 16 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Card>

              <Card>
                <Table
                  columns={applicationColumns}
                  dataSource={filteredApplications}
                  rowKey="id"
                  loading={loadingData}
                  pagination={{ pageSize: 10 }}
                />
              </Card>

              {/* Application Detail Drawer */}
              <Drawer
                title="Chi tiết và Duyệt hồ sơ"
                onClose={() => setIsApplicationDrawerVisible(false)}
                open={isApplicationDrawerVisible}
                width={900}
                bodyStyle={{ padding: 0 }}
              >
                {selectedApplication && (
                  <Row style={{ height: '100%' }}>
                    {/* Left Column */}
                    <Col span={12} style={{ padding: 24, borderRight: '1px solid #f0f0f0', overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
                      <Collapse
                        defaultActiveKey={['personal', 'registration', 'documents']}
                        items={[
                          {
                            key: 'personal',
                            label: 'Thông tin Thí sinh',
                            children: (
                              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                <div>
                                  <strong>Họ và Tên:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.studentName}</p>
                                </div>
                                <div>
                                  <strong>CCCD:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.cccd}</p>
                                </div>
                                <div>
                                  <strong>Ngày sinh:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.birthDate}</p>
                                </div>
                                <div>
                                  <strong>Email:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.email}</p>
                                </div>
                                <div>
                                  <strong>Số điện thoại:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.phone}</p>
                                </div>
                                <div>
                                  <strong>Địa chỉ:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.address}</p>
                                </div>
                              </Space>
                            ),
                          },
                          {
                            key: 'registration',
                            label: 'Thông tin Đăng ký',
                            children: (
                              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                <div>
                                  <strong>Ngành đăng ký:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.major}</p>
                                </div>
                                <div>
                                  <strong>Trường:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>
                                    {universities.find(u => u.code === selectedApplication.university)?.name || selectedApplication.university}
                                  </p>
                                </div>
                                <div>
                                  <strong>Điểm xét tuyển học bạ:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>
                                    {selectedApplication.transcriptScore} ({selectedApplication.transcriptSubjects})
                                  </p>
                                </div>
                                <div>
                                  <strong>Đợt tuyển sinh:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.enrollmentPeriod}</p>
                                </div>
                                <div>
                                  <strong>Ngày nộp:</strong>
                                  <p style={{ margin: '4px 0 0 0' }}>{selectedApplication.submissionDate}</p>
                                </div>
                              </Space>
                            ),
                          },
                          {
                            key: 'documents',
                            label: 'Tài liệu đính kèm',
                            children: (
                              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                {(selectedApplication.documents || []).map((doc, idx) => (
                                  <div key={idx} style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                                    <Space>
                                      <FileTextOutlined />
                                      <span>{doc.name}</span>
                                      <Button type="text" size="small">Xem</Button>
                                    </Space>
                                  </div>
                                ))}
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </Col>

                    {/* Right Column */}
                    <Col span={12} style={{ padding: 24, background: '#fafafa', overflowY: 'auto', maxHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ marginBottom: 16 }}>Xem trước Tài liệu Minh chứng</h3>

                      <div style={{ flex: 1, overflow: 'auto', marginBottom: 24 }}>
                        {selectedApplication.documents && selectedApplication.documents[0] && (
                          <Card style={{ marginBottom: 16 }}>
                            <p style={{ marginBottom: 8, fontWeight: 600 }}>
                              {selectedApplication.documents[0].name}
                            </p>
                            <div style={{ width: '100%', height: 300, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#999' }}>
                              [Xem trước hình ảnh/PDF]
                            </div>
                          </Card>
                        )}

                        {selectedApplication.documents && selectedApplication.documents[1] && (
                          <Card>
                            <p style={{ marginBottom: 8, fontWeight: 600 }}>
                              {selectedApplication.documents[1].name}
                            </p>
                            <div style={{ width: '100%', height: 300, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#999' }}>
                              [Xem trước hình ảnh/PDF]
                            </div>
                          </Card>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <Space style={{ width: '100%', gap: 12 }}>
                        <Button
                          danger
                          block
                          size="large"
                          icon={<CloseOutlined />}
                          onClick={handleRejectApplication}
                        >
                          Từ chối
                        </Button>
                        <Button
                          type="primary"
                          block
                          size="large"
                          style={{ background: '#52c41a' }}
                          icon={<CheckOutlined />}
                          onClick={handleApproveApplication}
                        >
                          Phê duyệt
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                )}
              </Drawer>

              {/* Reject Modal */}
              <Modal
                title="Lý do từ chối"
                open={isRejectModalVisible}
                onOk={handleConfirmReject}
                onCancel={() => setIsRejectModalVisible(false)}
                okText="Từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập lý do từ chối..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </Modal>
            </div>
          )}

          {/* Email Configuration */}
          {activeMenu === 'email' && (
            <div>
              <h1 style={{ marginBottom: 24 }}>Cấu hình Email Thông báo</h1>

              {/* Email Settings */}
              <Card style={{ marginBottom: 24 }} title="Cài đặt tự động gửi Email">
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12}>
                    <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                      <p style={{ marginBottom: 12, fontWeight: 500 }}>
                        Bật/Tắt tự động gửi email khi trạng thái hồ sơ thay đổi
                      </p>
                      <Space>
                        <Switch
                          checked={autoEmailEnabled}
                          onChange={setAutoEmailEnabled}
                          style={{ scale: 1.2 }}
                        />
                      </Space>
                      <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
                        {autoEmailEnabled ? '✓ Email sẽ được gửi tự động khi hồ sơ thay đổi trạng thái' : '✗ Email được vô hiệu hóa'}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Email Templates */}
              <Card title="Cấu hình Mẫu Email" loading={loadingData}>
                {emailTemplates.length >= 3 ? (
                  <Tabs
                    items={[
                      {
                        key: 'registration',
                        label: '📋 Đăng ký nộp hồ sơ thành công',
                        children: (
                          <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Tiêu đề Email:</strong>
                              </p>
                              <Input
                                value={emailTemplates[0]?.subject || ''}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[0].subject = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                                placeholder="Tiêu đề mẫu với các biến: {fullName}, {id}, {schoolName}, {majorName}"
                              />
                            </div>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Nội dung Email:</strong>
                              </p>
                              <Input.TextArea
                                rows={8}
                                value={emailTemplates[0]?.content || ''}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[0].content = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                                placeholder="Nội dung mẫu với các biến: {fullName}, {id}, {schoolName}, {majorName}"
                              />
                            </div>
                            <Button type="primary" loading={savingTemplate} onClick={() => handleSaveEmailTemplate(0)}>
                              Lưu mẫu
                            </Button>
                          </Space>
                        ),
                      },
                      {
                        key: 'approved',
                        label: '✅ Đã phê duyệt',
                        children: (
                          <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Tiêu đề Email:</strong>
                              </p>
                              <Input
                                value={emailTemplates[1]?.subject || ''}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[1].subject = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                                placeholder="Tiêu đề mẫu"
                              />
                            </div>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Nội dung Email:</strong>
                              </p>
                              <Input.TextArea
                                rows={8}
                                value={emailTemplates[1]?.content || ''}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[1].content = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                                placeholder="Nội dung mẫu"
                              />
                            </div>
                            <Button type="primary" loading={savingTemplate} onClick={() => handleSaveEmailTemplate(1)}>
                              Lưu mẫu
                            </Button>
                          </Space>
                        ),
                      },
                      {
                        key: 'rejected',
                        label: '❌ Từ chối',
                        children: (
                          <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Tiêu đề Email:</strong>
                              </p>
                              <Input
                                value={emailTemplates[2]?.subject || ''}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[2].subject = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                                placeholder="Tiêu đề mẫu"
                              />
                            </div>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Nội dung Email:</strong>
                              </p>
                              <Input.TextArea
                                rows={8}
                                value={emailTemplates[2]?.content || ''}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[2].content = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                                placeholder="Nội dung mẫu"
                              />
                            </div>
                            <Button type="primary" loading={savingTemplate} onClick={() => handleSaveEmailTemplate(2)}>
                              Lưu mẫu
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>Đang tải danh sách mẫu template...</p>
                )}
              </Card>

              {/* Email Logs */}
              <Card style={{ marginTop: 24 }} title={`📧 Lịch sử gửi Email (${emailLogs.length})`}>
                <Table
                  columns={emailLogColumns}
                  dataSource={emailLogs}
                  rowKey="id"
                  loading={loadingData}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                />
              </Card>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;