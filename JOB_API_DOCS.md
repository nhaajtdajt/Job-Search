# Job Management APIs - Implementation Complete ✅

## 📋 Overview

Successfully implemented full CRUD operations for Job Management with proper authentication, validation, and permission checks.

---

## 🎯 Implemented Features

### ✅ Repository Layer ([job.repo.js](file:///Users/nguyenbaoan/codeLab/nhập%20môn%20cnpm/Job-Search/src/BE-server/src/repositories/job.repo.js))
- `create()` - Insert new job
- `update()` - Update existing job  
- `delete()` - Delete job (hard delete)
- `incrementViews()` - Increment view counter
- `isOwnedByEmployer()` - Check ownership
- `findByEmployerId()` - Get jobs by employer
- **Relationship management:**
  - `addTags()` / `removeTags()`
  - `addLocations()` / `removeLocations()`
  - `addSkills()` / `removeSkills()`

### ✅ Service Layer ([job.service.js](file:///Users/nguyenbaoan/codeLab/nhập%20môn%20cnpm/Job-Search/src/BE-server/src/services/job.service.js))
- `createJob()` - Create with validation & auto-expiry
- `updateJob()` - Update with permission check
- `deleteJob()` - Delete with permission check
- `publishJob()` - Set posted_at to now
- `expireJob()` - Close recruitment
- `incrementViews()` - Track job views
- `getJobsByEmployer()` - Get employer's jobs

**Business Logic:**
- ✅ Auto-calculate `expired_at` (default: 30 days)
- ✅ Validate required fields
- ✅ Check employer ownership before update/delete
- ✅ Handle job relations (tags, locations, skills)

### ✅ Controller Layer ([job.controller.js](file:///Users/nguyenbaoan/codeLab/nhập%20môn%20cnpm/Job-Search/src/BE-server/src/controllers/job.controller.js))
- All CRUD endpoints implemented
- Proper error handling
- Standard response format
- Extract user info from JWT token

### ✅ Routes ([job.route.js](file:///Users/nguyenbaoan/codeLab/nhập%20môn%20cnpm/Job-Search/src/BE-server/src/routes/job.route.js))
- Public routes (no auth)
- Protected routes with `authenticate` + `authorize(['employer'])`

---

## 📡 API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Get Jobs List
```http
GET /api/jobs?page=1&limit=10&job_type=full-time&employer_id=1
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `job_type` (optional) - Filter by job type
- `employer_id` (optional) - Filter by employer

**Response:**
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

#### 2. Get Job Detail
```http
GET /api/jobs/:jobId
```

**Response:**
```json
{
  "success": true,
  "message": "Job retrieved successfully",
  "data": {
    "job_id": 1,
    "job_title": "Senior Frontend Developer",
    "description": "...",
    "requirements": "...",
    "benefits": "...",
    "salary_min": 20000000,
    "salary_max": 35000000,
    "job_type": "full-time",
    "posted_at": "2025-12-28T10:00:00Z",
    "expired_at": "2026-01-28T10:00:00Z",
    "views": 150,
    "employer": {
      "employer_id": 1,
      "full_name": "John Doe",
      "email": "john@company.com",
      "role": "HR Manager",
      "company": {
        "company_id": 1,
        "company_name": "Tech Corp",
        "website": "https://techcorp.com",
        "address": "Ho Chi Minh City",
        "logo_url": "https://..."
      }
    }
  }
}
```

---

#### 3. Increment View Counter
```http
PUT /api/jobs/:jobId/views
```

**Response:**
```json
{
  "success": true,
  "message": "View counted successfully",
  "data": {
    "job_id": 1,
    "views": 151,
    ...
  }
}
```

---

### Protected Endpoints (Employer Only - Requires Authentication)

**Authentication Required:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**User must have role:** `employer`

---

#### 4. Create New Job
```http
POST /api/jobs
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "job_title": "Senior Frontend Developer",
  "description": "We are looking for...",
  "requirements": "- 3+ years experience...",
  "benefits": "- Competitive salary...",
  "salary_min": 20000000,
  "salary_max": 35000000,
  "job_type": "full-time",
  "expired_at": "2026-01-28T10:00:00Z",
  "tag_ids": [1, 2, 3],
  "location_ids": [1],
  "skill_ids": ["SK001", "SK002"]
}
```

**Required Fields:**
- `job_title` (string)
- `job_type` (string)

**Optional Fields:**
- `description` (text)
- `requirements` (text)
- `benefits` (text)
- `salary_min` (decimal)
- `salary_max` (decimal)
- `expired_at` (timestamp) - Auto-calculated if not provided (30 days from now)
- `tag_ids` (array of integers)
- `location_ids` (array of integers)
- `skill_ids` (array of strings)

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job_id": 1,
    "employer_id": 1,
    "job_title": "Senior Frontend Developer",
    ...
  }
}
```

---

#### 5. Update Job
```http
PUT /api/jobs/:jobId
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "job_title": "Senior Frontend Developer (Updated)",
  "description": "Updated description...",
  "salary_min": 25000000,
  "tag_ids": [1, 3, 5],
  "location_ids": [1, 2]
}
```

