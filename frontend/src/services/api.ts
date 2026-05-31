<<<<<<< HEAD
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
=======
const BASE_URL = 'http://localhost:3000/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
>>>>>>> origin/suadashboard
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
<<<<<<< HEAD
    method: "POST",
    headers: { "Content-Type": "application/json" },
=======
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
>>>>>>> origin/suadashboard
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
  studentId: string; // Giữ nguyên định nghĩa kiểu dữ liệu để tránh lỗi compile ở giao diện
  phone: string;
}) {
  // 1. Tự sinh mã sinh viên ngẫu nhiên (Ví dụ: SV20264859)
  const year = new Date().getFullYear(); // Lấy năm hiện tại
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Sinh 4 số ngẫu nhiên từ 1000 đến 9999
  const autoStudentId = `SV${year}${randomNumber}`;

  // 2. Gộp mã sinh viên vừa tự sinh vào dữ liệu, đè lên giá trị trống từ giao diện truyền vào
  const finalData = {
    ...data,
<<<<<<< HEAD
    studentId: autoStudentId,
=======
    studentId: autoStudentId
>>>>>>> origin/suadashboard
  };

  // 3. Gửi cục dữ liệu đã có sẵn mã sinh viên ẩn lên cho Backend
  const res = await fetch(`${BASE_URL}/auth/register`, {
<<<<<<< HEAD
    method: "POST",
    headers: { "Content-Type": "application/json" },
=======
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
>>>>>>> origin/suadashboard
    body: JSON.stringify(finalData),
  });
  return res.json();
}
export async function submitApplication(data: any) {
  const res = await fetch(`${BASE_URL}/applications`, {
<<<<<<< HEAD
    method: "POST",
    headers: {
      "Content-Type": "application/json",
=======
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
>>>>>>> origin/suadashboard
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
<<<<<<< HEAD
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/uploads/documents`, {
    method: "POST",
=======
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/uploads/documents`, {
    method: 'POST',
>>>>>>> origin/suadashboard
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return res.json();
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/suadashboard
