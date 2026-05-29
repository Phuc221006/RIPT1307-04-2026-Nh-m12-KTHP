"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_services_js_1 = __importDefault(require("../services/auth_services.js"));
class AuthController {
    async register(req, res, next) {
        try {
            const result = await auth_services_js_1.default.registerUser(req.body);
            res.status(201).json({
                status: "success",
                message: "Đăng ký tài khoản thành công",
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        }
    }
    async login(req, res, next) {
        try {
            const result = await auth_services_js_1.default.loginUser(req.body);
            res.status(200).json({
                status: "success",
                message: "Đăng nhập thành công",
                data: result,
            });
        }
        catch (error) {
            res.status(401).json({
                status: "error",
                message: error.message,
            });
        }
    }
}
exports.default = new AuthController();
