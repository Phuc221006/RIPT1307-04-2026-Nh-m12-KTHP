import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import prisma from "./configs/prisma.ts";

const PORT = process.env.PORT || 5000;

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
        `🚀 [Server] Hệ thống Backend đang chạy tại: http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "❌ [Database] Lỗi kết nối CSDL, hệ thống không thể khởi động:",
      error,
    );

    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();