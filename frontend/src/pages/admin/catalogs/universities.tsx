import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Card, Form, Input, message, Modal, Space, Table, Tag, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { PaginationProps } from "antd";

// Giả định đường dẫn API của bạn, hãy sửa lại nếu file API nằm ở thư mục khác
import { createCatalogItem, deleteCatalogItem, getCatalogList, updateCatalogItem } from "../../../services/catalogApi";

type UniversityRow = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
};

type CatalogResponse = {
  data: UniversityRow[];
  meta: { total: number; page: number; limit: number };
};

const type = "universities" as const;

const UniversitiesPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState<UniversityRow[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number }>({
    total: 0,
    page: 1,
    limit: 10,
  });

  const [search, setSearch] = useState("");

  // Options for Form.List (choose existing majors and subject combinations)
  const [majorsOptions, setMajorsOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [combinationsOptions, setCombinationsOptions] = useState<Array<{ id: string; code: string }>>([]);
  const [catalogSelectLoading, setCatalogSelectLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UniversityRow | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await getCatalogList({ type, page: meta.page, limit: meta.limit, search })) as CatalogResponse;
      setData(res.data);
      setMeta(res.meta);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Tải danh mục thất bại");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load Majors + Combinations for the University modal selects
  useEffect(() => {
    const loadSelectData = async () => {
      setCatalogSelectLoading(true);
      try {
        const majorsRes = await getCatalogList({ type: "majors" });
        const majorsData = majorsRes?.data ?? majorsRes ?? [];
        setMajorsOptions(
          (majorsData as any[]).map((m) => ({
            id: m.id,
            name: m.name ?? m.code,
          })),
        );

        const combosRes = await getCatalogList({ type: "combinations" });
        const combosData = combosRes?.data ?? combosRes ?? [];
        setCombinationsOptions(
          (combosData as any[]).map((c) => ({
            id: c.id,
            code: c.code,
          })),
        );
      } catch (e: any) {
        message.error(e?.response?.data?.message || e?.message || "Tải danh mục phụ trợ thất bại");
      } finally {
        setCatalogSelectLoading(false);
      }
    };

    loadSelectData();
  }, []);

  const columns = useMemo<ColumnsType<UniversityRow>>(
    () => [
      { title: "Mã Trường", dataIndex: "code", key: "code", width: 140 },
      { title: "Tên Trường", dataIndex: "name", key: "name", width: 320 },
      {
        title: "Thao tác",
        key: "action",
        width: 120,
        render: (_, record) => (
          <Space>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(record);
                // Giả định API trả về record kèm theo mảng majors, nếu không có thì form sẽ load default
                form.setFieldsValue(record); 
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
                  content: "Bạn có chắc chắn muốn xóa trường này?",
                  okText: "Xóa",
                  cancelText: "Hủy",
                  okButtonProps: { danger: true },
                  onOk: async () => {
                    try {
                      setSubmitting(true);
                      await deleteCatalogItem({ type, id: record.id });
                      message.success("Xóa trường thành công");
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
    [form, fetchData]
  );

  const onChangePage: PaginationProps["onChange"] = async (page, pageSize) => {
    setMeta((m) => ({ ...m, page: page || 1, limit: pageSize || m.limit }));
  };

  // Logic Submit ĐÃ ĐƯỢC CHỈNH SỬA CHUẨN XÁC
  const onSubmit = async (values: any) => {
    if (!values.code?.trim() || !values.name?.trim()) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      // Lọc các dòng bị trống trong Form.List
      const validMajors = values.majors 
        ? values.majors.filter((m: any) => m.major_id && m.combination_ids?.length > 0)
        : [];

      if (validMajors.length === 0) {
        message.error("Vui lòng chọn ít nhất 1 Ngành và 1 Tổ hợp hợp lệ!");
        setSubmitting(false);
        return;
      }

      // Đóng gói Payload gửi xuống Backend
      const payload = {
        code: values.code.trim(),
        name: values.name.trim(),
        description: values.description || null,
        majors: validMajors
      };

      if (editing) {
        await updateCatalogItem({ type, id: editing.id, payload });
        message.success("Cập nhật trường thành công");
      } else {
        await createCatalogItem({ type, payload });
        message.success("Thêm trường thành công");
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
      <h1 style={{ marginBottom: 24 }}>Quản lý danh mục - Trường Đại học</h1>

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
          dataSource={data}
          loading={loading}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            showSizeChanger: true,
            onChange: onChangePage,
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={editing ? "✏️ Sửa trường đại học" : "➕ Thêm trường đại học"}
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
        width={750}
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onSubmit} 
          autoComplete="off"
          initialValues={{ majors: [{ major_id: undefined, combination_ids: [] }] }}
        >
          <Form.Item
            label="Mã trường"
            name="code"
            rules={[
              { required: true, message: "Vui lòng nhập mã trường" },
              { min: 2, message: "Mã trường phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="VD: HUST, VNU, PTIT" />
          </Form.Item>

          <Form.Item
            label="Tên trường"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}
          >
            <Input placeholder="VD: Học viện Công nghệ Bưu chính Viễn thông" />
          </Form.Item>

          <div style={{ fontWeight: 600, marginBottom: 8 }}>Cấu hình Ngành Tuyển Sinh:</div>
          <Form.List
            name="majors"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length < 1) {
                    return Promise.reject(new Error("Vui lòng thêm ít nhất 1 ngành"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    align="baseline"
                    style={{ width: "100%", display: 'flex', marginBottom: 8 }}
                    size="middle"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "major_id"]}
                      rules={[{ required: true, message: "Vui lòng chọn ngành" }]}
                      style={{ width: 250, margin: 0 }}
                    >
                      <Select
                        placeholder="Chọn ngành"
                        loading={catalogSelectLoading}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={majorsOptions.map((m) => ({
                          label: m.name,
                          value: m.id,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "combination_ids"]}
                      rules={[
                        { required: true, message: "Vui lòng chọn ít nhất 1 tổ hợp" }
                      ]}
                      style={{ flex: 1, margin: 0 }}
                    >
                      <Select
                        mode="multiple"
                        loading={catalogSelectLoading}
                        placeholder="Chọn tổ hợp"
                        options={combinationsOptions.map((c) => ({
                          label: c.code,
                          value: c.id,
                        }))}
                      />
                    </Form.Item>

                    <MinusCircleOutlined 
                      onClick={() => remove(field.name)} 
                      style={{ color: "red", cursor: "pointer", marginTop: 8 }} 
                    />
                  </Space>
                ))}

                <Form.Item style={{ marginTop: 16 }}>
                  <Button
                    type="dashed"
                    onClick={() => add({ major_id: undefined, combination_ids: [] })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm Ngành Tuyển Sinh
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default UniversitiesPage;