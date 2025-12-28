# Database Schema - Job Search Application

## Overview

This document describes the database schema for the Job Search application.
The database uses PostgreSQL with Supabase authentication integration.

---

## Tables

### 1. users
User profile information linked to Supabase auth.

| Column | Type | Constraints |
|--------|------|-------------|
| user_id | UUID | PK, FK -> auth.users(id) ON DELETE CASCADE |
| name | TEXT | |
| gender | VARCHAR(10) | |
| date_of_birth | DATE | |
| phone | VARCHAR(15) | |
| address | TEXT | |
| avatar_url | TEXT | |

---

### 2. company
Company/employer organization information.

| Column | Type | Constraints |
|--------|------|-------------|
| company_id | BIGSERIAL | PK |
| company_name | TEXT | NOT NULL, UNIQUE |
| website | TEXT | UNIQUE |
| address | TEXT | NOT NULL |
| description | TEXT | |
| logo_url | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT now() |

---

### 3. employer
Employer accounts linked to companies.

| Column | Type | Constraints |
|--------|------|-------------|
| employer_id | BIGSERIAL | PK |
| full_name | TEXT | NOT NULL |
| email | TEXT | |
| role | VARCHAR(50) | NOT NULL |
| status | VARCHAR(50) | |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| avatar_url | TEXT | |
| user_id | UUID | FK -> users.user_id ON DELETE SET NULL |
| company_id | BIGINT | NOT NULL, FK -> company.company_id ON DELETE CASCADE |

---

### 4. job
Job postings created by employers.

| Column | Type | Constraints |
|--------|------|-------------|
| job_id | BIGSERIAL | PK |
| employer_id | BIGINT | NOT NULL, FK -> employer.employer_id ON DELETE CASCADE |
| job_title | TEXT | NOT NULL |
| description | TEXT | |
| requirements | TEXT | |
| benefits | TEXT | |
| salary_min | DECIMAL(15,2) | |
| salary_max | DECIMAL(15,2) | |
| job_type | VARCHAR(50) | NOT NULL |
| posted_at | TIMESTAMPTZ | DEFAULT now() |
| expired_at | TIMESTAMPTZ | |
| views | INTEGER | DEFAULT 0 |

---

### 5. tag
Tags for categorizing jobs (work type, level, etc.).

| Column | Type | Constraints |
|--------|------|-------------|
| tag_id | BIGSERIAL | PK |
| tag_name | VARCHAR(50) | NOT NULL |
| type | VARCHAR(50) | NOT NULL |

---

### 6. job_tag
Junction table linking jobs to tags.

| Column | Type | Constraints |
|--------|------|-------------|
| stt | BIGSERIAL | PK |
| job_id | BIGINT | NOT NULL, FK -> job.job_id ON DELETE CASCADE |
| tag_id | BIGINT | NOT NULL, FK -> tag.tag_id ON DELETE CASCADE |

---

### 7. location
Available job locations.

| Column | Type | Constraints |
|--------|------|-------------|
| location_id | BIGSERIAL | PK |
| location_name | VARCHAR(100) | NOT NULL |

---

### 8. job_location
Junction table linking jobs to locations.

| Column | Type | Constraints |
|--------|------|-------------|
| stt | BIGSERIAL | PK |
| job_id | BIGINT | NOT NULL, FK -> job.job_id ON DELETE CASCADE |
| location_id | BIGINT | NOT NULL, FK -> location.location_id ON DELETE CASCADE |

---

### 9. saved_job
Jobs saved by users for later viewing.

| Column | Type | Constraints |
|--------|------|-------------|
| user_id | UUID | PK, FK -> users.user_id ON DELETE CASCADE |
| job_id | BIGINT | PK, FK -> job.job_id ON DELETE CASCADE |
| saved_at | TIMESTAMPTZ | DEFAULT now() |

---

### 10. notification
User notifications.

| Column | Type | Constraints |
|--------|------|-------------|
| notification_id | VARCHAR(10) | PK |
| user_id | UUID | FK -> users.user_id ON DELETE CASCADE |
| note | TEXT | NOT NULL |
| seen | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT now() |

---

### 11. resume
User resumes/CVs.

| Column | Type | Constraints |
|--------|------|-------------|
| resume_id | VARCHAR(7) | PK |
| user_id | UUID | NOT NULL, FK -> users.user_id ON DELETE CASCADE |
| resume_title | TEXT | NOT NULL |
| summary | TEXT | NOT NULL |
| resume_url | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | |

---

### 12. res_education
Education entries in resumes.

| Column | Type | Constraints |
|--------|------|-------------|
| education_id | BIGSERIAL | PK |
| resume_id | VARCHAR(7) | FK -> resume.resume_id ON DELETE CASCADE |
| school_name | TEXT | NOT NULL |
| major | TEXT | NOT NULL |
| degree | TEXT | NOT NULL |
| start_year | INTEGER | |
| end_year | INTEGER | CHECK: end_year >= start_year |

---

### 13. res_experience
Work experience entries in resumes.

| Column | Type | Constraints |
|--------|------|-------------|
| experience_id | BIGSERIAL | PK |
| resume_id | VARCHAR(7) | NOT NULL, FK -> resume.resume_id ON DELETE CASCADE |
| job_title | TEXT | NOT NULL |
| company_name | TEXT | NOT NULL |
| start_date | DATE | |
| end_date | DATE | CHECK: end_date > start_date |
| description | TEXT | |

