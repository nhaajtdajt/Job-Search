# 🎬 DEMO SCRIPT TOÀN DIỆN - VIEC24H JOB SEARCH PLATFORM

> **Version:** 2.0 - Full Use Case Coverage  
> **Thời lượng:** ~60 phút (Candidate 25' + Employer 25' + Admin 10')  
> **Số Use Case:** 39 (15 Candidate + 15 Employer + 9 Admin)  
> **Presenter:** Product Owner / Pre-sales

---

## 📋 CHECKLIST TRƯỚC KHI DEMO

- [ ] Trình duyệt đã clear cache, mở 3 tabs riêng biệt
- [ ] Tài khoản demo:
  - [ ] Candidate mới (chưa đăng ký) - dùng email test
  - [ ] Candidate đã có data (có CV, applications, saved items)
  - [ ] Employer đã verify (có jobs và applications)
  - [ ] Admin account
- [ ] Sample data sẵn sàng:
  - [ ] 10+ jobs với đa dạng status
  - [ ] 5+ companies với logo/banner
  - [ ] 20+ applications với các status khác nhau
  - [ ] Saved jobs, saved searches, followed companies
- [ ] Email client mở sẵn để show verification/notification emails
- [ ] Network ổn định

---

# 🟢 PHẦN 1: CANDIDATE DEMO (25 phút)
## Bao gồm 15 Use Cases: UC-C01 → UC-C15

---

## NHÓM 1: AUTHENTICATION MODULE (UC-C01, UC-C02, UC-C03)

### UC-C01: Đăng ký tài khoản ứng viên
| Mục tiêu | Demo tạo tài khoản mới với email và social login |
|----------|------------------------------------------------|
| **URL** | `/register` |
| **Hành động** | |
| 1. | Truy cập trang đăng ký |
| 2. | Nhập: Họ tên, Email, Mật khẩu |
| 3. | Tick đồng ý điều khoản |
| 4. | Click "Đăng ký" |
| 5. | (Alt) Hoặc click "Đăng ký với Google" → Popup OAuth |
| **Kết quả** | Thông báo "Vui lòng kiểm tra email xác thực", Email verification được gửi |

**Script nói:**
> "viec24h hỗ trợ 2 cách đăng ký: truyền thống với email/password, hoặc nhanh hơn với Google/Facebook. Khi đăng ký email, ứng viên cần xác thực để đảm bảo tính xác thực."

---

### UC-C02: Đăng nhập hệ thống
| Mục tiêu | Demo các phương thức đăng nhập |
|----------|-------------------------------|
| **URL** | `/login` |
| **Hành động** | |
| 1. | Nhập email và password |
| 2. | Click "Đăng nhập" |
| 3. | (Alt) Hoặc click "Đăng nhập với Google" |
| **Kết quả** | Redirect về trang chủ, Header hiện avatar và tên user |

**Script nói:**
> "Đăng nhập nhanh chóng. Social login giúp user không cần nhớ mật khẩu riêng."

---

### UC-C03: Quên mật khẩu / Đặt lại mật khẩu
| Mục tiêu | Demo flow khôi phục tài khoản |
|----------|------------------------------|
| **URL** | `/forgot-password` → `/reset-password` |
| **Hành động** | |
| 1. | Click "Quên mật khẩu?" từ trang Login |
| 2. | Nhập email |
| 3. | Click "Gửi link đặt lại" |
| 4. | Mở email, click link reset |
| 5. | Nhập mật khẩu mới, xác nhận |
| **Kết quả** | Thông báo thành công, có thể đăng nhập với password mới |

**Script nói:**
> "Quy trình khôi phục mật khẩu an toàn qua email. Token có thời hạn để bảo mật."

---

## NHÓM 2: PROFILE & RESUME MODULE (UC-C04, UC-C05, UC-C06)

### UC-C04: Quản lý hồ sơ cá nhân
| Mục tiêu | Demo cập nhật thông tin và avatar |
|----------|----------------------------------|
| **URL** | `/user/profile` |
| **Hành động** | |
| 1. | Vào menu User → "Hồ sơ cá nhân" |
| 2. | Cập nhật: Họ tên, Số điện thoại, Địa chỉ |
| 3. | Click "Thay avatar" → Chọn file ảnh |
| 4. | Click "Lưu thay đổi" |
| **Kết quả** | Avatar mới hiển thị trên header, thông tin được cập nhật |

**Script nói:**
> "Hồ sơ cá nhân là ấn tượng đầu tiên với nhà tuyển dụng. Avatar chuyên nghiệp tăng cơ hội được chú ý."

---

### UC-C05: Tạo CV/Resume
| Mục tiêu | Demo tạo CV hoàn chỉnh với các section |
|----------|---------------------------------------|
| **URL** | `/user/resumes/create` |
| **Hành động** | |
| 1. | Vào "CV của tôi" → "Tạo CV mới" |
| 2. | Nhập tiêu đề: "CV Senior Developer 2026" |
| 3. | **Thêm Học vấn:** Đại học Bách khoa, CNTT, 2018-2022 |
| 4. | **Thêm Kinh nghiệm:** Công ty ABC, Developer, 2 năm, mô tả công việc |
| 5. | **Thêm Kỹ năng:** Chọn React, Node.js, SQL từ dropdown |
| 6. | (Optional) Upload file CV PDF |
| 7. | Click "Lưu CV" |
| **Kết quả** | CV xuất hiện trong danh sách, có thể preview |

**Script nói:**
> "CV builder trực quan, có cấu trúc. Ứng viên tạo nhiều CV cho các vị trí khác nhau. Có thể upload PDF để nhà tuyển dụng tải về."

---

### UC-C06: Quản lý danh sách CV
| Mục tiêu | Demo CRUD và preview CV |
|----------|------------------------|
| **URL** | `/user/resumes` |
| **Hành động** | |
| 1. | Xem danh sách CV đã tạo |
| 2. | Click "Xem" để preview (`/user/resumes/:id`) |
| 3. | Click "Sửa" để chỉnh sửa (`/user/resumes/:id/edit`) |
| 4. | Thêm 1 experience mới → Lưu |
| 5. | Demo xóa CV (nếu có nhiều) |
| **Kết quả** | Danh sách cập nhật, CV có thể xem/sửa/xóa |

**Script nói:**
> "Quản lý nhiều CV linh hoạt. Mỗi CV có thể chỉnh sửa riêng biệt, dùng cho các vị trí khác nhau."

---

## NHÓM 3: JOB SEARCH & APPLICATION MODULE (UC-C07, UC-C08, UC-C09, UC-C10)

### UC-C07: Tìm kiếm việc làm
| Mục tiêu | Demo search và filter đầy đủ |
|----------|----------------------------|
| **URL** | `/jobs` |
| **Hành động** | |
| 1. | Nhập từ khóa: "Developer" (hiện suggestions) |
| 2. | Áp dụng filter: Loại việc = "Full-time" |
| 3. | Áp dụng filter: Mức lương = "15-25 triệu" |
| 4. | Áp dụng filter: Địa điểm = "Hồ Chí Minh" |
| 5. | Xem kết quả với pagination |
| 6. | Thay đổi sắp xếp: "Mới nhất" / "Lương cao nhất" |
| **Kết quả** | Danh sách jobs lọc theo điều kiện, có pagination |

**Script nói:**
> "Bộ lọc đa chiều giúp ứng viên nhanh chóng tìm đúng job. Autocomplete suggestions giúp tìm kiếm chính xác hơn."

---

### UC-C08: Xem chi tiết việc làm
| Mục tiêu | Demo trang job detail đầy đủ thông tin |
|----------|---------------------------------------|
| **URL** | `/jobs/:id` |
| **Hành động** | |
| 1. | Click vào một job từ danh sách |
| 2. | Scroll xem: Mô tả → Yêu cầu → Phúc lợi |
| 3. | Xem thông tin công ty (sidebar) |
| 4. | Xem mức lương và loại hình |
| 5. | (Background: view count tự động tăng) |
| **Kết quả** | Trang hiển thị đầy đủ, có nút "Ứng tuyển" và "Lưu" |

**Script nói:**
> "Trang chi tiết cung cấp đầy đủ thông tin để ứng viên quyết định. Hệ thống tự động đếm lượt xem để nhà tuyển dụng biết job hấp dẫn."

---

### UC-C09: Ứng tuyển việc làm
| Mục tiêu | Demo quy trình apply hoàn chỉnh |
|----------|--------------------------------|
| **URL** | `/jobs/:id` (từ trang detail) |
| **Hành động** | |
| 1. | Click "Ứng tuyển ngay" |
| 2. | Popup hiện danh sách CV |
| 3. | Chọn CV phù hợp |
| 4. | Click "Xác nhận ứng tuyển" |
| 5. | (Background: Email gửi cho cả 2 bên) |
| **Kết quả** | Thông báo thành công, nút đổi thành "Đã ứng tuyển", NTD nhận notification |

**Script nói:**
> "Ứng tuyển chỉ 2 click: chọn CV và xác nhận. Cả ứng viên và nhà tuyển dụng đều nhận email thông báo."

**Demo thêm (Alternative flow):**
- Quay lại job đã apply → Hiển thị "Đã ứng tuyển" với trạng thái

---

### UC-C10: Theo dõi đơn ứng tuyển
| Mục tiêu | Demo tracking và rút đơn |
|----------|-------------------------|
| **URL** | `/user/applications` |
| **Hành động** | |
| 1. | Vào "Việc đã ứng tuyển" |
| 2. | Xem danh sách với các status khác nhau |
| 3. | Filter theo status: "Đang chờ" / "Đã xem" / "Chấp nhận" |
| 4. | Click vào một đơn để xem chi tiết (`/user/applications/:id`) |
| 5. | Demo "Rút đơn" (với đơn pending) |
| **Kết quả** | Thấy trạng thái realtime, có thể rút đơn khi cần |

**Script nói:**
> "Ứng viên theo dõi được tất cả đơn. Trạng thái cập nhật realtime khi nhà tuyển dụng review. Có thể rút đơn nếu thay đổi ý định."

---

## NHÓM 4: SAVE & FOLLOW MODULE (UC-C11, UC-C12, UC-C13)

### UC-C11: Lưu việc làm yêu thích
| Mục tiêu | Demo bookmark jobs |
|----------|-------------------|
| **URL** | `/jobs` → `/user/saved-jobs` |
| **Hành động** | |
| 1. | Từ danh sách jobs hoặc job detail |
| 2. | Click icon bookmark/heart |
| 3. | Icon chuyển sang đã lưu |
| 4. | Vào "Việc làm đã lưu" (`/user/saved-jobs`) |
| 5. | Xem danh sách, demo bỏ lưu |
| **Kết quả** | Job được bookmark, quản lý trong trang riêng |

**Script nói:**
> "Lưu job để so sánh hoặc apply sau. Rất tiện khi đang so sánh nhiều cơ hội."

---

### UC-C12: Lưu tìm kiếm
| Mục tiêu | Demo saved search và job alerts |
|----------|-------------------------------|
| **URL** | `/jobs` → `/user/saved-searches` |
| **Hành động** | |
| 1. | Thực hiện search với filter cụ thể |
| 2. | Click "Lưu tìm kiếm này" |
| 3. | Đặt tên: "Frontend jobs HCM 20tr+" |
| 4. | Bật toggle "Thông báo email" |
| 5. | Lưu → Vào "Tìm kiếm đã lưu" (`/user/saved-searches`) |
| 6. | Click "Xem jobs" để execute saved search |
| **Kết quả** | Search được lưu, nhận email khi có job mới match |

**Script nói:**
> "Tính năng smart matching - khi nhà tuyển dụng đăng job mới phù hợp, ứng viên tự động nhận thông báo. Không cần tìm lại mỗi ngày."

---

### UC-C13: Theo dõi công ty
| Mục tiêu | Demo follow company |
|----------|-------------------|
| **URL** | `/companies/:id` |
| **Hành động** | |
| 1. | Vào trang "Công ty" (`/companies`) |
| 2. | Click vào một công ty để xem chi tiết |
| 3. | Click "Theo dõi" |
| 4. | Button chuyển thành "Đang theo dõi" |
| 5. | Xem danh sách jobs của công ty |
| **Kết quả** | Follow công ty, nhận thông báo khi có job mới |

**Script nói:**
> "Theo dõi công ty yêu thích để không bỏ lỡ cơ hội. Khi công ty đăng job mới, ứng viên nhận notification."

---

## NHÓM 5: NOTIFICATIONS MODULE (UC-C14, UC-C15)

### UC-C14: Xem thông báo
| Mục tiêu | Demo notification system |
|----------|-------------------------|
| **URL** | Header → `/user/notifications` |
| **Hành động** | |
| 1. | Click icon chuông 🔔 trên header |
| 2. | Xem dropdown với badge số chưa đọc |
| 3. | Click một notification để mark as read |
| 4. | Click "Xem tất cả" |
| 5. | Xem trang notifications đầy đủ |
| 6. | Click "Đánh dấu tất cả đã đọc" |
| **Kết quả** | Notifications được quản lý, badge reset |

**Script nói:**
> "Hệ thống thông báo realtime. Ứng viên không bỏ lỡ khi nhà tuyển dụng review đơn hoặc có job mới phù hợp."

---

### UC-C15: Thông báo job matching
| Mục tiêu | Demo smart job alerts |
|----------|----------------------|
| **URL** | `/user/job-notifications` |
| **Hành động** | |
| 1. | Vào "Thông báo việc làm" |
| 2. | Xem danh sách jobs match từ saved searches |
| 3. | Giải thích: "System tự động match dựa trên filters đã lưu" |
| 4. | Click vào job để xem chi tiết |
| **Kết quả** | Danh sách jobs được match tự động |

**Script nói:**
> "Đây là tính năng khác biệt của viec24h. Không cần tìm - hệ thống tự động gợi ý job phù hợp dựa trên tiêu chí đã lưu."

---

## KẾT THÚC CANDIDATE DEMO

**Tổng kết:**
> "Vừa rồi là 15 chức năng dành cho Ứng viên, từ đăng ký, tạo CV, tìm việc, ứng tuyển đến theo dõi kết quả. Tất cả đều smooth và intuitive. Tiếp theo là góc nhìn Nhà tuyển dụng."

---

# 🟠 PHẦN 2: EMPLOYER DEMO (25 phút)
## Bao gồm 15 Use Cases: UC-E01 → UC-E15

---

## NHÓM 1: AUTHENTICATION MODULE (UC-E01, UC-E02)

### UC-E01: Đăng ký tài khoản Employer
| Mục tiêu | Demo B2B registration flow |
|----------|---------------------------|
| **URL** | `/employer/register` |
| **Hành động** | |
| 1. | Truy cập trang Employer (`/employer`) |
| 2. | Click "Đăng ký" |
| 3. | Nhập thông tin liên hệ: Tên, Email công ty, SĐT |
| 4. | Nhập thông tin công ty: Tên công ty, Website, Quy mô |
| 5. | (Hoặc chọn công ty đã tồn tại từ danh sách) |
| 6. | Click "Đăng ký" |
| **Kết quả** | Tài khoản tạo thành công, thông báo "Chờ xác thực từ Admin" |

**Script nói:**
> "Khác với ứng viên, nhà tuyển dụng cần được Admin verify. Điều này đảm bảo chất lượng - chỉ doanh nghiệp thật mới đăng tin."

---

### UC-E02: Đăng nhập Employer
| Mục tiêu | Demo employer login |
|----------|-------------------|
| **URL** | `/employer/login` |
| **Hành động** | |
| 1. | Nhập email và password (dùng account verified) |
| 2. | Click "Đăng nhập" |
| 3. | (Hoặc đăng nhập bằng Google) |
| **Kết quả** | Redirect đến Employer Dashboard |

**Script nói:**
> "Employer portal riêng biệt với giao diện tối ưu cho tuyển dụng."

*(Lưu ý: Từ đây dùng account employer đã verify)*

---

## NHÓM 2: COMPANY PROFILE MODULE (UC-E03, UC-E04)

### UC-E03: Quản lý hồ sơ công ty
| Mục tiêu | Demo employer branding |
|----------|----------------------|
| **URL** | `/employer/company` |
| **Hành động** | |
| 1. | Vào "Hồ sơ công ty" từ sidebar |
| 2. | Cập nhật mô tả công ty |
| 3. | Upload logo (ảnh vuông) |
| 4. | Upload banner (ảnh ngang) |
| 5. | Cập nhật website, địa chỉ |
| 6. | Click "Lưu thay đổi" |
| **Kết quả** | Logo/banner hiển thị trên tất cả tin tuyển dụng |

**Script nói:**
> "Hồ sơ công ty ấn tượng thu hút ứng viên chất lượng. Logo chuyên nghiệp tăng độ tin cậy."

---

### UC-E04: Xem follower của công ty
| Mục tiêu | Demo audience insights |
|----------|----------------------|
| **URL** | `/employer/company` (section followers) |
| **Hành động** | |
| 1. | Scroll xuống section Followers |
| 2. | Xem số lượng người theo dõi |
| 3. | (Nếu có) Xem danh sách followers |
| **Kết quả** | Thấy ai đang quan tâm đến công ty |

**Script nói:**
> "Doanh nghiệp biết được bao nhiêu ứng viên đang quan tâm. Audience insights giúp đánh giá employer branding."

---

## NHÓM 3: JOB POSTING MODULE (UC-E05, UC-E06, UC-E07)

### UC-E05: Tạo tin tuyển dụng
| Mục tiêu | Demo job creation đầy đủ |
|----------|--------------------------|
| **URL** | `/employer/jobs/create` |
| **Hành động** | |
| 1. | Vào "Quản lý tin" → "Tạo tin mới" |
| 2. | Nhập tiêu đề: "Senior React Developer" |
| 3. | Nhập mô tả công việc (rich text) |
| 4. | Nhập yêu cầu: 3+ năm kinh nghiệm, React, TypeScript |
| 5. | Nhập phúc lợi: Bảo hiểm, du lịch công ty |
| 6. | Chọn mức lương: Min 25tr, Max 35tr |
| 7. | Chọn loại hình: Full-time |
| 8. | Chọn Tags và Skills |
| 9. | Chọn "Lưu nháp" hoặc "Đăng tin ngay" |
| **Kết quả** | Tin được tạo, nếu publish thì auto-match ứng viên |

**Script nói:**
> "Form đăng tin đầy đủ trường. Có thể lưu draft để review trước khi đăng. Khi đăng, hệ thống tự động thông báo ứng viên phù hợp."

---

### UC-E06: Quản lý tin tuyển dụng
| Mục tiêu | Demo job list và edit |
|----------|----------------------|
| **URL** | `/employer/jobs` |
| **Hành động** | |
| 1. | Xem danh sách tin với status tags |
| 2. | Filter: "Draft" / "Published" / "Expired" |
| 3. | Click "Sửa" trên một tin (`/employer/jobs/:id/edit`) |
| 4. | Cập nhật mô tả hoặc salary |
| 5. | Lưu thay đổi |
| **Kết quả** | Tin được cập nhật |

**Script nói:**
> "Quản lý tập trung tất cả tin tuyển dụng. Dễ dàng filter theo trạng thái và chỉnh sửa bất cứ lúc nào."

---

### UC-E07: Publish/Expire tin tuyển dụng
| Mục tiêu | Demo job lifecycle |
|----------|-------------------|
| **URL** | `/employer/jobs` |
| **Hành động** | |
| 1. | Với tin Draft → Click "Đăng tin" (Publish) |
| 2. | Status chuyển sang "Đang tuyển" |
| 3. | Với tin Published → Click "Đóng tuyển" (Expire) |
| 4. | Status chuyển sang "Đã đóng" |
| **Kết quả** | Job lifecycle được quản lý linh hoạt |

**Script nói:**
> "Kiểm soát hoàn toàn lifecycle: Draft → Published → Expired. Đóng tuyển ngay khi đủ ứng viên."

---

## NHÓM 4: APPLICATION MANAGEMENT MODULE (UC-E08, UC-E09, UC-E10)

### UC-E08: Xem danh sách ứng viên
| Mục tiêu | Demo application pipeline |
|----------|--------------------------|
| **URL** | `/employer/applications` |
| **Hành động** | |
| 1. | Vào "Quản lý ứng viên" |
| 2. | Xem danh sách tất cả applications |
| 3. | Filter theo Job: "Senior React Developer" |
| 4. | Filter theo Status: "Pending" / "Reviewed" |
| 5. | Xem thông tin tóm tắt: Tên, CV, Ngày apply |
| **Kết quả** | Danh sách ứng viên với filter đa chiều |

**Script nói:**
> "Tất cả ứng viên được tập trung. Filter giúp HR xử lý nhanh - tập trung vào pending trước."

---

### UC-E09: Review đơn ứng tuyển
| Mục tiêu | Demo full review workflow |
|----------|--------------------------|
| **URL** | `/employer/applications/:id` |
| **Hành động** | |
| 1. | Click vào một application |
| 2. | Xem CV chi tiết: Học vấn, Kinh nghiệm, Kỹ năng |
| 3. | Cập nhật status: Pending → Reviewed |
| 4. | Thêm ghi chú: "Ứng viên tốt, schedule phỏng vấn tuần sau" |
| 5. | Cập nhật status: Reviewed → Accepted |
| 6. | (Ứng viên nhận notification và email) |
| **Kết quả** | Status thay đổi, notes lưu lại, ứng viên được thông báo |

**Script nói:**
> "Workflow review rõ ràng. Ghi chú nội bộ giúp team cùng đánh giá. Mỗi thay đổi status đều thông báo ứng viên."

---

### UC-E10: Bulk Update ứng viên
| Mục tiêu | Demo mass action |
|----------|-----------------|
| **URL** | `/employer/applications` |
| **Hành động** | |
| 1. | Tick chọn nhiều applications (checkbox) |
| 2. | Click dropdown "Bulk Action" |
| 3. | Chọn "Cập nhật thành Rejected" |
| 4. | Xác nhận |
| 5. | Tất cả selected đổi status |
| **Kết quả** | Xử lý hàng loạt, tiết kiệm thời gian |

**Script nói:**
> "Khi cần xử lý nhiều đơn cùng lúc - ví dụ reject tất cả không phù hợp - bulk action tiết kiệm rất nhiều thời gian."

---

## NHÓM 5: CANDIDATE MANAGEMENT MODULE (UC-E11, UC-E12)

### UC-E11: Xem hồ sơ ứng viên
| Mục tiêu | Demo candidate profile view |
|----------|---------------------------|
| **URL** | `/employer/candidates/:id` |
| **Hành động** | |
| 1. | Từ application detail, click "Xem hồ sơ" |
| 2. | Xem thông tin cá nhân |
| 3. | Xem tất cả CV của ứng viên |
| 4. | Xem lịch sử ứng tuyển vào công ty |
| **Kết quả** | Full profile của ứng viên |

**Script nói:**
> "Xem toàn bộ hồ sơ ứng viên: profile, tất cả CV, và lịch sử apply. Giúp đánh giá tổng thể."

---

### UC-E12: Lưu ứng viên tiềm năng
| Mục tiêu | Demo talent pool |
|----------|-----------------|
| **URL** | `/employer/saved-candidates` |
| **Hành động** | |
| 1. | Từ candidate profile, click "Lưu ứng viên" |
| 2. | Thêm ghi chú: "Phù hợp vị trí DevOps" |
| 3. | Vào "Ứng viên đã lưu" |
| 4. | Xem danh sách với notes |
| 5. | Demo xóa khỏi danh sách |
| **Kết quả** | Talent pool để liên hệ sau |

**Script nói:**
> "Ứng viên chưa phù hợp hôm nay có thể là ideal cho ngày mai. Lưu lại để build talent pipeline."

---

## NHÓM 6: DASHBOARD & ANALYTICS MODULE (UC-E13, UC-E14)

### UC-E13: Xem Dashboard
| Mục tiêu | Demo overview metrics |
|----------|---------------------|
| **URL** | `/employer/dashboard` |
| **Hành động** | |
| 1. | Xem các cards: Active Jobs, Total Applications |
| 2. | Xem Pipeline chart (breakdown by status) |
| 3. | Xem Recent Applications |
| 4. | Click quick action từ dashboard |
| **Kết quả** | Overview toàn bộ hoạt động tuyển dụng |

**Script nói:**
> "Dashboard là command center. Một cái nhìn thấy ngay: bao nhiêu tin hoạt động, bao nhiêu ứng viên, pipeline ra sao."

---

### UC-E14: Xem Analytics
| Mục tiêu | Demo data-driven insights |
|----------|-------------------------|
| **URL** | `/employer/analytics` |
| **Hành động** | |
| 1. | Xem Views per Job |
| 2. | Xem Application Rate |
| 3. | Xem Conversion Funnel |
| 4. | So sánh giữa các jobs |
| **Kết quả** | Hiểu hiệu quả tuyển dụng |

**Script nói:**
> "Analytics giúp optimize. Job nào có nhiều view nhưng ít apply? Có thể cần sửa JD. Data-driven recruitment."

---

## NHÓM 7: SETTINGS MODULE (UC-E15)

### UC-E15: Quản lý cài đặt và tài khoản
| Mục tiêu | Demo account management |
|----------|------------------------|
| **URL** | `/employer/settings` |
| **Hành động** | |
| 1. | Vào "Cài đặt" |
| 2. | **Thay đổi thông tin:** Update tên, SĐT |
| 3. | **Notification preferences:** Bật/tắt email updates |
| 4. | **Đổi mật khẩu:** Nhập current → new password |
| 5. | **Account actions:** Demo suspend/reactivate (giải thích) |
| **Kết quả** | Toàn quyền kiểm soát tài khoản |

**Script nói:**
> "Cài đặt đầy đủ: từ notification preferences đến account management. Có thể tạm ngưng tài khoản khi cần."

---

## KẾT THÚC EMPLOYER DEMO

**Tổng kết:**
> "Đó là 15 chức năng dành cho Nhà tuyển dụng - từ đăng ký, đăng tin, quản lý ứng viên đến analytics. Cuối cùng là góc nhìn Admin."

---

# 🔴 PHẦN 3: ADMIN DEMO (10 phút)
## Bao gồm 9 Use Cases: UC-A01 → UC-A09

---

## NHÓM 1: AUTHENTICATION (UC-A01)

### UC-A01: Đăng nhập Admin
| Mục tiêu | Demo secure admin access |
|----------|-------------------------|
| **URL** | `/admin/login` |
| **Hành động** | |
| 1. | Truy cập portal admin riêng |
| 2. | Nhập credentials admin |
| 3. | Đăng nhập |
| **Kết quả** | Redirect đến Admin Dashboard |

**Script nói:**
> "Admin portal hoàn toàn tách biệt, chỉ role admin mới access được."

---

## NHÓM 2: USER MANAGEMENT (UC-A02, UC-A03)

### UC-A02: Quản lý Users (Job Seekers)
| Mục tiêu | Demo user moderation |
|----------|---------------------|
| **URL** | `/admin/users` |
| **Hành động** | |
| 1. | Xem danh sách users với pagination |
| 2. | Tìm kiếm theo tên hoặc email |
| 3. | Xem thông tin: Ngày đăng ký, Status |
| 4. | Click "Block" để khóa user vi phạm |
| 5. | Click "Unblock" để mở lại |
| **Kết quả** | User bị block không thể đăng nhập |

**Script nói:**
> "Quản lý tất cả users. Có thể block tài khoản vi phạm ngay lập tức."

---

### UC-A03: Quản lý Employers
| Mục tiêu | Demo B2B verification |
|----------|----------------------|
| **URL** | `/admin/employers` |
| **Hành động** | |
| 1. | Xem danh sách employers |
| 2. | Filter "Chưa verify" |
| 3. | Xem thông tin: Công ty, Website, Ngày đăng ký |
| 4. | Click "Verify" để xác thực |
| 5. | (Employer có thể đăng tin sau khi verify) |
| 6. | Demo "Suspend" employer vi phạm |
| **Kết quả** | Chỉ employer verified mới đăng tin |

**Script nói:**
> "Verification là bước quan trọng. Admin review thông tin công ty trước khi cho phép đăng tin. Đảm bảo chất lượng nền tảng."

---

## NHÓM 3: CONTENT MODERATION (UC-A04, UC-A05)

### UC-A04: Quản lý Jobs
| Mục tiêu | Demo job moderation |
|----------|-------------------|
| **URL** | `/admin/jobs` |
| **Hành động** | |
| 1. | Xem tất cả jobs toàn hệ thống |
| 2. | Filter theo status, company |
| 3. | Xem nội dung job detail |
| 4. | Demo xóa job vi phạm (spam, scam) |
| **Kết quả** | Nội dung được kiểm soát |

**Script nói:**
> "Admin giám sát tất cả tin tuyển dụng. Xóa ngay những tin spam hoặc vi phạm chính sách."

---

### UC-A05: Quản lý Companies
| Mục tiêu | Demo company overview |
|----------|---------------------|
| **URL** | `/admin/companies` |
| **Hành động** | |
| 1. | Xem danh sách công ty |
| 2. | Xem thông tin: Số jobs, số employers |
| 3. | Click để xem chi tiết |
| **Kết quả** | Tổng quan ecosystem công ty |

**Script nói:**
> "Xem tất cả công ty trên nền tảng với số liệu liên quan."

---

## NHÓM 4: DASHBOARD & ANALYTICS (UC-A06, UC-A07)

### UC-A06: Xem Dashboard tổng quan
| Mục tiêu | Demo platform health |
|----------|---------------------|
| **URL** | `/admin/dashboard` |
| **Hành động** | |
| 1. | Xem metrics: Total Users, Employers, Jobs, Applications |
| 2. | Xem biểu đồ User Growth |
| 3. | Xem Top Companies |
| 4. | Xem Recent Activity |
| **Kết quả** | Platform overview at a glance |

**Script nói:**
> "Admin dashboard cho thấy sức khỏe nền tảng: tăng trưởng users, hoạt động jobs và applications."

---

### UC-A07: Xem Analytics chi tiết
| Mục tiêu | Demo business intelligence |
|----------|-----------------------------|
| **URL** | `/admin/dashboard` (charts section) |
| **Hành động** | |
| 1. | Chọn time range: 7 ngày / 30 ngày / 3 tháng / 1 năm |
| 2. | Xem User Growth over time |
| 3. | Xem Application Trends |
| 4. | Xem Job Category Distribution |
| **Kết quả** | Trend analysis cho business decisions |

**Script nói:**
> "Analytics sâu hơn với time range. Xem xu hướng để planning: mùa nào tuyển nhiều, ngành nào hot."

---

## NHÓM 5: NOTIFICATION SYSTEM (UC-A08, UC-A09)

### UC-A08: Gửi thông báo hệ thống
| Mục tiêu | Demo broadcast notification |
|----------|---------------------------|
| **URL** | `/admin/notifications` |
| **Hành động** | |
| 1. | Vào "Quản lý thông báo" |
| 2. | Click "Gửi thông báo mới" |
| 3. | Chọn audience: All / Job Seekers / Employers |
| 4. | Nhập tiêu đề và nội dung |
| 5. | Click "Gửi" |
| **Kết quả** | Notification broadcast đến tất cả target users |

**Script nói:**
> "Khi cần announce: bảo trì hệ thống, tính năng mới, khuyến mãi. Admin broadcast đến đúng audience."

---

### UC-A09: Quản lý thông báo đã gửi
| Mục tiêu | Demo notification history |
|----------|--------------------------|
| **URL** | `/admin/notifications` |
| **Hành động** | |
| 1. | Xem danh sách thông báo đã gửi |
| 2. | Xem thống kê: Sent to, Read rate |
| 3. | Xem nội dung từng thông báo |
| **Kết quả** | Track communication effectiveness |

**Script nói:**
> "Theo dõi thông báo đã gửi: bao nhiêu người nhận, tỷ lệ đọc. Đánh giá hiệu quả communication."

---

## KẾT THÚC ADMIN DEMO

**Tổng kết:**
> "9 chức năng Admin bao quát toàn bộ vận hành: quản lý users/employers, kiểm duyệt nội dung, analytics và communication."

---

# 📊 TỔNG KẾT TOÀN BỘ DEMO

## Use Case Coverage Summary

| Role | Use Cases | Core 🟢 | Advanced 🟡 | Nice-to-have 🔴 |
|------|-----------|---------|-------------|-----------------|
| **Candidate** | UC-C01 → UC-C15 | 11 | 4 | 0 |
| **Employer** | UC-E01 → UC-E15 | 9 | 5 | 1 |
| **Admin** | UC-A01 → UC-A09 | 5 | 3 | 1 |
| **TỔNG** | **39 Use Cases** | **25** | **12** | **2** |

---

## Điểm mạnh đã demo

| # | Feature | Value |
|---|---------|-------|
| 1 | Multi-role system | Phân quyền rõ ràng, UX tối ưu cho từng role |
| 2 | Social OAuth | Đăng ký/đăng nhập 1-click |
| 3 | Smart Job Matching | Auto-notify ứng viên phù hợp |
| 4 | Complete Workflow | End-to-end từ post job đến hiring |
| 5 | Real-time Notifications | Cập nhật tức thì mọi hoạt động |
| 6 | Analytics Dashboard | Data-driven decisions |
| 7 | B2B Verification | Đảm bảo chất lượng employers |
| 8 | Bulk Operations | Tiết kiệm thời gian cho HR |

---

## FAQ Thường gặp

| Câu hỏi | Trả lời |
|---------|---------|
| "Có hỗ trợ mobile app không?" | Responsive web, app native đang roadmap |
| "Data lưu trữ ở đâu?" | Supabase (PostgreSQL), region Singapore |
| "Có API cho integration?" | Có, REST API documented |
| "Chi phí như thế nào?" | (Theo model định: Freemium/Subscription) |
| "Customize được không?" | White-label available |

---

## Call-to-Action

> "Quý vị vừa trải nghiệm toàn bộ 39 tính năng của **viec24h**. Nền tảng đã sẵn sàng giúp doanh nghiệp tìm kiếm nhân tài và ứng viên có việc làm mơ ước.
>
> **Bước tiếp theo:**
> 1. Đăng ký trial miễn phí
> 2. Onboarding 1-1 với team
> 3. Go-live trong 24 giờ
>
> Cảm ơn quý vị đã theo dõi!"

---

*Demo Script v2.0 - Full Coverage 39 Use Cases*  
*Dựa trên USE_CASE_DOCUMENT.md v1.0*
