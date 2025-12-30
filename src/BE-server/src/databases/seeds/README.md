# Database Seeds - Job Search Application

## Overview

This document describes the comprehensive seed data for development and testing purposes. The seeds provide realistic, diverse data to test backend APIs and frontend integration.

---

## Seed Files Execution Order

| Order | Filename | Description | Records |
|-------|----------|-------------|---------|
| 01 | `01_truncate_tables.js` | Clear all tables (CASCADE) | - |
| 02 | `02_seed_skills.js` | Master data: Technical skills | 67 skills |
| 03 | `03_seed_tags.js` | Master data: Job tags (WorkType, Level, Priority) | 18 tags |
| 04 | `04_seed_locations.js` | Master data: Cities and locations | 22 locations |
| 05 | `05_seed_companies.js` | Master data: Companies | 17 companies |
| 06 | `06_seed_jobs.js` | Jobs with employers, tags, locations, skills | 19 jobs, 10 employers |
| 07 | `07_seed_users.js` | User profiles (job seekers) | 15 users |
| 08 | `08_seed_resumes.js` | Resumes with education, experience, skills | 15 resumes |
| 09 | `09_seed_applications.js` | Job applications with various statuses | 20 applications |
| 10 | `10_seed_saved_jobs.js` | Saved jobs by users | ~30 saved jobs |
| 11 | `11_seed_notifications.js` | User notifications | 30 notifications |
| 12 | `12_seed_saved_searches.js` | Saved job searches by users | ~25 saved searches |
| 13 | `13_seed_resume_views.js` | Resume views by employers | ~30 resume views |

---

## Seed Execution Order & Dependencies

```
1. Truncate tables (01)           → Clears all data
2. Master data (02-05)             → No dependencies
   - Skills, Tags, Locations, Companies
3. Jobs & Employers (06)           → Depends on: Companies, Tags, Locations, Skills
4. Users (07)                      → Should match Supabase auth.users
5. Resumes (08)                    → Depends on: Users, Skills
6. Applications (09)               → Depends on: Resumes, Users, Jobs
7. Saved Jobs (10)                 → Depends on: Users, Jobs
8. Notifications (11)              → Depends on: Users
9. Saved Searches (12)             → Depends on: Users, Locations, Skills
10. Resume Views (13)              → Depends on: Resumes, Employers
```

---

## Running Seeds

### Run all seeds in order
```bash
cd BE-server
npx knex seed:run
```

### Run specific seed
```bash
npx knex seed:run --specific=02_seed_skills.js
```

### Run seeds from a specific file onwards
```bash
# Run from seed 05 onwards
npx knex seed:run --specific=05_seed_companies.js
```

---

## Seed Data Summary

### 1. Skills (67 records)
Comprehensive list of technical skills including:
- Frontend: ReactJS, Vue.js, Angular, Next.js, TypeScript, etc.
- Backend: Node.js, Java, Python, Go, PHP, .NET, etc.
- Mobile: React Native, Flutter, iOS, Android
- Databases: PostgreSQL, MySQL, MongoDB, Redis, etc.
- Cloud & DevOps: AWS, Azure, Docker, Kubernetes, CI/CD, etc.
- AI/ML: Machine Learning, TensorFlow, PyTorch, Data Science
- UI/UX: Figma, Adobe XD, Sketch

### 2. Tags (18 records)
- **WorkType**: Full-time, Part-time, Contract, Freelance, Remote, Hybrid, Onsite
- **Level**: Intern, Fresher, Junior, Mid-level, Senior, Lead, Manager, Director
- **Priority**: Hot, Urgent, Featured

### 3. Locations (22 records)
Major cities and districts in Vietnam:
- Tier 1: Hồ Chí Minh, Hà Nội, Đà Nẵng
- Tier 2: Cần Thơ, Hải Phòng, Biên Hòa, Nha Trang, Huế, Vũng Tàu, etc.
- Districts: Quận 1-9 (HCM), Cầu Giấy, Đống Đa (HN), etc.

### 4. Companies (17 records)
Real Vietnamese tech companies:
- **Large Corporations**: FPT Software, VinGroup, Viettel Solutions, TMA Solutions
- **E-commerce**: Tiki, Sendo, Lazada Vietnam, Shopee Vietnam
- **Fintech**: MoMo, VPBank, Techcombank
- **Gaming & Entertainment**: VNG Corporation, Amanotes
- **Software & Services**: CMC Corporation, ELCA Vietnam, Axon Active Vietnam
- **AI & Data**: FPT.AI, Got It AI

### 5. Employers (10 records)
HR managers and recruiters for each company with realistic names and roles.

### 6. Jobs (19 records)
Diverse job postings with:
- **Various Levels**: Fresher, Junior, Mid-level, Senior
- **Different Types**: Full-time, Remote, Hybrid
- **Multiple Locations**: HCM, HN, Remote
- **Different Skills**: React, Node.js, Java, Python, DevOps, Mobile, etc.
- **Realistic Salaries**: $500-$4000 USD
- **Complete Details**: Description, requirements, benefits, expiration dates

### 7. Users (15 records)
Job seeker profiles with:
- **Names**: Vietnamese names (Nguyễn, Trần, Lê, etc.)
- **Demographics**: Gender, date of birth, phone, address
- **Locations**: Mix of HCM and HN users
- **Note**: These UUIDs should match Supabase auth.users

