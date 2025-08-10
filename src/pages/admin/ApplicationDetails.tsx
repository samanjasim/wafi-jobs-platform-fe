import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubmissionDetails, updateSubmissionStatus } from '@/services/api';
import { SubmissionStatus } from '@/types';
import { getStatusText, getStatusColor, formatDateTime, formatFileSize } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Briefcase,
  Building,
  FileText,
  Download,
  Edit3,
  Save,
  X,
} from 'lucide-react';

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<SubmissionStatus>();
  const [adminNotes, setAdminNotes] = useState('');

  const { data: application, isLoading } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => getSubmissionDetails(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, notes }: { status: SubmissionStatus; notes?: string }) =>
      updateSubmissionStatus(id!, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission', id] });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setIsEditingStatus(false);
      toast.success('تم تحديث حالة الطلب بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة');
    },
  });

  const handleStatusUpdate = () => {
    if (newStatus !== undefined) {
      updateStatusMutation.mutate({
        status: newStatus,
        notes: adminNotes,
      });
    }
  };

  const startEditingStatus = () => {
    setNewStatus(application?.status);
    setAdminNotes(application?.adminNotes || '');
    setIsEditingStatus(true);
  };

  const cancelEditingStatus = () => {
    setIsEditingStatus(false);
    setNewStatus(undefined);
    setAdminNotes('');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">الطلب غير موجود</h3>
            <p className="mt-1 text-sm text-gray-500">
              لم يتم العثور على الطلب المحدد
            </p>
            <Link
              to="/admin/applications"
              className="mt-4 btn-primary inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للطلبات
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statusOptions = [
    { value: SubmissionStatus.Received, label: getStatusText(SubmissionStatus.Received) },
    { value: SubmissionStatus.UnderReview, label: getStatusText(SubmissionStatus.UnderReview) },
    { value: SubmissionStatus.Approved, label: getStatusText(SubmissionStatus.Approved) },
    { value: SubmissionStatus.Rejected, label: getStatusText(SubmissionStatus.Rejected) },
    { value: SubmissionStatus.OnHold, label: getStatusText(SubmissionStatus.OnHold) },
    { value: SubmissionStatus.Processed, label: getStatusText(SubmissionStatus.Processed) },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link
                to="/admin/applications"
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  تفاصيل الطلب
                </h1>
                <p className="text-sm text-gray-600">
                  رقم المرجع: {application.referenceCode}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className={getStatusColor(application.status)}>
                {getStatusText(application.status)}
              </span>
              {!isEditingStatus ? (
                <button
                  onClick={startEditingStatus}
                  className="btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>تحديث الحالة</span>
                </button>
              ) : (
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updateStatusMutation.isPending}
                    className="btn-primary flex items-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>حفظ</span>
                  </button>
                  <button
                    onClick={cancelEditingStatus}
                    className="btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <X className="h-4 w-4" />
                    <span>إلغاء</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <User className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">البيانات الشخصية</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">الاسم الكامل</label>
                  <p className="mt-1 text-sm text-gray-900">{application.formData.fullName}</p>
                </div>
                
                {application.formData.nationalId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">رقم الهوية</label>
                    <p className="mt-1 text-sm text-gray-900">{application.formData.nationalId}</p>
                  </div>
                )}
                
                {application.formData.dateOfBirth && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">تاريخ الميلاد</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(application.formData.dateOfBirth).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                )}
                
                {application.formData.nationality && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">الجنسية</label>
                    <p className="mt-1 text-sm text-gray-900">{application.formData.nationality}</p>
                  </div>
                )}
                
                {application.formData.maritalStatus && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">الحالة الاجتماعية</label>
                    <p className="mt-1 text-sm text-gray-900">{application.formData.maritalStatus}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <Phone className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">بيانات التواصل</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">رقم الهاتف</label>
                    <p className="text-sm text-gray-900">{application.formData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">البريد الإلكتروني</label>
                    <p className="text-sm text-gray-900">{application.formData.email}</p>
                  </div>
                </div>
                
                {application.formData.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">العنوان</label>
                    <p className="mt-1 text-sm text-gray-900">{application.formData.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            {(application.formData.qualification || application.formData.major || application.formData.graduationYear) && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                  <GraduationCap className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">المؤهلات التعليمية</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {application.formData.qualification && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">المؤهل العلمي</label>
                      <p className="mt-1 text-sm text-gray-900">{application.formData.qualification}</p>
                    </div>
                  )}
                  
                  {application.formData.major && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">التخصص</label>
                      <p className="mt-1 text-sm text-gray-900">{application.formData.major}</p>
                    </div>
                  )}
                  
                  {application.formData.graduationYear && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">سنة التخرج</label>
                      <p className="mt-1 text-sm text-gray-900">{application.formData.graduationYear}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {(application.formData.expCompany || application.formData.expPosition) && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                  <Briefcase className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">الخبرة العملية</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.formData.expCompany && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">الشركة السابقة</label>
                      <p className="mt-1 text-sm text-gray-900">{application.formData.expCompany}</p>
                    </div>
                  )}
                  
                  {application.formData.expPosition && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">المنصب</label>
                      <p className="mt-1 text-sm text-gray-900">{application.formData.expPosition}</p>
                    </div>
                  )}
                  
                  {application.formData.expDuration && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">مدة العمل</label>
                      <p className="mt-1 text-sm text-gray-900">{application.formData.expDuration}</p>
                    </div>
                  )}
                  
                  {application.formData.expReason && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">سبب ترك العمل</label>
                      <p className="mt-1 text-sm text-gray-900">{application.formData.expReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Questions */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <Building className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">أسئلة متعلقة بالشركة</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    هل تقدم للعمل في الشركة من قبل؟
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {application.formData.appliedBefore ? 'نعم' : 'لا'}
                  </p>
                  {application.formData.appliedBefore && application.formData.appliedBeforeWhen && (
                    <p className="mt-1 text-sm text-gray-600">
                      متى: {application.formData.appliedBeforeWhen}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    هل لديك أقارب يعملون في الشركة؟
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {application.formData.relativesInCompany ? 'نعم' : 'لا'}
                  </p>
                  {application.formData.relativesInCompany && application.formData.relativesDetails && (
                    <p className="mt-1 text-sm text-gray-600">
                      التفاصيل: {application.formData.relativesDetails}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            {isEditingStatus && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">تحديث الحالة</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">الحالة الجديدة</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(Number(e.target.value) as SubmissionStatus)}
                      className="form-input"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">ملاحظات المدير</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="form-input"
                      rows={4}
                      placeholder="أضف ملاحظات حول قرارك..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submission Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الطلب</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">تاريخ التقديم</label>
                    <p className="text-sm text-gray-900">{formatDateTime(application.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">عدد الملفات</label>
                    <p className="text-sm text-gray-900">{application.filesCount}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Edit3 className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">حالة التوقيع</label>
                    <p className="text-sm text-gray-900">
                      {application.hasSignature ? 'موقع' : 'غير موقع'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Files */}
            {application.files.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المرفقات</h3>
                
                <div className="space-y-2">
                  {application.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                        </div>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {application.adminNotes && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ملاحظات المدير</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {application.adminNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetails;
