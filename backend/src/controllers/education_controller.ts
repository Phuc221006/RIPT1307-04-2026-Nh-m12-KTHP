import { Request, Response } from "express";
import prisma from "../configs/prisma";

export const EducationController = {
  // --- TRƯỜNG ---
  createUni: async (req: Request, res: Response) => {
    const { code, name, description } = req.body;
    const uni = await prisma.universities.create({
      data: { id: crypto.randomUUID(), code, name, description },
    });
    res.status(201).json(uni);
  },
  getAllUnis: async (req: Request, res: Response) => {
    const unis = await prisma.universities.findMany();
    res.json(unis);
  },
  deleteUni: async (req: Request, res: Response) => {
    await prisma.universities.delete({ where: { id: req.params.id } });
    res.status(204).send();
  },

  // --- NGÀNH ---
  createMajor: async (req: Request, res: Response) => {
    const { university_id, code, name } = req.body;
    const major = await prisma.majors.create({
      data: { id: crypto.randomUUID(), university_id, code, name },
    });
    res.status(201).json(major);
  },

  // --- TỔ HỢP ---
  createCombo: async (req: Request, res: Response) => {
    const { major_id, code, subjects } = req.body;
    const combo = await prisma.subject_combinations.create({
      data: { id: crypto.randomUUID(), major_id, code, subjects },
    });
    res.status(201).json(combo);
  },
};
