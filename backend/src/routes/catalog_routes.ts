import express from "express";
import { getCatalogs, createCatalog, updateCatalog, deleteCatalog } from "../controllers/catalog_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js";
import { requireAdmin } from "../middlewares/admin_middleware.js";

const router = express.Router();

router.get("/:type", authenticate, getCatalogs);
router.post("/:type", authenticate, requireAdmin, createCatalog);
router.put("/:type/:id", authenticate, requireAdmin, updateCatalog);
router.delete("/:type/:id", authenticate, requireAdmin, deleteCatalog);

export default router;
