# Task Assignment - Job Search Platform Development

## 📅 Timeline: 2-3 Tuần (Sprint-based)

### Sprint 1 (Tuần 1): Core Features - Priority 1
### Sprint 2 (Tuần 2): Advanced Features - Priority 2  
### Sprint 3 (Tuần 3): Polish & Integration - Priority 2-3

---

## 👨‍💻 Developer 1 - Backend Core APIs & Authentication

### Mô tả
Phụ trách xây dựng các API cốt lõi cho User, Employer, Company và hoàn thiện hệ thống Authentication/Authorization.

### Sprint 1 - Week 1 (Priority 1)

#### [ ] Task 1.1: Authentication System (3 days)
**Files to create:**
- `src/controllers/auth.controller.js`
- `src/services/auth.service.js`
- `src/routes/auth.route.js`
- `src/utils/jwt.util.js`
- `src/utils/hash.util.js`
- `src/middlewares/role.middleware.js`

**Endpoints:**
- `POST /api/auth/register` - Đăng ký user/employer
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `POST /api/auth/verify-email` - Xác thực email

**Features:**
- JWT token generation & validation
- Refresh token mechanism
- Password hashing với bcrypt
- Email verification flow
- Role-based middleware (job_seeker, employer, admin)

---

#### [ ] Task 1.2: User Management APIs (2 days)
**Files to create:**
- `src/controllers/user.controller.js`
- `src/services/user.service.js`
- `src/repositories/user.repo.js`
- `src/routes/user.route.js`

**Endpoints:**
- `GET /api/users/profile` - Lấy thông tin user
- `PUT /api/users/profile` - Cập nhật thông tin
- `PUT /api/users/change-password` - Đổi password
- `DELETE /api/users/account` - Xóa tài khoản
- `POST /api/users/avatar` - Upload avatar
- `GET /api/users/:userId` - Xem profile công khai

**Features:**
- CRUD operations cho user profile
- Input validation
- Sanitize user data
- Handle avatar upload

---

#### [ ] Task 1.3: Employer & Company APIs (2 days)
**Files to create:**
- `src/controllers/employer.controller.js`
- `src/services/employer.service.js`
- `src/repositories/employer.repo.js`
- `src/routes/employer.route.js`
- `src/controllers/company.controller.js`
- `src/services/company.service.js`
- `src/repositories/company.repo.js`
- `src/routes/company.route.js`

**Employer Endpoints:**
- `GET /api/employers/profile` - Lấy thông tin employer
- `PUT /api/employers/profile` - Cập nhật thông tin
- `GET /api/employers/:employerId` - Xem profile công khai
- `GET /api/employers/:employerId/jobs` - Danh sách job của employer

**Company Endpoints:**
- `GET /api/companies` - Danh sách công ty
- `GET /api/companies/:companyId` - Chi tiết công ty
- `POST /api/companies` - Tạo công ty mới (admin)
- `PUT /api/companies/:companyId` - Cập nhật công ty
- `DELETE /api/companies/:companyId` - Xóa công ty (admin)
- `POST /api/companies/:companyId/logo` - Upload logo
- `GET /api/companies/:companyId/jobs` - Danh sách job của công ty

---

### Sprint 2 - Week 2 (Priority 2)

#### [ ] Task 1.4: OAuth Integration (2 days)
**Files to update:**
- `src/services/auth.service.js`
- `src/routes/auth.route.js`
- `src/configs/oauth.config.js` (new)

**Endpoints:**
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google callback
- `GET /api/auth/facebook` - Facebook OAuth
- `GET /api/auth/facebook/callback` - Facebook callback

**Dependencies:**
- passport
- passport-google-oauth20
- passport-facebook

---

#### [ ] Task 1.5: Admin APIs (2 days)
**Files to create:**
- `src/controllers/admin.controller.js`
- `src/services/admin.service.js`
- `src/routes/admin.route.js`

