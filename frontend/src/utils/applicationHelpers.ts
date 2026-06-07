import type { Rule } from "antd/es/form";
import {
  FILE_TYPE_LABELS,
  GENDER_OPTIONS,
  PRIORITY_OBJECT_OPTIONS,
  type CombinationOption,
  type DbFileType,
  type DocumentCategoryCode,
} from "../types/application";

export function getFileTypeLabel(fileType?: string): string {
  if (!fileType) return "Tài liệu minh chứng";
  return FILE_TYPE_LABELS[fileType] || fileType;
}

export function mapDocumentCategoryToDb(
  category: DocumentCategoryCode | string,
): DbFileType {
  if (category === "UU_TIEN") return "GIAY_UU_TIEN";
  if (category === "KHAC") return "OTHER";
  if (category === "CCCD" || category === "HOC_BA") return category;
  return "OTHER";
}

export function getSubjectLabels(combination?: CombinationOption | null): string[] {
  if (!combination?.subjects) {
    return ["Điểm môn 1", "Điểm môn 2", "Điểm môn 3"];
  }

  const raw = Array.isArray(combination.subjects)
    ? combination.subjects
    : String(combination.subjects).split(",");

  const labels = raw.map((s) => s.trim()).filter(Boolean);
  return [
    labels[0] || "Điểm môn 1",
    labels[1] || "Điểm môn 2",
    labels[2] || "Điểm môn 3",
  ];
}

export function parseNotesMeta(notes?: string | null) {
  const text = notes || "";
  const aspirationMatch = text.match(/\[Nguyện vọng\s(\d)\]/i);
  const gpaMatch = text.match(/\[GPA Học bạ:\s([^\]]+)\]/i);
  const genderMatch = text.match(/\[Giới tính:\s([^\]]+)\]/i);
  const rejectMatch = text.match(/\[LÝ DO TỪ CHỐI\]:\s([\s\S]*?)(?=\[|$)/i);

  return {
    aspiration: aspirationMatch?.[1] || "",
    gpa: gpaMatch?.[1]?.trim(),
    gender: genderMatch?.[1]?.trim(),
    rejectReason: rejectMatch?.[1]?.trim(),
    userNote: text
      .replace(/\[Nguyện vọng\s\d\]\s?/gi, "")
      .replace(/\[GPA Học bạ:[^\]]+\]\s?/gi, "")
      .replace(/\[Giới tính:[^\]]+\]\s?/gi, "")
      .replace(/\[LÝ DO TỪ CHỐI\]:[\s\S]*/gi, "")
      .trim(),
  };
}

export function getGenderLabel(code?: string): string {
  if (!code) return "---";
  const found = GENDER_OPTIONS.find((g) => g.value === code);
  if (found) return found.label;
  return code;
}

export function getPriorityObjectLabel(code?: string): string {
  if (!code) return "---";
  const found = PRIORITY_OBJECT_OPTIONS.find((p) => p.id === code);
  return found?.name || code;
}

export const phoneRules: Rule[] = [
  { required: true, message: "Vui lòng nhập số điện thoại!" },
  {
    pattern: /^(0|\+84)\d{9,10}$/,
    message: "Số điện thoại không hợp lệ (VD: 0912345678)!",
  },
];

export const cccdRules: Rule[] = [
  { required: true, message: "Vui lòng nhập số CCCD!" },
  {
    pattern: /^(\d{9}|\d{12})$/,
    message: "CCCD phải gồm 9 hoặc 12 chữ số!",
  },
];

export const addressRules: Rule[] = [
  { required: true, message: "Vui lòng nhập địa chỉ!" },
  { min: 5, message: "Địa chỉ quá ngắn!" },
];

export const genderRules: Rule[] = [
  { required: true, message: "Vui lòng chọn giới tính!" },
];

export function createScoreRules(label: string): Rule[] {
  return [
    { required: true, message: `Vui lòng nhập ${label}!` },
    {
      validator: async (_rule, value) => {
        if (value === undefined || value === null || value === "") {
          throw new Error(`Vui lòng nhập ${label}!`);
        }
        const num = Number(value);
        if (Number.isNaN(num) || num < 0 || num > 10) {
          throw new Error(`${label} phải từ 0 đến 10!`);
        }
      },
    },
  ];
}
