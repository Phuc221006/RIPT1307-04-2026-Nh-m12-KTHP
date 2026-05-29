"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_js_1 = __importDefault(require("../controllers/upload_controller.js"));
const upload_middleware_js_1 = require("../middlewares/upload_middleware.js");
const auth_middleware_js_1 = require("../middlewares/auth_middleware.js");
const router = (0, express_1.Router)();
// Endpoint upload file, yêu cầu đăng nhập và key field gửi lên là 'file'
router.post("/documents", auth_middleware_js_1.authenticate, upload_middleware_js_1.upload.single("file"), upload_controller_js_1.default.uploadFile);
exports.default = router;
