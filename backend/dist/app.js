"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_js_1 = __importDefault(require("./routes/auth_routes.js"));
const path_1 = __importDefault(require("path"));
const upload_routes_js_1 = __importDefault(require("./routes/upload_routes.js"));
const application_routes_js_1 = __importDefault(require("./routes/application_routes.js"));
const app = (0, express_1.default)();
const __dirname = path_1.default.resolve();
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Hệ thống chạy ổn định." });
});
// Cắm Module Auth vào hệ thống
app.use("/api/v1/auth", auth_routes_js_1.default);
app.use("/api/v1/uploads", upload_routes_js_1.default);
app.use("/api/v1/applications", application_routes_js_1.default);
// Middleware xử lý lỗi (Bắt buộc phải nằm cuối cùng)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Lỗi hệ thống nội bộ.",
    });
});
exports.default = app;
