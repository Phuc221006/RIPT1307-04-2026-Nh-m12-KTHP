import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  createCatalogItem,
  deleteCatalogItem,
  getCatalogList,
  updateCatalogItem,
} from "../../../services/catalogApi";

type ComboRow = {
  id: string;
  code: string;
  subjects: string;
  major_id?: string;
  majorCode?: string;
};

type CatalogResponse = {
  data: any[];
  meta: { total: number; page: number; limit: number };
};

const type = "combinations" as const;

const CombinationsPage: React.FC = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [items, setItems] = useState<ComboRow[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [search, setSearch] = useState("");

  const [majors, setMajors] = useState<Array<{ id: string; code: string; name: string }>>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ComboRow | null>(null);

  const fetchMajors = useCallback(async () => {
    try {
      const res = (await getCatalogList({ type: "majors", page: 1, limit: 1000, search: "" })) as CatalogResponse;
      setMajors(
        (res.data || []).map((m: any) => ({
          id: m.id,
          code: m.code,
          name: m.name,
        })),
      );
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Tải majors thất bại");
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await getCatalogList({ type, page: meta.page, limit: meta.limit, search })) as CatalogResponse;
      const data: ComboRow[] = (res.data || []).map((c: any) => ({
        id: c.id,
        code: c.code,
        subjects: c.subjects ?? "",
        major_id: c.major_id,
        majorCode: c.majors?.code,
      }));
      setItems(data);
      setMeta((prev) => ({ ...prev, total: res.meta.total }));
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Tải danh mục tổ hợp thất bại");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search]);

  useEffect(() => {
    fetchMajors();
  }, [fetchMajors]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo<ColumnsType<ComboRow>>(
    () => [
      { title: "Mã tổ hợp", dataIndex: "code", key: "code", width: 160 },
      {
        title: "Ngành",
        dataIndex: "majorCode",
        key: "majorCode",
        width: 220,
        render: (v) => <Tag color="blue">{v || "—"}</Tag>,
      },
      {
        title: "Các môn",
        dataIndex: "subjects",
        key: "subjects",
        width: 500,
        render: (v: any) => {
          const list = typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
          return (
            <Space wrap>
              {list.length ? (
                list.map((s) => (
                  <Tag key={s} color="green">
                    {s}
                  </Tag>
                ))
              ) : (
                <Tag color="default">—</Tag>
              )}
            </Space>
          );
        },
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
                  subjects: record.subjects,
                  major_id: record.major_id,
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
                  content: "Bạn có chắc chắn muốn xóa tổ hợp này?",
                  okText: "Xóa",
                  cancelText: "Hủy",
                  okButtonProps: { danger: true },
                  onOk: async () => {
                    try {
                      setSubmitting(true);
                      await deleteCatalogItem({ type, id: record.id });
                      message.success("Xóa tổ hợp thành công");
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
    if (!values.code?.trim() || !values.major_id || !values.subjects) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: values.code.trim(),
        major_id: values.major_id,
        // subjects đang lưu dạng chuỗi "A, B, C" nên FE gửi chuỗi
        subjects: values.subjects,
      };

      if (editing) {
        await updateCatalogItem({ type, id: editing.id, payload });
        message.success("Cập nhật tổ hợp thành công");
      } else {
        await createCatalogItem({ type, payload });
        message.success("Thêm tổ hợp thành công");
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
      <h1 style={{ marginBottom: 24 }}>Quản lý danh mục - Tổ hợp môn</h1>

      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: "100%" }} align="center" size={12}>
          <Input.Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã hoặc môn..."
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
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editing ? "✏️ Sửa tổ hợp môn" : "➕ Thêm tổ hợp môn"}
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
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
          <Form.Item
            label="Mã tổ hợp"
            name="code"
            rules={[
              { required: true, message: "Vui lòng nhập mã tổ hợp" },
              { min: 2, message: "Mã tổ hợp tối thiểu 2 ký tự" },
            ]}
          >
            <Input placeholder="VD: A00, A01" />
          </Form.Item>

          <Form.Item
            label="Ngành"
            name="major_id"
            rules={[{ required: true, message: "Vui lòng chọn ngành" }]}
          >
            <Select
              placeholder="Chọn ngành"
              options={majors.map((m) => ({
                label: `${m.code} - ${m.name}`,
                value: m.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Các môn (phân tách bằng dấu phẩy)"
            name="subjects"
            rules={[{ required: true, message: "Vui lòng nhập ít nhất 1 môn" }]}
          >
            <Input placeholder="VD: Toán, Vật lý, Hóa học" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CombinationsPage;

