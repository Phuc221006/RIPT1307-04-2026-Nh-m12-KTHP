import { useState } from "react";
import { Form, Input, Button, message, Tabs, Radio } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../../services/api";
import styles from "./index.less";

function LoginUI(props: {
  loading: boolean;
  role: "candidate" | "admin";
  setRole: (value: "candidate" | "admin") => void;
  tab: string;
  setTab: (value: string) => void;
  onLogin: (values: any) => void;
  form: any;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { loading, role, setRole, tab, setTab, onLogin, form, navigate } =
    props;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerBox}>
          <p className={styles.eyebrow}>Cổng tuyển sinh quốc gia</p>
          <h1 className={styles.title}>Xác thực - Cổng tuyển sinh Quốc gia</h1>
          <p className={styles.subtitle}>
            Đăng nhập để tiếp tục với vai trò của bạn.
          </p>
        </div>

        <Tabs
          activeKey={tab}
          onChange={(key) => {
            if (key === "register") {
              navigate("/register");
              return;
            }
            setTab("login");
          }}
          centered
          className={styles.tabs}
        >
          <Tabs.TabPane tab="Đăng nhập" key="login">
            <Form
              form={form}
              onFinish={onLogin}
              layout="vertical"
              size="large"
              className={styles.form}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="Nhập email..."
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Nhập mật khẩu..."
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item label="Bạn là:" className={styles.roleField}>
                <Radio.Group
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  buttonStyle="solid"
                  className={styles.radioGroup}
                >
                  <Radio.Button value="candidate">Thí sinh</Radio.Button>
                  <Radio.Button value="admin">Quản trị viên</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className={styles.submitBtn}
                  block
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Form.Item>

              <div className={styles.helperRow}>
                <a className={styles.forgotLink}>Quên mật khẩu?</a>
                <span className={styles.helperText}>
                  Chưa có tài khoản?{" "}
                  <a
                    className={styles.registerLink}
                    onClick={() => navigate("/register")}
                  >
                    Đăng ký ngay
                  </a>
                </span>
              </div>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đăng ký" key="register" />
        </Tabs>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"candidate" | "admin">("candidate");
  const [tab, setTab] = useState("login");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await login(values.email, values.password, role);

      if (res.status === "success") {
        setToken(res.data.accessToken || res.data.token);

        let realRole = "CANDIDATE"; // Mặc định là thí sinh

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          realRole = res.data.user.role; // 🚀 Lấy Role THẬT sự từ Database trả về
        }

        // Bắt lỗi: Nếu bấm nút Admin nhưng role thật trong DB không phải ADMIN
        if (role === "admin" && realRole !== "ADMIN") {
          message.warning("Tài khoản của bạn không có quyền Quản trị viên!");
          navigate("/dashboard"); // Đá về trang thí sinh ngay lập tức
          return;
        }

        message.success("Đăng nhập thành công!");

        // 🚀 CHỐT CHẶN: Chỉ khi role thật là ADMIN mới được vào /admin
        if (realRole === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        message.error(res.message || "Email hoặc mật khẩu không đúng.");
      }
    } catch {
      message.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginUI
      loading={loading}
      role={role}
      setRole={setRole}
      tab={tab}
      setTab={setTab}
      onLogin={handleLogin}
      form={form}
      navigate={navigate}
    />
  );
}
