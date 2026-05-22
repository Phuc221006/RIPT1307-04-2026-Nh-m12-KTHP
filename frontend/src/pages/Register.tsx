import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra nhập đủ
    if (!fullname || !email || !phone || !password || !confirm) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra mật khẩu
    if (password !== confirm) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    // Lấy danh sách user đã có
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Kiểm tra email đã tồn tại chưa
    const emailExists = users.find(
      (user: any) => user.email === email
    );

    if (emailExists) {
      alert("Email này đã được đăng ký!");
      return;
    }

    // Tạo mã sinh viên riêng
    const studentId =
      "TS" + Math.floor(100000 + Math.random() * 900000);

    // Tạo user mới
    const newUser = {
      name: fullname,
      email: email,
      phone: phone,
      password: password,
      studentId: studentId,

      // Thời gian tạo thực tế
      createdAt: new Date().toLocaleString("vi-VN"),

      // Trạng thái mặc định
      status: "Đang xét duyệt",
    };

    // Thêm user vào danh sách
    users.push(newUser);

    // Lưu lại
    localStorage.setItem("users", JSON.stringify(users));

    // Lưu user hiện tại
    localStorage.setItem("userName", fullname);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("studentId", studentId);
    localStorage.setItem(
      "createdAt",
      newUser.createdAt
    );

    alert("Đăng ký thành công!");

    navigate("/login");
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
        onSubmit={handleRegister}
        style={{
          width: "100%",
          maxWidth: 450,
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
            Đăng ký tài khoản
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: 15,
            }}
          >
            Tạo tài khoản thí sinh mới
          </p>
        </div>

        {/* FULLNAME */}
        <label
          style={{
            fontWeight: "bold",
            fontSize: 14,
            color: "#111827",
          }}
        >
          Họ và tên
        </label>

        <input
          type="text"
          placeholder="Nhập họ và tên"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 15px",
            marginTop: 8,
            marginBottom: 18,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 15,
            background: "#f9fafb",
          }}
        />

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
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 15px",
            marginTop: 8,
            marginBottom: 18,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 15,
            background: "#f9fafb",
          }}
        />

        {/* PHONE */}
        <label
          style={{
            fontWeight: "bold",
            fontSize: 14,
            color: "#111827",
          }}
        >
          Số điện thoại
        </label>

        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 15px",
            marginTop: 8,
            marginBottom: 18,
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

        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 15px",
            marginTop: 8,
            marginBottom: 18,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 15,
            background: "#f9fafb",
          }}
        />

        {/* CONFIRM */}
        <label
          style={{
            fontWeight: "bold",
            fontSize: 14,
            color: "#111827",
          }}
        >
          Nhập lại mật khẩu
        </label>

        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 15px",
            marginTop: 8,
            marginBottom: 25,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 15,
            background: "#f9fafb",
          }}
        />

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
          }}
        >
          Đăng ký
        </button>

        {/* LOGIN */}
        <p
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}