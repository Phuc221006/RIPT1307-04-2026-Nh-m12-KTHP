import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Select,
  Input,
  Row,
  Col,
  Modal,
  Descriptions,
  message,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  getAdminApplications,
  updateApplicationStatus,
} from "../../../services/api";
import AdminLayout from "../_layout";
import styles from "./index.less";

const { Option } = Select;

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: "processing", label: "Chờ duyệt" },
  APPROVED: { color: "success", label: "Đã duyệt" },
  REJECTED: { color: "error", label: "Từ chối" },
};

export default function HoSoAdminPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<any>({});
  const [selected, setSelected] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchData = async (params: any = {}) => {
    setLoading(true);
    try {
      const res = await getAdminApplications({
        ...filters,
        ...params,
        page,
        limit: 10,
      });
      if (res.status === "success") {
        // Hỗ trợ cả 2 dạng: res.data là mảng, hoặc res.data.data là mảng (có phân trang)
        setApps(res.data?.data || res.data || []);
        setTotal(res.data?.total || res.data?.length || 0);
      }
    } catch {
      message.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const res = await updateApplicationStatus(id, status);
      if (res.status === "success") {
        message.success("Cập nhật trạng thái thành công!");
        setModalOpen(false);
        fetchData(); // Tải lại bảng sau khi duyệt
      } else {
        message.error(res.message || "Cập nhật thất bại.");
      }
    } catch {
      message.error("Lỗi kết nối.");
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      title: "Mã Hồ sơ",
      dataIndex: "id",
      render: (v: string) => (
        <span className={styles.code}>
          HS-{v?.substring(0, 6).toUpperCase()}
        </span>
      ),
      width: 120,
    },
    {
      title: "Họ và Tên",
      render: (_: any, r: any) => (
        <span className={styles.name}>
          {r.users?.full_name || r.users?.fullName || "---"}
        </span>
      ),
    },
    {
      title: "Trường",
      render: (_: any, r: any) => (
        <span>{r.university_id || r.universityId || "---"}</span>
      ),
    },
    {
      title: "Ngành",
      render: (_: any, r: any) => (
        <span>{r.major_id || r.majorId || "---"}</span>
      ),
    },
    {
      title: "Tổng điểm",
      render: (_: any, r: any) => {
        const score = r.total_score ?? r.totalScore;
        return (
          <strong>
            {score !== undefined ? Number(score).toFixed(2) : "---"}
          </strong>
        );
      },
      width: 100,
    },
    {
      title: "Ngày nộp",
      render: (_: any, r: any) => {
        const d = r.created_at || r.createdAt;
        return (
          <span className={styles.date}>
            {d ? new Date(d).toLocaleDateString("vi-VN") : "---"}
          </span>
        );
      },
      width: 110,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) => {
        const c = STATUS_CONFIG[s] || STATUS_CONFIG.PENDING;
        return <Tag color={c.color}>{c.label}</Tag>;
      },
      width: 110,
    },
    {
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          className={styles.viewBtn}
          onClick={() => {
            setSelected(record);
            setModalOpen(true);
          }}
        >
          Xem chi tiết
        </Button>
      ),
      width: 130,
    },
  ];

  // Tiền xử lý dữ liệu cho Modal để code gọn gàng hơn
  const s = selected || {};
  const sFiles = s.application_files || s.applicationFiles || [];

  return (
    <AdminLayout title="Quản lý Hồ sơ Thí sinh">
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Hồ sơ Thí sinh</h1>
        </div>

        {/* Bộ lọc */}
        <Card className={styles.filterCard}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={6}>
              <label className={styles.filterLabel}>Trường</label>
              <Input
                placeholder="Tìm theo trường..."
                prefix={<SearchOutlined />}
                onChange={(e) =>
                  setFilters((f: any) => ({ ...f, university: e.target.value }))
                }
                className={styles.filterInput}
              />
            </Col>
            <Col xs={24} md={6}>
              <label className={styles.filterLabel}>Ngành</label>
              <Input
                placeholder="Tìm theo ngành..."
                prefix={<SearchOutlined />}
                onChange={(e) =>
                  setFilters((f: any) => ({ ...f, major: e.target.value }))
                }
                className={styles.filterInput}
              />
            </Col>
            <Col xs={24} md={6}>
              <label className={styles.filterLabel}>Trạng thái</label>
              <Select
                placeholder="Chọn trạng thái"
                allowClear
                style={{ width: "100%" }}
                onChange={(v) => setFilters((f: any) => ({ ...f, status: v }))}
              >
                <Option value="PENDING">Chờ duyệt</Option>
                <Option value="APPROVED">Đã duyệt</Option>
                <Option value="REJECTED">Từ chối</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <label className={styles.filterLabel}>&nbsp;</label>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                block
                onClick={() => fetchData()}
                className={styles.searchBtn}
              >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Bảng dữ liệu */}
        <Card className={styles.tableCard}>
          <Table
            dataSource={apps}
            columns={columns}
            rowKey="id"
            loading={loading}
            className={styles.table}
            pagination={{
              current: page,
              total,
              pageSize: 10,
              onChange: setPage,
              showTotal: (t) => `Tổng ${t} hồ sơ`,
            }}
          />
        </Card>
      </div>

      {/* Modal chi tiết */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={700}
        title={
          <span className={styles.modalTitle}>
            Chi tiết Hồ sơ — HS-{s.id?.substring(0, 6).toUpperCase()}
          </span>
        }
        className={styles.modal}
      >
        {selected && (
          <div className={styles.modalContent}>
            <Descriptions
              column={2}
              bordered
              size="small"
              className={styles.desc}
            >
              <Descriptions.Item label="Họ và tên">
                {s.users?.full_name || s.users?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {s.users?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Trường">
                {s.university_id || s.universityId}
              </Descriptions.Item>
              <Descriptions.Item label="Ngành">
                {s.major_id || s.majorId}
              </Descriptions.Item>
              <Descriptions.Item label="Tổ hợp">
                {s.combination_id || s.combinationId}
              </Descriptions.Item>
              <Descriptions.Item label="Nguyện vọng">
                {s.round_id || s.roundId}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm môn 1">
                {s.score_subject_1 ?? s.scoreSubject1}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm môn 2">
                {s.score_subject_2 ?? s.scoreSubject2}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm môn 3">
                {s.score_subject_3 ?? s.scoreSubject3}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng điểm">
                <strong>
                  {Number(s.total_score ?? s.totalScore).toFixed(2)}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Đối tượng ưu tiên">
                {s.priority_object || s.priorityObject}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày nộp">
                {new Date(s.created_at || s.createdAt).toLocaleDateString(
                  "vi-VN",
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={STATUS_CONFIG[s.status]?.color}>
                  {STATUS_CONFIG[s.status]?.label}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {sFiles.length > 0 && (
              <div className={styles.fileSection}>
                <h4>Minh chứng đính kèm:</h4>
                {sFiles.map((f: any, i: number) => (
                  // Chú ý sửa port 3000 thành 5000 ở đây
                  <a
                    key={i}
                    href={`http://localhost:5000${f.file_url || f.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.fileLink}
                  >
                    <DownloadOutlined />{" "}
                    {f.original_name || f.originalName || "Xem file"}
                  </a>
                ))}
              </div>
            )}

            {s.status === "PENDING" && (
              <div className={styles.actionBtns}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  className={styles.approveBtn}
                  loading={updating}
                  onClick={() => handleUpdateStatus(s.id, "APPROVED")}
                >
                  Duyệt hồ sơ
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  loading={updating}
                  onClick={() => handleUpdateStatus(s.id, "REJECTED")}
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
