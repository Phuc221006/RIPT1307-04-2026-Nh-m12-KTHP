import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// 💡 TUYỆT CHIÊU: Tạo từ điển Khối thi để gõ cho nhanh, tránh lặp code dài dòng
const COMBOS = {
  A00: { code: "A00", subjects: "Toán, Vật lý, Hóa học" },
  A01: { code: "A01", subjects: "Toán, Vật lý, Tiếng Anh" },
  B00: { code: "B00", subjects: "Toán, Hóa học, Sinh học" },
  C00: { code: "C00", subjects: "Ngữ văn, Lịch sử, Địa lý" },
  D01: { code: "D01", subjects: "Toán, Ngữ văn, Tiếng Anh" },
  D07: { code: "D07", subjects: "Toán, Hóa học, Tiếng Anh" },
  V00: { code: "V00", subjects: "Toán, Vật lý, Vẽ Mỹ thuật" },
  H00: { code: "H00", subjects: "Ngữ văn, Năng khiếu 1, Năng khiếu 2" },
};

// 📦 SIÊU DỮ LIỆU: 20 Trường x ~12 Ngành/Trường
const universitiesData = [
  {
    code: "UNI_PTIT",
    name: "Học viện Công nghệ Bưu chính Viễn thông",
    description: "Trường đại học trọng điểm quốc gia về ICT.",
    majors: [
      {
        code: "MAJ_IT",
        name: "Công nghệ thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_IS",
        name: "An toàn thông tin",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_SE",
        name: "Kỹ thuật phần mềm",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_DS",
        name: "Khoa học dữ liệu",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AI",
        name: "Trí tuệ nhân tạo",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_TEL",
        name: "Kỹ thuật Viễn thông",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ELE",
        name: "Kỹ thuật Điện tử",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_MKT",
        name: "Marketing số",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ECO",
        name: "Thương mại điện tử",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_MUL",
        name: "Công nghệ Đa phương tiện",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_LOG",
        name: "Logistics",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
    ],
  },
  {
    code: "UNI_HUST",
    name: "Đại học Bách Khoa Hà Nội",
    description: "Đại học kỹ thuật đa ngành hàng đầu Việt Nam.",
    majors: [
      {
        code: "MAJ_CS",
        name: "Khoa học máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_CE",
        name: "Kỹ thuật máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_DS",
        name: "Khoa học Dữ liệu và AI",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ME",
        name: "Cơ điện tử",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AUTO",
        name: "Kỹ thuật Ô tô",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ROB",
        name: "Robot và Tự động hóa",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_CHEM",
        name: "Kỹ thuật Hóa học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_BIO",
        name: "Kỹ thuật Sinh học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_MAT",
        name: "Khoa học Vật liệu",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_FOOD",
        name: "Công nghệ Thực phẩm",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_AERO",
        name: "Kỹ thuật Hàng không",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_NEU",
    name: "Đại học Kinh tế Quốc dân",
    description: "Trường trọng điểm về đào tạo kinh tế và quản lý.",
    majors: [
      {
        code: "MAJ_BA",
        name: "Quản trị Kinh doanh",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01, COMBOS.D07],
      },
      {
        code: "MAJ_ACC",
        name: "Kế toán",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_FIN",
        name: "Tài chính - Ngân hàng",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_MKT",
        name: "Marketing",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_LOG",
        name: "Logistics & Quản lý chuỗi",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_HR",
        name: "Quản trị Nhân lực",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_IB",
        name: "Kinh doanh Quốc tế",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ECO",
        name: "Kinh tế học",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_STA",
        name: "Thống kê Kinh tế",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_HOT",
        name: "Quản trị Khách sạn",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_LAW",
        name: "Luật Kinh tế",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01, COMBOS.C00],
      },
    ],
  },
  {
    code: "UNI_FTU",
    name: "Đại học Ngoại thương",
    description: "Trường đại học hàng đầu về kinh tế đối ngoại.",
    majors: [
      {
        code: "MAJ_IB",
        name: "Kinh tế đối ngoại",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01, COMBOS.D07],
      },
      {
        code: "MAJ_LOG",
        name: "Logistics",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_FIN",
        name: "Tài chính Quốc tế",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ACC",
        name: "Kế toán - Kiểm toán",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_MKT",
        name: "Marketing số",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_LAW",
        name: "Luật Thương mại Quốc tế",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      { code: "MAJ_ENG", name: "Ngôn ngữ Anh", combinations: [COMBOS.D01] },
      { code: "MAJ_JAP", name: "Ngôn ngữ Nhật", combinations: [COMBOS.D01] },
      { code: "MAJ_CHI", name: "Ngôn ngữ Trung", combinations: [COMBOS.D01] },
      { code: "MAJ_FRE", name: "Ngôn ngữ Pháp", combinations: [COMBOS.D01] },
      {
        code: "MAJ_HOT",
        name: "Quản trị Khách sạn Quốc tế",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
    ],
  },
  {
    code: "UNI_VNU_UET",
    name: "Đại học Công nghệ - ĐHQGHN",
    description: "Nơi đào tạo nhân tài công nghệ kỹ thuật.",
    majors: [
      {
        code: "MAJ_IT",
        name: "Công nghệ thông tin",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_CE",
        name: "Kỹ thuật máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_IS",
        name: "Hệ thống thông tin",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AI",
        name: "Trí tuệ nhân tạo",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ROB",
        name: "Cơ kỹ thuật và Robot",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AGRI",
        name: "Công nghệ Nông nghiệp",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_AERO",
        name: "Công nghệ Hàng không vũ trụ",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ELE",
        name: "Điện tử viễn thông",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_PHY",
        name: "Vật lý Kỹ thuật",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_MAT",
        name: "Công nghệ vật liệu",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_HMU",
    name: "Đại học Y Hà Nội",
    description: "Cái nôi đào tạo bác sĩ, chuyên gia y tế hàng đầu.",
    majors: [
      { code: "MAJ_MED", name: "Y khoa", combinations: [COMBOS.B00] },
      { code: "MAJ_DEN", name: "Răng - Hàm - Mặt", combinations: [COMBOS.B00] },
      { code: "MAJ_NUR", name: "Điều dưỡng", combinations: [COMBOS.B00] },
      {
        code: "MAJ_PHAR",
        name: "Dược học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_PUB",
        name: "Y tế Công cộng",
        combinations: [COMBOS.B00, COMBOS.D01],
      },
      {
        code: "MAJ_TEST",
        name: "Kỹ thuật Xét nghiệm Y học",
        combinations: [COMBOS.B00],
      },
      {
        code: "MAJ_IMG",
        name: "Kỹ thuật Hình ảnh Y học",
        combinations: [COMBOS.B00],
      },
      { code: "MAJ_NUT", name: "Dinh dưỡng", combinations: [COMBOS.B00] },
      {
        code: "MAJ_EYE",
        name: "Khúc xạ Nhãn khoa",
        combinations: [COMBOS.B00],
      },
      {
        code: "MAJ_PSY",
        name: "Tâm lý học Lâm sàng",
        combinations: [COMBOS.B00, COMBOS.C00, COMBOS.D01],
      },
    ],
  },
  {
    code: "UNI_FPT",
    name: "Đại học FPT",
    description: "Đại học của doanh nghiệp, môi trường quốc tế.",
    majors: [
      {
        code: "MAJ_SE",
        name: "Kỹ thuật phần mềm",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_AI",
        name: "Trí tuệ Nhân tạo",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_IS",
        name: "An toàn thông tin",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_GD",
        name: "Thiết kế Đồ họa",
        combinations: [COMBOS.V00, COMBOS.H00, COMBOS.D01],
      },
      {
        code: "MAJ_BA",
        name: "Quản trị Kinh doanh",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_MKT",
        name: "Digital Marketing",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_HOT",
        name: "Quản trị Khách sạn",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      { code: "MAJ_ENG", name: "Ngôn ngữ Anh", combinations: [COMBOS.D01] },
      { code: "MAJ_JAP", name: "Ngôn ngữ Nhật", combinations: [COMBOS.D01] },
      { code: "MAJ_KOR", name: "Ngôn ngữ Hàn", combinations: [COMBOS.D01] },
    ],
  },
  {
    code: "UNI_HAU",
    name: "Đại học Kiến trúc Hà Nội",
    description: "Cái nôi của các kiến trúc sư và nhà quy hoạch.",
    majors: [
      { code: "MAJ_ARC", name: "Kiến trúc", combinations: [COMBOS.V00] },
      {
        code: "MAJ_INT",
        name: "Thiết kế Nội thất",
        combinations: [COMBOS.H00],
      },
      {
        code: "MAJ_PLA",
        name: "Quy hoạch vùng và đô thị",
        combinations: [COMBOS.A00, COMBOS.V00],
      },
      {
        code: "MAJ_CE",
        name: "Kỹ thuật Xây dựng",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_INF",
        name: "Kỹ thuật Hạ tầng đô thị",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      { code: "MAJ_ART", name: "Điêu khắc", combinations: [COMBOS.H00] },
      {
        code: "MAJ_FAS",
        name: "Thiết kế Thời trang",
        combinations: [COMBOS.H00],
      },
      {
        code: "MAJ_IT",
        name: "Công nghệ thông tin",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_LAN",
        name: "Kiến trúc Cảnh quan",
        combinations: [COMBOS.V00],
      },
      {
        code: "MAJ_ECO",
        name: "Quản lý Xây dựng",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
    ],
  },
  {
    code: "UNI_USSH",
    name: "Đại học Khoa học Xã hội và Nhân văn",
    description: "Trường trọng điểm về nhóm ngành xã hội, văn hóa.",
    majors: [
      {
        code: "MAJ_PSY",
        name: "Tâm lý học",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_PR",
        name: "Quan hệ công chúng",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_JOU",
        name: "Báo chí",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_SOC",
        name: "Xã hội học",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_SOW",
        name: "Công tác xã hội",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_TOU",
        name: "Quản trị Dịch vụ Du lịch",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_LIT",
        name: "Văn học",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      { code: "MAJ_HIS", name: "Lịch sử", combinations: [COMBOS.C00] },
      {
        code: "MAJ_KOR",
        name: "Hàn Quốc học",
        combinations: [COMBOS.D01, COMBOS.C00],
      },
      {
        code: "MAJ_JAP",
        name: "Nhật Bản học",
        combinations: [COMBOS.D01, COMBOS.C00],
      },
    ],
  },
  {
    code: "UNI_HCMUT",
    name: "Đại học Bách Khoa TP.HCM",
    description: "Trường kỹ thuật lớn nhất khu vực miền Nam.",
    majors: [
      {
        code: "MAJ_CS",
        name: "Khoa học máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_CE",
        name: "Kỹ thuật Xây dựng",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ME",
        name: "Cơ điện tử",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AUTO",
        name: "Kỹ thuật Ô tô",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ELE",
        name: "Kỹ thuật Điện - Điện tử",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_CHEM",
        name: "Kỹ thuật Hóa học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_BIO",
        name: "Công nghệ Sinh học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_ENV",
        name: "Kỹ thuật Môi trường",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_AERO",
        name: "Kỹ thuật Hàng không",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_MAT",
        name: "Kỹ thuật Vật liệu",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_AOF",
    name: "Học viện Tài chính",
    description: "Trường đào tạo Tài chính - Kế toán số 1 VN.",
    majors: [
      {
        code: "MAJ_TAX",
        name: "Thuế và Tài chính",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ACC",
        name: "Kế toán doanh nghiệp",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_AUD",
        name: "Kiểm toán",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_CUS",
        name: "Hải quan & Logistics",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_INS",
        name: "Bảo hiểm",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_MKT",
        name: "Marketing",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_BA",
        name: "Quản trị kinh doanh",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ENG",
        name: "Ngôn ngữ Anh Tài chính",
        combinations: [COMBOS.D01],
      },
      {
        code: "MAJ_IT",
        name: "Tin học Tài chính",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ECO",
        name: "Kinh tế học",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
    ],
  },
  {
    code: "UNI_UTC",
    name: "Đại học Giao thông Vận tải",
    description: "Đại học trọng điểm về Giao thông và Kỹ thuật.",
    majors: [
      {
        code: "MAJ_ROAD",
        name: "Kỹ thuật Xây dựng Cầu đường",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AUTO",
        name: "Kỹ thuật Ô tô",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_LOG",
        name: "Logistics",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_RAIL",
        name: "Kỹ thuật Đường sắt",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_IT",
        name: "Công nghệ Thông tin",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ELE",
        name: "Kỹ thuật Điện tử",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ECO",
        name: "Kinh tế Vận tải",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ENV",
        name: "Kỹ thuật Môi trường",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_MEC",
        name: "Kỹ thuật Cơ khí",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_URB",
        name: "Kỹ thuật Giao thông Đô thị",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_TDTU",
    name: "Đại học Tôn Đức Thắng",
    description: "Đại học hiện đại, đạt nhiều chuẩn xếp hạng quốc tế.",
    majors: [
      {
        code: "MAJ_BA",
        name: "Quản trị Kinh doanh",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_LAW",
        name: "Luật học",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_HOT",
        name: "Quản trị Khách sạn",
        combinations: [COMBOS.A00, COMBOS.D01, COMBOS.C00],
      },
      {
        code: "MAJ_IT",
        name: "Khoa học máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_PHAR",
        name: "Dược học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      { code: "MAJ_ENG", name: "Ngôn ngữ Anh", combinations: [COMBOS.D01] },
      {
        code: "MAJ_GRA",
        name: "Thiết kế đồ họa",
        combinations: [COMBOS.H00, COMBOS.V00],
      },
      {
        code: "MAJ_SPO",
        name: "Quản lý Thể dục Thể thao",
        combinations: [COMBOS.C00, COMBOS.D01],
      },
      {
        code: "MAJ_ACC",
        name: "Kế toán",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_FIN",
        name: "Tài chính Ngân hàng",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
    ],
  },
  {
    code: "UNI_BA",
    name: "Học viện Ngân hàng",
    description: "Nơi ươm mầm tài năng khối Tài chính - Ngân hàng.",
    majors: [
      {
        code: "MAJ_BANK",
        name: "Tài chính Ngân hàng",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ACC",
        name: "Kế toán",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_IB",
        name: "Kinh doanh Quốc tế",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_BA",
        name: "Quản trị kinh doanh",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_LAW",
        name: "Luật Kinh tế",
        combinations: [COMBOS.A00, COMBOS.D01, COMBOS.C00],
      },
      {
        code: "MAJ_IT",
        name: "Công nghệ thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_MIS",
        name: "Hệ thống thông tin quản lý",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      { code: "MAJ_ENG", name: "Ngôn ngữ Anh", combinations: [COMBOS.D01] },
      {
        code: "MAJ_MKT",
        name: "Marketing",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_ECO",
        name: "Kinh tế đầu tư",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
    ],
  },
  {
    code: "UNI_KMA",
    name: "Học viện Kỹ thuật Mật mã",
    description: "Lò đào tạo chuyên gia an ninh mạng của Ban Cơ yếu.",
    majors: [
      {
        code: "MAJ_IS",
        name: "An toàn thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D07],
      },
      {
        code: "MAJ_IT",
        name: "Công nghệ thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D07],
      },
      {
        code: "MAJ_ELE",
        name: "Kỹ thuật Điện tử",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_SE",
        name: "Kỹ thuật phần mềm",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AI",
        name: "Trí tuệ nhân tạo",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_DATA",
        name: "Khoa học Dữ liệu",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_EM",
        name: "Hệ thống Nhúng",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_TEL",
        name: "Kỹ thuật Viễn thông",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_AUTO",
        name: "Tự động hóa",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_CYBER",
        name: "An ninh Mạng",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_UIT",
    name: "Đại học CNTT - ĐHQG TP.HCM",
    description: "Trường top đầu phía Nam về Máy tính và CNTT.",
    majors: [
      {
        code: "MAJ_SE",
        name: "Kỹ thuật phần mềm",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_IS",
        name: "An toàn thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_CS",
        name: "Khoa học Máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_CE",
        name: "Kỹ thuật Máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_IT",
        name: "Công nghệ Thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_AI",
        name: "Trí tuệ Nhân tạo",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_DS",
        name: "Khoa học Dữ liệu",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ECO",
        name: "Thương mại Điện tử",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_MIS",
        name: "Hệ thống thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_NET",
        name: "Mạng máy tính & Truyền thông",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_CTU",
    name: "Đại học Cần Thơ",
    description: "Trường đại học trọng điểm khu vực Đồng bằng Sông Cửu Long.",
    majors: [
      {
        code: "MAJ_AGRI",
        name: "Nông học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_AQUA",
        name: "Nuôi trồng Thủy sản",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_IT",
        name: "Công nghệ thông tin",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_BA",
        name: "Quản trị kinh doanh",
        combinations: [COMBOS.A00, COMBOS.D01],
      },
      { code: "MAJ_LAW", name: "Luật", combinations: [COMBOS.C00, COMBOS.D01] },
      {
        code: "MAJ_VET",
        name: "Thú y",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_ENV",
        name: "Khoa học Môi trường",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_FOOD",
        name: "Công nghệ Thực phẩm",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      { code: "MAJ_ENG", name: "Ngôn ngữ Anh", combinations: [COMBOS.D01] },
      {
        code: "MAJ_EDU",
        name: "Sư phạm Toán học",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_UMP",
    name: "Đại học Y Dược TP.HCM",
    description: "Đại học đào tạo khối ngành Y tế số 1 miền Nam.",
    majors: [
      { code: "MAJ_MED", name: "Y khoa", combinations: [COMBOS.B00] },
      {
        code: "MAJ_PHAR",
        name: "Dược học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      { code: "MAJ_DEN", name: "Răng - Hàm - Mặt", combinations: [COMBOS.B00] },
      { code: "MAJ_NUR", name: "Điều dưỡng", combinations: [COMBOS.B00] },
      { code: "MAJ_MID", name: "Hộ sinh", combinations: [COMBOS.B00] },
      { code: "MAJ_PUB", name: "Y tế Công cộng", combinations: [COMBOS.B00] },
      {
        code: "MAJ_TEST",
        name: "Xét nghiệm Y học",
        combinations: [COMBOS.B00],
      },
      { code: "MAJ_IMG", name: "Hình ảnh Y học", combinations: [COMBOS.B00] },
      {
        code: "MAJ_PHY",
        name: "Phục hồi chức năng",
        combinations: [COMBOS.B00],
      },
      { code: "MAJ_TRAD", name: "Y học Cổ truyền", combinations: [COMBOS.B00] },
    ],
  },
  {
    code: "UNI_HCMUS",
    name: "Đại học Khoa học Tự nhiên TP.HCM",
    description: "Nơi tập trung nghiên cứu Khoa học Cơ bản và Công nghệ cao.",
    majors: [
      {
        code: "MAJ_BIO",
        name: "Công nghệ Sinh học",
        combinations: [COMBOS.B00, COMBOS.A00],
      },
      {
        code: "MAJ_CHEM",
        name: "Hóa học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_CS",
        name: "Khoa học Máy tính",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_MAT",
        name: "Khoa học Vật liệu",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ENV",
        name: "Khoa học Môi trường",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_PHY",
        name: "Vật lý học",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_MATH",
        name: "Toán học",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_OCE",
        name: "Hải dương học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_GEO",
        name: "Địa chất học",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_NUC",
        name: "Kỹ thuật Hạt nhân",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
    ],
  },
  {
    code: "UNI_HCMUTE",
    name: "Đại học Sư phạm Kỹ thuật TP.HCM",
    description: "Trường đào tạo kỹ sư và giáo viên kỹ thuật thực hành.",
    majors: [
      {
        code: "MAJ_AUTO",
        name: "Kỹ thuật Ô tô",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ELE",
        name: "Kỹ thuật Điện - Điện tử",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_MEC",
        name: "Kỹ thuật Cơ khí",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_IT",
        name: "Công nghệ thông tin",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_CE",
        name: "Kỹ thuật Xây dựng",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_GAR",
        name: "Công nghệ May",
        combinations: [COMBOS.A00, COMBOS.A01, COMBOS.D01],
      },
      {
        code: "MAJ_FOOD",
        name: "Công nghệ Thực phẩm",
        combinations: [COMBOS.A00, COMBOS.B00],
      },
      {
        code: "MAJ_PRI",
        name: "Công nghệ In",
        combinations: [COMBOS.A00, COMBOS.A01],
      },
      {
        code: "MAJ_ECO",
        name: "Kinh tế Gia đình",
        combinations: [COMBOS.A00, COMBOS.D01],
      },
      {
        code: "MAJ_ENG",
        name: "Sư phạm Tiếng Anh",
        combinations: [COMBOS.D01],
      },
    ],
  },
];

async function main() {
  console.log("⏳ Đang dọn dẹp Database cũ (để tránh trùng lặp)...");

  // Xóa theo thứ tự từ bảng con đến bảng cha (chống lỗi Khóa ngoại)
  await prisma.application_files.deleteMany();
  await prisma.application_status_logs.deleteMany();
  await prisma.applications.deleteMany();
  await prisma.subject_combinations.deleteMany();
  await prisma.majors.deleteMany();
  await prisma.universities.deleteMany();
  await prisma.admission_rounds.deleteMany();

  console.log('✅ Đã dọn dẹp xong. Bắt đầu đổ dữ liệu "Khủng" vào Database...');

  // 1. Tạo Đợt tuyển sinh mặc định
  await prisma.admission_rounds.create({
    data: {
      id: crypto.randomUUID(),
      title: "Đợt Tuyển Sinh Đại Học 2026",
      start_date: new Date(),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      is_active: true,
    },
  });

  // 2. Vòng lặp siêu tốc: Đổ 20 Trường, >200 Ngành, >600 Tổ hợp môn
  for (const uni of universitiesData) {
    await prisma.universities.create({
      data: {
        id: crypto.randomUUID(),
        code: uni.code,
        name: uni.name,
        description: uni.description,

        // Tạo ngành học
        majors: {
          create: uni.majors.map((m) => ({
            id: crypto.randomUUID(),
            code: m.code,
            name: m.name,

            // Tạo tổ hợp môn cho ngành học đó
            subject_combinations: {
              create: m.combinations.map((c) => ({
                id: crypto.randomUUID(),
                code: c.code,
                subjects: c.subjects,
              })),
            },
          })),
        },
      },
    });
    console.log(
      `🏫 Đã thêm thành công: ${uni.name} (${uni.majors.length} ngành)`,
    );
  }

  console.log("🎉 XONG! TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC SEED THÀNH CÔNG RỰC RỠ!");
}

main()
  .catch((e) => {
    console.error("❌ Có lỗi xảy ra trong quá trình Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
