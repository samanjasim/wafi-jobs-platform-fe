import { z } from 'zod';
import { MaritalStatus } from '@/types';

// Work Experience Schema - Optional fields that can be empty
const WorkExperienceSchema = z.object({
  expCompany: z.string().optional(),
  expPosition: z.string().optional(),
  expDuration: z.string().optional(),
  expReason: z.string().optional(),
});

export const JobApplicationSchema = z.object({
  // Personal Information (All Required)
  fullName: z.string().min(2, 'الاسم الكامل مطلوب').max(100, 'الاسم طويل جداً'),
  nationalId: z.string().min(1, 'رقم الهوية الوطنية مطلوب'),
  dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب').refine(
    (val) => !isNaN(Date.parse(val)), 
    { message: 'تاريخ الميلاد غير صحيح' }
  ),
  nationality: z.string().min(1, 'الجنسية مطلوبة'),
  maritalStatus: z.string().min(1, 'يرجى اختيار الحالة الاجتماعية').refine(
    (val) => Object.values(MaritalStatus).includes(val as MaritalStatus),
    { message: 'يرجى اختيار حالة اجتماعية صحيحة' }
  ),

  // Contact Information (All Required)
  phone: z.string().min(10, 'رقم الهاتف مطلوب').regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح'),
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صحيح'),
  address: z.string().min(5, 'عنوان السكن مطلوب'),

  // Education (Optional)
  qualification: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.string().optional(),

  // Work Experience (Array - at least one entry allowed but not required)
  workExperiences: z.array(WorkExperienceSchema).optional(),

  // Company Questions (Required)
  appliedBefore: z.string().min(1, 'يرجى الإجابة على هذا السؤال').transform((val) => val === 'true'),
  appliedBeforeWhen: z.string().optional(),
  relativesInCompany: z.string().min(1, 'يرجى الإجابة على هذا السؤال').transform((val) => val === 'true'),
  relativesDetails: z.string().optional(),

  // Signature (Required)
  applicantName: z.string().min(1, 'اسم المتقدم مطلوب'),
  signature: z.string().min(1, 'التوقيع مطلوب'),
});

export type JobApplicationFormData = z.infer<typeof JobApplicationSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;

export const LoginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
