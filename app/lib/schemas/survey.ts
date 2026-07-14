import { z } from "zod";

// 허용된 이메일 도메인 (SurveyAnswer.js ALLOWED_INDIAN_EMAIL_DOMAINS)
const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "yahoo.in",
  "hotmail.com",
  "rediffmail.com",
  "icloud.com",
] as const;

// 이메일 검증 로직 (input-component.tsx에서 추출)
function validateEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  if (!normalized) return false;
  if (/\s/.test(email.trim())) return false;
  if (/[^\x00-\x7F]/.test(normalized)) return false;

  const parts = normalized.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!/^[a-z0-9._%+-]+$/.test(local)) return false;
  if (!/^[a-z0-9.-]+$/.test(domain)) return false;
  if (/^[._%+-]|[._%+-]$/.test(local)) return false;
  if (local.includes("..") || domain.includes("..")) return false;
  if (!domain.includes(".")) return false;

  const labels = domain.split(".");
  if (labels.some((l) => !l || l.startsWith("-") || l.endsWith("-")))
    return false;

  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,}$/.test(tld)) return false;
  return ALLOWED_EMAIL_DOMAINS.includes(domain as any);
}

// 전화번호 검증 (인도 번호: 6-9로 시작, 10자리)
const PhoneRegex = /^[6-9]\d{9}$/;

// 설문 답변 스키마
export const SurveyAnswersSchema = z.object({
  name: z.string().min(2).optional(),
  email: z
    .string()
    .refine(validateEmail, "Invalid email or unsupported domain")
    .optional(),
  phone: z.string().regex(PhoneRegex, "Invalid Indian phone number").optional(),
  city: z.string().optional(),
  gender: z.string().optional(),
  age: z.string().optional(),
  skinType: z.string().optional(),
  skinHelperCleanse: z.string().optional(),
  skinHelperAfterHours: z.string().optional(),
  skinHelperDay: z.string().optional(),
  skinHelperTexture: z.string().optional(),
  concerns: z.string().optional(),
  trigger: z.array(z.string()).optional(),
  sensitivity: z.string().optional(),
  outdoor: z.string().optional(),
  sunscreen: z.string().optional(),
  sleep: z.string().optional(),
  stress: z.string().optional(),
  routineLevel: z.string().optional(),
  photoDataUrl: z.string().optional(),
});

export type ValidatedSurveyAnswers = z.infer<typeof SurveyAnswersSchema>;

// Google Sheets 전송용 페이로드 스키마 (유연한 구조)
export const SurveySheetPayloadSchema = z.record(z.string(), z.any());

export type ValidatedSheetPayload = z.infer<typeof SurveySheetPayloadSchema>;