### 8. Resumes (15 records)
Comprehensive resumes with:
- **Titles**: Matching user skills and experience
- **Summaries**: Professional descriptions
- **Education**: University degrees (Bách Khoa, KHTN, FPT, etc.)
- **Experience**: 1-3 work experiences per resume
- **Skills**: 2-5 skills per resume with proficiency levels (Beginner, Intermediate, Advanced, Expert)

### 9. Applications (20 records)
Job applications with various statuses:
- **Pending**: 8 applications (recently submitted)
- **Under Review**: 4 applications (being evaluated)
- **Interview Scheduled**: 3 applications (interviews arranged)
- **Accepted**: 2 applications (offers accepted)
- **Rejected**: 3 applications (with rejection notes)
- **Withdrawn**: 2 applications (candidate withdrew)

### 10. Saved Jobs (~30 records)
Jobs saved by users for later viewing:
- Users save jobs matching their skills and interests
- Multiple saves per user (2-3 jobs per user on average)
- Realistic scenarios: Senior developers save senior positions, Frontend devs save frontend jobs, etc.

### 11. Notifications (30 records)
User notifications with various types:
- **Application Updates**: Status changes, interview schedules, acceptances
- **Job Recommendations**: New jobs matching user profile
- **Profile Updates**: CV views, profile completion reminders
- **System Notifications**: Promotional, educational, reminders
- Mix of seen/unseen notifications for realistic UX

### 12. Saved Searches (~25 records)
Saved job search filters:
- Users save their search criteria for quick access
- Realistic filters: location, skills, level, salary range, work type
- Multiple searches per user (1-2 searches per user)
- Filter data stored as JSON for flexibility

### 13. Resume Views (~30 records)
Resume views by employers:
- Employers view resumes from applications they received
- Employers browse and view resumes proactively
- Tracks view dates for analytics
- Multiple views per resume by different employers

---

## Important Notes

### Supabase Auth Integration

⚠️ **Users seed (07_seed_users.js) requires Supabase auth.users to exist first!**

The seed uses predefined UUIDs. To create matching auth users:

1. Create users in Supabase Dashboard with these UUIDs, OR
2. Use Supabase Admin API to create users programmatically, OR
3. Register users through your API and update the seed UUIDs

Example UUIDs used:
- `a0000000-0000-0000-0000-000000000001` - Nguyễn Văn An
- `a0000000-0000-0000-0000-000000000002` - Trần Thị Bình
- ... (15 total)

### Idempotency

Most seeds are idempotent (safe to run multiple times):
- **Master data** (skills, tags, locations, companies): Uses `TRUNCATE` then `INSERT`
- **Users**: Uses `.onConflict('user_id').merge()` to update existing
- **Jobs, Resumes, Applications**: Uses `DEL` then `INSERT` (not idempotent)

### Foreign Key Handling

Seeds handle FK constraints by:
1. **Querying for IDs**: Instead of hardcoding auto-generated IDs
2. **Inserting in correct order**: Parent tables first, then children
3. **Using dynamic lookups**: `await knex('company').where('company_name', 'FPT Software').first()`

---

## Testing with Seed Data

### Backend API Testing
- **GET /api/jobs**: Should return 19 jobs with pagination
- **GET /api/jobs/:jobId**: Should return job with tags, locations, skills
- **GET /api/users/profile**: Requires authenticated user
- **GET /api/resumes**: Should return user's resumes
- **GET /api/applications**: Should return user's applications with various statuses

### Frontend Integration
- **Job Listings**: Display jobs with filters (location, level, type)
- **Job Details**: Show complete job info with company, employer, tags, skills
- **User Profiles**: Display user info, resumes, applications
- **Application Status**: Show different statuses (pending, accepted, rejected, etc.)

---

## Warnings

⚠️ **DO NOT run seeds in production without modification!**

- Seeds use `TRUNCATE CASCADE` which deletes ALL related data
- User UUIDs are hardcoded and need Supabase auth integration
- Data is designed for development/testing only
- Some seeds are NOT idempotent (will create duplicates if run multiple times)

---

## Adding New Seed Data

To add new seed data:

1. **Create new file** with next order number: `10_seed_your_data.js`
2. **Follow the pattern**:
   - Clear existing data if needed
   - Query for parent IDs dynamically
   - Insert new records
   - Add relationships (tags, locations, skills)
3. **Respect FK dependencies**: Insert parent records first
4. **Update this README** with new seed file info
5. **Test thoroughly**: Ensure seeds run without errors

---

## Troubleshooting

### Error: Foreign key constraint violation
- **Solution**: Run seeds in correct order (01 → 09)
- Check that parent records exist before inserting children

### Error: Users not found
- **Solution**: Create users in Supabase auth.users first, OR
- Comment out user-dependent seeds (08, 09) if testing without auth

### Error: Duplicate key violation
- **Solution**: Run `01_truncate_tables.js` first to clear all data
- Some seeds are not idempotent - truncate before re-running

### Seed runs but no data appears
- **Solution**: Check database connection in `knexfile.js`
- Verify `.env.development` has correct `DATABASE_URL`
- Check for transaction rollbacks in seed files
