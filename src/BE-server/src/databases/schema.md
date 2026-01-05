# Database Schema - Job Search Platform

## Tổng Quan
Database sử dụng PostgreSQL với 21 bảng chính.

---

## Sơ Đồ Quan Hệ (ERD)

```
users (1) ─────────────────┬── (n) resume
  │                        │
  │ (1)                    └── (n) res_education
  │                        └── (n) res_experience
  │                        └── (n) resume_skill
  │
  ├── (n) application ────── (1) job
  ├── (n) saved_job ──────── (1) job
  ├── (n) saved_search
  ├── (n) notification
  ├── (n) saved_candidate ── (1) employer
  └── (n) followed_company ─ (1) company

employer (1) ─────┬── (n) job ────┬── (n) job_location ── (1) location
  │               │               ├── (n) job_skill ───── (1) skill
  │               │               └── (n) job_tag ─────── (1) tag
  │               │
  └── (1) company └── (n) resume_view
```

---

## Chi Tiết Các Bảng

### 1. users
Bảng người dùng (Job Seeker).

```sql
CREATE TABLE public.users (
  user_id uuid NOT NULL,
  name text,
  gender character varying,
  date_of_birth date,
  phone character varying,
  address text,
  avatar_url text,
  job_title text,
  current_level character varying,
  industry text,
  field text,
  experience_years integer,
  current_salary numeric,
  education character varying,
  nationality character varying,
  marital_status character varying,
  country character varying,
  province character varying,
  desired_location text,
  desired_salary numeric,
  status character varying DEFAULT 'active'::character varying 
    CHECK (status::text = ANY (ARRAY['active', 'blocked']::text[])),
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);
```

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| user_id | uuid | PK, từ Supabase Auth |
| name | text | Họ tên |
| gender | varchar | Giới tính |
| date_of_birth | date | Ngày sinh |
| phone | varchar | Số điện thoại |
| address | text | Địa chỉ |
| avatar_url | text | URL ảnh đại diện |
| job_title | text | Vị trí công việc hiện tại |
| current_level | varchar | Cấp bậc hiện tại |
| industry | text | Ngành nghề |
| field | text | Lĩnh vực |
| experience_years | integer | Số năm kinh nghiệm |
| current_salary | numeric | Mức lương hiện tại |
| education | varchar | Trình độ học vấn |
| nationality | varchar | Quốc tịch |
| marital_status | varchar | Tình trạng hôn nhân |
| country | varchar | Quốc gia |
| province | varchar | Tỉnh/thành phố |
| desired_location | text | Địa điểm mong muốn |
| desired_salary | numeric | Mức lương mong muốn |
| status | varchar | Trạng thái: 'active', 'blocked' |

---

### 2. company
Bảng công ty.

```sql
CREATE TABLE public.company (
  company_id bigint NOT NULL DEFAULT nextval('company_company_id_seq'::regclass),
  company_name text NOT NULL UNIQUE,
  website text UNIQUE,
  address text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT company_pkey PRIMARY KEY (company_id)
);
```

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| company_id | bigint | PK, auto increment |
| company_name | text | Tên công ty (unique) |
| website | text | Website (unique) |
| address | text | Địa chỉ |
| description | text | Mô tả công ty |
| logo_url | text | URL logo |
| created_at | timestamptz | Ngày tạo |

---

### 3. employer
Bảng nhà tuyển dụng.

```sql
CREATE TABLE public.employer (
  employer_id bigint NOT NULL DEFAULT nextval('employer_employer_id_seq'::regclass),
  full_name text NOT NULL,
  email text,
  role character varying NOT NULL,
  status character varying DEFAULT 'verified'::character varying 
    CHECK (status::text = ANY (ARRAY['verified', 'suspended']::text[])),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  avatar_url text,
  user_id uuid,
  company_id bigint,
  CONSTRAINT employer_pkey PRIMARY KEY (employer_id),
  CONSTRAINT employer_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT employer_company_id_foreign FOREIGN KEY (company_id) REFERENCES public.company(company_id)
);
```

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| employer_id | bigint | PK, auto increment |
| full_name | text | Họ tên |
| email | text | Email |
| role | varchar | Vai trò |
| status | varchar | Trạng thái: 'verified', 'suspended' |
| created_at | timestamptz | Ngày tạo |
| avatar_url | text | URL ảnh đại diện |
| user_id | uuid | FK → users |
| company_id | bigint | FK → company |

