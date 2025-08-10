import { useQuery } from '@tanstack/react-query';
import { getSubmissions } from '@/services/api';
import { SubmissionStatus } from '@/types';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Pause, 
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const AdminDashboard = () => {
  // Fetch all submissions to calculate stats
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['submissions', 'all'],
    queryFn: () => getSubmissions({ 
      pageSize: 1000, // Get all for stats calculation
      sortBy: 'CreatedAt',
      sortDescending: true 
    }),
  });

  const submissions = submissionsData?.items || [];

  // Calculate statistics
  const stats = {
    totalApplications: submissions.length,
    receivedCount: submissions.filter(s => s.status === SubmissionStatus.Received).length,
    underReviewCount: submissions.filter(s => s.status === SubmissionStatus.UnderReview).length,
    approvedCount: submissions.filter(s => s.status === SubmissionStatus.Approved).length,
    rejectedCount: submissions.filter(s => s.status === SubmissionStatus.Rejected).length,
    onHoldCount: submissions.filter(s => s.status === SubmissionStatus.OnHold).length,
    processedCount: submissions.filter(s => s.status === SubmissionStatus.Processed).length,
    todayApplications: submissions.filter(s => {
      const today = new Date();
      const submissionDate = new Date(s.createdAt);
      return submissionDate.toDateString() === today.toDateString();
    }).length,
    weeklyApplications: submissions.filter(s => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(s.createdAt) >= weekAgo;
    }).length,
  };

  const statCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats.totalApplications,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'طلبات اليوم',
      value: stats.todayApplications,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'مستلمة',
      value: stats.receivedCount,
      icon: Clock,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'قيد المراجعة',
      value: stats.underReviewCount,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'مقبولة',
      value: stats.approvedCount,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'مرفوضة',
      value: stats.rejectedCount,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'معلقة',
      value: stats.onHoldCount,
      icon: Pause,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'تمت المعالجة',
      value: stats.processedCount,
      icon: FileCheck,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  // Get recent submissions
  const recentSubmissions = submissions.slice(0, 5);

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

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-gray-600">
            إحصائيات شاملة لطلبات التوظيف
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute ${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <p className="mr-16 text-sm font-medium text-gray-500 truncate">
                  {stat.title}
                </p>
              </dt>
              <dd className="mr-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Recent Submissions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              أحدث الطلبات
            </h3>
            
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  لا توجد طلبات
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  لم يتم تقديم أي طلبات حتى الآن
                </p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentSubmissions.map((submission, index) => (
                    <li key={submission.id}>
                      <div className="relative pb-8">
                        {index !== recentSubmissions.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3 rtl:space-x-reverse">
                          <div>
                            <span className={`
                              h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                              ${submission.status === SubmissionStatus.Received ? 'bg-blue-500' :
                                submission.status === SubmissionStatus.UnderReview ? 'bg-yellow-500' :
                                submission.status === SubmissionStatus.Approved ? 'bg-green-500' :
                                submission.status === SubmissionStatus.Rejected ? 'bg-red-500' :
                                submission.status === SubmissionStatus.OnHold ? 'bg-orange-500' :
                                'bg-purple-500'
                              }
                            `}>
                              <Users className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 rtl:space-x-reverse">
                            <div>
                              <p className="text-sm text-gray-500">
                                طلب جديد من{' '}
                                <span className="font-medium text-gray-900">
                                  {submission.formData.fullName}
                                </span>
                              </p>
                              <p className="text-xs text-gray-400">
                                رقم المرجع: {submission.referenceCode}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime={submission.createdAt.toString()}>
                                {formatDate(submission.createdAt)}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
