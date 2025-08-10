import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SubmissionStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getStatusText(status: SubmissionStatus): string {
  const statusMap = {
    [SubmissionStatus.Received]: 'مستلم',
    [SubmissionStatus.UnderReview]: 'قيد المراجعة',
    [SubmissionStatus.Approved]: 'مقبول',
    [SubmissionStatus.Rejected]: 'مرفوض',
    [SubmissionStatus.OnHold]: 'معلق',
    [SubmissionStatus.Processed]: 'تمت المعالجة',
  };
  
  return statusMap[status] || 'غير معروف';
}

export function getStatusColor(status: SubmissionStatus): string {
  const colorMap = {
    [SubmissionStatus.Received]: 'status-received',
    [SubmissionStatus.UnderReview]: 'status-underreview',
    [SubmissionStatus.Approved]: 'status-approved',
    [SubmissionStatus.Rejected]: 'status-rejected',
    [SubmissionStatus.OnHold]: 'status-onhold',
    [SubmissionStatus.Processed]: 'status-processed',
  };
  
  return colorMap[status] || 'status-received';
}

export function generateReferenceCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `AWJ-${year}${month}${day}-${random}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9+\-\s()]{10,}$/;
  return phoneRegex.test(phone);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}
