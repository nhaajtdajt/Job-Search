# TÀI LIỆU USE CASE - VIEC24H JOB SEARCH PLATFORM

> **Version:** 1.0  
> **Ngày tạo:** 10/01/2026  
> **Mục đích:** Product documentation, Demo script, Launch preparation

---

## 📌 TỔNG QUAN HỆ THỐNG

**viec24h** là nền tảng tuyển dụng trực tuyến kết nối **Ứng viên (Candidate)**, **Nhà tuyển dụng (Employer)** và **Quản trị viên (Admin)**.

### Kiến trúc kỹ thuật
- **Frontend:** React + Vite + Ant Design + TailwindCSS
- **Backend:** Node.js + Express.js + Knex.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email + Social OAuth)
- **Storage:** Supabase Storage (Avatar, Logo, CV PDF)

### Các Role trong hệ thống
| Role | Mô tả |
|------|-------|
| `job_seeker` | Người tìm việc, ứng viên |
| `employer` | Nhà tuyển dụng, đại diện doanh nghiệp |
| `admin` | Quản trị viên hệ thống |

---

## 🟢 PHẦN 1: USE CASES CHO CANDIDATE (Người tìm việc)

### 1.1 Authentication Module

---

#### UC-C01: Đăng ký tài khoản ứng viên
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C01 |
| **Use Case Name** | Đăng ký tài khoản ứng viên |
| **Actor** | Candidate (chưa đăng nhập) |
| **Description** | Người dùng tạo tài khoản mới để trở thành ứng viên tìm việc |
| **Preconditions** | Chưa có tài khoản, có email hợp lệ |
| **Main Flow** | 1. Truy cập trang `/register`<br>2. Nhập họ tên, email, password<br>3. Đồng ý điều khoản sử dụng<br>4. Nhấn "Đăng ký"<br>5. Nhận email xác thực<br>6. Xác thực email thành công |
| **Alternative Flow** | - Đăng ký bằng Google/Facebook OAuth<br>- Email đã tồn tại → Hiển thị lỗi |
| **Related API** | `POST /api/auth/register` |
| **Related UI Screen** | `JobSeekerRegister.jsx` |
| **Business Value** | Mở rộng user base, thu thập dữ liệu ứng viên |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C02: Đăng nhập hệ thống
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C02 |
| **Use Case Name** | Đăng nhập hệ thống |
| **Actor** | Candidate |
| **Description** | Ứng viên đăng nhập để sử dụng các tính năng |
| **Preconditions** | Đã có tài khoản, email đã xác thực |
| **Main Flow** | 1. Truy cập `/login`<br>2. Nhập email và password<br>3. Nhấn "Đăng nhập"<br>4. Hệ thống xác thực và redirect đến Dashboard |
| **Alternative Flow** | - Đăng nhập bằng Google/Facebook<br>- Sai thông tin → Hiển thị lỗi |
| **Related API** | `POST /api/auth/login`, `POST /api/auth/social/callback` |
| **Related UI Screen** | `JobSeekerLogin.jsx`, `AuthCallback.jsx` |
| **Business Value** | Gateway cho tất cả tính năng protected |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C03: Quên mật khẩu / Đặt lại mật khẩu
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C03 |
| **Use Case Name** | Quên mật khẩu / Đặt lại mật khẩu |
| **Actor** | Candidate |
| **Description** | Khôi phục tài khoản khi quên mật khẩu |
| **Preconditions** | Có tài khoản với email đã xác thực |
| **Main Flow** | 1. Truy cập `/forgot-password`<br>2. Nhập email<br>3. Nhận email chứa link reset<br>4. Truy cập link và nhập mật khẩu mới<br>5. Đăng nhập với mật khẩu mới |
| **Related API** | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| **Related UI Screen** | `ForgotPassword.jsx`, `ResetPassword.jsx` |
| **Business Value** | Giảm churn rate, hỗ trợ user |
| **Priority** | 🟢 Core - Demo ngay |

---

### 1.2 Profile & Resume Module

---