**Endpoints:**
- `GET /api/admin/users` - Danh sách users (pagination, filter)
- `PUT /api/admin/users/:userId/status` - Block/unblock user
- `GET /api/admin/employers` - Danh sách employers
- `PUT /api/admin/employers/:employerId/verify` - Verify employer
- `GET /api/admin/companies` - Quản lý công ty
- `GET /api/admin/jobs` - Quản lý jobs
- `DELETE /api/admin/jobs/:jobId` - Xóa job vi phạm
- `GET /api/admin/statistics` - Thống kê tổng quan

---

#### [ ] Task 1.6: Rate Limiting & Security (1 day)
**Files to create:**
- `src/middlewares/rate-limit.middleware.js`
- `src/middlewares/security.middleware.js`

**Features:**
- Rate limiting cho các endpoints
- Request sanitization
- CSRF protection
- Helmet.js integration

---

### Sprint 3 - Week 3 (Testing & Documentation)

#### [ ] Task 1.7: API Testing (2 days)
**Files to create:**
- `tests/auth.test.js`
- `tests/user.test.js`
- `tests/employer.test.js`
- `tests/company.test.js`
- `tests/admin.test.js`

**Setup:**
- Jest + Supertest
- Test database setup
- Mock Supabase auth

---

#### [ ] Task 1.8: API Documentation (1 day)
**Files to update:**
- `src/docs/swagger.yml`

**Complete Swagger docs cho:**
- All auth endpoints
- User, Employer, Company endpoints
- Admin endpoints
- Error responses
- Authentication schemas

---

## 👨‍💻 Developer 2 - Backend Application & Resume System

### Mô tả
Phụ trách xây dựng hệ thống Resume/CV và Application, cùng với tích hợp File Storage.

### Sprint 1 - Week 1 (Priority 1)

#### [ ] Task 2.1: File Storage Integration (2 days)
**Files to create:**
- `src/services/storage.service.js`
- `src/utils/file.util.js`
- `src/middlewares/upload.middleware.js`
- `src/configs/storage.config.js`

**Features:**
- Integrate Supabase Storage hoặc AWS S3
- File upload (images: avatar, logo, company banner)
- PDF upload (CV/Resume)
- File validation (type, size, virus scan)
- Generate signed URLs
- Delete files

**Utilities:**
- Image resize & optimization
- File type validation
- Generate unique filenames

---

#### [ ] Task 2.2: Job Management APIs - Full CRUD (2 days)
**Files to update/create:**
- Update `src/controllers/job.controller.js`
- Update `src/services/job.service.js`
- Update `src/repositories/job.repo.js`

**New Endpoints:**
- `POST /api/jobs` - Tạo job mới (employer only)
- `PUT /api/jobs/:jobId` - Cập nhật job
- `DELETE /api/jobs/:jobId` - Xóa job
- `POST /api/jobs/:jobId/publish` - Publish job
- `POST /api/jobs/:jobId/expire` - Đóng tuyển dụng
- `PUT /api/jobs/:jobId/views` - Tăng lượt xem

**Features:**
- Validate job data
- Auto-calculate expired_at
- Check employer permissions
- Handle job tags, locations, skills

---

#### [ ] Task 2.3: Resume/CV Management APIs (3 days)
**Files to create:**
- `src/controllers/resume.controller.js`
- `src/services/resume.service.js`
- `src/repositories/resume.repo.js`
- `src/routes/resume.route.js`

**Endpoints:**
- `GET /api/resumes` - Danh sách CV của user
- `GET /api/resumes/:resumeId` - Chi tiết CV
- `POST /api/resumes` - Tạo CV mới
- `PUT /api/resumes/:resumeId` - Cập nhật CV
- `DELETE /api/resumes/:resumeId` - Xóa CV
- `POST /api/resumes/:resumeId/upload` - Upload file CV (PDF)
- `GET /api/resumes/:resumeId/download` - Download CV

