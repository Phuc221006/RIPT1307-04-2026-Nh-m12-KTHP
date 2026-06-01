import { useState } from 'react';
import { Card, Tabs, Table, Button, Input, Tag, Modal, Form, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../_layout';
import styles from './index.less';

const TRUONG_INIT = [
  { id: '1',  code: 'HUST',   name: 'Đại học Bách khoa Hà Nội' },
  { id: '2',  code: 'VNU',    name: 'Đại học Quốc gia Hà Nội' },
  { id: '3',  code: 'NEU',    name: 'Đại học Kinh tế Quốc dân' },
  { id: '4',  code: 'FTU',    name: 'Đại học Ngoại thương' },
  { id: '5',  code: 'HMU',    name: 'Đại học Y Hà Nội' },
  { id: '6',  code: 'HCMUT',  name: 'Đại học Bách khoa TP.HCM' },
  { id: '7',  code: 'VNUHCM', name: 'Đại học Quốc gia TP.HCM' },
  { id: '8',  code: 'CTU',    name: 'Đại học Cần Thơ' },
  { id: '9',  code: 'DNU',    name: 'Đại học Đà Nẵng' },
];

const NGANH_INIT = [
  { id: '1',  code: 'CNTT',  name: 'Công nghệ thông tin',          truong: 'HUST' },
  { id: '2',  code: 'KTPM',  name: 'Kỹ thuật phần mềm',           truong: 'HUST' },
  { id: '3',  code: 'KHMT',  name: 'Khoa học máy tính',           truong: 'VNU' },
  { id: '4',  code: 'ATTT',  name: 'An toàn thông tin',           truong: 'VNU' },
  { id: '5',  code: 'HTTT',  name: 'Hệ thống thông tin',          truong: 'NEU' },
  { id: '6',  code: 'TTNT',  name: 'Trí tuệ nhân tạo',            truong: 'HCMUT' },
  { id: '7',  code: 'KTDT',  name: 'Kỹ thuật điện tử',            truong: 'HCMUT' },
  { id: '8',  code: 'QTKD',  name: 'Quản trị kinh doanh',         truong: 'NEU' },
  { id: '9',  code: 'KT',    name: 'Kế toán',                     truong: 'UEH' },
  { id: '10', code: 'MKT',   name: 'Marketing',                   truong: 'UEH' },
  { id: '11', code: 'YDK',   name: 'Y đa khoa',                   truong: 'HMU' },
  { id: '12', code: 'DH',    name: 'Dược học',                    truong: 'HMU' },
  { id: '13', code: 'LH',    name: 'Luật',                        truong: 'VNU' },
  { id: '14', code: 'NNA',   name: 'Ngôn ngữ Anh',                truong: 'VNU' },
];

const TOHOP_INIT = [
  { id: '1',  code: 'A00', subjects: 'Toán, Vật lý, Hóa học' },
  { id: '2',  code: 'A01', subjects: 'Toán, Vật lý, Tiếng Anh' },
  { id: '3',  code: 'B00', subjects: 'Toán, Hóa học, Sinh học' },
  { id: '4', code: 'C00', subjects: 'Ngữ văn, Lịch sử, Địa lý' },
  { id: '5', code: 'D01', subjects: 'Ngữ văn, Toán, Tiếng Anh' },
  { id: '6', code: 'D07', subjects: 'Toán, Hóa học, Tiếng Anh' },
];

type TabType = 'truong' | 'nganh' | 'tohop';

export default function DanhMucPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('truong');
  const [truongData, setTruongData] = useState(TRUONG_INIT);
  const [nganhData, setNganhData] = useState(NGANH_INIT);
  const [tohopData, setTohopData] = useState(TOHOP_INIT);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [form] = Form.useForm();

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
    form.validateFields().then(values => {
      if (activeTab === 'truong') {
        if (editItem) {
          setTruongData(prev => prev.map(i => i.id === editItem.id ? { ...i, ...values } : i));
        } else {
          setTruongData(prev => [...prev, { ...values, id: Date.now().toString() }]);
        }
      } else if (activeTab === 'nganh') {
        if (editItem) {
          setNganhData(prev => prev.map(i => i.id === editItem.id ? { ...i, ...values } : i));
        } else {
          setNganhData(prev => [...prev, { ...values, id: Date.now().toString() }]);
        }
      } else {
        if (editItem) {
          setTohopData(prev => prev.map(i => i.id === editItem.id ? { ...i, ...values } : i));
        } else {
          setTohopData(prev => [...prev, { ...values, id: Date.now().toString() }]);
        }
      }
      message.success(editItem ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      setModalOpen(false);
    });
  };

  const handleDelete = () => {
    if (activeTab === 'truong') {
      setTruongData(prev => prev.filter(i => i.id !== deleteItem.id));
    } else if (activeTab === 'nganh') {
      setNganhData(prev => prev.filter(i => i.id !== deleteItem.id));
    } else {
      setTohopData(prev => prev.filter(i => i.id !== deleteItem.id));
    }
    message.success('Xóa thành công!');
    setDeleteModal(false);
  };

  const filterData = (data: any[]) =>
    data.filter(d => Object.values(d).some(v => String(v).toLowerCase().includes(search.toLowerCase())));

  const actionCol = (record: any) => (
    <div className={styles.actions}>
      <Button size="small" icon={<EditOutlined />} className={styles.editBtn} onClick={() => openEdit(record)}>Sửa</Button>
      <Button size="small" icon={<DeleteOutlined />} danger onClick={() => openDelete(record)}>Xóa</Button>
    </div>
  );

  const truongCols = [
    { title: 'Mã Trường', dataIndex: 'code', render: (v: string) => <Tag color="blue">{v}</Tag>, width: 120 },
    { title: 'Tên Trường', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'Hành động', width: 160, render: (_: any, r: any) => actionCol(r) },
  ];

  const nganhCols = [
    { title: 'Mã Ngành', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag>, width: 120 },
    { title: 'Tên Ngành', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'Trường', dataIndex: 'truong', render: (v: string) => <Tag>{v}</Tag>, width: 100 },
    { title: 'Hành động', width: 160, render: (_: any, r: any) => actionCol(r) },
  ];

  const tohopCols = [
    { title: 'Mã Tổ hợp', dataIndex: 'code', render: (v: string) => <Tag color="green">{v}</Tag>, width: 120 },
    { title: 'Môn học', dataIndex: 'subjects' },
    { title: 'Hành động', width: 160, render: (_: any, r: any) => actionCol(r) },
  ];

  const getModalFields = () => {
    if (activeTab === 'truong') return (
      <>
        <Form.Item name="code" label="Mã trường" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="name" label="Tên trường" rules={[{ required: true }]}><Input /></Form.Item>
      </>
    );
    if (activeTab === 'nganh') return (
      <>
        <Form.Item name="code" label="Mã ngành" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="name" label="Tên ngành" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="truong" label="Mã trường" rules={[{ required: true }]}><Input /></Form.Item>
      </>
    );
    return (
      <>
        <Form.Item name="code" label="Mã tổ hợp" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="subjects" label="Môn học" rules={[{ required: true }]}><Input /></Form.Item>
      </>
    );
  };

  const tabItems = [
    {
      key: 'truong', label: `Trường Đại học (${filterData(truongData).length})`,
      children: (
        <Table dataSource={filterData(truongData)} columns={truongCols} rowKey="id"
          className={styles.table} pagination={{ pageSize: 6, showTotal: t => `Tổng ${t} trường` }} />
      ),
    },
    {
      key: 'nganh', label: `Ngành học (${filterData(nganhData).length})`,
      children: (
        <Table dataSource={filterData(nganhData)} columns={nganhCols} rowKey="id"
          className={styles.table} pagination={{ pageSize: 6, showTotal: t => `Tổng ${t} ngành` }} />
      ),
    },
    {
      key: 'tohop', label: `Tổ hợp môn (${filterData(tohopData).length})`,
      children: (
        <Table dataSource={filterData(tohopData)} columns={tohopCols} rowKey="id"
          className={styles.table} pagination={{ pageSize: 6, showTotal: t => `Tổng ${t} tổ hợp` }} />
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý Danh mục">
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Danh mục Hệ thống</h1>
          <Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={openAdd}>
            Thêm mới
          </Button>
        </div>

        <Card className={styles.card}>
          <div className={styles.toolbar}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã..."
              prefix={<SearchOutlined />}
              className={styles.searchInput}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Tabs
            items={tabItems}
            className={styles.tabs}
            onChange={k => { setActiveTab(k as TabType); setSearch(''); }}
          />
        </Card>
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        title={editItem ? 'Chỉnh sửa' : 'Thêm mới'}
        okText={editItem ? 'Cập nhật' : 'Thêm'}
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
        <p>Bạn có chắc muốn xóa <strong>{deleteItem?.name || deleteItem?.code}</strong> không?</p>
      </Modal>
    </AdminLayout>
  );
}