---

### 4. job
Bảng tin tuyển dụng.

```sql
CREATE TABLE public.job (
  job_id bigint NOT NULL DEFAULT nextval('job_job_id_seq'::regclass),
  employer_id bigint NOT NULL,
  job_title text NOT NULL,
  description text,
  requirements text,
  benefits text,
  salary_min numeric,
  salary_max numeric,
  job_type character varying NOT NULL,
  posted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  expired_at timestamp with time zone,
  views integer DEFAULT 0,
  status character varying DEFAULT 'draft'::character varying,
  CONSTRAINT job_pkey PRIMARY KEY (job_id),
  CONSTRAINT job_employer_id_foreign FOREIGN KEY (employer_id) REFERENCES public.employer(employer_id)
);
```

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| job_id | bigint | PK, auto increment |
| employer_id | bigint | FK → employer |
| job_title | text | Tiêu đề job |
| description | text | Mô tả công việc |
| requirements | text | Yêu cầu |
| benefits | text | Quyền lợi |
| salary_min | numeric | Lương tối thiểu |
| salary_max | numeric | Lương tối đa |
| job_type | varchar | Loại: Full-time, Part-time, Contract, Remote |
| posted_at | timestamptz | Ngày đăng |
| expired_at | timestamptz | Ngày hết hạn |
| views | integer | Số lượt xem |
| status | varchar | Trạng thái: draft, active, expired |

---

### 5. resume
Bảng CV/Resume.

```sql
CREATE TABLE public.resume (
  resume_id character varying NOT NULL,
  user_id uuid NOT NULL,
  resume_title text NOT NULL,
  summary text NOT NULL,
  resume_url text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone,
  CONSTRAINT resume_pkey PRIMARY KEY (resume_id),
  CONSTRAINT resume_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
```

---

### 6. res_education
Bảng học vấn trong resume.

```sql
CREATE TABLE public.res_education (
  education_id bigint NOT NULL DEFAULT nextval('res_education_education_id_seq'::regclass),
  resume_id character varying,
  school_name text NOT NULL,
  major text NOT NULL,
  degree text NOT NULL,
  start_year integer,
  end_year integer,
  CONSTRAINT res_education_pkey PRIMARY KEY (education_id),
  CONSTRAINT res_education_resume_id_foreign FOREIGN KEY (resume_id) REFERENCES public.resume(resume_id)
);
```

---

### 7. res_experience
Bảng kinh nghiệm làm việc trong resume.

```sql
CREATE TABLE public.res_experience (
  experience_id bigint NOT NULL DEFAULT nextval('res_experience_experience_id_seq'::regclass),
  resume_id character varying NOT NULL,
  job_title text NOT NULL,
  company_name text NOT NULL,
  start_date date,
  end_date date,
  description text,
  CONSTRAINT res_experience_pkey PRIMARY KEY (experience_id),
  CONSTRAINT res_experience_resume_id_foreign FOREIGN KEY (resume_id) REFERENCES public.resume(resume_id)
);
```

---

### 8. application
Bảng đơn ứng tuyển.

