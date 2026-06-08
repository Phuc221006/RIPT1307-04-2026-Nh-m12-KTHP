import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../configs/prisma.js";

export const EducationController = {
  // --- TRƯỜNG ---
  createUni: async (req: Request, res: Response) => {
    try {
      const { code, name, description, majors } = req.body as any;
      const majorsPayload: any[] = Array.isArray(majors) ? majors : [];

      const result = await prisma.$transaction(async (tx) => {
        const uni = await tx.universities.create({
          data: {
            id: crypto.randomUUID(),
            code: code?.trim(),
            name: name?.trim(),
            description,
          },
        });

        for (const item of majorsPayload) {
          const majorId = item?.major_id;
          const combinationIds: string[] = Array.isArray(item?.combination_ids)
            ? item.combination_ids
            : [];

          if (!majorId) continue;

          await tx.majors.update({
            where: { id: String(majorId) },
            data: { university_id: uni.id },
          });

          if (combinationIds.length > 0) {
            await tx.subject_combinations.updateMany({
              where: { id: { in: combinationIds.map(String) } },
              data: { major_id: String(majorId) },
            });
          }
        }

        return uni;
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error?.code === "P2002") {
        return res.status(400).json({
          status: "error",
          message: "Mã đã tồn tại",
        });
      }
      return res.status(500).json({ status: "error", message: error.message });
    }
  },

  getAllUnis: async (req: Request, res: Response) => {
    try {
      const unis = await prisma.universities.findMany({
        orderBy: { name: "asc" },
        include: {
          majors: {
            include: {
              subject_combinations: true,
            },
          },
        },
      });

      return res.json(
        unis.map((u) => ({
          ...u,
          majors: u.majors.map((m) => ({
            ...m,
            subjectCombos: m.subject_combinations.map((c) => c.code),
          })),
        }))
      );
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },

  updateUni: async (req: Request, res: Response) => {
    try {
      const idParam = (req.params as any).id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      const { code, name, description, majors } = req.body as any;
      const majorsPayload: any[] = Array.isArray(majors) ? majors : [];

      const existingUni = await prisma.universities.findFirst({
        where: {
          code,
          NOT: { id: String(id) },
        },
        select: { id: true },
      });

      // 🎯 DEBUG 1: Chốt chặn kiểm tra trùng mã trường thủ công
      if (existingUni) {
        return res.status(400).json({
          status: "error",
          message: "DEBUG 1: Lỗi check tay - Mã trường đã tồn tại ở một bản ghi khác!",
        });
      }

      await prisma.$transaction(async (tx) => {
        await tx.universities.update({
          where: { id: String(id) },
          data: {
            code,
            name,
            description,
            updated_at: new Date(),
          },
        });

        const majorsPayloadSafe = Array.isArray(majorsPayload)
          ? majorsPayload
          : [];

        // Chạy vòng lặp cập nhật ngành học và tổ hợp môn
        for (const item of majorsPayloadSafe) {
          const majorId = item?.major_id;
          const combinationIds: string[] = Array.isArray(item?.combination_ids)
            ? item.combination_ids
            : [];

          if (!majorId) continue;

          // Liên kết ngành học với trường đại học này
          await tx.majors.update({
            where: { id: String(majorId) },
            data: { university_id: String(id) },
          });

          // Liên kết các tổ hợp môn với ngành học này
          if (combinationIds.length > 0) {
            await tx.subject_combinations.updateMany({
              where: { id: { in: combinationIds.map(String) } },
              data: { major_id: String(majorId) },
            });
          }
        }
      });

      const updated = await prisma.universities.findUnique({
        where: { id: String(id) },
        include: {
          majors: {
            include: { subject_combinations: true },
          },
        },
      });

      if (!updated) {
        return res.status(400).json({
          status: "error",
          message: "Không tìm thấy trường đại học",
        });
      }

      return res.status(200).json({
        ...updated,
        majors: updated.majors.map((m) => ({
          ...m,
          subjectCombos: m.subject_combinations.map((c) => c.code),
        })),
      });
    } catch (error: any) {
      // 🎯 DEBUG 2: Bóc tách chính xác xem Prisma báo trùng unique ở bảng/trường nào
      if (error?.code === "P2002") {
        const target = error.meta?.target;
        const targetStr = Array.isArray(target) ? target.join(", ") : String(target || "không rõ");
        return res.status(400).json({
          status: "error",
          message: `DEBUG 2: Lỗi P2002 Prisma - Trùng lặp dữ liệu unique ở: [${targetStr}]`,
          meta: error.meta
        });
      }
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  deleteUni: async (req: Request, res: Response) => {
    try {
      const idParam = (req.params as any).id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      await prisma.universities.delete({ where: { id: String(id) } });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // --- NGÀNH ---
  createMajor: async (req: Request, res: Response) => {
    try {
      const { universityId, university_id, code, name } = req.body;
      const major = await prisma.majors.create({
        data: {
          id: crypto.randomUUID(),
          university_id: String(universityId || university_id),
          code,
          name,
        },
      });
      res.status(201).json(major);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  getAllMajors: async (req: Request, res: Response) => {
    try {
      const { universityId } = req.query;
      const whereClause = universityId
        ? { university_id: String(universityId) }
        : {};
      const majors = await prisma.majors.findMany({
        where: whereClause,
        include: { universities: true },
        orderBy: { name: "asc" },
      });
      res.json(majors);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  updateMajor: async (req: Request, res: Response) => {
    try {
      const idParam = (req.params as any).id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      const { universityId, university_id, code, name } = req.body;
      const major = await prisma.majors.update({
        where: { id: String(id) },
        data: {
          university_id: String(universityId || university_id),
          code,
          name,
        },
      });
      res.status(200).json(major);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  deleteMajor: async (req: Request, res: Response) => {
    try {
      const idParam = (req.params as any).id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      await prisma.majors.delete({ where: { id: String(id) } });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // --- TỔ HỢP ---
  createCombo: async (req: Request, res: Response) => {
    try {
      const { majorId, major_id, code, subjects } = req.body;
      const combo = await prisma.subject_combinations.create({
        data: {
          id: crypto.randomUUID(),
          major_id: String(majorId || major_id),
          code,
          subjects: Array.isArray(subjects) ? subjects.join(", ") : String(subjects || ""),
        },
      });
      res.status(201).json(combo);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  getAllCombos: async (req: Request, res: Response) => {
    try {
      const { majorId } = req.query;
      const whereClause = majorId ? { major_id: String(majorId) } : {};
      const combos = await prisma.subject_combinations.findMany({
        where: whereClause,
      });
      res.json(combos);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  updateCombo: async (req: Request, res: Response) => {
    try {
      const idParam = (req.params as any).id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      const { majorId, major_id, code, subjects } = req.body;
      const combo = await prisma.subject_combinations.update({
        where: { id: String(id) },

        data: {
          major_id: String(majorId || major_id),
          code,
          subjects: Array.isArray(subjects) ? subjects.join(", ") : String(subjects || ""),
        },
      });
      res.status(200).json(combo);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  deleteCombo: async (req: Request, res: Response) => {
    try {
      const idParam = (req.params as any).id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      await prisma.subject_combinations.delete({ where: { id: String(id) } });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};