**Allowed Fields:**
- `job_title`
- `description`
- `requirements`
- `benefits`
- `salary_min`
- `salary_max`
- `job_type`
- `expired_at`
- `tag_ids` (replaces all tags)
- `location_ids` (replaces all locations)
- `skill_ids` (replaces all skills)

**Permission Check:**
- Only the job owner (employer) can update

**Response:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {...}
}
```

**Errors:**
- `404 Not Found` - Job not found
- `403 Forbidden` - Not the job owner

---

#### 6. Delete Job
```http
DELETE /api/jobs/:jobId
Authorization: Bearer <JWT_TOKEN>
```

**Permission Check:**
- Only the job owner (employer) can delete

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully",
  "data": null
}
```

**Errors:**
- `404 Not Found` - Job not found
- `403 Forbidden` - Not the job owner

---

#### 7. Publish Job
```http
POST /api/jobs/:jobId/publish
Authorization: Bearer <JWT_TOKEN>
```

**Description:**
Updates `posted_at` to current timestamp. Useful if job was created as draft.

**Permission Check:**
- Only the job owner (employer) can publish

**Response:**
```json
{
  "success": true,
  "message": "Job published successfully",
  "data": {
    "job_id": 1,
    "posted_at": "2025-12-28T15:30:00Z",
    ...
  }
}
```

---

#### 8. Expire/Close Job
```http
POST /api/jobs/:jobId/expire
Authorization: Bearer <JWT_TOKEN>
```

**Description:**
Closes recruitment by setting `expired_at` to current timestamp.

**Permission Check:**
- Only the job owner (employer) can expire

**Response:**
```json
{
  "success": true,
  "message": "Job expired successfully",
  "data": {
    "job_id": 1,
    "expired_at": "2025-12-28T15:30:00Z",
    ...
  }
}
```

---

## 🔐 Authentication & Authorization

### Authentication
Uses JWT token from:
1. `Authorization: Bearer <token>` header (preferred)
2. `accessToken` cookie (fallback)

### Authorization
Protected endpoints require:
- Valid JWT token
- `role` field in token payload must be `'employer'`

### Token Payload Expected
```json
{
  "user_id": "uuid",
  "employer_id": 1,
  "role": "employer",
  "email": "employer@company.com",
  "iat": 1703750000,
  "exp": 1704354800
}
```

---

## 🧪 Testing the APIs

### Using cURL

#### Create Job (Employer)
```bash
curl -X POST http://localhost:8017/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "job_title": "Backend Developer",
    "job_type": "full-time",
    "description": "We are looking for a backend developer",
    "salary_min": 15000000,
    "salary_max": 25000000,
    "tag_ids": [1, 2],
    "location_ids": [1],
    "skill_ids": ["SK001"]
  }'
```

#### Get Jobs (Public)
```bash
curl http://localhost:8017/api/jobs?page=1&limit=10
```

#### Update Job (Employer)
```bash
curl -X PUT http://localhost:8017/api/jobs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "job_title": "Senior Backend Developer",
    "salary_min": 20000000
  }'
```

#### Delete Job (Employer)
```bash
curl -X DELETE http://localhost:8017/api/jobs/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 File Structure

```
src/BE-server/src/
├── controllers/
│   └── job.controller.js ✅ (Updated)
├── services/
│   └── job.service.js ✅ (Updated)
├── repositories/
│   └── job.repo.js ✅ (Updated)
└── routes/
    └── job.route.js ✅ (Updated)
```

---

## ✅ Checklist - All Complete

- [x] Repository CRUD methods
- [x] Service business logic
- [x] Controller endpoints
- [x] Routes with authentication
- [x] Permission checks (employer ownership)
- [x] Auto-calculate expiry date
- [x] Handle job relationships (tags, locations, skills)
- [x] Error handling
- [x] Documentation

---

## 🚀 Next Steps (Optional Enhancements)

### Validation Layer
- [ ] Create validation schemas using Joi or Zod
- [ ] Add validation middleware

### Testing
- [ ] Unit tests for services
- [ ] Integration tests for endpoints
- [ ] Test permission checks

### Swagger Documentation
- [ ] Update swagger.yml with new endpoints
- [ ] Add request/response examples

### Advanced Features
- [ ] Job status field (draft, published, expired, archived)
- [ ] Soft delete instead of hard delete
- [ ] Job versioning/history
- [ ] Bulk operations
- [ ] Advanced search filters

---

## 💡 Important Notes

> [!WARNING]
> **Auth Middleware Requirement**: The protected endpoints expect `req.user.employer_id` to be set by the auth middleware. Make sure your authentication system populates this field in the token payload.

> [!IMPORTANT]
> **Database Relations**: When updating tags, locations, or skills, the system removes all existing relations and adds the new ones. This is a complete replacement, not an append operation.

> [!TIP]
> **Auto Expiry**: If no `expired_at` is provided when creating a job, the system automatically sets it to 30 days from the creation date.

---

## 🎉 Implementation Status

**Task 2.2: Job Management APIs - Full CRUD** ✅ **COMPLETE**

All endpoints have been implemented and are ready for testing!
