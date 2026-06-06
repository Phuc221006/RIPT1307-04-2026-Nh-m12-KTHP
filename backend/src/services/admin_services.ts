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
          users: { select: { full_name: true, email: true, phone: true } },
          application_files: true,
        },
        orderBy: { created_at: "desc" },
        skip: skip,
        take: take,
      }),
      prisma.applications.count({ where }),
    ]);

    return { data, total, page: currentPage, limit: take };
  }

  async updateApplicationStatus(id: string, status: any) {
    return await prisma.applications.update({
      where: { id },
      data: { status },
    });
  }
}

export default new AdminService();
