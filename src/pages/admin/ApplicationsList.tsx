import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getSubmissions } from '@/services/api';
import { SubmissionStatus, SubmissionFilterDto } from '@/types';
import { getStatusText, getStatusColor, formatDate, debounce } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  FileText, 
  Phone, 
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const ApplicationsList = () => {
  const [filters, setFilters] = useState<SubmissionFilterDto>({
    page: 1,
    pageSize: 12,
    sortBy: 'CreatedAt',
    sortDescending: true,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['submissions', filters],
    queryFn: () => getSubmissions(filters),
  });

  const debouncedSearch = debounce((searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, 500);

  const handleStatusFilter = (status: SubmissionStatus | undefined) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const statusOptions = [
    { value: undefined, label: 'جميع الحالات' },
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">طلبات التوظيف</h1>
              <p className="mt-1 text-sm text-gray-600">
                إدارة ومراجعة جميع طلبات التوظيف
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
            >
              <RefreshCw className="h-4 w-4" />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="البحث بالاسم أو رقم المرجع..."
                className="form-input pl-10"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filters.status || ''}
                onChange={(e) => handleStatusFilter(e.target.value ? Number(e.target.value) : undefined)}
                className="form-input pl-10"
              >
                {statusOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                placeholder="من تاريخ"
                className="form-input text-sm"
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  fromDate: e.target.value ? new Date(e.target.value) : undefined,
                  page: 1 
                }))}
              />
              <input
                type="date"
                placeholder="إلى تاريخ"
                className="form-input text-sm"
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  toDate: e.target.value ? new Date(e.target.value) : undefined,
                  page: 1 
                }))}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                عرض {data?.items.length || 0} من {data?.totalCount || 0} طلب
              </p>
              <div className="text-sm text-gray-500">
                الصفحة {data?.page || 1} من {data?.totalPages || 1}
              </div>
            </div>

            {/* Applications Grid */}
            {!data?.items.length ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  لا توجد طلبات
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  لم يتم العثور على طلبات مطابقة للمعايير المحددة
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.items.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {application.formData.fullName}
                        </h3>
                        <span className={`${getStatusColor(application.status)} shrink-0`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 font-mono">
                          {application.referenceCode}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 ml-1" />
                          {formatDate(application.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-3">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 ml-2 text-gray-400" />
                          <span>{application.formData.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 ml-2 text-gray-400" />
                          <span className="truncate">{application.formData.email}</span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {application.formData.expPosition && (
                        <div className="text-sm">
                          <span className="text-gray-500">المنصب السابق: </span>
                          <span className="text-gray-900">{application.formData.expPosition}</span>
                        </div>
                      )}

                      {application.formData.qualification && (
                        <div className="text-sm">
                          <span className="text-gray-500">المؤهل: </span>
                          <span className="text-gray-900">{application.formData.qualification}</span>
                        </div>
                      )}

                      {/* Indicators */}
                      <div className="flex space-x-4 rtl:space-x-reverse pt-2 text-xs">
                        {application.filesCount > 0 && (
                          <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {application.filesCount} ملف
                          </span>
                        )}
                        {application.hasSignature && (
                          <span className="text-green-600 bg-green-100 px-2 py-1 rounded">
                            موقع
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between">
                        <Link
                          to={`/admin/applications/${application.id}`}
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض التفاصيل
                        </Link>
                        
                        <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                          <Download className="h-4 w-4 ml-1" />
                          تحميل
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(data.page - 1)}
                    disabled={!data.hasPreviousPage}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => handlePageChange(data.page + 1)}
                    disabled={!data.hasNextPage}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
                
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      عرض{' '}
                      <span className="font-medium">
                        {(data.page - 1) * data.pageSize + 1}
                      </span>{' '}
                      إلى{' '}
                      <span className="font-medium">
                        {Math.min(data.page * data.pageSize, data.totalCount)}
                      </span>{' '}
                      من{' '}
                      <span className="font-medium">{data.totalCount}</span> نتيجة
                    </p>
                  </div>
                  
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(data.page - 1)}
                        disabled={!data.hasPreviousPage}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(data.totalPages - 4, data.page - 2)) + i;
                        if (pageNum <= data.totalPages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                pageNum === data.page
                                  ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => handlePageChange(data.page + 1)}
                        disabled={!data.hasNextPage}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApplicationsList;