**Education Endpoints:**
- `POST /api/resumes/:resumeId/education` - Thêm học vấn
- `PUT /api/resumes/:resumeId/education/:eduId` - Sửa học vấn
- `DELETE /api/resumes/:resumeId/education/:eduId` - Xóa học vấn

**Experience Endpoints:**
- `POST /api/resumes/:resumeId/experience` - Thêm kinh nghiệm
- `PUT /api/resumes/:resumeId/experience/:expId` - Sửa kinh nghiệm
- `DELETE /api/resumes/:resumeId/experience/:expId` - Xóa kinh nghiệm

**Skills Endpoints:**
- `POST /api/resumes/:resumeId/skills` - Thêm skills
- `DELETE /api/resumes/:resumeId/skills/:skillId` - Xóa skill

---

### Sprint 2 - Week 2 (Priority 1-2)

#### [ ] Task 2.4: Application System APIs (3 days)
**Files to create:**
- `src/controllers/application.controller.js`
- `src/services/application.service.js`
- `src/repositories/application.repo.js`
- `src/routes/application.route.js`

**User/Job Seeker Endpoints:**
- `GET /api/applications` - Lịch sử ứng tuyển của user
- `GET /api/applications/:applicationId` - Chi tiết đơn ứng tuyển
- `POST /api/applications` - Nộp đơn ứng tuyển
- `PUT /api/applications/:applicationId` - Cập nhật đơn
- `DELETE /api/applications/:applicationId` - Rút đơn
- `GET /api/applications/statistics` - Thống kê ứng tuyển

**Employer Endpoints:**
- `GET /api/jobs/:jobId/applications` - Danh sách ứng viên của job
- `GET /api/employer/applications` - Tất cả ứng viên của employer
- `PUT /api/applications/:applicationId/status` - Thay đổi trạng thái
- `POST /api/applications/:applicationId/notes` - Thêm ghi chú

**Features:**
- Prevent duplicate applications
- Send notification on application
- Update application status workflow
- Filter & sort applications

---

#### [ ] Task 2.5: Saved Jobs & Searches (2 days)
**Files to create:**
- `src/controllers/saved.controller.js`
- `src/services/saved.service.js`
- `src/repositories/saved.repo.js`
- `src/routes/saved.route.js`

**Saved Jobs Endpoints:**
- `GET /api/saved-jobs` - Danh sách job đã lưu
- `POST /api/saved-jobs/:jobId` - Lưu job
- `DELETE /api/saved-jobs/:jobId` - Bỏ lưu job
- `GET /api/saved-jobs/check/:jobId` - Kiểm tra đã lưu chưa

**Saved Searches Endpoints:**
- `GET /api/saved-searches` - Danh sách search đã lưu
- `POST /api/saved-searches` - Lưu search
- `PUT /api/saved-searches/:searchId` - Cập nhật search
- `DELETE /api/saved-searches/:searchId` - Xóa search

---

#### [ ] Task 2.6: Resume View Tracking (1 day)
**Files to create:**
- `src/controllers/resume-view.controller.js`
- `src/services/resume-view.service.js`
- `src/repositories/resume-view.repo.js`

**Endpoints:**
- `POST /api/resumes/:resumeId/view` - Track employer view
- `GET /api/resumes/:resumeId/views` - Lấy lịch sử xem
- `GET /api/user/resume-views` - Ai đã xem CV của mình

---

### Sprint 3 - Week 3

#### [ ] Task 2.7: PDF Generation for Resume (2 days)
**Files to create:**
- `src/services/pdf.service.js`
- `src/utils/pdf.util.js`

**Features:**
- Generate PDF từ resume data
- Resume templates
- Export to PDF

**Dependencies:**
- pdfkit hoặc puppeteer

---

#### [ ] Task 2.8: Testing (1 day)
**Files to create:**
- `tests/resume.test.js`
- `tests/application.test.js`
- `tests/storage.test.js`

