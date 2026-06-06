import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../configs/prisma.js";

export const EducationController = {
  // --- TRƯỜNG ---
  createUni: async (req: Request, res: Response) => {
    try {
      const { code, name, description } = req.body;
      const uni = await prisma.universities.create({
        data: {
          id: crypto.randomUUID(),
          code,
          name,
          description,
        },
      });
      res.status(201).json(uni);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  getAllUnis: async (req: Request, res: Response) => {
    try {
      const unis = await prisma.universities.findMany({
        orderBy: { name: "asc" },
      });
      res.json(unis);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  updateUni: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { code, name, description } = req.body;
      const uni = await prisma.universities.update({
        where: { id },
        data: { code, name, description },
      });
      res.status(200).json(uni);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  deleteUni: async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await prisma.universities.delete({ where: { id } });
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
      const { id } = req.params;
      const { universityId, university_id, code, name } = req.body;
      const major = await prisma.majors.update({
        where: { id },
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
      const { id } = req.params;
      await prisma.majors.delete({ where: { id } });
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
      const { id } = req.params;
      const { majorId, major_id, code, subjects } = req.body;
      const combo = await prisma.subject_combinations.update({
        where: { id },
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
      const { id } = req.params;
      await prisma.subject_combinations.delete({ where: { id } });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};
