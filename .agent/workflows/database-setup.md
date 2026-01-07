---
description: Hướng dẫn setup database cho Backend (Knex + Supabase)
---

# Database Setup Workflow

## Yêu cầu trước khi bắt đầu

1. **Supabase Project** đã tạo và có:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (quan trọng!)
   - `SUPABASE_ANON_KEY`

2. **File `.env.development`** trong `src/BE-server/` đã cấu hình:
   ```env
   DATABASE_URL=postgres://...
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   SUPABASE_ANON_KEY=eyJxxx...
   JWT_SECRET=your_secret_key
   ```

---

## 🆕 Fresh Database Setup (lần đầu)

```bash
cd src/BE-server

# 1. Chạy migrations (tạo tables)
npx knex migrate:latest

# 2. Chạy seed data (thêm dữ liệu mẫu)
npx knex seed:run

# 3. Fix sequences (QUAN TRỌNG - tránh lỗi duplicate key)
node scripts/fix-sequences.js

# 4. Tạo profile cho admin users
node scripts/fix-admin-profiles.js
```

---

## 🔄 Reset Database (xóa hết và làm lại)

```bash
cd src/BE-server

# 1. Reset database (xóa tất cả tables)
node scripts/reset-database.js

# 2. Chạy lại migrations
npx knex migrate:latest

# 3. Chạy seed data
npx knex seed:run

# 4. Fix sequences
node scripts/fix-sequences.js

# 5. Fix admin profiles
node scripts/fix-admin-profiles.js
```

---

## 🔧 Troubleshooting - Các lỗi thường gặp

### Lỗi: "duplicate key value violates unique constraint"
```bash
# Chạy fix sequences
node scripts/fix-sequences.js
```

### Lỗi: "User profile not found" khi login admin
```bash
# Chạy fix admin profiles  
node scripts/fix-admin-profiles.js
```

### Lỗi: "Undefined binding(s) detected" hoặc 500 Error khi tạo job
- Kiểm tra `role.middleware.js` dùng `req.user.user_id` (không phải `req.user.id`)
- Đảm bảo JWT token chứa `employer_id` cho employer users

---

## 👤 Tài khoản Admin mặc định

| Email | Password |
|-------|----------|
| admin@jobsearch.com | Admin@123456 |
| admin2@jobsearch.com | Admin@123456 |
| superadmin@jobsearch.com | Admin@123456 |

---

## 📋 Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `scripts/reset-database.js` | Xóa tất cả tables và migration records |
| `scripts/fix-sequences.js` | Fix auto-increment sequences sau khi seed |
| `scripts/fix-admin-profiles.js` | Tạo profile cho admin users trong bảng `users` |

---

## ⚠️ Lưu ý quan trọng

1. **Luôn chạy `fix-sequences.js` sau khi seed** - Nếu không sẽ bị lỗi duplicate key khi tạo record mới

2. **Admin users được tạo trong Supabase Auth** - Script seed tạo admin trong Supabase Auth, nhưng bảng `users` local cần sync profile riêng

3. **Employer cần có record trong bảng `employer`** - Khi đăng ký employer, system tự tạo. Nếu lỗi, kiểm tra JWT token có `employer_id`


tài khoản employer có data
1	demo.employer1@jobsearch.com	Demo@123456	FPT Software
2	demo.employer2@jobsearch.com	Demo@123456	VinGroup
3	demo.employer3@jobsearch.com	Demo@123456	Viettel Solutions
4	demo.employer4@jobsearch.com	Demo@123456	Shopee Vietnam
5	demo.employer5@jobsearch.com	Demo@123456	MoMo
