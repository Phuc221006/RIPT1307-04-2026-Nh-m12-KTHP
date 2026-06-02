import { useState } from "react";
import { Form, Input, Button, message, Steps } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import styles from "./index.less";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        studentId: "", // Giữ nguyên logic tự động sinh mã ngẫu nhiên của bạn!
        dateOfBirth: values.dateOfBirth,
      } as any);

      if (res.status === "success") {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        message.error(res.message || "Đăng ký thất bại.");
      }
    } catch {
      message.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0)
        await form.validateFields(["fullName", "dateOfBirth"]);
      if (currentStep === 1) await form.validateFields(["email", "phone"]);
      setCurrentStep((s) => s + 1);
    } catch {}
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="url(#g2)" />
              <path
                d="M14 34L24 14L34 34"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 27.5H30.5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="g2"
                  x1="0"
                  y1="0"
                  x2="48"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#667eea" />
                  <stop offset="1" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Tuyển Sinh</span>
            <span className={styles.logoSub}>Tạo tài khoản mới</span>
          </div>
        </div>

        <h1 className={styles.title}>Đăng ký tài khoản</h1>
        <p className={styles.subtitle}>
          Điền thông tin để bắt đầu hành trình tuyển sinh
        </p>

        <Steps
          current={currentStep}
          size="small"
          className={styles.steps}
          items={[
            { title: "Cá nhân" },
            { title: "Liên hệ" },
            { title: "Bảo mật" },
          ]}
        />

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          {/* Step 0 */}
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input
                prefix={<UserOutlined className={styles.inputIcon} />}
                placeholder="Nguyễn Văn A"
                className={styles.input}
              />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
            >
              <Input
                prefix={<IdcardOutlined className={styles.inputIcon} />}
                placeholder="VD: 01/01/2000"
                className={styles.input}
              />
            </Form.Item>
          </div>

          {/* Step 1 */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className={styles.inputIcon} />}
                placeholder="example@email.com"
                className={styles.input}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập SĐT!" },
                { pattern: /^[0-9]{10,11}$/, message: "SĐT không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className={styles.inputIcon} />}
                placeholder="0912345678"
                className={styles.input}
              />
            </Form.Item>
          </div>

          {/* Step 2 */}
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Tối thiểu 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="Tối thiểu 6 ký tự"
                className={styles.input}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="Nhập lại mật khẩu"
                className={styles.input}
              />
            </Form.Item>
          </div>

          <div className={styles.btnGroup}>
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep((s) => s - 1)}
                className={styles.backBtn}
              >
                ← Quay lại
              </Button>
            )}
            {currentStep < 2 ? (
              <Button onClick={nextStep} className={styles.nextBtn}>
                Tiếp theo →
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.submitBtn}
              >
                {loading ? "Đang đăng ký..." : "✓ Hoàn tất đăng ký"}
              </Button>
            )}
          </div>
        </Form>

        <div className={styles.footer}>
          <span>Đã có tài khoản?</span>
          <a onClick={() => navigate("/login")} className={styles.loginLink}>
            {" "}
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