---

## 👨‍💻 Developer 3 - Frontend Job Seeker Experience

### Mô tả
Phụ trách hoàn thiện toàn bộ tính năng cho Job Seeker (người tìm việc).

### Sprint 1 - Week 1 (Priority 1)

#### [ ] Task 3.1: API Integration Setup (1 day)
**Files to create:**
- `src/services/api.js` - Axios instance với interceptors
- `src/services/authService.js` - Authentication API calls
- `src/services/jobService.js` - Job API calls
- `src/hooks/useAuth.js` - Auth hook
- `src/contexts/AuthContext.jsx` - Auth context
- `src/utils/storage.js` - LocalStorage utilities

**Features:**
- Axios interceptors (token, error handling)
- Protected routes
- Auth state management

**Dependencies to add:**
```bash
npm install axios @tanstack/react-query zustand react-hook-form
```

---

#### [ ] Task 3.2: Authentication Pages - Complete (2 days)
**Files to update/create:**
- Update `src/pages/JobSeekerLogin.jsx`
- Update `src/pages/JobSeekerRegister.jsx`
- `src/pages/ForgotPassword.jsx` (new)
- `src/pages/ResetPassword.jsx` (new)
- `src/pages/VerifyEmail.jsx` (new)
- `src/components/auth/SocialLogin.jsx` (new)

**Features:**
- Form validation với react-hook-form
- Connect to backend auth APIs
- Social login buttons (Google, Facebook)
- Loading states
- Error handling
- Success messages
- Redirect after login

---

#### [ ] Task 3.3: User Profile & Settings (2 days)
**Files to create:**
- `src/pages/UserProfile.jsx`
- `src/pages/UserSettings.jsx`
- `src/components/profile/ProfileForm.jsx`
- `src/components/profile/AvatarUpload.jsx`
- `src/components/profile/ChangePassword.jsx`
- `src/services/userService.js`

**Features:**
- View/Edit profile information
- Upload avatar
- Change password
- Account deletion
- Profile preview

---

#### [ ] Task 3.4: Resume/CV Management (2 days)
**Files to create:**
- `src/pages/ResumeList.jsx`
- `src/pages/ResumeCreate.jsx`
- `src/pages/ResumeEdit.jsx`
- `src/pages/ResumePreview.jsx`
- `src/components/resume/ResumeForm.jsx`
- `src/components/resume/EducationForm.jsx`
- `src/components/resume/ExperienceForm.jsx`
- `src/components/resume/SkillsSelector.jsx`
- `src/components/resume/ResumeUpload.jsx`
- `src/services/resumeService.js`

**Features:**
- List all resumes
- Create new resume (form-based)
- Edit resume
- Upload PDF resume
- Preview resume
- Download resume
- Delete resume
- Multi-step form for resume creation

---

### Sprint 2 - Week 2 (Priority 1-2)

#### [ ] Task 3.5: Job Search & Detail - Enhanced (2 days)
**Files to update/create:**
- Update `src/pages/Jobs.jsx`
- Update `src/pages/JobDetail.jsx`
- Update `src/components/Filters.jsx`
- Update `src/components/SearchBar.jsx`
- `src/components/jobs/JobListItem.jsx` (new)
- `src/components/jobs/AdvancedFilters.jsx` (new)
- `src/components/jobs/SaveJobButton.jsx` (new)

**Features:**
- Connect to job APIs
- Advanced filters (salary, location, tags, skills)
- Search suggestions
- Pagination
- Save job functionality
- Share job
- Apply button
- Company info in job detail

---

#### [ ] Task 3.6: Application Management (2 days)
**Files to create:**
- `src/pages/ApplicationHistory.jsx`
- `src/pages/ApplicationDetail.jsx`
- `src/components/application/ApplyJobModal.jsx`
- `src/components/application/ApplicationCard.jsx`
- `src/components/application/ApplicationStatusBadge.jsx`
- `src/services/applicationService.js`

