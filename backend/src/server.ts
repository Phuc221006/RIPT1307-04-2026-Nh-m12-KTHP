import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./configs/prisma.ts";
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ [Database] Kết nối thành công tới MySQL (db_htqlts_2026)");

    // Khởi động server Express
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
    // Ngắt kết nối an toàn nếu có lỗi
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