#### UC-C04: Quản lý hồ sơ cá nhân
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C04 |
| **Use Case Name** | Quản lý hồ sơ cá nhân |
| **Actor** | Candidate (đã đăng nhập) |
| **Description** | Cập nhật thông tin cá nhân: tên, avatar, liên hệ |
| **Preconditions** | Đã đăng nhập |
| **Main Flow** | 1. Truy cập `/user/profile`<br>2. Xem/chỉnh sửa thông tin<br>3. Upload avatar<br>4. Nhấn "Lưu" |
| **Related API** | `GET/PUT /api/users/profile`, `POST /api/users/avatar` |
| **Related UI Screen** | `ProfileComplete.jsx` |
| **Business Value** | Hoàn thiện hồ sơ → Tăng cơ hội được tuyển |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C05: Tạo CV/Resume
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C05 |
| **Use Case Name** | Tạo CV/Resume |
| **Actor** | Candidate |
| **Description** | Tạo CV mới với thông tin học vấn, kinh nghiệm, kỹ năng |
| **Preconditions** | Đã đăng nhập |
| **Main Flow** | 1. Truy cập `/user/resumes/create`<br>2. Nhập tiêu đề CV<br>3. Thêm học vấn (education)<br>4. Thêm kinh nghiệm (experience)<br>5. Thêm kỹ năng (skills)<br>6. Upload file CV PDF (optional)<br>7. Lưu CV |
| **Related API** | `POST /api/resumes`, `POST /api/resumes/:id/education`, `POST /api/resumes/:id/experience`, `POST /api/resumes/:id/skills`, `POST /api/resumes/:id/upload` |
| **Related UI Screen** | `ResumeCreate.jsx` |
| **Business Value** | Core feature - CV là tài sản chính của ứng viên |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C06: Quản lý danh sách CV
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C06 |
| **Use Case Name** | Quản lý danh sách CV |
| **Actor** | Candidate |
| **Description** | Xem, sửa, xóa các CV đã tạo |
| **Preconditions** | Đã có ít nhất 1 CV |
| **Main Flow** | 1. Truy cập `/user/resumes`<br>2. Xem danh sách CV<br>3. Click để xem chi tiết hoặc chỉnh sửa<br>4. Xóa CV không cần thiết |
| **Related API** | `GET /api/resumes`, `GET/PUT/DELETE /api/resumes/:id` |
| **Related UI Screen** | `ResumeList.jsx`, `ResumeEdit.jsx`, `ResumePreview.jsx` |
| **Business Value** | Linh hoạt quản lý nhiều CV cho nhiều vị trí |
| **Priority** | 🟢 Core - Demo ngay |

---

### 1.3 Job Search & Application Module

---

#### UC-C07: Tìm kiếm việc làm
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C07 |
| **Use Case Name** | Tìm kiếm việc làm |
| **Actor** | Bất kỳ (Guest hoặc Candidate) |
| **Description** | Tìm kiếm việc làm theo từ khóa, vị trí, loại hình |
| **Preconditions** | Không yêu cầu |
| **Main Flow** | 1. Truy cập `/jobs`<br>2. Nhập từ khóa tìm kiếm<br>3. Áp dụng bộ lọc (salary, job_type, location)<br>4. Xem danh sách kết quả với pagination<br>5. Click vào job để xem chi tiết |
| **Related API** | `GET /api/jobs`, `GET /api/search/suggestions` |
| **Related UI Screen** | `Jobs.jsx`, `JobDetail.jsx` |
| **Business Value** | Core feature - Gateway cho user engagement |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C08: Xem chi tiết việc làm
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C08 |
| **Use Case Name** | Xem chi tiết việc làm |
| **Actor** | Bất kỳ |
| **Description** | Xem đầy đủ thông tin về một vị trí tuyển dụng |
| **Preconditions** | Job đang ở trạng thái published |
| **Main Flow** | 1. Click vào job từ danh sách<br>2. Xem mô tả, yêu cầu, phúc lợi<br>3. Xem thông tin công ty<br>4. Xem mức lương<br>5. Hệ thống tự động tăng view count |
| **Related API** | `GET /api/jobs/:id`, `PUT /api/jobs/:id/views` |
| **Related UI Screen** | `JobDetail.jsx` |
| **Business Value** | Engagement metric, chuyển đổi sang application |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C09: Ứng tuyển việc làm
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C09 |
| **Use Case Name** | Ứng tuyển việc làm |
| **Actor** | Candidate (đã đăng nhập) |
| **Description** | Nộp đơn ứng tuyển vào vị trí mong muốn |
| **Preconditions** | Đã đăng nhập, đã có ít nhất 1 CV |
| **Main Flow** | 1. Xem chi tiết job<br>2. Nhấn "Ứng tuyển ngay"<br>3. Chọn CV để nộp<br>4. Xác nhận ứng tuyển<br>5. Nhận email xác nhận<br>6. Nhà tuyển dụng nhận thông báo |
| **Alternative Flow** | - Đã ứng tuyển trước đó → Hiển thị trạng thái<br>- Chưa có CV → Redirect tạo CV |
| **Related API** | `POST /api/jobs/:id/apply`, `GET /api/jobs/:id/application-status` |
| **Related UI Screen** | `JobDetail.jsx` |
| **Business Value** | Core conversion metric |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C10: Theo dõi đơn ứng tuyển
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C10 |
| **Use Case Name** | Theo dõi đơn ứng tuyển |
| **Actor** | Candidate |
| **Description** | Xem lịch sử và trạng thái các đơn đã nộp |
| **Preconditions** | Đã nộp ít nhất 1 đơn |
| **Main Flow** | 1. Truy cập `/user/applications`<br>2. Xem danh sách đơn với trạng thái<br>3. Lọc theo status (pending, reviewed, accepted, rejected)<br>4. Click xem chi tiết đơn<br>5. Rút đơn nếu cần |
| **Related API** | `GET /api/applications`, `GET /api/applications/:id`, `DELETE /api/applications/:id` |
| **Related UI Screen** | `MyJobs.jsx`, `ApplicationDetail.jsx` |
| **Business Value** | Transparency, giảm anxiety cho ứng viên |
| **Priority** | 🟢 Core - Demo ngay |