**Features:**
- View application history
- Filter by status
- Application statistics
- Apply to job (modal with resume selection)
- Withdraw application
- View application status timeline

---

#### [ ] Task 3.7: Saved Jobs & Companies (1 day)
**Files to create:**
- `src/pages/SavedJobs.jsx`
- `src/pages/SavedSearches.jsx`
- `src/components/saved/SavedJobCard.jsx`
- `src/services/savedService.js`

**Features:**
- View saved jobs
- Unsave jobs
- Saved searches
- Quick search from saved

---

#### [ ] Task 3.8: Notifications (2 days)
**Files to create:**
- `src/pages/Notifications.jsx`
- `src/components/notifications/NotificationBell.jsx`
- `src/components/notifications/NotificationItem.jsx`
- `src/components/notifications/NotificationCenter.jsx`
- `src/services/notificationService.js`

**Features:**
- Notification bell in header
- Notification dropdown
- Mark as read
- Notification types (application status, new jobs, etc.)
- Notification preferences

---

### Sprint 3 - Week 3 (Polish)

#### [ ] Task 3.9: Dashboard/Home for Logged Users (2 days)
**Files to update/create:**
- Update `src/pages/Home.jsx` (show different content when logged in)
- `src/components/dashboard/RecommendedJobs.jsx`
- `src/components/dashboard/ApplicationStats.jsx`
- `src/components/dashboard/RecentActivity.jsx`

**Features:**
- Personalized job recommendations
- Application statistics
- Recent activity
- Quick actions

---

#### [ ] Task 3.10: UI/UX Polish & Responsive (1 day)
- Mobile responsive cho tất cả pages
- Loading states
- Empty states
- Error boundaries
- Toast notifications
- Skeleton loaders

---

## 👨‍💻 Developer 4 - Frontend Employer Experience

### Mô tả
Phụ trách hoàn thiện toàn bộ tính năng cho Employer (nhà tuyển dụng).

### Sprint 1 - Week 1 (Priority 1)

#### [ ] Task 4.1: Employer Authentication & Profile (2 days)
**Files to update/create:**
- Update `src/pages/EmployerLogin.jsx`
- Update `src/pages/EmployerRegister.jsx`
- `src/pages/employer/EmployerProfile.jsx`
- `src/pages/employer/CompanyProfile.jsx`
- `src/components/employer/CompanyForm.jsx`
- `src/components/employer/CompanyLogoUpload.jsx`
- `src/services/employerService.js`
- `src/services/companyService.js`

**Features:**
- Form validation
- Connect to employer/company APIs
- Edit employer profile
- Edit company profile
- Upload company logo
- Company verification status

---

#### [ ] Task 4.2: Job Posting Management (3 days)
**Files to create:**
- `src/pages/employer/JobList.jsx`
- `src/pages/employer/JobCreate.jsx`
- `src/pages/employer/JobEdit.jsx`
- `src/components/employer/JobForm.jsx`
- `src/components/employer/JobStatusBadge.jsx`
- `src/components/employer/JobActions.jsx`

**Features:**
- View all jobs posted by employer
- Create new job post
  - Multi-step form (basic info, requirements, benefits, location, tags)
  - Rich text editor for description
  - Salary range selector
  - Location picker
  - Tag/skill selector
- Edit existing job
- Delete job
- Publish/unpublish job
- Close recruitment
- Job statistics (views, applications)

---

#### [ ] Task 4.3: Employer Dashboard - Enhanced (2 days)
**Files to update:**
- Update `src/pages/EmployerDashboard.jsx`
- `src/components/employer/StatCard.jsx`
- `src/components/employer/RecentApplications.jsx`
- `src/components/employer/JobPerformance.jsx`
- `src/components/employer/QuickActions.jsx`

