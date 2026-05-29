"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_js_1 = __importDefault(require("../controllers/application_controller.js"));
const auth_middleware_js_1 = require("../middlewares/auth_middleware.js");
const router = (0, express_1.Router)();
// Phải đăng nhập mới được nộp hồ sơ
router.post("/", auth_middleware_js_1.authenticate, application_controller_js_1.default.create);
exports.default = router;
