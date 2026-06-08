import dotenv from "dotenv";
import cors from "cors"; // 1. Import thư viện cors để xử lý bảo mật tên miền

dotenv.config();

import app from "./app.js";
import prisma from "./configs/prisma.js";

const PORT = process.env.PORT || 5000;

// 2. Cấu hình CORS cho phép mọi Front-end (bao gồm cả Netlify) gọi vào Server
app.use(
  cors({
    origin: "*", // Cho phép tất cả các nguồn truy cập
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

async function startServer() {
  try {
    await prisma.$connect();

    // ===== THÊM ĐOẠN NÀY =====
    const users = await prisma.users.findMany({
      select: {
        email: true,
        role: true,
      },
    });

    console.log("USERS =", users);
    // =========================

    console.log("✅ [Database] Kết nối thành công tới MySQL (db_htqlts_2026)");

    app.listen(PORT, () => {
      console.log(
        `🚀 [Server] Hệ thống Backend đang chạy tại link Render online`
      );
    });
  } catch (error) {
    console.error(
      "❌ [Database] Lỗi kết nối CSDL, hệ thống không thể khởi động:",
      error
    );

    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();