---

### 1.4 Save & Follow Module

---

#### UC-C11: Lưu việc làm yêu thích
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C11 |
| **Use Case Name** | Lưu việc làm yêu thích |
| **Actor** | Candidate |
| **Description** | Bookmark các job để xem sau |
| **Preconditions** | Đã đăng nhập |
| **Main Flow** | 1. Xem chi tiết job hoặc list<br>2. Click icon "Bookmark"<br>3. Job được lưu vào danh sách<br>4. Truy cập `/user/saved-jobs` để quản lý |
| **Related API** | `POST/DELETE /api/users/saved-jobs`, `GET /api/users/saved-jobs/:id/check` |
| **Related UI Screen** | `SavedJobs.jsx` |
| **Business Value** | Engagement, return visits |
| **Priority** | 🟡 Advanced - Demo được |

---

#### UC-C12: Lưu tìm kiếm
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C12 |
| **Use Case Name** | Lưu tìm kiếm |
| **Actor** | Candidate |
| **Description** | Lưu bộ lọc tìm kiếm để sử dụng lại |
| **Preconditions** | Đã đăng nhập, đã thực hiện search |
| **Main Flow** | 1. Thực hiện tìm kiếm với bộ lọc<br>2. Click "Lưu tìm kiếm này"<br>3. Đặt tên cho search<br>4. Bật/tắt thông báo email khi có job mới phù hợp |
| **Related API** | `POST/GET/PUT/DELETE /api/users/saved-searches` |
| **Related UI Screen** | `SavedSearches.jsx` |
| **Business Value** | Retention, job alert feature |
| **Priority** | 🟡 Advanced - Demo được |

---

#### UC-C13: Theo dõi công ty
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C13 |
| **Use Case Name** | Theo dõi công ty |
| **Actor** | Candidate |
| **Description** | Follow công ty để nhận thông báo job mới |
| **Preconditions** | Đã đăng nhập |
| **Main Flow** | 1. Xem trang chi tiết công ty<br>2. Click "Theo dõi"<br>3. Công ty được thêm vào danh sách follow<br>4. Nhận notification khi có job mới |
| **Related API** | `POST/DELETE /api/followed-companies`, `POST /api/followed-companies/:id/toggle` |
| **Related UI Screen** | `CompanyDetail.jsx` |
| **Business Value** | Engagement, company branding |
| **Priority** | 🟡 Advanced - Demo được |

---

### 1.5 Notifications Module

---

#### UC-C14: Xem thông báo
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C14 |
| **Use Case Name** | Xem thông báo |
| **Actor** | Candidate |
| **Description** | Xem các thông báo từ hệ thống |
| **Preconditions** | Đã đăng nhập |
| **Main Flow** | 1. Click icon chuông trên header<br>2. Xem danh sách thông báo<br>3. Click để đánh dấu đã đọc<br>4. Click "Xem tất cả" để vào trang notifications |
| **Related API** | `GET /api/notifications`, `PUT /api/notifications/:id/read` |
| **Related UI Screen** | `NotificationBell.jsx`, `Notifications.jsx` |
| **Business Value** | Real-time engagement |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-C15: Thông báo job matching
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-C15 |
| **Use Case Name** | Thông báo job matching |
| **Actor** | Candidate |
| **Description** | Nhận thông báo khi có job mới phù hợp với saved search |
| **Preconditions** | Đã bật notification cho saved search |
| **Main Flow** | 1. Employer đăng job mới<br>2. Hệ thống match với saved searches<br>3. Tạo notification cho user phù hợp<br>4. Gửi email (nếu kích hoạt) |
| **Related API** | (Background job) `job-match.service.js` |
| **Related UI Screen** | `JobNotifications.jsx` |
| **Business Value** | Proactive engagement, conversion |
| **Priority** | 🟡 Advanced - Demo được |

