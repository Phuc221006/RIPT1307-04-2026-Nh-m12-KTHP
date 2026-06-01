import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();

  const [active, setActive] = useState("home");

  const [submissions, setSubmissions] = useState<any[]>([]);

  const [form, setForm] = useState({
    type: "",
    note: "",
  });

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");

    if (!isLogin) {
      navigate("/login");
    }

    // LOAD LỊCH SỬ HỒ SƠ
    const saved = localStorage.getItem("submissions");

    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  }, [navigate]);

  // LẤY THÔNG TIN USER
  const user = {
    name: localStorage.getItem("userName") || "Chưa có tên",
    email: localStorage.getItem("userEmail") || "Chưa có email",
    id: localStorage.getItem("studentId") || "TS000",
    major: localStorage.getItem("userMajor") || "Công nghệ thông tin",
    createdAt:
      localStorage.getItem("createdAt") || new Date().toLocaleString("vi-VN"),

    status:
      submissions.length > 0
        ? submissions[submissions.length - 1].status
        : "Chưa nộp hồ sơ",
  };

  // NỘP HỒ SƠ
  const handleSubmit = () => {
    if (!form.type.trim()) {
      alert("Vui lòng nhập loại hồ sơ!");
      return;
    }

    const newSubmission = {
      id: submissions.length + 1,

      date: new Date().toLocaleString("vi-VN"),

      type: form.type,

      status: "Chờ xét duyệt",

      note: form.note || "Không có ghi chú",
    };

    const updated = [...submissions, newSubmission];

    setSubmissions(updated);

    localStorage.setItem("submissions", JSON.stringify(updated));

    setForm({
      type: "",
      note: "",
    });

    alert("Nộp hồ sơ thành công!");
  };

  // MÀU TRẠNG THÁI
  const getBadgeClass = (status: string) => {
    if (status.includes("Chờ")) return "badge pending";

    if (status.includes("Duyệt")) return "badge approved";

    if (status.includes("Từ chối")) return "badge rejected";

    return "badge";
  };

  return (
    <div className="container">
      <Sidebar active={active} setActive={setActive} />

      <div className="dashboard-content">
        <h1 className="header-title">HỆ THỐNG QUẢN LÝ HỒ SƠ THÍ SINH</h1>

        {/* ================= HOME ================= */}
        {active === "home" && (
          <>
            <div className="card-grid">
              <div className="card">
                <h3>Họ và tên</h3>
                <p>{user.name}</p>
              </div>

              <div className="card">
                <h3>Mã thí sinh</h3>
                <p>{user.id}</p>
              </div>

              <div className="card">
                <h3>Email</h3>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="card-grid">
              <div className="card">
                <h3>Ngành đăng ký</h3>
                <p>{user.major}</p>
              </div>

              <div className="card">
                <h3>Ngày tạo tài khoản</h3>
                <p>{user.createdAt}</p>
              </div>

              <div className="card">
                <h3>Trạng thái hồ sơ</h3>

                <span className={getBadgeClass(user.status)}>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="big-card">
              <h2>Thông báo mới</h2>

              {submissions.length === 0 ? (
                <p className="gray-text">Bạn chưa nộp hồ sơ nào.</p>
              ) : (
                <div
                  style={{
                    marginTop: 15,
                  }}
                >
                  <div
                    style={{
                      padding: 15,
                      borderRadius: 12,
                      background: "#f3f4f6",
                    }}
                  >
                    <b>Hồ sơ "{submissions[submissions.length - 1].type}"</b>

                    <p
                      style={{
                        marginTop: 8,
                        color: "#6b7280",
                      }}
                    >
                      Trạng thái hiện tại:
                    </p>

                    <span
                      className={getBadgeClass(
                        submissions[submissions.length - 1].status,
                      )}
                    >
                      {submissions[submissions.length - 1].status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= PROFILE ================= */}
        {active === "profile" && (
          <div className="big-card">
            <h2>Hồ sơ cá nhân</h2>

            <div
              style={{
                marginTop: 20,
                lineHeight: 2,
                fontSize: 16,
              }}
            >
              <p>
                <b>Họ và tên:</b> {user.name}
              </p>

              <p>
                <b>Email:</b> {user.email}
              </p>

              <p>
                <b>Mã thí sinh:</b> {user.id}
              </p>

              <p>
                <b>Ngành đăng ký:</b> {user.major}
              </p>

              <p>
                <b>Ngày tạo:</b> {user.createdAt}
              </p>
            </div>
          </div>
        )}

        {/* ================= STATUS ================= */}
        {active === "status" && (
          <div className="big-card">
            <h2>Trạng thái hồ sơ</h2>

            <div
              style={{
                marginTop: 25,
              }}
            >
              <span className={getBadgeClass(user.status)}>{user.status}</span>

              <p
                style={{
                  marginTop: 20,
                  color: "#6b7280",
                }}
              >
                Admin sẽ xét duyệt hồ sơ và cập nhật trạng thái tại đây.
              </p>
            </div>
          </div>
        )}

        {/* ================= HISTORY ================= */}
        {active === "history" && (
          <>
            {/* FORM NỘP */}
            <div className="big-card">
              <h2>Nộp hồ sơ mới</h2>

              <input
                type="text"
                placeholder="Nhập loại hồ sơ"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Nhập ghi chú"
                value={form.note}
                onChange={(e) =>
                  setForm({
                    ...form,
                    note: e.target.value,
                  })
                }
              />

              <button onClick={handleSubmit}>Nộp hồ sơ</button>
            </div>

            {/* BẢNG */}
            <div className="big-card">
              <h2>Lịch sử nộp hồ sơ</h2>

              {submissions.length === 0 ? (
                <p
                  style={{
                    marginTop: 20,
                    color: "#6b7280",
                  }}
                >
                  Chưa có hồ sơ nào được nộp.
                </p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Ngày nộp</th>
                      <th>Loại hồ sơ</th>
                      <th>Trạng thái</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td>{item.date}</td>

                        <td>{item.type}</td>

                        <td>
                          <span className={getBadgeClass(item.status)}>
                            {item.status}
                          </span>
                        </td>

                        <td>{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
