const BASE_URL = "http://localhost:5000/api/v1";

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

export async function login(email: string, password: string, role?: 'candidate' | 'admin') {
  const res = await fetch(`${BASE_URL}/auth/login`, {
<<<<<<< HEAD
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
=======
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: role || 'candidate' }),
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
  });
  return res.json();
}

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
<<<<<<< HEAD
  studentId: string;
=======
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
  phone: string;
  studentId?: string;
  major?: string;
  dob?: string;
}) {
  // 1. Tự sinh mã sinh viên ngẫu nhiên
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
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

const getAdminToken = () => localStorage.getItem("token");

export async function getAdminStatistics() {
  const res = await fetch(`${BASE_URL}/admin/statistics`, {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  return res.json();
}

export async function getAdminApplications(params: any = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/admin/applications?${query}`, {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  return res.json();
}

export async function updateApplicationStatus(id: string, status: string) {
  const res = await fetch(`${BASE_URL}/admin/applications/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify({ status }),
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
export const getDashboardStats = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/applications/stats",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Đảm bảo lấy đúng key token nhóm ông lưu khi login
        "Content-Type": "application/json",
      },
    },
  );
  return response.json();
};

export const getUniversities = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/education/universities",
    { method: "GET" },
  );
  return response.json();
};

export const getMajors = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/education/majors",
    { method: "GET" },
  );
  return response.json();
};

export const getCombinations = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/education/combinations",
    { method: "GET" },
  );
  return response.json();
};