```sql
CREATE TABLE public.application (
  application_id bigint NOT NULL DEFAULT nextval('application_application_id_seq'::regclass),
  resume_id character varying NOT NULL,
  user_id uuid NOT NULL,
  job_id bigint NOT NULL,
  apply_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  status character varying NOT NULL,
  notes text,
  updated_at timestamp with time zone,
  CONSTRAINT application_pkey PRIMARY KEY (application_id),
  CONSTRAINT application_resume_id_foreign FOREIGN KEY (resume_id) REFERENCES public.resume(resume_id),
  CONSTRAINT application_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT application_job_id_foreign FOREIGN KEY (job_id) REFERENCES public.job(job_id)
);
```

---

### 9. notification
Bảng thông báo.

```sql
CREATE TABLE public.notification (
  notification_id character varying NOT NULL,
  user_id uuid,
  note text NOT NULL,
  seen boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  title character varying,
  metadata jsonb,
  CONSTRAINT notification_pkey PRIMARY KEY (notification_id),
  CONSTRAINT notification_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
```

---

### 10. saved_job
Bảng job đã lưu.

```sql
CREATE TABLE public.saved_job (
  user_id uuid NOT NULL,
  job_id bigint NOT NULL,
  saved_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT saved_job_pkey PRIMARY KEY (user_id, job_id),
  CONSTRAINT saved_job_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT saved_job_job_id_foreign FOREIGN KEY (job_id) REFERENCES public.job(job_id)
);
```

---

### 11. saved_search
Bảng tìm kiếm đã lưu.

```sql
CREATE TABLE public.saved_search (
  stt bigint NOT NULL DEFAULT nextval('saved_search_stt_seq'::regclass),
  user_id uuid NOT NULL,
  name text NOT NULL,
  filter text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT saved_search_pkey PRIMARY KEY (stt),
  CONSTRAINT saved_search_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
```

---

### 12. saved_candidate
Bảng ứng viên đã lưu (Employer).

```sql
CREATE TABLE public.saved_candidate (
  employer_id bigint NOT NULL,
  user_id uuid NOT NULL,
  notes text,
  saved_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT saved_candidate_pkey PRIMARY KEY (employer_id, user_id),
  CONSTRAINT saved_candidate_employer_id_foreign FOREIGN KEY (employer_id) REFERENCES public.employer(employer_id),
  CONSTRAINT saved_candidate_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
```

---

### 13. skill
Bảng kỹ năng.

```sql
CREATE TABLE public.skill (
  skill_id character varying NOT NULL,
  skill_name text NOT NULL,
  CONSTRAINT skill_pkey PRIMARY KEY (skill_id)
);
```

---

### 14. job_skill
Bảng liên kết job-skill.

```sql
CREATE TABLE public.job_skill (
  skill_id character varying NOT NULL,
  job_id bigint NOT NULL,
  CONSTRAINT job_skill_pkey PRIMARY KEY (skill_id, job_id),
  CONSTRAINT job_skill_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES public.skill(skill_id),
  CONSTRAINT job_skill_job_id_foreign FOREIGN KEY (job_id) REFERENCES public.job(job_id)
);
```

---

### 15. resume_skill
Bảng liên kết resume-skill.

```sql
CREATE TABLE public.resume_skill (
  skill_id character varying NOT NULL,
  resume_id character varying NOT NULL,
  level character varying NOT NULL,
  CONSTRAINT resume_skill_pkey PRIMARY KEY (skill_id, resume_id),
  CONSTRAINT resume_skill_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES public.skill(skill_id),
  CONSTRAINT resume_skill_resume_id_foreign FOREIGN KEY (resume_id) REFERENCES public.resume(resume_id)
);
```

---

### 16. location
Bảng địa điểm.

```sql
CREATE TABLE public.location (
  location_id bigint NOT NULL DEFAULT nextval('location_location_id_seq'::regclass),
  location_name character varying NOT NULL,
  CONSTRAINT location_pkey PRIMARY KEY (location_id)
);
```

---

### 17. job_location
Bảng liên kết job-location.

