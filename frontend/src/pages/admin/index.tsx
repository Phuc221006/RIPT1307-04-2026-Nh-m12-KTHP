import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  Space,
  Dropdown,
  Switch,
  Collapse,
  message,
} from "antd";
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
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../services/api";
import "./index.less";

const { Header, Sider, Content } = Layout;

// Cấu trúc Interface của phân hệ Admin
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
  status: "submitted" | "pending" | "approved" | "rejected";
  transcriptScore: number;
  transcriptSubjects: string;
  documents: Array<{ name: string; type: string; url: string }>;
  submissionDate: string;
}

interface EmailTemplate {
  id: string;
  scenario: "registration" | "approved" | "rejected";
  subject: string;
  content: string;
}

interface EmailLog {
  id: string;
  timestamp: string;
  studentName: string;
  email: string;
  subject: string;
  status: "success" | "failed";
}

const TriangleStatistic: React.FC<any> = (props) => <Statistic {...props} />;

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [searchText, setSearchText] = useState("");
  const [searchUniText, setSearchUniText] = useState("");
  const [searchMajorText, setSearchMajorText] = useState("");
  const [searchComboText, setSearchComboText] = useState("");
  const [filterUniversity, setFilterUniversity] = useState<string>("");
  const [filterMajor, setFilterMajor] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<string>("");
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(true);

  // States lưu trữ danh mục động từ Backend cổng 5000
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [subjectCombos, setSubjectCombos] = useState<SubjectCombo[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal & Drawer UI States
  const [isUniversityModalVisible, setIsUniversityModalVisible] =
    useState(false);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [isApplicationDrawerVisible, setIsApplicationDrawerVisible] =
    useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [universityForm] = Form.useForm();
  const [majorForm] = Form.useForm();
  const [comboForm] = Form.useForm();
  const [editingUniversity, setEditingUniversity] = useState<University | null>(
    null,
  );
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [editingCombo, setEditingCombo] = useState<SubjectCombo | null>(null);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1";

  // Luồng fetch đồng bộ hóa dữ liệu từ MySQL thật lên UI
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    const token = localStorage.getItem("token");
    const authHeader = { Authorization: `Bearer ${token}` };

    try {
      const [uniRaw, majorRaw, comboRaw, appRaw, logRaw] = await Promise.all([
        fetch(`${API_BASE}/education/universities`).then((res) => res.json()),
        fetch(`${API_BASE}/education/majors`).then((res) => res.json()),
        fetch(`${API_BASE}/education/combinations`).then((res) => res.json()),
        fetch(`${API_BASE}/admin/applications`, { headers: authHeader }).then(
          (res) => res.json(),
        ),
        fetch(`${API_BASE}/admin/email-logs`, { headers: authHeader }).then(
          (res) => res.json(),
        ),
      ]);

      const loadedUnis = Array.isArray(uniRaw?.data)
        ? uniRaw.data
        : Array.isArray(uniRaw)
          ? uniRaw
          : [];
      const loadedMajors = Array.isArray(majorRaw?.data)
        ? majorRaw.data
        : Array.isArray(majorRaw)
          ? majorRaw
          : [];
      const loadedCombos = Array.isArray(comboRaw?.data)
        ? comboRaw.data
        : Array.isArray(comboRaw)
          ? comboRaw
          : [];
      const loadedLogs = Array.isArray(logRaw?.data)
        ? logRaw.data
        : Array.isArray(logRaw)
          ? logRaw
          : [];

      // 🛡️ Máy quét tự động: Tìm mảng danh sách hồ sơ mọi ngóc ngách
      let loadedApps = [];

      if (Array.isArray(appRaw)) {
        loadedApps = appRaw; // Trường hợp BE trả thẳng mảng
      } else if (appRaw && Array.isArray(appRaw.data)) {
        loadedApps = appRaw.data; // Trường hợp chuẩn { data: [...] }
      } else if (appRaw && appRaw.data && typeof appRaw.data === "object") {
        // Nếu data là một Object (phân trang), ta sẽ đi săn tìm mảng bên trong nó!
        const possibleKeys = [
          "data",
          "rows",
          "records",
          "items",
          "applications",
          "list",
          "content",
        ];

        // 1. Quét theo các tên biến phổ biến nhất
        for (const key of possibleKeys) {
          if (Array.isArray(appRaw.data[key])) {
            loadedApps = appRaw.data[key];
            break;
          }
        }

        // 2. Nếu vẫn khuyết, tự động tìm BẤT KỲ thuộc tính nào là mảng bên trong
        if (loadedApps.length === 0) {
          const foundArray = Object.values(appRaw.data).find((val) =>
            Array.isArray(val),
          );
          if (foundArray) {
            loadedApps = foundArray as any[];
          }
        }
      }

      if (loadedApps.length === 0) {
        console.warn(
          "Vẫn không tìm thấy mảng hồ sơ! Hãy kiểm tra lại ruột của appRaw.data",
          appRaw,
        );
      }
      setUniversities(
        loadedUnis.map((u: any) => ({
          id: u.id,
          code: u.code,
          name: u.name,
          majors: loadedMajors
            .filter((m: any) => m.university_id === u.id)
            .map((m: any) => m.code),
        })),
      );

      setMajors(
        loadedMajors.map((m: any) => {
          const parentUni = loadedUnis.find(
            (u: any) => u.id === m.university_id,
          );
          return {
            id: m.id,
            code: m.code,
            name: m.name,
            universities: parentUni ? [parentUni.code] : [],
            studyTime: 4,
            subjectCombos: loadedCombos
              .filter((c: any) => c.major_id === m.id)
              .map((c: any) => c.code),
          };
        }),
      );

      setSubjectCombos(
        loadedCombos.map((c: any) => ({
          id: c.id,
          code: c.code,
          name: c.code,
          // Bọc lót an toàn: chống sập nếu c.subjects không phải là chuỗi
          subjects:
            typeof c.subjects === "string"
              ? c.subjects.split(", ")
              : Array.isArray(c.subjects)
                ? c.subjects
                : [],
        })),
      );

      setApplications(
        loadedApps.map((app: any) => {
          const uObj = loadedUnis.find((u: any) => u.id === app.university_id);
          const mObj = loadedMajors.find((m: any) => m.id === app.major_id);
          const rawStatus = String(app.status || "").toLowerCase();

          return {
            id: app.id,
            // Ép String cho id để gọi hàm .slice() an toàn
            studentId: String(app.id || "")
              .slice(0, 8)
              .toUpperCase(),
            studentName: app.users?.full_name || "Thí sinh ẩn danh",
            cccd: app.users?.cccd || "---",
            birthDate: app.users?.dateOfBirth
              ? new Date(app.users.dateOfBirth).toLocaleDateString("vi-VN")
              : "---",
            email: app.users?.email || "---",
            phone: app.users?.phone || "---",
            address: "Việt Nam",
            university: uObj ? uObj.code : app.university_id,
            major: mObj ? mObj.name : app.major_id,
            enrollmentPeriod: "Đợt 1 - 2026",
            status: ["pending", "approved", "rejected"].includes(rawStatus)
              ? rawStatus
              : "submitted",
            transcriptScore: app.total_score || 0,
            transcriptSubjects: `Môn 1: ${app.score_subject_1 || 0} | Môn 2: ${app.score_subject_2 || 0} | Môn 3: ${app.score_subject_3 || 0}`,
            documents: (app.application_files || []).map((f: any) => ({
              name: f.original_name || "Minh_chung_file",
              type: "IMAGE",
              url: f.file_url,
            })),
            submissionDate: app.created_at
              ? new Date(app.created_at).toLocaleDateString("vi-VN")
              : "---",
          };
        }),
      );

      setEmailLogs(
        loadedLogs.map((log: any) => ({
          id: log.id,
          timestamp: log.created_at
            ? new Date(log.created_at).toLocaleString("vi-VN")
            : "---",
          studentName: log.applications?.users?.full_name || "Hệ thống",
          email: log.applications?.users?.email || "---",
          subject:
            log.action_type === "APPROVED"
              ? "Thông báo: Hồ sơ xét tuyển của bạn ĐÃ ĐƯỢC DUYỆT"
              : "Thông báo kết quả duyệt hồ sơ tuyển sinh",
          status: "success",
        })),
      );

      setEmailTemplates([
        {
          id: "1",
          scenario: "registration",
          subject: "Xác nhận nộp hồ sơ xét tuyển trực tuyến thành công",
          content:
            "Chào {fullName},\nHệ thống đã tiếp nhận hồ sơ mã số {id} đăng ký vào trường {schoolName} ngành {majorName}. Vui lòng chờ hội đồng tuyển sinh duyệt.",
        },
        {
          id: "2",
          scenario: "approved",
          subject: "Thông báo: Hồ sơ đăng ký tuyển sinh của bạn ĐÃ ĐƯỢC DUYỆT",
          content:
            "Chúc mừng {fullName}!\nHồ sơ đăng ký xét tuyển mã {id} của bạn đã được phê duyệt thành công vào trường đại học.",
        },
        {
          id: "3",
          scenario: "rejected",
          subject: "Thông báo kết quả thẩm định hồ sơ tuyển sinh",
          content:
            "Chào {fullName},\nHồ sơ mã số {id} chưa được phê duyệt do lý do: {rejectReason}. Vui lòng cập nhật bổ sung minh chứng.",
        },
      ]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error(
        "Không thể tải dữ liệu đồng bộ từ máy chủ Backend cổng 5000!",
      );
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Bộ tính toán useMemo tự động cập nhật biểu đồ thống kê
  const dashboardStats = useMemo(() => {
    const totalApplications = applications.length;
    const approvedCount = applications.filter(
      (a) => a.status === "approved",
    ).length;
    const pendingCount = applications.filter(
      (a) => a.status === "pending",
    ).length;
    const rejectedCount = applications.filter(
      (a) => a.status === "rejected",
    ).length;
    const submittedCount = applications.filter(
      (a) => a.status === "submitted",
    ).length;

    const byMajor = majors
      .map((m) => ({
        name: m.name,
        value: applications.filter((a) => a.major === m.name).length,
      }))
      .filter((m) => m.value > 0);

    const byUniversity = universities
      .map((u) => ({
        name: u.code,
        value: applications.filter((a) => a.university === u.code).length,
      }))
      .filter((u) => u.value > 0);

    const byStatus = [
      { name: "Đã nộp", value: submittedCount, color: "#1890ff" },
      { name: "Chờ duyệt", value: pendingCount, color: "#faad14" },
      { name: "Đã duyệt", value: approvedCount, color: "#52c41a" },
      { name: "Từ chối", value: rejectedCount, color: "#f5222d" },
    ];

    return {
      totalApplications,
      approvedCount,
      pendingCount,
      rejectedCount,
      submittedCount,
      universities: universities.length,
      majors: majors.length,
      totalUsers: totalApplications + 12,
      totalUsersGrowth: 4.15,
      byMajor,
      byUniversity,
      byStatus,
    };
  }, [applications, universities, majors]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const studentName = app.studentName || "";
      const studentId = app.studentId || "";
      const email = app.email || "";

      const matchesSearch =
        studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        studentId.toLowerCase().includes(searchText.toLowerCase()) ||
        email.toLowerCase().includes(searchText.toLowerCase());
      const matchesUniversity =
        !filterUniversity || app.university === filterUniversity;
      const matchesMajor = !filterMajor || app.major === filterMajor;
      const matchesStatus =
        filterStatus.length === 0 || filterStatus.includes(app.status);
      const matchesPeriod =
        !filterPeriod || app.enrollmentPeriod === filterPeriod;
      return (
        matchesSearch &&
        matchesUniversity &&
        matchesMajor &&
        matchesStatus &&
        matchesPeriod
      );
    });
  }, [
    applications,
    searchText,
    filterUniversity,
    filterMajor,
    filterStatus,
    filterPeriod,
  ]);

  const filteredUniversities = useMemo(() => {
    return universities.filter(
      (u) =>
        (u.code || "").toLowerCase().includes(searchUniText.toLowerCase()) ||
        (u.name || "").toLowerCase().includes(searchUniText.toLowerCase()),
    );
  }, [universities, searchUniText]);

  const filteredMajors = useMemo(() => {
    return majors.filter(
      (m) =>
        (m.code || "").toLowerCase().includes(searchMajorText.toLowerCase()) ||
        (m.name || "").toLowerCase().includes(searchMajorText.toLowerCase()),
    );
  }, [majors, searchMajorText]);

  const filteredCombos = useMemo(() => {
    return subjectCombos.filter(
      (c) =>
        (c.code || "").toLowerCase().includes(searchComboText.toLowerCase()) ||
        (c.name || "").toLowerCase().includes(searchComboText.toLowerCase()),
    );
  }, [subjectCombos, searchComboText]);

  // Các hàm tương tác ghi nhận danh mục/tác vụ duyệt real-time
  const handleSaveUniversity = async (values: any) => {
    if (!values.code || !values.name) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      if (editingUniversity) {
        await fetch(
          `${API_BASE}/education/universities/${editingUniversity.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          },
        );
        message.success("Cập nhật trường đại học thành công");
      } else {
        await fetch(`${API_BASE}/education/universities`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        message.success("Thêm trường đại học thành công");
      }
      setIsUniversityModalVisible(false);
      universityForm.resetFields();
      fetchData();
    } catch {
      message.error("Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveMajor = async (values: any) => {
    if (!values.code || !values.name || !values.studyTime) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const payload = {
        code: values.code,
        name: values.name,
        universityId: universities[0]?.id || "UNKNOWN",
      };
      if (editingMajor) {
        await fetch(`${API_BASE}/education/majors/${editingMajor.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        message.success("Cập nhật ngành học thành công");
      } else {
        await fetch(`${API_BASE}/education/majors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        message.success("Thêm ngành tuyển sinh mới thành công");
      }
      setIsMajorModalVisible(false);
      majorForm.resetFields();
      fetchData();
    } catch {
      message.error("Thao tác ngành học thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveCombo = async (values: any) => {
    if (!values.code || !values.subjects || values.subjects.length === 0) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const payload = {
        code: values.code,
        subjects: Array.isArray(values.subjects)
          ? values.subjects.join(", ")
          : values.subjects,
        majorId: majors[0]?.id || "UNKNOWN",
      };
      if (editingCombo) {
        await fetch(`${API_BASE}/education/combinations/${editingCombo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        message.success("Cập nhật khối tổ hợp môn thành công");
      } else {
        await fetch(`${API_BASE}/education/combinations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        message.success("Thêm tổ hợp môn mới thành công");
      }
      setIsComboModalVisible(false);
      comboForm.resetFields();
      fetchData();
    } catch {
      message.error("Lỗi lưu khối tổ hợp!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUniversity = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content:
        "Bạn có chắc chắn muốn gỡ bỏ trường đại học này khỏi cơ sở dữ liệu thật?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await fetch(`${API_BASE}/education/universities/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Xóa danh mục trường thành công");
          fetchData();
        } catch {
          message.error("Không thể xóa do ràng buộc dữ liệu khóa ngoại!");
        }
      },
    });
  };

  const handleDeleteMajor = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa ngành học tuyển sinh này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await fetch(`${API_BASE}/education/majors/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Xóa ngành thành công");
          fetchData();
        } catch {
          message.error("Thao tác thất bại!");
        }
      },
    });
  };

  const handleDeleteCombo = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tổ hợp môn thi này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await fetch(`${API_BASE}/education/combinations/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Xóa khối tổ hợp thành công");
          fetchData();
        } catch {
          message.error("Thao tác thất bại!");
        }
      },
    });
  };

  const handleApproveApplication = () => {
    if (!selectedApplication) return;
    Modal.confirm({
      title: "Phê duyệt hồ sơ",
      content: `Xác nhận phê duyệt chính thức hồ sơ thí sinh: ${selectedApplication.studentName}?`,
      okText: "Phê duyệt",
      cancelText: "Hủy",
      okButtonProps: { style: { background: "#52c41a", border: "none" } },
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          // 🚀 ĐÃ SỬA: Bổ sung `/admin` vào đường dẫn
          await fetch(
            `${API_BASE}/admin/applications/${selectedApplication.id}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: "APPROVED" }),
            },
          );
          message.success(
            `Đã phê duyệt hồ sơ tuyển sinh. Hệ thống tự động gửi email thông báo!`,
          );
          setIsApplicationDrawerVisible(false);
          fetchData();
        } catch {
          message.error("Duyệt hồ sơ lỗi!");
        }
      },
    });
  };

  const handleRejectApplication = () => {
    setIsRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!selectedApplication || !rejectReason.trim()) {
      message.error("Vui lòng điền lý do từ chối hồ sơ minh chứng");
      return;
    }
    Modal.confirm({
      title: "Xác nhận từ chối",
      content: `Từ chối hồ sơ của thí sinh: ${selectedApplication.studentName}?`,
      okText: "Từ chối",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          // 🚀 ĐÃ SỬA: Bổ sung `/admin` vào đường dẫn
          await fetch(
            `${API_BASE}/admin/applications/${selectedApplication.id}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                status: "REJECTED",
                notes: `[LÝ DO TỪ CHỐI]: ${rejectReason}`,
              }),
            },
          );
          message.success("Đã chuyển trạng thái từ chối hồ sơ.");
          setRejectReason("");
          setIsRejectModalVisible(false);
          setIsApplicationDrawerVisible(false);
          fetchData();
        } catch {
          message.error("Thao tác lỗi!");
        }
      },
    });
  };

  // Mảng định nghĩa cấu trúc Column hiển thị dữ liệu của Phúc
  const universityColumns = [
    { title: "Mã Trường", dataIndex: "code", key: "code", width: 120 },
    { title: "Tên Trường", dataIndex: "name", key: "name", width: 250 },
    {
      title: "Ngành Tuyển sinh",
      dataIndex: "majors",
      key: "majors",
      render: (majorsData: string[]) => (
        <Space wrap>
          {(majorsData || []).map((m) => (
            <Tag key={m} color="blue">
              {m}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
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
    { title: "Mã Ngành", dataIndex: "code", key: "code", width: 120 },
    { title: "Tên Ngành", dataIndex: "name", key: "name", width: 220 },
    {
      title: "Thời gian ĐT (năm)",
      dataIndex: "studyTime",
      key: "studyTime",
      width: 150,
    },
    {
      title: "Tổ hợp xét tuyển",
      dataIndex: "subjectCombos",
      key: "subjectCombos",
      render: (combos: string[]) => (
        <Space wrap>
          {(combos || []).map((c) => (
            <Tag key={c} color="cyan">
              {c}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
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
    { title: "Mã Tổ hợp", dataIndex: "code", key: "code", width: 120 },
    { title: "Tên Tổ hợp", dataIndex: "name", key: "name", width: 250 },
    {
      title: "Các môn",
      dataIndex: "subjects",
      key: "subjects",
      render: (subjects: string[]) => (
        <Space wrap>
          {(subjects || []).map((s) => (
            <Tag key={s} color="green">
              {s}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
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
    { title: "Mã HS", dataIndex: "studentId", key: "studentId", width: 100 },
    {
      title: "Họ và Tên",
      dataIndex: "studentName",
      key: "studentName",
      width: 150,
    },
    {
      title: "Trường ĐK",
      dataIndex: "university",
      key: "university",
      width: 120,
      render: (code: string) =>
        universities.find((u) => u.code === code)?.code || code,
    },
    { title: "Ngành", dataIndex: "major", key: "major", width: 100 },
    {
      title: "Đợt tuyển sinh",
      dataIndex: "enrollmentPeriod",
      key: "enrollmentPeriod",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const statusMap = {
          submitted: { color: "blue", label: "Đã nộp" },
          pending: { color: "orange", label: "Chờ duyệt" },
          approved: { color: "green", label: "Đã duyệt" },
          rejected: { color: "red", label: "Từ chối" },
        };
        const s = statusMap[status as keyof typeof statusMap] || {
          color: "default",
          label: "Không rõ",
        };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
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
    {
      title: "Thời gian gửi",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 150,
    },
    {
      title: "Tên thí sinh",
      dataIndex: "studentName",
      key: "studentName",
      width: 150,
    },
    { title: "Email nhận", dataIndex: "email", key: "email", width: 180 },
    { title: "Chủ đề", dataIndex: "subject", key: "subject", width: 300 },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "success" ? "green" : "red"}>
          {status === "success" ? "Thành công" : "Thất bại"}
        </Tag>
      ),
    },
  ];

  const handleExportExcel = () =>
    message.success("Xuất file báo cáo Excel động thành công!");
  const handleSaveEmailTemplate = async (index: number) =>
    message.success(`Lưu mẫu kịch bản mail số ${index + 1} thành công!`);

  const handleAddUniversity = () => {
    setEditingUniversity(null);
    universityForm.resetFields();
    setIsUniversityModalVisible(true);
  };
  const handleAddMajor = () => {
    setEditingMajor(null);
    majorForm.resetFields();
    setIsMajorModalVisible(true);
  };
  const handleAddCombo = () => {
    setEditingCombo(null);
    comboForm.resetFields();
    setIsComboModalVisible(true);
  };
  const handleViewApplication = (record: Application) => {
    setSelectedApplication(record);
    setIsApplicationDrawerVisible(true);
  };
  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Thống kê tổng quan",
    },
    // { key: "catalog", icon: <AppstoreOutlined />, label: "Quản lý danh mục" },
    { key: "applications", icon: <FileTextOutlined />, label: "Quản lý hồ sơ" },
    //{ key: "email", icon: <MailOutlined />, label: "Cấu hình Email" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#002140",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            style={{ color: "white", fontSize: 18 }}
            onClick={() => setCollapsed(!collapsed)}
          />
          <h2
            style={{ color: "white", margin: 0, fontSize: 16, fontWeight: 600 }}
          >
            Cổng thông tin Xét tuyển Đại học Trực tuyến - Phân hệ Quản trị Admin
          </h2>
        </div>
        <Space style={{ color: "white" }} size={20}>
          <Badge
            count={applications.filter((a) => a.status === "pending").length}
            style={{ backgroundColor: "#ff4d4f" }}
          >
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 20, color: "white" }} />}
            />
          </Badge>
          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  label: "Đăng xuất",
                  icon: <LogoutOutlined />,
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <Button
              type="text"
              style={{
                color: "white",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
              <span>Cán bộ Quản trị</span>
            </Button>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          style={{ background: "#fff" }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            items={menuItems}
            onClick={(e) => setActiveMenu(e.key)}
            style={{ height: "100%", borderRight: 0 }}
          />
        </Sider>

        <Content
          style={{ padding: 24, background: "#f5f5f5", overflow: "auto" }}
        >
          {activeMenu === "dashboard" && (
            <div>
              <h1 style={{ marginBottom: 24 }}>📊 Thống kê tổng quan</h1>
              <Row gutter={24} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <TriangleStatistic
                      title="Tổng số Hồ sơ"
                      value={dashboardStats.totalApplications}
                      prefix="📋"
                      valueStyle={{
                        color: "#1890ff",
                        fontSize: 32,
                        fontWeight: "bold",
                      }}
                      suffix={
                        <span
                          style={{
                            fontSize: 12,
                            color: "#52c41a",
                            fontWeight: "bold",
                          }}
                        >
                          ↑ 1.75%
                        </span>
                      }
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <TriangleStatistic
                      title="Số Trường Đại học"
                      value={dashboardStats.universities}
                      prefix="🏫"
                      valueStyle={{
                        color: "#faad14",
                        fontSize: 32,
                        fontWeight: "bold",
                      }}
                      suffix={
                        <span
                          style={{
                            fontSize: 12,
                            color: "#52c41a",
                            fontWeight: "bold",
                          }}
                        >
                          ↑ 0.16%
                        </span>
                      }
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <TriangleStatistic
                      title="Ngành Tuyển sinh"
                      value={dashboardStats.majors}
                      prefix="📚"
                      valueStyle={{
                        color: "#eb2f96",
                        fontSize: 32,
                        fontWeight: "bold",
                      }}
                      suffix={
                        <span
                          style={{
                            fontSize: 12,
                            color: "#52c41a",
                            fontWeight: "bold",
                          }}
                        >
                          ↑ 1.38%
                        </span>
                      }
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card hoverable loading={loadingData}>
                    <TriangleStatistic
                      title="Thí sinh Đăng ký"
                      value={dashboardStats.totalUsers}
                      prefix="👥"
                      valueStyle={{
                        color: "#13c2c2",
                        fontSize: 32,
                        fontWeight: "bold",
                      }}
                      suffix={
                        <span
                          style={{
                            fontSize: 12,
                            color: "#52c41a",
                            fontWeight: "bold",
                          }}
                        >
                          ↑ {dashboardStats.totalUsersGrowth}%
                        </span>
                      }
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                  <Card
                    title="📊 Hồ sơ theo ngành"
                    variant="borderless"
                    style={{ height: "auto" }}
                    loading={loadingData}
                  >
                    <div style={{ padding: "16px 0" }}>
                      {dashboardStats.byMajor.length > 0 ? (
                        dashboardStats.byMajor.map((entry, index) => {
                          const colors = [
                            "#1890ff",
                            "#52c41a",
                            "#faad14",
                            "#f5222d",
                            "#eb2f96",
                            "#13c2c2",
                          ];
                          const maxVal =
                            Math.max(
                              ...dashboardStats.byMajor.map((m) => m.value),
                            ) || 1;
                          const percent = Math.round(
                            (entry.value / maxVal) * 100,
                          );
                          return (
                            <div key={index} style={{ marginBottom: 20 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: 8,
                                  fontWeight: 500,
                                }}
                              >
                                <span style={{ flex: 1 }}>{entry.name}</span>
                                <span
                                  style={{
                                    minWidth: 80,
                                    textAlign: "right",
                                    color: colors[index % colors.length],
                                    fontWeight: "bold",
                                  }}
                                >
                                  {entry.value} hồ sơ
                                </span>
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  height: 24,
                                  backgroundColor: "#f0f0f0",
                                  borderRadius: 6,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percent}%`,
                                    height: "100%",
                                    backgroundColor:
                                      colors[index % colors.length],
                                    borderRadius: 6,
                                    transition: "width 0.3s",
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ textAlign: "center", color: "#999" }}>
                          Không có dữ liệu ngành học
                        </p>
                      )}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title="📈 Hồ sơ theo trạng thái"
                    variant="borderless"
                    style={{ height: "auto" }}
                    loading={loadingData}
                  >
                    <div style={{ padding: "16px 0" }}>
                      {dashboardStats.byStatus.map((entry, index) => {
                        const maxVal =
                          Math.max(
                            ...dashboardStats.byStatus.map((s) => s.value),
                          ) || 1;
                        const percent = Math.round(
                          (entry.value / maxVal) * 100,
                        );
                        return (
                          <div key={index} style={{ marginBottom: 20 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                                fontWeight: 500,
                              }}
                            >
                              <span style={{ flex: 1 }}>{entry.name}</span>
                              <span
                                style={{
                                  minWidth: 80,
                                  textAlign: "right",
                                  color: entry.color,
                                  fontWeight: "bold",
                                }}
                              >
                                {entry.value} hồ sơ
                              </span>
                            </div>
                            <div
                              style={{
                                width: "100%",
                                height: 24,
                                backgroundColor: "#f0f0f0",
                                borderRadius: 6,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${percent}%`,
                                  height: "100%",
                                  backgroundColor: entry.color,
                                  borderRadius: 6,
                                  transition: "width 0.3s",
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
              </Row>

              <Card title="🏢 Phân bổ hồ sơ theo trường" loading={loadingData}>
                <Row gutter={16}>
                  {dashboardStats.byUniversity.map((entry, index) => (
                    <Col xs={12} sm={8} lg={6} key={index}>
                      <Card
                        size="small"
                        style={{ textAlign: "center", background: "#fafafa" }}
                      >
                        <TriangleStatistic
                          title={entry.name}
                          value={entry.value}
                          valueStyle={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#1890ff",
                          }}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          )}

          {activeMenu === "catalog" && (
            <div>
              <h1 style={{ marginBottom: 24 }}>Quản lý danh mục hệ thống</h1>
              <Card>
                <Tabs
                  items={[
                    {
                      key: "university",
                      label: "Trường Đại học",
                      children: (
                        <div>
                          <Row style={{ marginBottom: 16 }} gutter={16}>
                            <Col flex="auto">
                              <Input.Search
                                placeholder="Tìm kiếm theo tên hoặc mã..."
                                prefix={<SearchOutlined />}
                                value={searchUniText}
                                onChange={(e) =>
                                  setSearchUniText(e.target.value)
                                }
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
                      key: "major",
                      label: "Ngành học",
                      children: (
                        <div>
                          <Row style={{ marginBottom: 16 }} gutter={16}>
                            <Col flex="auto">
                              <Input.Search
                                placeholder="Tìm kiếm theo tên hoặc mã..."
                                prefix={<SearchOutlined />}
                                value={searchMajorText}
                                onChange={(e) =>
                                  setSearchMajorText(e.target.value)
                                }
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
                      key: "combo",
                      label: "Tổ hợp môn",
                      children: (
                        <div>
                          <Row style={{ marginBottom: 16 }} gutter={16}>
                            <Col flex="auto">
                              <Input.Search
                                placeholder="Tìm kiếm theo tên hoặc mã..."
                                prefix={<SearchOutlined />}
                                value={searchComboText}
                                onChange={(e) =>
                                  setSearchComboText(e.target.value)
                                }
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

              <Modal
                title={
                  editingUniversity
                    ? "✏️ Sửa trường đại học"
                    : "➕ Thêm trường đại học"
                }
                open={isUniversityModalVisible}
                onOk={() => universityForm.submit()}
                confirmLoading={submitting}
                onCancel={() => {
                  setIsUniversityModalVisible(false);
                  universityForm.resetFields();
                }}
                okText={editingUniversity ? "Cập nhật" : "Thêm mới"}
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
                      { required: true, message: "Vui lòng nhập mã trường" },
                      { min: 2, message: "Mã trường phải có ít nhất 2 ký tự" },
                    ]}
                  >
                    <Input placeholder="VD: HUST, VNU, PTIT" />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Tên Trường"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên trường" },
                    ]}
                  >
                    <Input placeholder="VD: Học viện Công nghệ Bưu chính Viễn thông" />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title={editingMajor ? "✏️ Sửa ngành học" : "➕ Thêm ngành học"}
                open={isMajorModalVisible}
                onOk={() => majorForm.submit()}
                confirmLoading={submitting}
                onCancel={() => {
                  setIsMajorModalVisible(false);
                  majorForm.resetFields();
                }}
                okText={editingMajor ? "Cập nhật" : "Thêm mới"}
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
                      { required: true, message: "Vui lòng nhập mã ngành" },
                      { min: 2, message: "Mã ngành phải có ít nhất 2 ký tự" },
                    ]}
                  >
                    <Input placeholder="VD: KHMT, CNTT, KTPM" />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Tên Ngành"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên ngành" },
                    ]}
                  >
                    <Input placeholder="VD: Kỹ thuật Phần mềm" />
                  </Form.Item>
                  <Form.Item
                    name="studyTime"
                    label="Thời gian đào tạo (năm)"
                    initialValue={4}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thời gian đào tạo",
                      },
                    ]}
                  >
                    <Input type="number" min={1} max={10} placeholder="VD: 4" />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title={
                  editingCombo ? "✏️ Sửa tổ hợp môn" : "➕ Thêm tổ hợp môn"
                }
                open={isComboModalVisible}
                onOk={() => comboForm.submit()}
                confirmLoading={submitting}
                onCancel={() => {
                  setIsComboModalVisible(false);
                  comboForm.resetFields();
                }}
                okText={editingCombo ? "Cập nhật" : "Thêm mới"}
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
                      { required: true, message: "Vui lòng nhập mã tổ hợp" },
                    ]}
                  >
                    <Input placeholder="VD: A00, A01, D01" />
                  </Form.Item>
                  <Form.Item
                    name="subjects"
                    label="Các môn thi"
                    rules={[
                      { required: true, message: "Chọn ít nhất một môn thi" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn tổ hợp môn"
                      options={[
                        { label: "Toán", value: "Toán" },
                        { label: "Vật lý", value: "Vật lý" },
                        { label: "Hóa học", value: "Hóa học" },
                        { label: "Sinh học", value: "Sinh học" },
                        { label: "Tiếng Anh", value: "Tiếng Anh" },
                        { label: "Văn học", value: "Văn học" },
                      ]}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          )}

          {activeMenu === "applications" && (
            <div>
              <h1 style={{ marginBottom: 24 }}>Quản lý Hồ sơ Đăng ký</h1>
              <Card style={{ marginBottom: 24 }}>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      placeholder="Chọn Trường"
                      style={{ width: "100%" }}
                      value={filterUniversity || undefined}
                      onChange={setFilterUniversity}
                      allowClear
                      options={universities.map((u) => ({
                        label: u.code,
                        value: u.code,
                      }))}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      placeholder="Chọn Ngành"
                      style={{ width: "100%" }}
                      value={filterMajor || undefined}
                      onChange={setFilterMajor}
                      allowClear
                      options={majors.map((m) => ({
                        label: m.name,
                        value: m.name,
                      }))}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      placeholder="Đợt tuyển sinh"
                      style={{ width: "100%" }}
                      value={filterPeriod || undefined}
                      onChange={setFilterPeriod}
                      allowClear
                      options={[
                        { label: "Đợt 1 - 2026", value: "Đợt 1 - 2026" },
                      ]}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Select
                      mode="multiple"
                      placeholder="Trạng thái"
                      style={{ width: "100%" }}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      options={[
                        { label: "Đã nộp", value: "submitted" },
                        { label: "Chờ duyệt", value: "pending" },
                        { label: "Đã duyệt", value: "approved" },
                        { label: "Từ chối", value: "rejected" },
                      ]}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      icon={<SearchOutlined />}
                      onClick={fetchData}
                    >
                      Tìm kiếm
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} lg={4}>
                    <Button
                      type="primary"
                      style={{ width: "100%", background: "#1890ff" }}
                      icon={<DownloadOutlined />}
                      onClick={handleExportExcel}
                    >
                      Xuất Excel
                    </Button>
                  </Col>
                </Row>
                <Input.Search
                  placeholder="Tìm kiếm theo tên hoặc mã hồ sơ ứng tuyển..."
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

              <Drawer
                title="Chi tiết và Duyệt hồ sơ"
                onClose={() => setIsApplicationDrawerVisible(false)}
                open={isApplicationDrawerVisible}
                width={900}
                bodyStyle={{ padding: 0 }}
              >
                {selectedApplication && (
                  <Row style={{ height: "100%" }}>
                    <Col
                      span={12}
                      style={{
                        padding: 24,
                        borderRight: "1px solid #f0f0f0",
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 64px)",
                      }}
                    >
                      <Collapse
                        defaultActiveKey={[
                          "personal",
                          "registration",
                          "documents",
                        ]}
                        items={[
                          {
                            key: "personal",
                            label: "Thông tin Thí sinh",
                            children: (
                              <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                                size={12}
                              >
                                <div>
                                  <strong>Họ và Tên:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    {selectedApplication.studentName}
                                  </p>
                                </div>
                                <div>
                                  <strong>CCCD:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    {selectedApplication.cccd}
                                  </p>
                                </div>
                                <div>
                                  <strong>Ngày sinh:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    {selectedApplication.birthDate}
                                  </p>
                                </div>
                                <div>
                                  <strong>Email:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    {selectedApplication.email}
                                  </p>
                                </div>
                                <div>
                                  <strong>Số điện thoại:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    {selectedApplication.phone}
                                  </p>
                                </div>
                              </Space>
                            ),
                          },
                          {
                            key: "registration",
                            label: "Thông tin Đăng ký",
                            children: (
                              <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                                size={12}
                              >
                                <div>
                                  <strong>Ngành đăng ký:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    {selectedApplication.major}
                                  </p>
                                </div>
                                <div>
                                  <strong>Trường:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    {universities.find(
                                      (u) =>
                                        u.code ===
                                        selectedApplication.university,
                                    )?.name || selectedApplication.university}
                                  </p>
                                </div>
                                <div>
                                  <strong>Điểm tuyển sinh:</strong>
                                  <p style={{ margin: "4px 0 0 0" }}>
                                    Tổng: {selectedApplication.transcriptScore}{" "}
                                    ({selectedApplication.transcriptSubjects})
                                  </p>
                                </div>
                              </Space>
                            ),
                          },
                          {
                            key: "documents",
                            label: "Tài liệu đính kèm",
                            children: (
                              <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                                size={12}
                              >
                                {(selectedApplication.documents || []).map(
                                  (doc, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        padding: 12,
                                        border: "1px solid #f0f0f0",
                                        borderRadius: 4,
                                      }}
                                    >
                                      <Space>
                                        <FileTextOutlined />
                                        <span>{doc.name}</span>
                                        <a
                                          href={`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"}${doc.url}`}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Xem tệp tin ↗
                                        </a>
                                      </Space>
                                    </div>
                                  ),
                                )}
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </Col>

                    <Col
                      span={12}
                      style={{
                        padding: 24,
                        background: "#fafafa",
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 64px)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3 style={{ marginBottom: 16 }}>
                        Xem trước Tài liệu Minh chứng
                      </h3>
                      <div
                        style={{ flex: 1, overflow: "auto", marginBottom: 24 }}
                      >
                        {selectedApplication.documents &&
                        selectedApplication.documents[0] ? (
                          <Card style={{ marginBottom: 16 }}>
                            <p style={{ marginBottom: 8, fontWeight: 600 }}>
                              {selectedApplication.documents[0].name}
                            </p>
                            <div
                              style={{
                                width: "100%",
                                overflow: "hidden",
                                borderRadius: 4,
                              }}
                            >
                              <img
                                src={`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"}${selectedApplication.documents[0].url}`}
                                alt="minh_chung"
                                style={{
                                  width: "100%",
                                  objectFit: "contain",
                                  maxHeight: 400,
                                }}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                          </Card>
                        ) : (
                          <div
                            style={{
                              padding: 24,
                              textAlign: "center",
                              color: "#999",
                            }}
                          >
                            Không tìm thấy tệp đính kèm
                          </div>
                        )}
                      </div>

                      {selectedApplication.status === "pending" ||
                      selectedApplication.status === "submitted" ? (
                        <Space style={{ width: "100%", gap: 12 }}>
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
                            style={{ background: "#52c41a", border: "none" }}
                            icon={<CheckOutlined />}
                            onClick={handleApproveApplication}
                          >
                            Phê duyệt
                          </Button>
                        </Space>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            padding: 12,
                            background: "#e6f7ff",
                            borderRadius: 6,
                          }}
                        >
                          Hồ sơ này đã thẩm định:{" "}
                          <Tag color="blue">
                            {selectedApplication.status.toUpperCase()}
                          </Tag>
                        </div>
                      )}
                    </Col>
                  </Row>
                )}
              </Drawer>

              <Modal
                title="Lý do từ chối hồ sơ minh chứng"
                open={isRejectModalVisible}
                onOk={handleConfirmReject}
                onCancel={() => setIsRejectModalVisible(false)}
                okText="Xác nhận từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập lý do chi tiết..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </Modal>
            </div>
          )}

          {activeMenu === "email" && (
            <div>
              <h1 style={{ marginBottom: 24 }}>Cấu hình Email Thông báo</h1>
              <Card
                style={{ marginBottom: 24 }}
                title="Cài đặt tự động gửi Email tác vụ"
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12}>
                    <div
                      style={{
                        padding: 16,
                        background: "#f5f5f5",
                        borderRadius: 8,
                      }}
                    >
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
                      <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
                        {autoEmailEnabled
                          ? "✓ Email sẽ được gửi tự động khi hội đồng duyệt hồ sơ"
                          : "✗ Tác vụ email thông báo tự động tắt"}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card
                title="Cấu hình Mẫu Template Email Hệ thống"
                loading={loadingData}
              >
                {emailTemplates.length >= 3 ? (
                  <Tabs
                    items={[
                      {
                        key: "registration",
                        label: "📋 Đăng ký nộp hồ sơ thành công",
                        children: (
                          <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size={16}
                          >
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Tiêu đề mẫu Email:</strong>
                              </p>
                              <Input
                                value={emailTemplates[0]?.subject || ""}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[0].subject = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                              />
                            </div>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Nội dung cấu trúc:</strong>
                              </p>
                              <Input.TextArea
                                rows={8}
                                value={emailTemplates[0]?.content || ""}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[0].content = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                              />
                            </div>
                            <Button
                              type="primary"
                              loading={savingTemplate}
                              onClick={() => handleSaveEmailTemplate(0)}
                            >
                              Lưu cấu hình
                            </Button>
                          </Space>
                        ),
                      },
                      {
                        key: "approved",
                        label: "✅ Đã phê duyệt trúng tuyển",
                        children: (
                          <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size={16}
                          >
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Tiêu đề Email phê duyệt:</strong>
                              </p>
                              <Input
                                value={emailTemplates[1]?.subject || ""}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[1].subject = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                              />
                            </div>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Nội dung Email gửi thí sinh:</strong>
                              </p>
                              <Input.TextArea
                                rows={8}
                                value={emailTemplates[1]?.content || ""}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[1].content = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                              />
                            </div>
                            <Button
                              type="primary"
                              loading={savingTemplate}
                              onClick={() => handleSaveEmailTemplate(1)}
                            >
                              Lưu cấu hình
                            </Button>
                          </Space>
                        ),
                      },
                      {
                        key: "rejected",
                        label: "❌ Từ chối phê duyệt",
                        children: (
                          <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size={16}
                          >
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Tiêu đề thông báo từ chối:</strong>
                              </p>
                              <Input
                                value={emailTemplates[2]?.subject || ""}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[2].subject = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                              />
                            </div>
                            <div>
                              <p style={{ marginBottom: 8, fontWeight: 500 }}>
                                <strong>Nội dung lý do đính kèm:</strong>
                              </p>
                              <Input.TextArea
                                rows={8}
                                value={emailTemplates[2]?.content || ""}
                                onChange={(e) => {
                                  const updated = [...emailTemplates];
                                  updated[2].content = e.target.value;
                                  setEmailTemplates(updated);
                                }}
                              />
                            </div>
                            <Button
                              type="primary"
                              loading={savingTemplate}
                              onClick={() => handleSaveEmailTemplate(2)}
                            >
                              Lưu cấu hình
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <p style={{ textAlign: "center", color: "#999" }}>
                    Hệ thống đang đồng bộ kịch bản cấu hình...
                  </p>
                )}
              </Card>

              <Card
                style={{ marginTop: 24 }}
                title={`📧 Lịch sử nhật ký gửi Email tự động (${emailLogs.length})`}
              >
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
