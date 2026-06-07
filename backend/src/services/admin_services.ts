import prisma from "../configs/prisma.js";

class AdminService {
  async getStatistics() {
    const [totalApplications, totalUsers] = await Promise.all([
      prisma.applications.count(),
      prisma.users.count({ where: { role: "CANDIDATE" } }),
    ]);

    const byStatus = await prisma.applications.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Sửa majorId thành major_id để khớp với schema.prisma
    const byMajor = await prisma.applications.groupBy({
      by: ["major_id"],
      _count: { major_id: true },
      orderBy: { _count: { major_id: "desc" } },
      take: 6,
    });

    return {
      totalApplications,
      totalUsers,
      byStatus,
      byMajor,
    };
  }

  async getAllApplications(filters: any) {
    const { university, major, status, page = 1, limit = 10 } = filters;

    // ÉP KIỂU SỐ (NUMBER) ĐỂ PRISMA KHÔNG BÁO LỖI
    const currentPage = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (currentPage - 1) * take;

    const where: any = {};
    // Sửa tên cột thành snake_case cho chuẩn với Database
    if (university) where.university_id = { contains: String(university) };
    if (major) where.major_id = { contains: String(major) };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.applications.findMany({
        where,
        include: {
          users: {
            select: {
              full_name: true,
              email: true,
              phone: true,
              cccd: true,
              dob: true,
              address: true,
            },
          },
          application_files: true,
          subject_combinations: {
            select: { code: true, subjects: true },
          },
        },
        orderBy: { created_at: "desc" },
        skip: skip,
        take: take,
      }),
      prisma.applications.count({ where }),
    ]);

    return { data, total, page: currentPage, limit: take };
  }

  async getUniversities() {
    return await prisma.universities.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getMajors() {
    return await prisma.majors.findMany({
      include: {
        universities: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getCombinations() {
    return await prisma.subject_combinations.findMany({
      include: {
        majors: true,
      },
    });
  }

  async updateApplicationStatus(id: string, status: any, notes?: string) {
    const existing = await prisma.applications.findUnique({ where: { id } });
    let mergedNotes = existing?.notes || "";

    if (notes) {
      if (String(status).toUpperCase() === "REJECTED") {
        mergedNotes = `${mergedNotes ? mergedNotes + " " : ""}[LÝ DO TỪ CHỐI]: ${notes}`.trim();
      } else {
        mergedNotes = notes;
      }
    }

    return await prisma.applications.update({
      where: { id },
      data: {
        status,
        ...(notes ? { notes: mergedNotes } : {}),
      },
    });
  }
}

export default new AdminService();
