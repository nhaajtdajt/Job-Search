# Database Seeds - Job Search Application

## Overview

This document describes the seed data for development and testing purposes.

---

## Seed Files

| Order | Filename | Description |
|-------|----------|-------------|
| 01 | `01_seed_init_job_search_data.js` | Complete initial data for all tables |

---

## Seed Execution Order & Dependencies

```
1. auth.users (Supabase)     → No dependencies
2. users (profiles)          → Depends on: auth.users
3. skill, tag, location      → No dependencies (master data)
4. company                   → No dependencies
5. employer                  → Depends on: users, company
6. job                       → Depends on: employer
7. resume                    → Depends on: users
8. application               → Depends on: resume, users, job
```

---

## Test Accounts (Development Only)

### Job Seekers

| Name | Email | User ID | Role |
|------|-------|---------|------|
| Nguyễn Văn Dev | ungvien@test.com | a0000000-0000-0000-0000-000000000001 | Job Seeker |

### Employers

| Name | Email | User ID | Company | Role |
|------|-------|---------|---------|------|
| Lê Thị Tuyển Dụng | hr_fpt@test.com | b0000000-0000-0000-0000-000000000002 | FPT Software | HR Manager |
| Phạm Giám Đốc | ceo_vin@test.com | c0000000-0000-0000-0000-000000000003 | VinGroup | Director |

**Note:** All test accounts use `dummy_hash` as password (for Supabase auth simulation).

---

## Seed Data Details

### 1. Users (3 records)

| User ID | Name | Gender | Phone | Address |
|---------|------|--------|-------|---------|
| a0000000-...001 | Nguyễn Văn Dev | Nam | 0901234567 | TP.HCM |
| b0000000-...002 | Lê Thị Tuyển Dụng | Nữ | 0909888777 | Hà Nội |
| c0000000-...003 | Phạm Giám Đốc | Nam | 0912345678 | Hà Nội |

### 2. Companies (2 records)

| Company Name | Website | Address |
|--------------|---------|---------|
| FPT Software | https://fpt-software.com | Khu Công Nghệ Cao, Q9, TP.HCM |
| VinGroup | https://vingroup.net | Long Biên, Hà Nội |

### 3. Skills (4 records)

| Skill ID | Skill Name |
|----------|------------|
| SK001 | ReactJS |
| SK002 | NodeJS |
| SK003 | SQL |
| SK004 | Python |

### 4. Tags (4 records)

| Tag Name | Type |
|----------|------|
| Remote | WorkType |
| Full-time | WorkType |
| Senior | Level |
| Fresher | Level |

### 5. Locations (3 records)

| Location Name |
|---------------|
| Hồ Chí Minh |
| Hà Nội |
| Đà Nẵng |

### 6. Jobs (2 records)

| Job Title | Company | Job Type | Salary Range |
|-----------|---------|----------|--------------|
| Senior ReactJS Developer | FPT Software | Full-time | $1,500 - $2,500 |
| Backend Developer (NodeJS) | VinGroup | Full-time | $1,000 - $2,000 |

### 7. Resumes (1 record)

| Resume ID | User | Title |
|-----------|------|-------|
| RES0001 | Nguyễn Văn Dev | Frontend Developer |

### 8. Applications (1 record)

| Resume | Job | Status |
|--------|-----|--------|
| RES0001 | Senior ReactJS Developer | Pending |

---

## Running Seeds

### Run all seeds
```bash
npx knex seed:run
```

### Run specific seed
```bash
npx knex seed:run --specific=01_seed_init_job_search_data.js
```

---

## Idempotency

The seed file is designed to be idempotent (safe to run multiple times):

1. **auth.users**: Uses `ON CONFLICT (id) DO NOTHING`
2. **users**: Uses `.onConflict('user_id').merge()`
3. **Master data**: Uses `TRUNCATE TABLE ... CASCADE` to clear and re-insert

---

## Foreign Key Handling

The seed handles FK constraints by:

1. **Inserting in correct order**: Parent tables first, then children
2. **Using TRUNCATE CASCADE**: For master data tables (skill, tag, location, company)
3. **Querying for IDs**: Instead of hardcoding auto-generated IDs

Example:
```javascript
// Get company ID dynamically
const fptId = await knex('company')
  .where({ company_name: 'FPT Software' })
  .first()
  .then(r => r.company_id);

// Use in employer insert
await knex('employer').insert({
  company_id: fptId,
  // ...
});
```

---

## Warnings

⚠️ **DO NOT run seeds in production without modification!**

- Test accounts have dummy passwords
- Data is designed for development/testing only
- TRUNCATE CASCADE will delete all related data

---

## Adding New Seed Data

To add new seed data:

1. Create new file with next order number: `02_seed_your_data.js`
2. Follow the idempotent pattern (check before insert or use ON CONFLICT)
3. Respect FK dependencies (insert parent records first)
4. Update this documentation
