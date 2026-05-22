import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra nhập đủ
    if (!email.trim() || !password.trim()) {
      alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    // Lấy danh sách user đã đăng ký
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Tìm tài khoản đúng
    const foundUser = users.find(
      (user: any) =>
        user.email === email &&
        user.password === password
    );

    // Nếu không tìm thấy
    if (!foundUser) {
      alert("Sai Email hoặc Mật khẩu!");
      return;
    }

    // Lưu trạng thái đăng nhập
    localStorage.setItem("isLogin", "true");

    // Lưu thông tin user hiện tại
    localStorage.setItem("userName", foundUser.name);
    localStorage.setItem("userEmail", foundUser.email);
    localStorage.setItem("studentId", foundUser.studentId);
    localStorage.setItem("createdAt", foundUser.createdAt);
    localStorage.setItem("userPhone", foundUser.phone);
    localStorage.setItem("userStatus", foundUser.status);

    alert("Đăng nhập thành công!");

    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: 430,
          background: "white",
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1
            style={{
              fontSize: 34,
              fontWeight: "bold",
              color: "#1e3a8a",
              marginBottom: 10,
            }}
          >
            Hệ thống tuyển sinh
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: 15,
            }}
          >
            Đăng nhập để theo dõi hồ sơ xét tuyển
          </p>
        </div>

        {/* EMAIL */}
        <label
          style={{
            fontWeight: "bold",
            fontSize: 14,
            color: "#111827",
          }}
        >
          Email
        </label>

        <input
          type="email"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 15px",
            marginTop: 8,
            marginBottom: 20,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 15,
            background: "#f9fafb",
          }}
        />

        {/* PASSWORD */}
        <label
          style={{
            fontWeight: "bold",
            fontSize: 14,
            color: "#111827",
          }}
        >
          Mật khẩu
        </label>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 8,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            overflow: "hidden",
            background: "#f9fafb",
          }}
        >
          <input
            type={showPass ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              flex: 1,
              padding: "14px 15px",
              border: "none",
              outline: "none",
              fontSize: 15,
              background: "transparent",
            }}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              padding: "14px 15px",
              border: "none",
              cursor: "pointer",
              background: "#e5e7eb",
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            {showPass ? "Ẩn" : "Hiện"}
          </button>
        </div>

        {/* OPTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 18,
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              color: "#374151",
            }}
          >
            <input type="checkbox" />
            Ghi nhớ
          </label>

          <a
            href="#"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            transition: "0.3s",
          }}
        >
          Đăng nhập
        </button>

        {/* REGISTER */}
        <p
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}