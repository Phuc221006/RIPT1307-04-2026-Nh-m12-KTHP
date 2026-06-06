import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import prisma from "../configs/prisma.js"; // Nhớ import đúng file prisma.js của bạn
import bcrypt from "bcrypt";
import crypto from "crypto"; // Thêm thư viện này để tạo ID chuẩn UUID

class AuthService {
  async registerUser(data: any) {
    const { email, password, fullName, phone, dob } = data;

    // 1. Gọi đúng tên model là 'users' theo schema của bạn
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email này đã tồn tại trong hệ thống.");
    }

    // 2. Băm mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Tạo tài khoản vào Database
    const newUser = await prisma.users.create({
      data: {
        // Schema của bạn không có @default(uuid()) ở cột id, nên ta phải tự sinh ID
        id: crypto.randomUUID(),
        email: email,
        password: hashedPassword,
        full_name: fullName,
        phone: phone,
        dob: dob ? new Date(dob) : null,
        role: "CANDIDATE",
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        dob: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    return newUser;
  }

  async loginUser(data: any) {
  const { email, password } = data;

  const user = await prisma.users.findUnique({
    where: { email },
  });

  console.log("========== LOGIN ==========");
  console.log("EMAIL:", email);
  console.log("USER FOUND:", user);

  if (!user) {
    throw new Error("Không tìm thấy tài khoản.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  console.log("PASSWORD INPUT:", password);
  console.log("PASSWORD DB:", user.password);
  console.log("MATCH:", isMatch);

  if (!isMatch) {
    throw new Error("Sai mật khẩu.");
  }

    /// 3. Ký phát Token JWT
    const secretKey: Secret = process.env.JWT_SECRET || "fallback_secret_key";

    const signOptions: SignOptions = {
      expiresIn: "1d",
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secretKey,
      signOptions,
    );

    return {
      // Trả về dữ liệu cho Frontend, map lại full_name thành fullName cho Frontend dễ dùng
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        dob: user.dob,
        phone: user.phone,
        role: user.role,
      },
      accessToken: token,
    };
  }
}

export default new AuthService();
