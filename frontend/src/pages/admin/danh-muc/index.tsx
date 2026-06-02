import { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Table,
  Button,
  Input,
  Tag,
  Modal,
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AdminLayout from "../_layout";
import {
  getUniversities,
  getMajors,
  getCombinations,
} from "../../../services/api";
import styles from "./index.less";

type TabType = "truong" | "nganh" | "tohop";

export default function DanhMucPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("truong");

  // Khởi tạo state rỗng, chờ dữ liệu từ Backend
  const [truongData, setTruongData] = useState<any[]>([]);
  const [nganhData, setNganhData] = useState<any[]>([]);
  const [tohopData, setTohopData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [form] = Form.useForm();

  // Gọi 3 API cùng lúc để tối ưu tốc độ tải trang
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [resTruong, resNganh, resTohop] = await Promise.all([
          getUniversities(),
          getMajors(),
          getCombinations(),
        ]);

        if (resTruong.status === "success") setTruongData(resTruong.data || []);
        if (resNganh.status === "success") setNganhData(resNganh.data || []);
        if (resTohop.status === "success") setTohopData(resTohop.data || []);
      } catch (error) {
        message.error("Không thể tải dữ liệu danh mục từ máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditItem(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const openDelete = (record: any) => {
    setDeleteItem(record);
    setDeleteModal(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (activeTab === "truong") {
        if (editItem) {
          setTruongData((prev) =>
            prev.map((i) => (i.id === editItem.id ? { ...i, ...values } : i)),
          );
        } else {
          setTruongData((prev) => [
            ...prev,
            { ...values, id: Date.now().toString() },
          ]);
        }
      } else if (activeTab === "nganh") {
        if (editItem) {
          setNganhData((prev) =>
            prev.map((i) => (i.id === editItem.id ? { ...i, ...values } : i)),
          );
        } else {
          setNganhData((prev) => [
            ...prev,
            { ...values, id: Date.now().toString() },
          ]);
        }
      } else {
        if (editItem) {
          setTohopData((prev) =>
            prev.map((i) => (i.id === editItem.id ? { ...i, ...values } : i)),
          );
        } else {
          setTohopData((prev) => [
            ...prev,
            { ...values, id: Date.now().toString() },
          ]);
        }
      }
      message.success(
        editItem
          ? "Cập nhật thành công (Local)!"
          : "Thêm mới thành công (Local)!",
      );
      setModalOpen(false);
    });
  };

  const handleDelete = () => {
    if (activeTab === "truong") {
      setTruongData((prev) => prev.filter((i) => i.id !== deleteItem.id));
    } else if (activeTab === "nganh") {
      setNganhData((prev) => prev.filter((i) => i.id !== deleteItem.id));
    } else {
      setTohopData((prev) => prev.filter((i) => i.id !== deleteItem.id));
    }
    message.success("Xóa thành công (Local)!");
    setDeleteModal(false);
  };

  const filterData = (data: any[]) =>
    data.filter((d) =>
      Object.values(d).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase()),
      ),
    );

  const actionCol = (record: any) => (
    <div className={styles.actions}>
      <Button
        size="small"
        icon={<EditOutlined />}
        className={styles.editBtn}
        onClick={() => openEdit(record)}
      >
        Sửa
      </Button>
      <Button
        size="small"
        icon={<DeleteOutlined />}
        danger
        onClick={() => openDelete(record)}
      >
        Xóa
      </Button>
    </div>
  );

  const truongCols = [
    {
      title: "Mã Trường",
      dataIndex: "code",
      render: (v: string) => <Tag color="blue">{v}</Tag>,
      width: 120,
    },
    {
      title: "Tên Trường",
      dataIndex: "name",
      render: (v: string) => <strong>{v}</strong>,
    },
    {
      title: "Hành động",
      width: 160,
      render: (_: any, r: any) => actionCol(r),
    },
  ];

  const nganhCols = [
    {
      title: "Mã Ngành",
      dataIndex: "code",
      render: (v: string) => <Tag color="purple">{v}</Tag>,
      width: 120,
    },
    {
      title: "Tên Ngành",
      dataIndex: "name",
      render: (v: string) => <strong>{v}</strong>,
    },
    // DB dùng university_id, mock data dùng truong -> Lấy linh hoạt cả 2
    {
      title: "Mã Trường",
      render: (_: any, r: any) => (
        <Tag>{r.university_id || r.truong || "---"}</Tag>
      ),
      width: 150,
    },
    {
      title: "Hành động",
      width: 160,
      render: (_: any, r: any) => actionCol(r),
    },
  ];

  const tohopCols = [
    {
      title: "Mã Tổ hợp",
      dataIndex: "code",
      render: (v: string) => <Tag color="green">{v}</Tag>,
      width: 120,
    },
    { title: "Môn học", dataIndex: "subjects" },
    {
      title: "Hành động",
      width: 160,
      render: (_: any, r: any) => actionCol(r),
    },
  ];

  const getModalFields = () => {
    if (activeTab === "truong")
      return (
        <>
          <Form.Item name="code" label="Mã trường" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </>
      );
    if (activeTab === "nganh")
      return (
        <>
          <Form.Item name="code" label="Mã ngành" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Tên ngành" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="university_id"
            label="Mã trường (Liên kết)"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </>
      );
    return (
      <>
        <Form.Item name="code" label="Mã tổ hợp" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="subjects" label="Môn học" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </>
    );
  };

  const tabItems = [
    {
      key: "truong",
      label: `Trường Đại học (${filterData(truongData).length})`,
      children: (
        <Table
          dataSource={filterData(truongData)}
          columns={truongCols}
          rowKey="id"
          loading={loading}
          className={styles.table}
          pagination={{ pageSize: 6, showTotal: (t) => `Tổng ${t} trường` }}
        />
      ),
    },
    {
      key: "nganh",
      label: `Ngành học (${filterData(nganhData).length})`,
      children: (
        <Table
          dataSource={filterData(nganhData)}
          columns={nganhCols}
          rowKey="id"
          loading={loading}
          className={styles.table}
          pagination={{ pageSize: 6, showTotal: (t) => `Tổng ${t} ngành` }}
        />
      ),
    },
    {
      key: "tohop",
      label: `Tổ hợp môn (${filterData(tohopData).length})`,
      children: (
        <Table
          dataSource={filterData(tohopData)}
          columns={tohopCols}
          rowKey="id"
          loading={loading}
          className={styles.table}
          pagination={{ pageSize: 6, showTotal: (t) => `Tổng ${t} tổ hợp` }}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý Danh mục">
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Danh mục Hệ thống</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addBtn}
            onClick={openAdd}
          >
            Thêm mới
          </Button>
        </div>

        <Card className={styles.card}>
          <div className={styles.toolbar}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã..."
              prefix={<SearchOutlined />}
              className={styles.searchInput}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Tabs
            items={tabItems}
            className={styles.tabs}
            onChange={(k) => {
              setActiveTab(k as TabType);
              setSearch("");
            }}
          />
        </Card>
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        title={editItem ? "Chỉnh sửa" : "Thêm mới"}
        okText={editItem ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {getModalFields()}
        </Form>
      </Modal>

      {/* Modal Xác nhận xóa */}
      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        onOk={handleDelete}
        title="Xác nhận xóa"
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc muốn xóa{" "}
          <strong>{deleteItem?.name || deleteItem?.code}</strong> không?
        </p>
      </Modal>
    </AdminLayout>
  );
}