---

## 🟠 PHẦN 2: USE CASES CHO EMPLOYER (Nhà tuyển dụng)

### 2.1 Authentication Module

---

#### UC-E01: Đăng ký tài khoản Employer
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E01 |
| **Use Case Name** | Đăng ký tài khoản Employer |
| **Actor** | Employer (chưa đăng nhập) |
| **Description** | Doanh nghiệp tạo tài khoản để đăng tin tuyển dụng |
| **Preconditions** | Có email doanh nghiệp, thông tin công ty |
| **Main Flow** | 1. Truy cập `/employer/register`<br>2. Nhập thông tin liên hệ<br>3. Nhập thông tin công ty (tên, website, quy mô)<br>4. Đăng ký<br>5. Chờ Admin verify (required) |
| **Alternative Flow** | - Đăng ký bằng Google với chọn công ty existing<br>- Công ty đã tồn tại → Link vào |
| **Related API** | `POST /api/auth/register` (role: employer) |
| **Related UI Screen** | `EmployerRegister.jsx` |
| **Business Value** | B2B customer acquisition |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E02: Đăng nhập Employer
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E02 |
| **Use Case Name** | Đăng nhập Employer |
| **Actor** | Employer |
| **Description** | Đăng nhập vào hệ thống quản lý tuyển dụng |
| **Preconditions** | Đã có tài khoản và được verify |
| **Main Flow** | 1. Truy cập `/employer/login`<br>2. Nhập email và password<br>3. Đăng nhập thành công → Redirect Dashboard |
| **Alternative Flow** | - Chưa verify → Hiển thị thông báo chờ |
| **Related API** | `POST /api/auth/login` (loginType: employer) |
| **Related UI Screen** | `EmployerLogin.jsx` |
| **Business Value** | Gateway cho employer features |
| **Priority** | 🟢 Core - Demo ngay |

---

### 2.2 Company Profile Module

---

#### UC-E03: Quản lý hồ sơ công ty
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E03 |
| **Use Case Name** | Quản lý hồ sơ công ty |
| **Actor** | Employer (verified) |
| **Description** | Cập nhật thông tin công ty: mô tả, logo, banner |
| **Preconditions** | Đã verify, có quyền sửa company |
| **Main Flow** | 1. Truy cập `/employer/company`<br>2. Cập nhật mô tả, website, địa chỉ<br>3. Upload logo và banner<br>4. Lưu thay đổi |
| **Related API** | `GET/PUT /api/companies/:id`, `POST /api/companies/:id/logo`, `POST /api/companies/:id/banner` |
| **Related UI Screen** | `CompanyProfile.jsx` |
| **Business Value** | Employer branding |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E04: Xem follower của công ty
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E04 |
| **Use Case Name** | Xem follower của công ty |
| **Actor** | Employer |
| **Description** | Xem danh sách ứng viên đang follow công ty |
| **Preconditions** | Đã verify |
| **Main Flow** | 1. Truy cập trang Company<br>2. Xem số lượng followers<br>3. Xem danh sách chi tiết (nếu có) |
| **Related API** | `GET /api/companies/:id/followers/count`, `GET /api/companies/:id/followers` |
| **Related UI Screen** | `CompanyProfile.jsx` |
| **Business Value** | Audience insights |
| **Priority** | 🔴 Nice-to-have |

---

### 2.3 Job Posting Module

---

