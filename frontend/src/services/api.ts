const BASE_URL = "http://localhost:3000/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function login(
  email: string,
  password: string,
  role?: "candidate" | "admin",
) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role: role || "candidate" }),
  });
  return res.json();
}

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  studentId?: string;
  major?: string;
  dob?: string;
}) {
  // 1. Tự sinh mã sinh viên ngẫu nhiên (Ví dụ: SV20264859)
  const year = new Date().getFullYear(); // Lấy năm hiện tại
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Sinh 4 số ngẫu nhiên từ 1000 đến 9999
  const autoStudentId = `SV${year}${randomNumber}`;

  // 2. Gộp mã sinh viên vừa tự sinh vào dữ liệu, đè lên giá trị trống từ giao diện truyền vào
  const finalData = {
    ...data,
    studentId: autoStudentId,
  };

  // 3. Gửi cục dữ liệu đã có sẵn mã sinh viên ẩn lên cho Backend
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
  });
  return res.json();
}
export async function submitApplication(data: any) {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyApplications() {
  const res = await fetch(`${BASE_URL}/applications/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/uploads/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return res.json();
}

export async function loginService(payload: any) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      role: payload.role, // "CANDIDATE" hoặc "ADMIN" để phân quyền chuẩn nghiệp vụ BA
    }),
  });
  return await response.json();
}

// 1. Lấy số liệu 4 ô thống kê, tiến trình và dữ liệu vẽ biểu đồ Dashboard Admin
export async function getAdminDashboardStats() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

// 2. Lấy danh sách hồ sơ kèm bộ lọc tìm kiếm (Trạng thái, trường, từ khóa tên/CCCD)
// Cập nhật các hàm gọi API khớp với route trong admin_routes.ts
export async function getAdminApplicationsList(params: any) {
  const token = localStorage.getItem("token");
  // Route khớp với: app.use("/api/v1/admin", adminRoutes) + router.get("/applications", ...)
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/admin/applications?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

// 3. Lấy lịch sử log hệ thống và trạng thái gửi Email thông báo tự động
export async function getAdminEmailLogs() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/email-logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

// 4. API kích hoạt khi Admin bấm nút "+ Thêm mới" Trường đại học
export async function addUniversity(payload: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/education/universities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// 5. API kích hoạt khi Admin bấm nút "+ Thêm mới" Ngành học
export async function addMajor(payload: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/education/majors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
