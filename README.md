# 🚀 AlWafi Jobs Platform Frontend

A modern, responsive React frontend application for the AlWafi Jobs Platform, built with React, TypeScript, and Vite.

## 🎯 Features

### 📋 Public Features
- **Single-Step Job Application Form**: Complete form with validation for job applications
- **Arabic RTL Support**: Right-to-left layout for Arabic content
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive validation using Zod and React Hook Form
- **Success Feedback**: Reference code generation and success notifications

### 🔐 Admin Features
- **JWT Authentication**: Secure login system for administrators
- **Dashboard**: Comprehensive statistics and recent applications overview
- **Applications Management**: Card-based layout for browsing applications
- **Advanced Filtering**: Search by name, reference code, status, and date range
- **Application Details**: Detailed view of individual applications
- **Status Management**: Update application status with admin notes
- **Pagination**: Efficient handling of large datasets

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router v6** for routing
- **TanStack Query** for API state management
- **Axios** for HTTP requests
- **React Hook Form** with **Zod** validation
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── AdminLayout.tsx  # Admin panel layout
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions
├── pages/             # Page components
│   ├── JobApplicationForm.tsx  # Public job application form
│   └── admin/         # Admin panel pages
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── ApplicationsList.tsx
│       └── ApplicationDetails.tsx
├── schemas/           # Zod validation schemas
│   └── index.ts
├── services/          # API services
│   └── api.ts         # HTTP client and API functions
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- AlWafi Jobs Platform Backend running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alwafi-jobs-platform-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Status Colors**:
  - Received: Blue (#3b82f6)
  - Under Review: Yellow (#eab308)
  - Approved: Green (#10b981)
  - Rejected: Red (#ef4444)
  - On Hold: Orange (#f97316)
  - Processed: Purple (#8b5cf6)

### Components
- **Form Controls**: Consistent styling with error states
- **Buttons**: Primary and secondary variants
- **Status Badges**: Color-coded status indicators
- **Cards**: Clean, modern card layout for applications

## 🔗 API Integration

The frontend integrates with the AlWafi Jobs Platform backend API:

### Public Endpoints
- `POST /api/submissions/submit/job-application` - Submit job application

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/submissions` - Get submissions list with filtering
- `GET /api/submissions/{id}` - Get submission details
- `PUT /api/submissions/{id}/status` - Update submission status

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes for admin panel

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Grid layouts** adapt to screen size
- **Navigation** optimized for touch devices

## 🌐 Arabic Support

- **RTL Layout**: Proper right-to-left text direction
- **Arabic Typography**: Optimized for Arabic text
- **Date Formatting**: Arabic locale date formatting
- **Form Labels**: All labels and text in Arabic

## 🔧 Development Features

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first styling
- **Component Architecture**: Modular, reusable components

### State Management
- **TanStack Query**: Server state management
- **React Context**: Auth state management
- **Form State**: React Hook Form for complex forms

### Error Handling
- **Toast Notifications**: User-friendly error messages
- **Loading States**: Skeleton screens and spinners
- **Fallback UI**: Error boundaries and 404 pages

## 📊 Admin Dashboard Features

### Statistics Dashboard
- Total applications count
- Today's applications
- Status breakdown (Received, Under Review, etc.)
- Weekly applications trend
- Recent applications timeline

### Applications Management
- **Card-based layout** for better UX
- **Advanced filtering**:
  - Search by name or reference code
  - Filter by status
  - Date range filtering
- **Sorting and pagination**
- **Bulk operations** (future enhancement)

### Application Details
- **Complete applicant information**
- **Status update with notes**
- **File attachments management**
- **Application timeline**
- **Admin comments system**

## 🔒 Security Features

- **JWT Token Management**: Secure storage and refresh
- **Protected Routes**: Admin panel access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Safe HTML rendering
- **CORS Configuration**: Proper cross-origin setup

## 📝 Form Validation

### Job Application Form
- **Required Fields**: Name, phone, email
- **Format Validation**: Email format, phone number pattern
- **Optional Fields**: All other fields are optional
- **Real-time Validation**: Instant feedback on errors
- **Arabic Error Messages**: User-friendly Arabic error messages

## 🎯 Future Enhancements

- [ ] **File Upload**: CV and document upload functionality
- [ ] **Email Notifications**: Automated email sending
- [ ] **Advanced Search**: Full-text search in applications
- [ ] **Export Features**: Excel/PDF export of applications
- [ ] **Multi-language Support**: English/Arabic language switching
- [ ] **Mobile App**: React Native mobile application
- [ ] **Real-time Updates**: WebSocket integration for live updates
- [ ] **Analytics Dashboard**: Advanced reporting and analytics

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_APP_TITLE=منصة الوافي للوظائف
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact:
- Email: support@alwafi-jobs.com
- Phone: +966 XX XXX XXXX

---

Built with ❤️ for AlWafi Jobs Platform
