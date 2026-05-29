"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const application_services_js_1 = __importDefault(require("../services/application_services.js"));
class ApplicationController {
    async create(req, res, next) {
        try {
            // Lấy ID của thí sinh từ Token (đã được middleware authenticate nhúng vào)
            const userId = req.user.id;
            const result = await application_services_js_1.default.submitApplication(userId, req.body);
            res.status(201).json({
                status: "success",
                message: "Nộp hồ sơ xét tuyển thành công.",
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        }
    }
}
exports.default = new ApplicationController();
