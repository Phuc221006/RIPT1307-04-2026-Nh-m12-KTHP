"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../configs/prisma.js")); // Nhớ import đúng file prisma.js của bạn
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto")); // Thêm thư viện này để tạo ID chuẩn UUID
class AuthService {
    async registerUser(data) {
        const { email, password, fullName, phone } = data;
        // 1. Gọi đúng tên model là 'users' theo schema của bạn
        const existingUser = await prisma_js_1.default.users.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email này đã tồn tại trong hệ thống.");
        }
        // 2. Băm mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // 3. Tạo tài khoản vào Database
        const newUser = await prisma_js_1.default.users.create({
            data: {
                // Schema của bạn không có @default(uuid()) ở cột id, nên ta phải tự sinh ID
                id: crypto_1.default.randomUUID(),
                email: email,
                password: hashedPassword,
                full_name: fullName, // Map biến fullName từ request sang cột full_name trong DB
                phone: phone,
                role: "CANDIDATE",
            },
            select: {
                id: true,
                email: true,
                full_name: true,
                role: true,
                created_at: true,
            },
        });
        return newUser;
    }
    async loginUser(data) {
        const { email, password } = data;
        // Tìm user trong bảng 'users'
        const user = await prisma_js_1.default.users.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
        }
        // So sánh mật khẩu
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
        }
        /// 3. Ký phát Token JWT
        const secretKey = process.env.JWT_SECRET || "fallback_secret_key";
        const signOptions = {
            expiresIn: "1d",
        };
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, secretKey, signOptions);
        return {
            // Trả về dữ liệu cho Frontend, map lại full_name thành fullName cho Frontend dễ dùng
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
            },
            accessToken: token,
        };
    }
}
exports.default = new AuthService();
