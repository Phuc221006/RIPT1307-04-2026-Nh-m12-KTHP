<<<<<<< HEAD
import { useState } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../../services/api";
import styles from "./index.less";
=======
import { useState } from 'react';
import { Form, Input, Button, message, Tabs, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login, setToken } from '../../services/api';
import styles from './index.less';
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9

function LoginUI(props: {
  loading: boolean;
  role: 'candidate' | 'admin';
  setRole: (value: 'candidate' | 'admin') => void;
  tab: string;
  setTab: (value: string) => void;
  onLogin: (values: any) => void;
  form: any;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { loading, role, setRole, tab, setTab, onLogin, form, navigate } = props;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerBox}>
          <p className={styles.eyebrow}>Cổng tuyển sinh quốc gia</p>
          <h1 className={styles.title}>Xác thực - Cổng tuyển sinh Quốc gia</h1>
          <p className={styles.subtitle}>Đăng nhập để tiếp tục với vai trò của bạn.</p>
        </div>

        <Tabs
          activeKey={tab}
          onChange={(key) => {
            if (key === 'register') {
              navigate('/register');
              return;
            }
            setTab('login');
          }}
          centered
          className={styles.tabs}
        >
          <Tabs.TabPane tab="Đăng nhập" key="login">
            <Form form={form} onFinish={onLogin} layout="vertical" size="large" className={styles.form}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input prefix={<UserOutlined className={styles.inputIcon} />} placeholder="Nhập email..." className={styles.input} />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password prefix={<LockOutlined className={styles.inputIcon} />} placeholder="Nhập mật khẩu..." className={styles.input} />
              </Form.Item>

              <Form.Item label="Bạn là:" className={styles.roleField}>
                <Radio.Group value={role} onChange={(e) => setRole(e.target.value)} buttonStyle="solid" className={styles.radioGroup}>
                  <Radio.Button value="candidate">Thí sinh</Radio.Button>
                  <Radio.Button value="admin">Quản trị viên</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} className={styles.submitBtn} block>
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </Form.Item>

              <div className={styles.helperRow}>
                <a className={styles.forgotLink}>Quên mật khẩu?</a>
                <span className={styles.helperText}>
                  Chưa có tài khoản?{' '}
                  <a className={styles.registerLink} onClick={() => navigate('/register')}>Đăng ký ngay</a>
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
  const [role, setRole] = useState<'candidate' | 'admin'>('candidate');
  const [tab, setTab] = useState('login');
  const [form] = Form.useForm();
  const navigate = useNavigate();

<<<<<<< HEAD
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await login(values.email, values.password);

      if (res.status === "success") {
        // Lấy token (hỗ trợ cả 2 chuẩn trả về để không bị lỗi)
        setToken(res.data.accessToken || res.data.token);

=======
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await login(values.email, values.password, role);
      if (res.status === 'success') {
        setToken(res.data.accessToken || res.data.token);
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        message.success("Đăng nhập thành công!");

        // Logic phân luồng: Admin đi đường Admin, Thí sinh đi đường Thí sinh
        if (res.data.user?.role === "ADMIN") {
          navigate("/admin/thong-ke");
        } else {
          navigate("/dashboard");
        }
<<<<<<< HEAD
=======
        message.success('Đăng nhập thành công!');
        navigate(role === 'admin' ? '/admin' : '/dashboard');
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
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
<<<<<<< HEAD
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="14" fill="url(#g1)" />
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
                  id="g1"
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
            <span className={styles.logoSub}>Hệ thống quản lý hồ sơ</span>
          </div>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Chào mừng trở lại</h1>
          <p className={styles.subtitle}>
            Đăng nhập để tiếp tục hành trình của bạn
          </p>
        </div>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="Địa chỉ email"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Mật khẩu"
              className={styles.input}
            />
          </Form.Item>

          <div className={styles.formOptions}>
            <Checkbox className={styles.remember}>Ghi nhớ đăng nhập</Checkbox>
            <a className={styles.forgotLink}>Quên mật khẩu?</a>
          </div>

          <Form.Item style={{ marginTop: 16 }}>
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
        </Form>

        <div className={styles.footer}>
          <span>Chưa có tài khoản?</span>
          <a
            onClick={() => navigate("/register")}
            className={styles.registerLink}
          >
            {" "}
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
=======
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
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
  );
}