#### UC-E05: Tạo tin tuyển dụng
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E05 |
| **Use Case Name** | Tạo tin tuyển dụng |
| **Actor** | Employer (verified) |
| **Description** | Đăng tin tuyển dụng mới |
| **Preconditions** | Employer đã được verify |
| **Main Flow** | 1. Truy cập `/employer/jobs/create`<br>2. Nhập tiêu đề, mô tả, yêu cầu<br>3. Chọn mức lương, loại hình việc làm<br>4. Chọn tags, locations, skills<br>5. Chọn lưu nháp hoặc đăng ngay<br>6. Hệ thống auto-match và notify ứng viên |
| **Related API** | `POST /api/jobs` |
| **Related UI Screen** | `JobCreate.jsx` |
| **Business Value** | Core B2B value proposition |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E06: Quản lý tin tuyển dụng
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E06 |
| **Use Case Name** | Quản lý tin tuyển dụng |
| **Actor** | Employer |
| **Description** | Xem, sửa, đóng các tin đang hoạt động |
| **Preconditions** | Đã đăng ít nhất 1 tin |
| **Main Flow** | 1. Truy cập `/employer/jobs`<br>2. Xem danh sách với status filter<br>3. Click sửa để update nội dung<br>4. Publish draft hoặc Expire job |
| **Related API** | `GET /api/jobs/my-jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id` |
| **Related UI Screen** | `JobList.jsx`, `JobEdit.jsx` |
| **Business Value** | Job lifecycle management |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E07: Publish/Expire tin tuyển dụng
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E07 |
| **Use Case Name** | Publish/Expire tin tuyển dụng |
| **Actor** | Employer |
| **Description** | Đưa tin từ draft sang published, hoặc đóng tin |
| **Preconditions** | Có quyền sở hữu tin |
| **Main Flow** | 1. Chọn tin từ danh sách<br>2. Click "Đăng tin" (draft → published)<br>3. Hoặc "Đóng tuyển" (published → expired) |
| **Related API** | `POST /api/jobs/:id/publish`, `POST /api/jobs/:id/expire` |
| **Related UI Screen** | `JobList.jsx` |
| **Business Value** | Flexible job status control |
| **Priority** | 🟢 Core - Demo ngay |

---

### 2.4 Application Management Module

---

#### UC-E08: Xem danh sách ứng viên
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E08 |
| **Use Case Name** | Xem danh sách ứng viên |
| **Actor** | Employer |
| **Description** | Xem tất cả đơn ứng tuyển vào các job của mình |
| **Preconditions** | Có ít nhất 1 application |
| **Main Flow** | 1. Truy cập `/employer/applications`<br>2. Xem danh sách với thông tin ứng viên<br>3. Lọc theo job, status<br>4. Click để xem chi tiết |
| **Related API** | `GET /api/applications/employer`, `GET /api/jobs/:id/applications` |
| **Related UI Screen** | `ApplicationList.jsx` |
| **Business Value** | Core recruitment workflow |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E09: Review đơn ứng tuyển
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E09 |
| **Use Case Name** | Review đơn ứng tuyển |
| **Actor** | Employer |
| **Description** | Xem chi tiết và đánh giá đơn ứng tuyển |
| **Preconditions** | Có đơn ứng tuyển |
| **Main Flow** | 1. Click vào application từ danh sách<br>2. Xem CV và thông tin ứng viên<br>3. Cập nhật status (pending → reviewed → accepted/rejected)<br>4. Thêm notes nội bộ<br>5. Ứng viên nhận notification |
| **Related API** | `GET /api/applications/employer/:id`, `PUT /api/applications/:id/status`, `POST /api/applications/:id/notes` |
| **Related UI Screen** | `ApplicationDetail.jsx` |
| **Business Value** | Core recruitment decision |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E10: Bulk Update ứng viên
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E10 |
| **Use Case Name** | Bulk Update ứng viên |
| **Actor** | Employer |
| **Description** | Cập nhật status nhiều đơn cùng lúc |
| **Preconditions** | Có nhiều đơn cần xử lý |
| **Main Flow** | 1. Chọn nhiều applications<br>2. Chọn status mới<br>3. Xác nhận bulk update<br>4. Tất cả ứng viên nhận notification |
| **Related API** | `PUT /api/applications/bulk-status` |
| **Related UI Screen** | `ApplicationList.jsx` |
| **Business Value** | Efficiency cho HR |
| **Priority** | 🟡 Advanced - Demo được |

---

### 2.5 Candidate Management Module

---

#### UC-E11: Xem hồ sơ ứng viên
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E11 |
| **Use Case Name** | Xem hồ sơ ứng viên |
| **Actor** | Employer |
| **Description** | Xem thông tin chi tiết của ứng viên |
| **Preconditions** | Ứng viên đã apply vào job của mình |
| **Main Flow** | 1. Từ application detail, click "Xem hồ sơ"<br>2. Xem thông tin, CV, lịch sử apply |
| **Related API** | `GET /api/users/:id/profile`, `GET /api/users/:id/applications` |
| **Related UI Screen** | `CandidateProfile.jsx` |
| **Business Value** | Complete view of candidate |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E12: Lưu ứng viên tiềm năng
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E12 |
| **Use Case Name** | Lưu ứng viên tiềm năng |
| **Actor** | Employer |
| **Description** | Bookmark ứng viên để liên hệ sau |
| **Preconditions** | Đã xem profile ứng viên |
| **Main Flow** | 1. Xem profile ứng viên<br>2. Click "Lưu ứng viên"<br>3. Thêm notes (optional)<br>4. Truy cập `/employer/saved-candidates` để quản lý |
| **Related API** | `POST /api/saved-candidates`, `PATCH /api/saved-candidates/:id/notes` |
| **Related UI Screen** | `SavedCandidates.jsx` |
| **Business Value** | Talent pool building |
| **Priority** | 🟡 Advanced - Demo được |

