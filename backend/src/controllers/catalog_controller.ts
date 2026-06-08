import { Request, Response } from "express";
import prisma from "../configs/prisma.js";
import crypto from "crypto";

export const getCatalogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type } = req.params;

    const idParam = (req.params as any).id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;


    const pageRaw = req.query.page;


    const limitRaw = req.query.limit;
    const searchRaw = req.query.search;

    const page = Math.max(Number(pageRaw) || 1, 1);
    const limit = Math.max(Number(limitRaw) || 10, 1);
    const search = String(searchRaw ?? "").trim();
    const skip = (page - 1) * limit;

    let data: any[];
    let total = 0;

    const searchCondition: any = search
      ? {
          OR: [
            { code: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;

    switch (type) {
      case "universities": {
        total = await prisma.universities.count({ where: searchCondition });
        data = await prisma.universities.findMany({
          where: searchCondition,

          orderBy: { created_at: "desc" },
          skip,
          take: limit,
        });
        break;
      }
      case "majors": {
        const where = search
          ? {
              AND: [
                {
                  OR: [
                { code: { contains: search, mode: "insensitive" } },
                    { name: { contains: search, mode: "insensitive" } },
                  ],
                },
              ],
            }
          : undefined;

        total = await prisma.majors.count({ where });
        data = await prisma.majors.findMany({
          where,
          include: { universities: true },
          orderBy: { created_at: "desc" },
          skip,
          take: limit,
        });
        break;
      }
      case "combinations": {
        // subjects đang lưu dạng chuỗi "A, B, C" => search trên chuỗi subjects
        const where = search
          ? {
              OR: [
                { code: { contains: search, mode: "insensitive" } },
                { subjects: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined;


        total = await prisma.subject_combinations.count({ where });
        data = await prisma.subject_combinations.findMany({
          where,
          include: {
            majors: {
              include: { universities: true },
            },
          },
          orderBy: { id: "desc" },
          skip,
          take: limit,
        });
        break;
      }
      default:
        return res.status(400).json({ status: "error", message: "Loại danh mục không hợp lệ" });
    }

    return res.status(200).json({
      data,
      meta: { total, page, limit },
    });
  } catch (error: any) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};


export const createCatalog = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type } = req.params;
    const data = req.body;
    let result;
    const id = crypto.randomUUID();

    switch (type) {
      case "universities":
        result = await prisma.universities.create({
          data: {
            id,
            code: data.code,
            name: data.name,
            description: data.description,
          },
        });
        break;
      case "majors":
        result = await prisma.majors.create({
          data: {
            id,
            code: data.code,
            name: data.name,
            university_id: data.university_id,
          },
        });
        break;
      case "combinations":
        result = await prisma.subject_combinations.create({
          data: {
            id,
            code: data.code,
            subjects: data.subjects,
            major_id: data.major_id,
          },
        });
        break;
      default:
        return res.status(400).json({ status: "error", message: "Loại danh mục không hợp lệ" });
    }
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ status: "error", message: "Mã đã tồn tại" });
    }
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateCatalog = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type } = req.params;
    const idParam = (req.params as any).id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const data = req.body;
    let result;

    switch (type) {
      case "universities":
        result = await prisma.universities.update({
          where: { id },
          data: {
            code: data.code,
            name: data.name,
            description: data.description,
            updated_at: new Date()
          },
        });
        break;
      case "majors":
        result = await prisma.majors.update({
          where: { id },
          data: {
            code: data.code,
            name: data.name,
            university_id: data.university_id,
            updated_at: new Date()
          },
        });
        break;
      case "combinations":
        result = await prisma.subject_combinations.update({
          where: { id },
          data: {
            code: data.code,
            subjects: data.subjects,
            major_id: data.major_id,
          },
        });
        break;
      default:
        return res.status(400).json({ status: "error", message: "Loại danh mục không hợp lệ" });
    }
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ status: "error", message: "Mã đã tồn tại" });
    }
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteCatalog = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type } = req.params;
    const idParam = (req.params as any).id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;


    switch (type) {
      case "universities":
        // Check for dependencies
        const majorsCount = await prisma.majors.count({ where: { university_id: id } });
        if (majorsCount > 0) {
          return res.status(400).json({ status: "error", message: "Không thể xóa trường vì đang có ngành thuộc trường này" });
        }
        await prisma.universities.delete({ where: { id } });
        break;
      case "majors":
        // Check for dependencies
        const combosCount = await prisma.subject_combinations.count({ where: { major_id: id } });
        if (combosCount > 0) {
          return res.status(400).json({ status: "error", message: "Không thể xóa ngành vì đang có tổ hợp thuộc ngành này" });
        }
        await prisma.majors.delete({ where: { id } });
        break;
      case "combinations":
        // Check for dependencies (applications)
        const appsCount = await prisma.applications.count({ where: { combination_id: id } });
        if (appsCount > 0) {
          return res.status(400).json({ status: "error", message: "Không thể xóa tổ hợp vì đã có hồ sơ đăng ký" });
        }
        await prisma.subject_combinations.delete({ where: { id } });
        break;
      default:
        return res.status(400).json({ status: "error", message: "Loại danh mục không hợp lệ" });
    }
    return res.status(200).json({ status: "success", message: "Đã xóa thành công" });
  } catch (error: any) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
