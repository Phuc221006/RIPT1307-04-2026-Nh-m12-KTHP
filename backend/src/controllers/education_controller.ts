import { Request, Response } from "express";
import prisma from "../configs/prisma.js";

export const EducationController = {
  // --- TRƯỜNG ---
  createUni: async (req: Request, res: Response) => {
    try {
      const { code, name, description } = req.body;
      const uni = await prisma.universities.create({
        data: { id: crypto.randomUUID(), code, name, description },
      });
      res.status(201).json(uni);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
  getAllUnis: async (req: Request, res: Response) => {
    try {
      const unis = await prisma.universities.findMany();
      res.json(unis);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
  deleteUni: async (req: Request, res: Response) => {
    try {
      await prisma.universities.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // --- NGÀNH ---
  createMajor: async (req: Request, res: Response) => {
    try {
      const { university_id, code, name } = req.body;
      const major = await prisma.majors.create({
        data: { id: crypto.randomUUID(), university_id, code, name },
      });
      res.status(201).json(major);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // 🔹 THÊM HÀM NÀY: Lấy toàn bộ ngành học để Phúc đổ vào ô chọn (Dropdown)
  getAllMajors: async (req: Request, res: Response) => {
    try {
      // 🔹 Lấy universityId từ query string (Ví dụ: /majors?universityId=UNI_PTIT)
      const { universityId } = req.query;

      // Nếu có truyền universityId thì lọc theo trường, không thì trả về tất cả
      const whereClause = universityId
        ? { university_id: String(universityId) }
        : {};

      const majors = await prisma.majors.findMany({
        where: whereClause,
      });

      res.json(majors);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // --- TỔ HỢP ---
  createCombo: async (req: Request, res: Response) => {
    try {
      const { major_id, code, subjects } = req.body;
      const combo = await prisma.subject_combinations.create({
        data: { id: crypto.randomUUID(), major_id, code, subjects },
      });
      res.status(201).json(combo);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // 🔹 THÊM HÀM NÀY: Lấy toàn bộ tổ hợp môn (A00, A01...) cho Frontend
  getAllCombos: async (req: Request, res: Response) => {
    try {
      // 🔹 BA XỬ LÝ: Lấy mã ngành từ query parameter (Ví dụ: /combinations?majorId=MAJ_SE_UUID)
      const { majorId } = req.query;

      // Nếu Frontend có truyền majorId thì lọc theo ngành, không thì trả về tất cả tổ hợp
      const whereClause = majorId ? { major_id: String(majorId) } : {};

      const combos = await prisma.subject_combinations.findMany({
        where: whereClause,
      });

      res.json(combos);
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message:
          error.message || "Lỗi khi kết nối DB lấy danh sách tổ hợp môn.",
      });
    }
  },
};
