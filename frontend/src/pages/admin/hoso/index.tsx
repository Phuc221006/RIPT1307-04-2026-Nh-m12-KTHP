import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Select, Input, Row, Col, Modal, Descriptions, message } from 'antd';
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { getAdminApplications, updateApplicationStatus } from '../../../services/api';
import AdminLayout from '../_layout';
import styles from './index.less';

const { Option } = Select;

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING:  { color: 'processing', label: 'Chờ duyệt' },
  APPROVED: { color: 'success',    label: 'Đã duyệt' },
  REJECTED: { color: 'error',      label: 'Từ chối' },
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
      const res = await getAdminApplications({ ...filters, ...params, page, limit: 10 });
      if (res.status === 'success') {
        setApps(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch {
      message.error('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, filters]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const res = await updateApplicationStatus(id, status);
      if (res.status === 'success') {
        message.success('Cập nhật trạng thái thành công!');
        setModalOpen(false);
        fetchData();
      } else {
        message.error(res.message || 'Cập nhật thất bại.');
      }
    } catch {
      message.error('Lỗi kết nối.');
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      title: 'Mã Hồ sơ',
      dataIndex: 'id',
      render: (v: string) => <span className={styles.code}>HS-{v.substring(0, 6).toUpperCase()}</span>,
      width: 120,
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'users',
      render: (u: any) => <span className={styles.name}>{u?.full_name || '---'}</span>,
    },
    {
      title: 'Trường',
      dataIndex: 'universityId',
      render: (v: string) => <span>{v || '---'}</span>,
    },
    {
      title: 'Ngành',
      dataIndex: 'majorId',
      render: (v: string) => <span>{v || '---'}</span>,
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'totalScore',
      render: (v: number) => <strong>{v?.toFixed(2) || '---'}</strong>,
      width: 100,
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'created_at',
      render: (v: string) => <span className={styles.date}>{new Date(v).toLocaleDateString('vi-VN')}</span>,
      width: 110,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) => {
        const c = STATUS_CONFIG[s] || STATUS_CONFIG.PENDING;
        return <Tag color={c.color}>{c.label}</Tag>;
      },
      width: 110,
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          className={styles.viewBtn}
          onClick={() => { setSelected(record); setModalOpen(true); }}
        >
          Xem chi tiết
        </Button>
      ),
      width: 130,
    },
  ];

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
                onChange={e => setFilters((f: any) => ({ ...f, university: e.target.value }))}
                className={styles.filterInput}
              />
            </Col>
            <Col xs={24} md={6}>
              <label className={styles.filterLabel}>Ngành</label>
              <Input
                placeholder="Tìm theo ngành..."
                prefix={<SearchOutlined />}
                onChange={e => setFilters((f: any) => ({ ...f, major: e.target.value }))}
                className={styles.filterInput}
              />
            </Col>
            <Col xs={24} md={6}>
              <label className={styles.filterLabel}>Trạng thái</label>
              <Select
                placeholder="Chọn trạng thái"
                allowClear
                style={{ width: '100%' }}
                onChange={v => setFilters((f: any) => ({ ...f, status: v }))}
              >
                <Option value="PENDING">Chờ duyệt</Option>
                <Option value="APPROVED">Đã duyệt</Option>
                <Option value="REJECTED">Từ chối</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <label className={styles.filterLabel}>&nbsp;</label>
              <Button type="primary" icon={<SearchOutlined />} block onClick={() => fetchData()} className={styles.searchBtn}>
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
              showTotal: t => `Tổng ${t} hồ sơ`,
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
        title={<span className={styles.modalTitle}>Chi tiết Hồ sơ — HS-{selected?.id?.substring(0, 6).toUpperCase()}</span>}
        className={styles.modal}
      >
        {selected && (
          <div className={styles.modalContent}>
            <Descriptions column={2} bordered size="small" className={styles.desc}>
              <Descriptions.Item label="Họ và tên">{selected.users?.full_name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selected.users?.email}</Descriptions.Item>
              <Descriptions.Item label="Trường">{selected.universityId}</Descriptions.Item>
              <Descriptions.Item label="Ngành">{selected.majorId}</Descriptions.Item>
              <Descriptions.Item label="Tổ hợp">{selected.combinationId}</Descriptions.Item>
              <Descriptions.Item label="Nguyện vọng">{selected.roundId}</Descriptions.Item>
              <Descriptions.Item label="Điểm môn 1">{selected.scoreSubject1}</Descriptions.Item>
              <Descriptions.Item label="Điểm môn 2">{selected.scoreSubject2}</Descriptions.Item>
              <Descriptions.Item label="Điểm môn 3">{selected.scoreSubject3}</Descriptions.Item>
              <Descriptions.Item label="Tổng điểm"><strong>{selected.totalScore?.toFixed(2)}</strong></Descriptions.Item>
              <Descriptions.Item label="Đối tượng ưu tiên">{selected.priorityObject}</Descriptions.Item>
              <Descriptions.Item label="Ngày nộp">{new Date(selected.created_at).toLocaleDateString('vi-VN')}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={STATUS_CONFIG[selected.status]?.color}>{STATUS_CONFIG[selected.status]?.label}</Tag>
              </Descriptions.Item>
            </Descriptions>

            {selected.application_files?.length > 0 && (
              <div className={styles.fileSection}>
                <h4>Minh chứng đính kèm:</h4>
                {selected.application_files.map((f: any, i: number) => (
                  <a key={i} href={`http://localhost:3000${f.fileUrl}`} target="_blank" rel="noreferrer" className={styles.fileLink}>
                    <DownloadOutlined /> {f.originalName}
                  </a>
                ))}
              </div>
            )}

            {selected.status === 'PENDING' && (
              <div className={styles.actionBtns}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  className={styles.approveBtn}
                  loading={updating}
                  onClick={() => handleUpdateStatus(selected.id, 'APPROVED')}
                >
                  Duyệt hồ sơ
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  loading={updating}
                  onClick={() => handleUpdateStatus(selected.id, 'REJECTED')}
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