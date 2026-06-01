import prisma from "../configs/prisma.js";

class AdminService {
  async getStatistics() {
    const [totalApplications, totalUsers] = await Promise.all([
      prisma.applications.count(),
      prisma.users.count({ where: { role: 'CANDIDATE' } }),
    ]);

    const byStatus = await prisma.applications.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const byMajor = await prisma.applications.groupBy({
      by: ['majorId'],
      _count: { majorId: true },
      orderBy: { _count: { majorId: 'desc' } },
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
    const where: any = {};
    if (university) where.universityId = { contains: university };
    if (major) where.majorId = { contains: major };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.applications.findMany({
        where,
        include: {
          users: { select: { full_name: true, email: true, phone: true } },
          application_files: true,
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.applications.count({ where }),
    ]);

    return { data, total, page, limit };
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
  async updateApplicationStatus(id: string, status: string) {
    return await prisma.applications.update({
      where: { id },
      data: { status },
    });
  }
}

export default new AdminService();