---

### 14. skill
Available skills for jobs and resumes.

| Column | Type | Constraints |
|--------|------|-------------|
| skill_id | VARCHAR(5) | PK |
| skill_name | TEXT | NOT NULL |

---

### 15. resume_skill
Skills associated with resumes.

| Column | Type | Constraints |
|--------|------|-------------|
| skill_id | VARCHAR(5) | PK, FK -> skill.skill_id ON DELETE CASCADE |
| resume_id | VARCHAR(7) | PK, FK -> resume.resume_id ON DELETE CASCADE |
| level | VARCHAR(50) | NOT NULL |

---

### 16. job_skill
Skills required for jobs.

| Column | Type | Constraints |
|--------|------|-------------|
| skill_id | VARCHAR(5) | PK, FK -> skill.skill_id ON DELETE CASCADE |
| job_id | BIGINT | PK, FK -> job.job_id ON DELETE CASCADE |

---

### 17. saved_search
User saved job searches.

| Column | Type | Constraints |
|--------|------|-------------|
| stt | BIGSERIAL | PK |
| user_id | UUID | NOT NULL, FK -> users.user_id ON DELETE CASCADE |
| name | TEXT | NOT NULL |
| filter | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT now() |

---

### 18. resume_view
Tracks employer views of resumes.

| Column | Type | Constraints |
|--------|------|-------------|
| resume_id | VARCHAR(7) | PK, FK -> resume.resume_id ON DELETE CASCADE |
| employer_id | BIGINT | PK, FK -> employer.employer_id ON DELETE CASCADE |
| view_date | TIMESTAMPTZ | DEFAULT now() |

---

### 19. application
Job applications submitted by users.

| Column | Type | Constraints |
|--------|------|-------------|
| application_id | BIGSERIAL | PK |
| resume_id | VARCHAR(7) | NOT NULL, FK -> resume.resume_id ON DELETE CASCADE |
| user_id | UUID | NOT NULL, FK -> users.user_id ON DELETE CASCADE |
| job_id | BIGINT | NOT NULL, FK -> job.job_id ON DELETE CASCADE |
| apply_date | TIMESTAMPTZ | DEFAULT now() |
| status | VARCHAR(50) | NOT NULL |
| notes | TEXT | |
| updated_at | TIMESTAMPTZ | |

---

## Entity Relationship Diagram

```
                    ┌─────────────┐
                    │  auth.users │
                    └──────┬──────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   company   │◄────│  employer   │────►│    users    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │                   ▼                   │
       │            ┌─────────────┐            │
       │            │     job     │            │
       │            └──────┬──────┘            │
       │                   │                   │
       │     ┌─────────────┼─────────────┐     │
       │     │             │             │     │
       │     ▼             ▼             ▼     │
       │ ┌───────┐   ┌──────────┐   ┌───────┐ │
       │ │job_tag│   │job_skill │   │job_loc│ │
       │ └───┬───┘   └────┬─────┘   └───┬───┘ │
       │     │            │             │     │
       │     ▼            ▼             ▼     │
       │ ┌───────┐   ┌──────────┐   ┌───────┐ │
       │ │  tag  │   │  skill   │   │locatio│ │
       │ └───────┘   └────┬─────┘   └───────┘ │
       │                  │                   │
       │                  ▼                   │
       │           ┌────────────┐             │
       │           │resume_skill│             │
       │           └─────┬──────┘             │
       │                 │                    │
       │                 ▼                    │
       │           ┌─────────────┐            │
       └──────────►│   resume    │◄───────────┘
                   └──────┬──────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌───────────┐  ┌────────────┐  ┌───────────┐
    │res_educati│  │res_experien│  │application│
    └───────────┘  └────────────┘  └───────────┘
```

---

## Database Functions & Triggers

### handle_new_user()
Automatically creates a user profile when a new auth user is created.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (user_id, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### on_auth_user_created (Trigger)
Fires after INSERT on auth.users to call handle_new_user().

---

## Indexes

Default indexes created by PostgreSQL:
- Primary key indexes on all tables
- Unique indexes on company.company_name, company.website
- Foreign key indexes (recommended to add manually for performance)

### Recommended Additional Indexes
```sql
CREATE INDEX idx_job_employer_id ON job(employer_id);
CREATE INDEX idx_job_posted_at ON job(posted_at DESC);
CREATE INDEX idx_job_job_type ON job(job_type);
CREATE INDEX idx_application_status ON application(status);
CREATE INDEX idx_application_user_id ON application(user_id);
```

---

## Migration History

| Timestamp | Filename | Description |
|-----------|----------|-------------|
| 20251227083019 | init_job_search_schema.js | Initial schema creation with all tables |

---

## Notes

1. **Supabase Integration**: The `users` table references `auth.users` from Supabase authentication.
2. **Cascading Deletes**: Most foreign keys use ON DELETE CASCADE to maintain referential integrity.
3. **Composite Primary Keys**: `saved_job`, `resume_skill`, `job_skill`, `resume_view` use composite primary keys.
4. **Check Constraints**: Education and experience tables have date validation constraints.
