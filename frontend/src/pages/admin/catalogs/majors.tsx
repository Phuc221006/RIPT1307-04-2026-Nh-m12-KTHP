import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Select,
} from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import { getCatalogList, createCatalogItem, updateCatalogItem, deleteCatalogItem } from "../../../services/catalogApi";

type MajorRow = {
  id: string;
  code: string;
  name: string;
  university_id?: string;
  universityCode?: string;
};

type CatalogResponse = {
  data: any[];
  meta: { total: number; page: number; limit: number };
};

const type = "majors" as const;

const MajorsPage: React.FC = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [items, setItems] = useState<MajorRow[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [search, setSearch] = useState("");

  const [universities, setUniversities] = useState<{ id: string; code: string; name: string }[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MajorRow | null>(null);

  const fetchUniversities = useCallback(async () => {
    try {
      const res = (await getCatalogList({ type: "universities", page: 1, limit: 1000, search: "" })) as any as CatalogResponse;
      setUniversities(
        (res.data || []).map((u: any) => ({ id: u.id, code: u.code, name: u.name })),
      );
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Tải trường thất bại");
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await getCatalogList({ type, page: meta.page, limit: meta.limit, search })) as CatalogResponse;
      const data: MajorRow[] = res.data.map((m: any) => ({
        id: m.id,
        code: m.code,
        name: m.name,
        university_id: m.university_id,
        universityCode: m.universities?.[0]?.code,
      }));
      setItems(data);
      setMeta((prev) => ({ ...prev, total: res.meta.total }));
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Tải danh mục ngành thất bại");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo<ColumnsType<MajorRow>>(
    () => [
      { title: "Mã Ngành", dataIndex: "code", key: "code", width: 140 },
      { title: "Tên Ngành", dataIndex: "name", key: "name", width: 320 },
      {
        title: "Trường",
        dataIndex: "universityCode",
        key: "universityCode",
        width: 200,
        render: (v) => <Tag color="blue">{v || "—"}</Tag>,
      },
      {
        title: "Thao tác",
        key: "action",
        width: 220,
        render: (_, record) => (
          <Space>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(record);
                form.setFieldsValue({
                  code: record.code,
                  name: record.name,
                  university_id: record.university_id,
                });
                setModalOpen(true);
              }}
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: "Xác nhận xóa",
                  content: "Bạn có chắc chắn muốn xóa ngành này?",
                  okText: "Xóa",
                  cancelText: "Hủy",
                  okButtonProps: { danger: true },
                  onOk: async () => {
                    try {
                      setSubmitting(true);
                      await deleteCatalogItem({ type, id: record.id });
                      message.success("Xóa ngành thành công");
                      await fetchData();
                    } catch (e: any) {
                      message.error(e?.response?.data?.message || e?.message || "Xóa thất bại");
                    } finally {
                      setSubmitting(false);
                    }
                  },
                });
              }}
            />
          </Space>
        ),
      },
    ],
    [form, fetchData],
  );

  const onSubmit = async (values: any) => {
    if (!values.code?.trim() || !values.name?.trim() || !values.university_id) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: values.code.trim(),
        name: values.name.trim(),
        university_id: values.university_id,
      };

      if (editing) {
        await updateCatalogItem({ type, id: editing.id, payload });
        message.success("Cập nhật ngành thành công");
      } else {
        await createCatalogItem({ type, payload });
        message.success("Thêm ngành thành công");
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      await fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Quản lý danh mục - Ngành học</h1>

      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: "100%" }} align="center" size={12}>
          <Input.Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã hoặc tên..."
            prefix={<SearchOutlined />}
            allowClear
            onSearch={() => setMeta((m) => ({ ...m, page: 1 }))}
            style={{ flex: 1, minWidth: 260 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setMeta((m) => ({ ...m, page: page || 1, limit: pageSize || m.limit }));
            },
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={editing ? "✏️ Sửa ngành học" : "➕ Thêm ngành học"}
        open={modalOpen}
        confirmLoading={submitting}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
          <Form.Item
            label="Mã ngành"
            name="code"
            rules={[
              { required: true, message: "Vui lòng nhập mã ngành" },
              { min: 2, message: "Mã ngành phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="VD: KHMT, CNTT..." />
          </Form.Item>

          <Form.Item
            label="Tên ngành"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên ngành" }]}
          >
            <Input placeholder="VD: Kỹ thuật Phần mềm" />
          </Form.Item>

          <Form.Item
            label="Trường đại học"
            name="university_id"
            rules={[{ required: true, message: "Vui lòng chọn trường" }]}
          >
            <Select
              placeholder="Chọn trường"
              options={universities.map((u) => ({
                label: `${u.code} - ${u.name}`,
                value: u.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MajorsPage;

