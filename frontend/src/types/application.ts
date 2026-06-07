export type ApplicationStatus =
  | "submitted"
  | "pending"
  | "approved"
  | "rejected";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type DocumentCategoryCode =
  | "CCCD"
  | "HOC_BA"
  | "UU_TIEN"
  | "KHAC";

export type DbFileType = "CCCD" | "HOC_BA" | "GIAY_UU_TIEN" | "OTHER";

export interface ApplicationDocument {
  name: string;
  url: string;
  fileType: DbFileType | string;
  label: string;
}

export interface ApplicationFormValues {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  phone: string;
  address: string;
  cccd: string;
  gender: Gender;
  priorityType?: string;
  gpa?: number;
  university: string;
  major: string;
  combination: string;
  priority: "1" | "2" | "3";
  score1: number;
  score2: number;
  score3: number;
  note?: string;
}

export interface ApplicationSubmitPayload {
  universityId: string;
  majorId: string;
  combinationId: string;
  aspiration: string;
  scoreSubject1: number;
  scoreSubject2: number;
  scoreSubject3: number;
  totalScore: number;
  priorityObject: string;
  gpa?: number;
  notes?: string;
  phone: string;
  address: string;
  cccd: string;
  gender: Gender;
  files: UploadedFilePayload[];
}

export interface UploadedFilePayload {
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
  documentCategory: DocumentCategoryCode;
}

/** Model thống nhất hiển thị ở Drawer Admin */
export interface ApplicationReview {
  id: string;
  studentId: string;
  studentName: string;
  cccd: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  university: string;
  universityName: string;
  major: string;
  combinationCode: string;
  combinationSubjects: string;
  aspiration: string;
  priorityObject: string;
  priorityScore: number;
  gpa?: string;
  enrollmentPeriod: string;
  status: ApplicationStatus;
  transcriptScore: number;
  scoreSubject1: number;
  scoreSubject2: number;
  scoreSubject3: number;
  transcriptSubjects: string;
  documents: ApplicationDocument[];
  submissionDate: string;
  notes?: string;
  rejectReason?: string;
}

export interface UniversityOption {
  id: string;
  code: string;
  name: string;
}

export interface MajorOption {
  id: string;
  code: string;
  name: string;
  university_id?: string;
}

export interface CombinationOption {
  id: string;
  code: string;
  name?: string;
  subjects: string | string[];
  major_id?: string;
}

export const PRIORITY_OBJECT_OPTIONS = [
  { id: "NONE", name: "Không có ưu tiên" },
  { id: "KV1", name: "Ưu tiên 1 (Khu vực 1)" },
  { id: "KV2_NT", name: "Ưu tiên 2 - Nông thôn (KV2-NT)" },
  { id: "KV2", name: "Ưu tiên 2 (Khu vực 2)" },
] as const;

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

export const ASPIRATION_OPTIONS = [
  { value: "1", label: "Nguyện vọng 1" },
  { value: "2", label: "Nguyện vọng 2" },
  { value: "3", label: "Nguyện vọng 3" },
];

export const DOC_CATEGORIES: {
  code: DocumentCategoryCode;
  name: string;
  required: boolean;
}[] = [
  { code: "CCCD", name: "Căn cước công dân (Mặt trước & sau)", required: true },
  { code: "HOC_BA", name: "Học bạ THPT", required: true },
  { code: "UU_TIEN", name: "Giấy chứng nhận ưu tiên", required: false },
  { code: "KHAC", name: "Các giấy tờ khác (Bằng khen, IELTS...)", required: false },
];

export const FILE_TYPE_LABELS: Record<string, string> = {
  CCCD: "Ảnh CCCD",
  HOC_BA: "Ảnh Học bạ",
  GIAY_UU_TIEN: "Giấy chứng nhận ưu tiên",
  OTHER: "Các giấy tờ khác",
};
