import { useState } from 'react';
import { Card, Tabs, Table, Button, Input, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../_layout';
import styles from './index.less';

const TRUONG_DATA = [
  { id: 'HUST', code: 'HUST', name: 'Đại học Bách khoa Hà Nội' },
  { id: 'VNU',  code: 'VNU',  name: 'Đại học Quốc gia Hà Nội' },
  { id: 'HCMUT',code: 'HCMUT',name: 'Đại học Bách khoa TP.HCM' },
  { id: 'NEU',  code: 'NEU',    name: 'Đại học Kinh tế Quốc dân' },
  { id: 'FTU',  code: 'FTU',    name: 'Đại học Ngoại thương' },
  { id: 'HMU',  code: 'HMU',    name: 'Đại học Y Hà Nội' },
  { id: 'VNUHCM',  code: 'VNUHCM', name: 'Đại học Quốc gia TP.HCM' },
  { id: 'CTU',  code: 'CTU',    name: 'Đại học Cần Thơ' },
  { id: 'DNU',  code: 'DNU',    name: 'Đại học Đà Nẵng' },

];

const NGANH_DATA = [
  { id: '1',  code: 'CNTT',  name: 'Công nghệ thông tin',       truong: 'HUST' },
  { id: '2',  code: 'KTPM',  name: 'Kỹ thuật phần mềm',        truong: 'HUST' },
  { id: '3',  code: 'KHMT',  name: 'Khoa học máy tính',        truong: 'VNU' },
  { id: '4',  code: 'ATTT',  name: 'An toàn thông tin',        truong: 'VNU' },
  { id: '5',  code: 'HTTT',  name: 'Hệ thống thông tin',       truong: 'NEU' },
  { id: '6',  code: 'TTNT',  name: 'Trí tuệ nhân tạo',         truong: 'HCMUT' },
  { id: '7',  code: 'KTDT',  name: 'Kỹ thuật điện tử',         truong: 'HCMUT' },
  { id: '8',  code: 'QTKD',  name: 'Quản trị kinh doanh',      truong: 'NEU' },
  { id: '9',  code: 'KT',    name: 'Kế toán',                  truong: 'UEH' },
  { id: '10', code: 'MKT',   name: 'Marketing',                truong: 'UEH' },
  { id: '11', code: 'YDK',   name: 'Y đa khoa',                truong: 'HMU' },
  { id: '12', code: 'DH',    name: 'Dược học',                 truong: 'HMU' },
  { id: '13', code: 'LH',    name: 'Luật',                     truong: 'VNU' },
  { id: '14', code: 'NNA',   name: 'Ngôn ngữ Anh',             truong: 'VNU' },

];
const TOHOP_DATA = [
  { id: '1', code: 'A00', subjects: 'Toán, Lý, Hóa' },
  { id: '2', code: 'A01', subjects: 'Toán, Lý, Anh' },
  { id: '3', code: 'B00', subjects: 'Toán, Hóa, Sinh' },
  { id: '4', code: 'C00', subjects: 'Văn, Sử, Địa' },
  { id: '5', code: 'D01', subjects: 'Toán, Văn, Anh' },
  { id: '6', code: 'D07', subjects: 'Toán, Hóa, Anh' },
];

export default function DanhMucPage() {
  const [search, setSearch] = useState('');

  const truongCols = [
    { title: 'Mã Trường', dataIndex: 'code', render: (v: string) => <Tag color="blue">{v}</Tag>, width: 120 },
    { title: 'Tên Trường', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
    {
      title: 'Hành động', width: 160,
      render: (_: any, r: any) => (
        <div className={styles.actions}>
          <Button size="small" icon={<EditOutlined />} className={styles.editBtn}>Sửa</Button>
          <Button size="small" icon={<DeleteOutlined />} danger>Xóa</Button>
        </div>
      ),
    },
  ];

  const nganhCols = [
    { title: 'Mã Ngành', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag>, width: 120 },
    { title: 'Tên Ngành', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'Trường', dataIndex: 'truong', render: (v: string) => <Tag>{v}</Tag>, width: 100 },
    {
      title: 'Hành động', width: 160,
      render: () => (
        <div className={styles.actions}>
          <Button size="small" icon={<EditOutlined />} className={styles.editBtn}>Sửa</Button>
          <Button size="small" icon={<DeleteOutlined />} danger>Xóa</Button>
        </div>
      ),
    },
  ];

  const toHopCols = [
    { title: 'Mã Tổ hợp', dataIndex: 'code', render: (v: string) => <Tag color="green">{v}</Tag>, width: 120 },
    { title: 'Môn học', dataIndex: 'subjects', render: (v: string) => <span>{v}</span> },
    {
      title: 'Hành động', width: 160,
      render: () => (
        <div className={styles.actions}>
          <Button size="small" icon={<EditOutlined />} className={styles.editBtn}>Sửa</Button>
          <Button size="small" icon={<DeleteOutlined />} danger>Xóa</Button>
        </div>
      ),
    },
  ];

  const filterData = (data: any[]) =>
    data.filter(d => Object.values(d).some(v => String(v).toLowerCase().includes(search.toLowerCase())));

  const tabItems = [
    {
      key: '1', label: 'Trường Đại học',
      children: (
        <Table dataSource={filterData(TRUONG_DATA)} columns={truongCols} rowKey="id"
          className={styles.table} pagination={{ pageSize: 6, showTotal: t => `Tổng ${t} trường` }} />
      ),
    },
    {
      key: '2', label: 'Ngành học',
      children: (
        <Table dataSource={filterData(NGANH_DATA)} columns={nganhCols} rowKey="id"
          className={styles.table} pagination={{ pageSize: 6, showTotal: t => `Tổng ${t} ngành` }} />
      ),
    },
    {
      key: '3', label: 'Tổ hợp môn',
      children: (
        <Table dataSource={filterData(TOHOP_DATA)} columns={toHopCols} rowKey="id"
          className={styles.table} pagination={{ pageSize: 6, showTotal: t => `Tổng ${t} tổ hợp` }} />
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý Danh mục">
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Quản lý Danh mục Hệ thống</h1>
          <Button type="primary" icon={<PlusOutlined />} className={styles.addBtn}>Thêm mới</Button>
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
          <Tabs items={tabItems} className={styles.tabs} />
        </Card>
      </div>
    </AdminLayout>
  );
}