import { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { submitJobApplication } from '@/services/api';
import { JobApplicationSchema, type JobApplicationFormData } from '@/schemas';
import { MaritalStatus } from '@/types';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  User, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Building, 
  Upload,
  PenTool,
  Download,
  Plus,
  Trash2
} from 'lucide-react';
import SignatureCanvas from '@/components/SignatureCanvas';

const JobApplicationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const signatureRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: {
      workExperiences: [{ expCompany: '', expPosition: '', expDuration: '', expReason: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workExperiences',
  });

  const appliedBeforeValue = watch('appliedBefore');
  const relativesInCompanyValue = watch('relativesInCompany');
  const appliedBefore = appliedBeforeValue === 'true';
  const relativesInCompany = relativesInCompanyValue === 'true';

  const submitMutation = useMutation({
    mutationFn: submitJobApplication,
    onSuccess: (data) => {
      setReferenceCode(data.referenceCode);
      setIsSubmitted(true);
      toast.success('تم إرسال طلبك بنجاح!');
      reset();
      setCvFile(null);
      setValue('signature', '');
      signatureRef.current?.clear();
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.');
      console.error('Submission error:', error);
    },
  });

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('حجم الملف كبير جداً. يرجى اختيار ملف أصغر من 5MB');
        return;
      }
      setCvFile(file);
      toast.success('تم اختيار الملف بنجاح');
    }
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    const formData = new FormData();
    
    // Add all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'workExperiences') {
        formData.append(key, value.toString());
      }
    });

    // Add work experiences if they exist
    if (data.workExperiences && data.workExperiences.length > 0) {
      formData.append('workExperiences', JSON.stringify(data.workExperiences));
    }

    // Add CV file if selected
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    submitMutation.mutate(formData as any);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">تم إرسال طلبك بنجاح!</h2>
            <p className="text-gray-600">سيتم مراجعة طلبك والتواصل معك قريباً</p>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium">رقم المرجع: {referenceCode}</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              تقديم طلب آخر
            </button>
            <button
              onClick={() => window.print()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <Download className="h-4 w-4" />
              <span>طباعة الإيصال</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="space-y-8">
            {/* Welcome Text */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed">
                انضم إلى عائلة شركة دلتا للصناعات الغذائية
              </h1>
              <p className="text-xl md:text-2xl font-medium text-emerald-100">
                قدّم طلبك الآن وابدأ مسيرتك المهنية معنا
              </p>
            </div>
            
            {/* Logo */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <img 
                  src="/images/alwafi-logo.png" 
                  alt="Delta AlWafi Logo" 
                  className="h-20 md:h-24 w-auto"
                  onError={(e) => {
                    // Fallback if logo image is not found
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.setAttribute('style', 'display: block;');
                  }}
                />
                {/* Fallback text logo */}
                <div className="hidden text-white font-bold text-2xl md:text-3xl">
                  Delta AlWafi
                </div>
              </div>
            </div>
            
            {/* Form Title */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white">نموذج طلب التوظيف</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Personal Information Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6 pb-4 border-b border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">المعلومات الشخصية</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="الاسم الأول والأب والجد والعائلة"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    تاريخ الميلاد <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    الجنسية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('nationality')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="الجنسية"
                  />
                  {errors.nationality && (
                    <p className="text-red-500 text-sm">{errors.nationality.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رقم الهوية الوطنية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('nationalId')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="رقم الهوية الوطنية"
                  />
                  {errors.nationalId && (
                    <p className="text-red-500 text-sm">{errors.nationalId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    الحالة الاجتماعية <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('maritalStatus')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">اختر الحالة الاجتماعية</option>
                    <option value={MaritalStatus.Single}>أعزب/عزباء</option>
                    <option value={MaritalStatus.Married}>متزوج/متزوجة</option>
                    <option value={MaritalStatus.Divorced}>مطلق/مطلقة</option>
                    <option value={MaritalStatus.Widowed}>أرمل/أرملة</option>
                  </select>
                  {errors.maritalStatus && (
                    <p className="text-red-500 text-sm">{errors.maritalStatus.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6 pb-4 border-b border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">معلومات التواصل</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="+966 5X XXX XXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    عنوان السكن الحالي <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('address')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    rows={3}
                    placeholder="العنوان الكامل"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6 pb-4 border-b border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">المؤهلات التعليمية</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">أعلى مؤهل دراسي</label>
                  <input
                    type="text"
                    {...register('qualification')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="مثال: بكالوريوس"
                  />
                  {errors.qualification && (
                    <p className="text-red-500 text-sm">{errors.qualification.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">التخصص</label>
                  <input
                    type="text"
                    {...register('major')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="مثال: هندسة حاسوب"
                  />
                  {errors.major && (
                    <p className="text-red-500 text-sm">{errors.major.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">سنة التخرج</label>
                  <input
                    type="text"
                    {...register('graduationYear')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="مثال: 2020"
                  />
                  {errors.graduationYear && (
                    <p className="text-red-500 text-sm">{errors.graduationYear.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-100">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">الخبرات العملية</h3>
                </div>
                <button
                  type="button"
                  onClick={() => append({ expCompany: '', expPosition: '', expDuration: '', expReason: '' })}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة خبرة</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-xl p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        الخبرة العملية {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">اسم الشركة</label>
                        <input
                          type="text"
                          {...register(`workExperiences.${index}.expCompany` as const)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="اسم الشركة أو المؤسسة"
                        />
                        {errors.workExperiences?.[index]?.expCompany && (
                          <p className="text-red-500 text-sm">{errors.workExperiences[index]?.expCompany?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">المسمى الوظيفي</label>
                        <input
                          type="text"
                          {...register(`workExperiences.${index}.expPosition` as const)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="المسمى الوظيفي"
                        />
                        {errors.workExperiences?.[index]?.expPosition && (
                          <p className="text-red-500 text-sm">{errors.workExperiences[index]?.expPosition?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">المدة</label>
                        <input
                          type="text"
                          {...register(`workExperiences.${index}.expDuration` as const)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="مثال: سنتان"
                        />
                        {errors.workExperiences?.[index]?.expDuration && (
                          <p className="text-red-500 text-sm">{errors.workExperiences[index]?.expDuration?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">سبب ترك العمل</label>
                        <input
                          type="text"
                          {...register(`workExperiences.${index}.expReason` as const)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="سبب ترك العمل السابق"
                        />
                        {errors.workExperiences?.[index]?.expReason && (
                          <p className="text-red-500 text-sm">{errors.workExperiences[index]?.expReason?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Questions Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6 pb-4 border-b border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">أسئلة متعلقة بالشركة</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    هل سبق لك التقديم على وظيفة في الشركة؟ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        {...register('appliedBefore')}
                        value="true"
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">نعم</span>
                    </label>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        {...register('appliedBefore')}
                        value="false"
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">لا</span>
                    </label>
                  </div>
                  {errors.appliedBefore && (
                    <p className="text-red-500 text-sm">{errors.appliedBefore.message}</p>
                  )}

                  {appliedBefore && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        {...register('appliedBeforeWhen')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="إذا كانت الإجابة نعم، متى؟"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    هل لديك أقارب يعملون في الشركة؟ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        {...register('relativesInCompany')}
                        value="true"
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">نعم</span>
                    </label>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        {...register('relativesInCompany')}
                        value="false"
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">لا</span>
                    </label>
                  </div>
                  {errors.relativesInCompany && (
                    <p className="text-red-500 text-sm">{errors.relativesInCompany.message}</p>
                  )}

                  {relativesInCompany && (
                    <div className="space-y-2">
                      <textarea
                        {...register('relativesDetails')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        rows={3}
                        placeholder="إذا كانت الإجابة نعم، الرجاء ذكر الاسم ودرجة القرابة"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CV Upload Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6 pb-4 border-b border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Upload className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">رفع السيرة الذاتية</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
                  <Upload className="mx-auto h-12 w-12 text-green-400 mb-4" />
                  <div className="space-y-2">
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      <span className="text-lg font-semibold text-gray-700">انقر لرفع السيرة الذاتية</span>
                      <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX (حتى 5MB)</p>
                    </label>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                  </div>
                  {cvFile && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-700">
                        تم اختيار: {cvFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6 pb-4 border-b border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <PenTool className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">التوقيع</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      اسم المتقدم (مقدم الطلب) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('applicantName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="اسم المتقدم للتوقيع"
                    />
                    {errors.applicantName && (
                      <p className="text-red-500 text-sm">{errors.applicantName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    التوقيع <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <SignatureCanvas
                      ref={signatureRef}
                      onSignatureChange={(signature) => {
                        setValue('signature', signature);
                      }}
                      width={350}
                      height={150}
                      className="w-full"
                    />
                    <input
                      type="hidden"
                      {...register('signature')}
                    />
                    {errors.signature && (
                      <p className="text-red-500 text-sm">{errors.signature.message}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        signatureRef.current?.clear();
                        setValue('signature', '');
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      مسح التوقيع
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full max-w-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </div>
                ) : (
                  'إرسال الطلب'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-t border-emerald-200 mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <img 
                  src="/images/alwafi-logo.png" 
                  alt="Delta AlWafi Logo" 
                  className="h-16 w-auto"
                />
              </div>
            </div>
            
            {/* Company Information */}
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-emerald-800">
                شركة دلتا للصناعات الغذائية المحدودة
              </h3>
              
              <div className="space-y-4 text-gray-700">
                {/* Address */}
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg font-medium">
                    العراق - بغداد - جسر الرستمية - المنطقة الصناعية
                  </p>
                </div>
                
                {/* Phone Numbers */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium">الهاتف:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl mx-auto">
                    <p className="text-sm">07801584020</p>
                    <p className="text-sm">07901907818</p>
                    <p className="text-sm">077029652950</p>
                    <p className="text-sm">07400147696</p>
                    <p className="text-sm">07400145214</p>
                    <p className="text-sm">07825932701</p>
                    <p className="text-sm">07721967470</p>
                  </div>
                </div>
                
                {/* Website */}
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="font-medium">الموقع الإلكتروني:</span>
                  <a href="https://www.deltaforfood.com" target="_blank" rel="noopener noreferrer" 
                     className="text-emerald-600 hover:text-emerald-800 transition-colors duration-200 underline">
                    www.deltaforfood.com
                  </a>
                </div>
                
                {/* Email */}
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">البريد الإلكتروني:</span>
                  <a href="mailto:info@deltaforfood.com" 
                     className="text-emerald-600 hover:text-emerald-800 transition-colors duration-200 underline">
                    info@deltaforfood.com
                  </a>
                </div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="border-t border-emerald-200 pt-6 text-center">
              <p className="text-gray-600">
                © 2025 شركة دلتا للصناعات الغذائية المحدودة. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobApplicationForm;