---

### 2.6 Dashboard & Analytics Module

---

#### UC-E13: Xem Dashboard
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E13 |
| **Use Case Name** | Xem Dashboard |
| **Actor** | Employer |
| **Description** | Xem tổng quan hoạt động tuyển dụng |
| **Preconditions** | Đã đăng nhập |
| **Main Flow** | 1. Truy cập `/employer/dashboard`<br>2. Xem số liệu: active jobs, total applications<br>3. Xem pipeline ứng viên (status breakdown)<br>4. Xem recent applications |
| **Related API** | `GET /api/employers/profile` (includes stats) |
| **Related UI Screen** | `EmployerDashboard.jsx` |
| **Business Value** | Overview và quick actions |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-E14: Xem Analytics
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E14 |
| **Use Case Name** | Xem Analytics |
| **Actor** | Employer |
| **Description** | Xem báo cáo chi tiết về hiệu quả tuyển dụng |
| **Preconditions** | Đã có data |
| **Main Flow** | 1. Truy cập `/employer/analytics`<br>2. Xem views per job, application rate<br>3. Xem conversion funnel |
| **Related API** | (Data from job views và application stats) |
| **Related UI Screen** | `Analytics.jsx` |
| **Business Value** | Data-driven recruitment |
| **Priority** | 🟡 Advanced - Demo được |

---

### 2.7 Settings Module

---

#### UC-E15: Quản lý cài đặt và tài khoản
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-E15 |
| **Use Case Name** | Quản lý cài đặt và tài khoản |
| **Actor** | Employer |
| **Description** | Cấu hình notifications, suspend/delete account |
| **Preconditions** | Đã đăng nhập |
| **Main Flow** | 1. Truy cập `/employer/settings`<br>2. Cập nhật notification preferences<br>3. Đổi mật khẩu<br>4. Tạm ngưng hoặc xóa tài khoản |
| **Related API** | `GET/PUT /api/employers/settings`, `POST /api/employers/account/suspend`, `DELETE /api/employers/account` |
| **Related UI Screen** | `EmployerSettings.jsx` |
| **Business Value** | Account lifecycle management |
| **Priority** | 🟡 Advanced - Demo được |

---

## 🔴 PHẦN 3: USE CASES CHO ADMIN (Quản trị viên)

### 3.1 Authentication Module

---

#### UC-A01: Đăng nhập Admin
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A01 |
| **Use Case Name** | Đăng nhập Admin |
| **Actor** | Admin |
| **Description** | Truy cập hệ thống quản trị |
| **Preconditions** | Có tài khoản role admin |
| **Main Flow** | 1. Truy cập `/admin/login`<br>2. Nhập credentials<br>3. Redirect `/admin/dashboard` |
| **Related API** | `POST /api/auth/login` (role check) |
| **Related UI Screen** | `AdminLogin.jsx` |
| **Business Value** | Secure admin access |
| **Priority** | 🟢 Core - Demo ngay |

---

### 3.2 User Management Module

---

#### UC-A02: Quản lý Users (Job Seekers)
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A02 |
| **Use Case Name** | Quản lý Users (Job Seekers) |
| **Actor** | Admin |
| **Description** | Xem, tìm kiếm, block/unblock users |
| **Preconditions** | Đã đăng nhập admin |
| **Main Flow** | 1. Truy cập `/admin/users`<br>2. Xem danh sách với pagination<br>3. Tìm kiếm theo tên/email<br>4. Block/unblock user khi cần |
| **Related API** | `GET /api/admin/users`, `PUT /api/admin/users/:id/status` |
| **Related UI Screen** | `UserManagement.jsx` |
| **Business Value** | User moderation |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-A03: Quản lý Employers
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A03 |
| **Use Case Name** | Quản lý Employers |
| **Actor** | Admin |
| **Description** | Xem, verify, suspend employers |
| **Preconditions** | Đã đăng nhập admin |
| **Main Flow** | 1. Truy cập `/admin/employers`<br>2. Xem danh sách với verification status<br>3. Verify employer mới đăng ký<br>4. Suspend employer vi phạm |
| **Related API** | `GET /api/admin/employers`, `PUT /api/admin/employers/:id/verify` |
| **Related UI Screen** | `EmployerManagement.jsx` |
| **Business Value** | B2B quality control |
| **Priority** | 🟢 Core - Demo ngay |