**Features:**
- Overview statistics
  - Total jobs posted
  - Active jobs
  - Total applications
  - Profile views
- Recent applications
- Job performance chart
- Quick actions (create job, view applications)

---

### Sprint 2 - Week 2 (Priority 1-2)

#### [ ] Task 4.4: Application Review System (3 days)
**Files to create:**
- `src/pages/employer/ApplicationList.jsx`
- `src/pages/employer/ApplicationDetail.jsx`
- `src/pages/employer/CandidateProfile.jsx`
- `src/components/employer/ApplicationTable.jsx`
- `src/components/employer/ApplicationFilters.jsx`
- `src/components/employer/ResumeViewer.jsx`
- `src/components/employer/ApplicationStatusUpdater.jsx`
- `src/components/employer/ApplicationNotes.jsx`

**Features:**
- View all applications
  - Filter by job, status, date
  - Sort by date, match score
  - Bulk actions
- Application detail
  - Candidate info
  - Resume viewer (PDF)
  - Cover letter
  - Change status (pending → reviewing → interview → offer → reject)
  - Add notes
- Candidate profile
  - Full resume
  - Application history
  - Contact info

---

#### [ ] Task 4.5: Saved Candidates (1 day)
**Files to create:**
- `src/pages/employer/SavedCandidates.jsx`
- `src/components/employer/CandidateCard.jsx`

**Features:**
- Save promising candidates
- Candidate database
- Search saved candidates
- Contact candidates

---

#### [ ] Task 4.6: Analytics & Reports (2 days)
**Files to create:**
- `src/pages/employer/Analytics.jsx`
- `src/components/employer/JobStatsChart.jsx`
- `src/components/employer/ApplicationChart.jsx`
- `src/components/employer/DateRangePicker.jsx`

**Features:**
- Job view trends
- Application trends
- Conversion rates
- Time to hire
- Source of candidates

**Dependencies:**
```bash
npm install recharts date-fns
```

---

### Sprint 3 - Week 3 (Polish)

#### [ ] Task 4.7: Notification System for Employer (1 day)
**Files to create:**
- `src/pages/employer/EmployerNotifications.jsx`
- Reuse notification components

**Features:**
- New application notifications
- Application status updates
- Job expiring soon

---

#### [ ] Task 4.8: UI/UX Polish & Responsive (2 days)
- Mobile responsive
- Loading states
- Empty states (no jobs, no applications)
- Export functionality (applications to CSV)
- Print resume function

---

## 👨‍💻 Developer 5 - Admin Panel & External Services

### Mô tả
Phụ trách xây dựng Admin Panel, Email Service, Notifications và Background Jobs.

### Sprint 1 - Week 1 (Priority 2)

#### [ ] Task 5.1: Email Service Integration (2 days)
**Files to create:**
- `src/services/email.service.js`
- `src/templates/email/welcome.html`
- `src/templates/email/verify-email.html`
- `src/templates/email/reset-password.html`
- `src/templates/email/application-received.html`
- `src/templates/email/application-status.html`
- `src/templates/email/new-job-match.html`
- `src/configs/email.config.js`

**Features:**
- SendGrid or Nodemailer setup
- Email templates (HTML)
- Send transactional emails
  - Welcome email
  - Email verification
  - Password reset
  - Application received (job seeker)
  - New application (employer)
  - Application status update
  - New job match (saved searches)

**Dependencies:**
```bash
npm install @sendgrid/mail nodemailer handlebars
```

---

#### [ ] Task 5.2: Notification System APIs (2 days)
**Files to create:**
- `src/controllers/notification.controller.js`
- `src/services/notification.service.js`
- `src/repositories/notification.repo.js`
- `src/routes/notification.route.js`

