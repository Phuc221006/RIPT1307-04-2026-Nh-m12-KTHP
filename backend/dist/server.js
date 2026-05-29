"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_js_1 = __importDefault(require("./app.js"));
const prisma_ts_1 = __importDefault(require("./configs/prisma.ts"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await prisma_ts_1.default.$connect();
        console.log("✅ [Database] Kết nối thành công tới MySQL (db_htqlts_2026)");
        // Khởi động server Express
        app_js_1.default.listen(PORT, () => {
            console.log(`🚀 [Server] Hệ thống Backend đang chạy tại: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ [Database] Lỗi kết nối CSDL, hệ thống không thể khởi động:", error);
        // Ngắt kết nối an toàn nếu có lỗi
        await prisma_ts_1.default.$disconnect();
        process.exit(1);
    }
}
startServer();
