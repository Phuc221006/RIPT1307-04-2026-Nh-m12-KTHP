import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth_routes.js";
import path from "path";
import uploadRoutes from "./routes/upload_routes.js";
import applicationRoutes from "./routes/application_routes.js";
import educationRoutes from "./routes/education_routes.js"; // <--- Dòng thêm mới

const app: Application = express();
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Hệ thống chạy ổn định." });
});

// Cắm Module Auth vào hệ thống
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/education", educationRoutes); // <--- Dòng thêm mới

// Middleware xử lý lỗi (Bắt buộc phải nằm cuối cùng)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Lỗi hệ thống nội bộ.",
  });
});

export default app;
