# Job Search - Backend Server

Backend API server cho ứng dụng tìm kiếm việc làm, được xây dựng với Node.js, Express và PostgreSQL.

## 📋 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x (hoặc Supabase)

## 🚀 Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd src/BE-server
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` trong thư mục `BE-server`:

```env
# Server
NODE_ENV=development
PORT=8017
HOSTNAME=localhost

# Database (PostgreSQL/Supabase)
DATABASE_URL=postgresql://username:password@host:5432/database_name

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Supabase (optional)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Khởi tạo Database

```bash
# Chạy migrations (tạo tables)
npx knex migrate:latest

# Chạy seeds (thêm dữ liệu mẫu)
npx knex seed:run
```

### 4. Chạy server

```bash
# Development (với hot-reload)
npm run dev

# Production
npm start
```

Server sẽ chạy tại: `http://localhost:8017`

## 📁 Cấu trúc dự án

```
src/
├── app.js                    # Express app setup
├── server.js                 # Entry point
├── configs/                  # Cấu hình
│   ├── cors.config.js
│   └── environment.config.js
├── constants/                # Hằng số
│   ├── http-status.js
│   ├── messages.js
│   ├── module.js
│   ├── role.js
│   └── job.js
├── controllers/              # HTTP handlers
├── databases/                # Database layer
│   ├── knex.js
│   ├── migrations/
│   └── seeds/
├── errors/                   # Custom errors
├── middlewares/              # Express middlewares
├── repositories/             # Data access layer
├── routes/                   # API routes
├── services/                 # Business logic
└── utils/                    # Utilities
```

## 🔌 API Endpoints

### Health Check
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Kiểm tra server |

### Jobs
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/jobs` | Lấy danh sách công việc |
| GET | `/api/jobs/:jobId` | Lấy chi tiết công việc |

### Query Parameters (GET /api/jobs)
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| page | number | 1 | Trang hiện tại |
| limit | number | 10 | Số item/trang (max: 100) |
| job_type | string | - | Lọc theo loại công việc |
| employer_id | number | - | Lọc theo nhà tuyển dụng |

## 🧪 Test với Postman

Import file `postman_collection.json` vào Postman để test API.

## 📦 Scripts

```bash
npm run dev      # Chạy development với nodemon
npm start        # Chạy production
npm test         # Chạy tests (chưa cấu hình)
```

## 🗄️ Database Commands

```bash
# Migrations
npx knex migrate:latest          # Chạy tất cả migrations
npx knex migrate:rollback        # Rollback migration cuối
npx knex migrate:status          # Xem trạng thái migrations

# Seeds
npx knex seed:run                # Chạy tất cả seeds
npx knex seed:run --specific 01_seed_init_job_search_data.js
```

## 🔧 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5.x
- **Database:** PostgreSQL
- **Query Builder:** Knex.js
- **Authentication:** JWT + Supabase Auth
- **Validation:** Custom middleware

## 👥 Tài khoản test (Development)

| Email | Role | Password |
|-------|------|----------|
| ungvien@test.com | Job Seeker | (xem seed file) |
| hr_fpt@test.com | HR Manager | (xem seed file) |
| ceo_vin@test.com | CEO | (xem seed file) |

## 📝 License

ISC