---

### 3.3 Content Moderation Module

---

#### UC-A04: Quản lý Jobs
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A04 |
| **Use Case Name** | Quản lý Jobs |
| **Actor** | Admin |
| **Description** | Xem, xóa các tin tuyển dụng |
| **Preconditions** | Đã đăng nhập admin |
| **Main Flow** | 1. Truy cập `/admin/jobs`<br>2. Xem danh sách tất cả jobs<br>3. Lọc theo status, company<br>4. Xóa job vi phạm |
| **Related API** | `GET /api/admin/jobs`, `DELETE /api/admin/jobs/:id` |
| **Related UI Screen** | `JobManagement.jsx` |
| **Business Value** | Content quality |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-A05: Quản lý Companies
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A05 |
| **Use Case Name** | Quản lý Companies |
| **Actor** | Admin |
| **Description** | Xem danh sách công ty |
| **Preconditions** | Đã đăng nhập admin |
| **Main Flow** | 1. Truy cập `/admin/companies`<br>2. Xem danh sách với số lượng jobs, employers<br>3. Xem thông tin chi tiết |
| **Related API** | `GET /api/admin/companies` |
| **Related UI Screen** | `CompanyManagement.jsx` |
| **Business Value** | Company overview |
| **Priority** | 🟡 Advanced - Demo được |

---

### 3.4 Dashboard & Analytics Module

---

#### UC-A06: Xem Dashboard tổng quan
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A06 |
| **Use Case Name** | Xem Dashboard tổng quan |
| **Actor** | Admin |
| **Description** | Xem số liệu thống kê toàn hệ thống |
| **Preconditions** | Đã đăng nhập admin |
| **Main Flow** | 1. Truy cập `/admin/dashboard`<br>2. Xem: total users, employers, jobs, applications<br>3. Xem biểu đồ tăng trưởng<br>4. Xem top companies |
| **Related API** | `GET /api/admin/statistics`, `GET /api/admin/analytics` |
| **Related UI Screen** | `AdminDashboard.jsx` |
| **Business Value** | Business intelligence |
| **Priority** | 🟢 Core - Demo ngay |

---

#### UC-A07: Xem Analytics chi tiết
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A07 |
| **Use Case Name** | Xem Analytics chi tiết |
| **Actor** | Admin |
| **Description** | Xem biểu đồ và trends theo thời gian |
| **Preconditions** | Có dữ liệu lịch sử |
| **Main Flow** | 1. Chọn time range (7d, 30d, 3m, 1y)<br>2. Xem user growth chart<br>3. Xem application trends<br>4. Xem job category distribution |
| **Related API** | `GET /api/admin/analytics?timeRange=30d` |
| **Related UI Screen** | `AdminDashboard.jsx` |
| **Business Value** | Trend analysis |
| **Priority** | 🟡 Advanced - Demo được |

---

### 3.5 Notification System Module

---

#### UC-A08: Gửi thông báo hệ thống
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A08 |
| **Use Case Name** | Gửi thông báo hệ thống |
| **Actor** | Admin |
| **Description** | Broadcast notification đến users |
| **Preconditions** | Đã đăng nhập admin |
| **Main Flow** | 1. Truy cập `/admin/notifications`<br>2. Chọn target audience (all, job_seeker, employer)<br>3. Nhập nội dung thông báo<br>4. Gửi |
| **Related API** | `POST /api/admin/notifications` |
| **Related UI Screen** | `NotificationManagement.jsx` |
| **Business Value** | Communication channel |
| **Priority** | 🟡 Advanced - Demo được |

---

#### UC-A09: Quản lý thông báo đã gửi
| Thuộc tính | Nội dung |
|------------|----------|
| **Use Case ID** | UC-A09 |
| **Use Case Name** | Quản lý thông báo đã gửi |
| **Actor** | Admin |
| **Description** | Xem lịch sử thông báo |
| **Preconditions** | Đã gửi ít nhất 1 notification |
| **Main Flow** | 1. Truy cập `/admin/notifications`<br>2. Xem danh sách đã gửi<br>3. Xem thống kê (read rate) |
| **Related API** | (View history from NotificationManagement) |
| **Related UI Screen** | `NotificationManagement.jsx` |
| **Business Value** | Communication tracking |
| **Priority** | 🔴 Nice-to-have |