**Endpoints:**
- `GET /api/notifications` - Danh sách thông báo
- `GET /api/notifications/unread-count` - Số thông báo chưa đọc
- `PUT /api/notifications/:notificationId/read` - Đánh dấu đã đọc
- `PUT /api/notifications/read-all` - Đánh dấu tất cả đã đọc
- `DELETE /api/notifications/:notificationId` - Xóa thông báo
- `POST /api/notifications/preferences` - Cài đặt thông báo

**Features:**
- Create notifications on events
- Mark as read/unread
- Delete notifications
- Notification preferences

---

#### [ ] Task 5.3: Background Jobs & Cron (3 days)
**Files to create:**
- `src/jobs/index.js`
- `src/jobs/expire-jobs.job.js`
- `src/jobs/send-job-alerts.job.js`
- `src/jobs/cleanup.job.js`
- `src/configs/queue.config.js`

**Jobs:**
1. **Expire Jobs** (daily)
   - Tự động đóng jobs hết hạn
   - Update job status

2. **Send Job Alerts** (daily)
   - Gửi email về jobs mới match với saved searches
   - Check user preferences

3. **Database Cleanup** (weekly)
   - Xóa notifications cũ (>30 days)
   - Archive old applications

4. **Email Queue**
   - Process email sending queue
   - Retry failed emails

**Dependencies:**
```bash
npm install bull ioredis node-cron
```

---

### Sprint 2 - Week 2 (Priority 2)

#### [ ] Task 5.4: Admin UI - Basic (3 days)
**Files to create:**
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/AdminLayout.jsx`
- `src/pages/admin/UserManagement.jsx`
- `src/pages/admin/EmployerManagement.jsx`
- `src/pages/admin/CompanyManagement.jsx`
- `src/pages/admin/JobManagement.jsx`
- `src/components/admin/Sidebar.jsx`
- `src/components/admin/UserTable.jsx`
- `src/components/admin/EmployerTable.jsx`
- `src/components/admin/AdminStats.jsx`

**Pages:**
- **Dashboard**: Statistics overview
- **Users**: List, search, filter, block/unblock
- **Employers**: List, verify, suspend
- **Companies**: List, approve, edit, delete
- **Jobs**: List, review, delete violating posts

**Features:**
- Protected admin routes
- Admin authentication
- Data tables với pagination
- Search & filter
- Bulk actions

---

#### [ ] Task 5.5: Admin Analytics (2 days)
**Files to create:**
- `src/pages/admin/Analytics.jsx`
- `src/components/admin/SystemStats.jsx`
- `src/components/admin/GrowthChart.jsx`
- `src/components/admin/TopCompanies.jsx`

**Features:**
- User growth chart
- Job posting trends
- Application trends
- Top companies
- Top jobs
- Revenue (if payment integrated)

---

### Sprint 3 - Week 3 (Advanced Features)

#### [ ] Task 5.6: Search Service Integration (3 days)
**Files to create:**
- `src/services/search.service.js`
- `src/configs/elasticsearch.config.js`
- `src/controllers/search.controller.js`
- `src/routes/search.route.js`

**Features:**
- Elasticsearch integration (optional)
- Index jobs, companies, resumes
- Full-text search
- Search suggestions
- Faceted search
- Search analytics

**Endpoints:**
- `GET /api/search/jobs` - Search jobs
- `GET /api/search/companies` - Search companies
- `GET /api/search/suggestions` - Search suggestions

**Dependencies:**
```bash
npm install @elastic/elasticsearch
```

---

#### [ ] Task 5.7: Advanced Features - Skills & Tags Management (2 days)
**Files to create:**
- `src/controllers/skill.controller.js`
- `src/services/skill.service.js`
- `src/repositories/skill.repo.js`
- `src/routes/skill.route.js`
- `src/controllers/tag.controller.js`
- `src/services/tag.service.js`
- `src/repositories/tag.repo.js`
- `src/routes/tag.route.js`
- `src/controllers/location.controller.js`
- `src/services/location.service.js`
- `src/repositories/location.repo.js`
- `src/routes/location.route.js`

**Skills Endpoints:**
- `GET /api/skills` - Danh sách skills
- `GET /api/skills/search` - Search skills
- `POST /api/skills` - Tạo skill (admin)

**Tags Endpoints:**
- `GET /api/tags` - Danh sách tags
- `GET /api/tags?type=work_type` - Tags by type

**Locations Endpoints:**
- `GET /api/locations` - Danh sách locations
- `GET /api/locations/search` - Search locations

---

---

## 📊 Dependency Management

### Backend Dependencies to Install
```bash
cd src/BE-server