```sql
CREATE TABLE public.job_location (
  stt bigint NOT NULL DEFAULT nextval('job_location_stt_seq'::regclass),
  job_id bigint NOT NULL,
  location_id bigint NOT NULL,
  CONSTRAINT job_location_pkey PRIMARY KEY (stt),
  CONSTRAINT job_location_job_id_foreign FOREIGN KEY (job_id) REFERENCES public.job(job_id),
  CONSTRAINT job_location_location_id_foreign FOREIGN KEY (location_id) REFERENCES public.location(location_id)
);
```

---

### 18. tag
Bảng tags.

```sql
CREATE TABLE public.tag (
  tag_id bigint NOT NULL DEFAULT nextval('tag_tag_id_seq'::regclass),
  tag_name character varying NOT NULL,
  type character varying NOT NULL,
  CONSTRAINT tag_pkey PRIMARY KEY (tag_id)
);
```

---

### 19. job_tag
Bảng liên kết job-tag.

```sql
CREATE TABLE public.job_tag (
  stt bigint NOT NULL DEFAULT nextval('job_tag_stt_seq'::regclass),
  job_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT job_tag_pkey PRIMARY KEY (stt),
  CONSTRAINT job_tag_job_id_foreign FOREIGN KEY (job_id) REFERENCES public.job(job_id),
  CONSTRAINT job_tag_tag_id_foreign FOREIGN KEY (tag_id) REFERENCES public.tag(tag_id)
);
```

---

### 20. resume_view
Bảng lượt xem resume (Employer).

```sql
CREATE TABLE public.resume_view (
  resume_id character varying NOT NULL,
  employer_id bigint NOT NULL,
  view_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT resume_view_pkey PRIMARY KEY (resume_id, employer_id),
  CONSTRAINT resume_view_resume_id_foreign FOREIGN KEY (resume_id) REFERENCES public.resume(resume_id),
  CONSTRAINT resume_view_employer_id_foreign FOREIGN KEY (employer_id) REFERENCES public.employer(employer_id)
);
```

---

### 21. followed_company
Bảng công ty đã theo dõi (User/Job Seeker).

```sql
CREATE TABLE public.followed_company (
  user_id uuid NOT NULL,
  company_id bigint NOT NULL,
  followed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT followed_company_pkey PRIMARY KEY (user_id, company_id),
  CONSTRAINT followed_company_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
  CONSTRAINT followed_company_company_id_foreign FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE
);
```

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| user_id | uuid | PK, FK → users |
| company_id | bigint | PK, FK → company |
| followed_at | timestamptz | Ngày follow |

---

## Bảng Hệ Thống Knex

### knex_migrations
```sql
CREATE TABLE public.knex_migrations (
  id integer NOT NULL DEFAULT nextval('knex_migrations_id_seq'::regclass),
  name character varying,
  batch integer,
  migration_time timestamp with time zone,
  CONSTRAINT knex_migrations_pkey PRIMARY KEY (id)
);
```

### knex_migrations_lock
```sql
CREATE TABLE public.knex_migrations_lock (
  index integer NOT NULL DEFAULT nextval('knex_migrations_lock_index_seq'::regclass),
  is_locked integer,
  CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index)
);
```

---

## Tổng Kết

| Bảng | Mô tả |
|------|-------|
| users | Người dùng (Job Seeker) |
| company | Công ty |
| employer | Nhà tuyển dụng |
| job | Tin tuyển dụng |
| resume | CV/Resume |
| res_education | Học vấn |
| res_experience | Kinh nghiệm |
| application | Đơn ứng tuyển |
| notification | Thông báo |
| saved_job | Job đã lưu |
| saved_search | Tìm kiếm đã lưu |
| saved_candidate | Ứng viên đã lưu |
| followed_company | Công ty đã theo dõi |
| skill | Kỹ năng |
| job_skill | Job-Skill |
| resume_skill | Resume-Skill |
| location | Địa điểm |
| job_location | Job-Location |
| tag | Tags |
| job_tag | Job-Tag |
| resume_view | Lượt xem resume |