---

## 📊 TỔNG HỢP VÀ PHÂN LOẠI

### Thống kê Use Cases

| Role | Core 🟢 | Advanced 🟡 | Nice-to-have 🔴 | Tổng |
|------|---------|-------------|-----------------|------|
| Candidate | 11 | 4 | 0 | 15 |
| Employer | 9 | 5 | 1 | 15 |
| Admin | 5 | 3 | 1 | 9 |
| **Tổng** | **25** | **12** | **2** | **39** |

### Độ sẵn sàng Demo

| Mức độ | Số lượng | Mô tả |
|--------|----------|-------|
| 🟢 Demo ngay | 25 | Hoàn chỉnh, có thể demo với khách hàng |
| 🟡 Demo được | 12 | Hoạt động nhưng cần giải thích context |
| 🔴 Trong code | 2 | Có logic nhưng UI cần polish |

---

## 🚀 DEMO FLOW THEO VAI TRÒ

### Flow 1: Candidate Demo (15 phút)

```
1. [Homepage] Giới thiệu giao diện chính
2. [Register] Đăng ký tài khoản mới (Google OAuth)
3. [Profile] Hoàn thiện hồ sơ, upload avatar
4. [Resume] Tạo CV với education/experience/skills
5. [Job Search] Tìm việc với bộ lọc
6. [Job Detail] Xem chi tiết và Apply
7. [My Applications] Theo dõi trạng thái
8. [Saved Jobs] Lưu việc yêu thích
9. [Notifications] Xem thông báo
```

### Flow 2: Employer Demo (15 phút)

```
1. [Landing] Giới thiệu trang Employer
2. [Register] Đăng ký với Company info
3. [Dashboard] Tổng quan sau khi verify
4. [Company Profile] Cập nhật logo, mô tả
5. [Create Job] Đăng tin tuyển dụng
6. [Job List] Quản lý tin đã đăng
7. [Applications] Xem ứng viên
8. [Review] Đánh giá và cập nhật status
9. [Saved Candidates] Lưu ứng viên tiềm năng
```

### Flow 3: Admin Demo (10 phút)

```
1. [Login] Đăng nhập admin
2. [Dashboard] Tổng quan hệ thống
3. [Users] Quản lý user list
4. [Employers] Verify employer mới
5. [Jobs] Review và xóa job vi phạm
6. [Notifications] Gửi thông báo hệ thống
```

---

## 💡 ĐIỂM MẠNH VÀ KHÁC BIỆT

### Điểm mạnh của viec24h

1. **Full-stack Authentication**
   - Email + Password
   - Google OAuth
   - Facebook OAuth
   - Email verification
   - Password reset flow

2. **Smart Job Matching**
   - Tự động match job mới với saved searches
   - Notify ứng viên khi có job phù hợp
   - Email notification

3. **Complete Recruitment Workflow**
   - Draft → Published → Expired lifecycle
   - Application status tracking
   - Bulk operations
   - Notes system

4. **Multi-role System**
   - Rõ ràng phân quyền
   - Protected routes
   - Role-based UI

5. **Modern Tech Stack**
   - React 19 + Vite
   - Ant Design components
   - Supabase integration
   - Responsive design

### Khác biệt so với competitors

| Feature | viec24h | TopCV | VietnamWorks |
|---------|---------|-------|--------------|
| Saved Search + Auto Notify | ✅ | ❌ | ❌ |
| Social OAuth (Google/FB) | ✅ | ✅ | ❌ |
| Employer Verification | ✅ | ❌ | ✅ |
| Bulk Application Status | ✅ | ❌ | ✅ |
| Company Follow | ✅ | ✅ | ✅ |
| Admin Analytics | ✅ | ❌ | ❌ |

---

## ✅ CHECKLIST TRƯỚC KHI LAUNCH

### Technical Readiness

- [x] Authentication hoạt động
- [x] CRUD operations đầy đủ
- [x] Email notifications
- [x] File upload (avatar, logo, CV)
- [x] Error handling
- [x] Rate limiting
- [ ] SSL Certificate
- [ ] Database backup

### Content Readiness

- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Sample data/Demo accounts
- [ ] Help documentation

### Marketing Readiness

- [x] Employer landing page
- [x] Responsive mobile
- [ ] SEO optimization
- [ ] Social sharing meta

---

> **Tài liệu này được tạo tự động từ codebase của viec24h. Mọi tính năng được mô tả đều đã tồn tại trong source code và có thể demo được.**