# Core
npm install bcrypt jsonwebtoken

# File upload & storage
npm install multer @supabase/storage-js aws-sdk

# Email
npm install @sendgrid/mail nodemailer handlebars

# Background jobs
npm install bull ioredis node-cron

# OAuth
npm install passport passport-google-oauth20 passport-facebook

# Search (optional)
npm install @elastic/elasticsearch

# PDF
npm install pdfkit puppeteer

# Testing
npm install --save-dev jest supertest @types/jest

# Security
npm install helmet express-rate-limit express-mongo-sanitize xss-clean
```

### Frontend Dependencies to Install
```bash
cd src/FE-client

# State & data fetching
npm install axios @tanstack/react-query zustand

# Forms
npm install react-hook-form @hookform/resolvers zod

# Charts & analytics
npm install recharts date-fns

# Rich text editor
npm install @tiptap/react @tiptap/starter-kit

# Utilities
npm install clsx tailwind-merge

# Icons (if needed more)
npm install @heroicons/react
```

---

## 🎯 Sprint Ceremonies

### Daily Standup (15 mins)
- Mỗi dev báo cáo: Yesterday, Today, Blockers

### Sprint Planning (Week start - 2 hrs)
- Review tasks
- Assign priorities
- Estimate effort

### Sprint Review (Week end - 1 hr)
- Demo completed features
- Get feedback

### Sprint Retrospective (Week end - 30 mins)
- What went well
- What to improve

---

## ✅ Definition of Done (DoD)

Một task được coi là hoàn thành khi:
- [ ] Code implemented
- [ ] Unit tests written (coverage > 70%)
- [ ] API documented (Swagger/JSDoc)
- [ ] Code reviewed by at least 1 peer
- [ ] No critical bugs
- [ ] Merged to main branch
- [ ] Deployed to dev/staging environment

---

## 🚀 Deployment Checklist

### Before Production
- [ ] All Priority 1 tasks completed
- [ ] Integration testing passed
- [ ] Security audit
- [ ] Performance testing
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Monitoring & logging setup
- [ ] Backup strategy in place
- [ ] Documentation complete

---

## 📝 Notes

> [!IMPORTANT]
> - Devs nên sync code hàng ngày để tránh conflict
> - Sử dụng feature branches và pull requests
> - Follow coding conventions (ESLint, Prettier)
> - Write meaningful commit messages
> - Update Swagger docs khi thêm API mới

> [!TIP]
> - Reuse components khi có thể
> - Keep functions small and focused
> - Handle errors gracefully
> - Log important events
> - Test edge cases

---

## 📞 Communication

**Daily:** Slack/Discord
**Code Review:** GitHub PR
**Documentation:** Confluence/Notion
**Bug Tracking:** Jira/GitHub Issues
**Design:** Figma

---

## 🎉 Success Metrics

**Sprint 1 Success:**
- ✅ Authentication works end-to-end
- ✅ Job CRUD complete
- ✅ Resume CRUD complete
- ✅ Application flow works
- ✅ Basic user/employer dashboards

**Sprint 2 Success:**
- ✅ Email notifications working
- ✅ File uploads working
- ✅ Admin panel functional
- ✅ Advanced job search
- ✅ Application review working

**Sprint 3 Success:**
- ✅ All critical bugs fixed
- ✅ UI/UX polished
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Ready for production deploy
