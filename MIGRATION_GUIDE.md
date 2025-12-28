# Quick Migration Guide - Frontend Refactoring

## For Developers Working on This Project

### What Changed?

The frontend folder structure has been reorganized for better maintainability. **No business logic or UI behavior changed** - only file locations and import paths.

---

## 📍 Quick Reference: Where Did My Files Go?

### Components

| Old Path | New Path | Notes |
|----------|----------|-------|
| `components/Card.jsx` | `components/common/Card.jsx` | Shared UI |
| `components/SearchBar.jsx` | `components/common/SearchBar.jsx` | Shared UI |
| `components/Filters.jsx` | `components/common/Filters.jsx` | Shared UI |
| `components/SectionTitle.jsx` | `components/common/SectionTitle.jsx` | Shared UI |
| `components/JobCard.jsx` | `components/job/JobCard.jsx` | Job-related |
| `components/SimpleJobCard.jsx` | `components/job/SimpleJobCard.jsx` | Job-related |
| `components/companyCard.jsx` | `components/job/CompanyCard.jsx` | **Renamed** to PascalCase |
| `components/EmployerCard.jsx` | `components/employer/EmployerCard.jsx` | Employer-specific |
| `components/EmployerHeader.jsx` | `components/employer/EmployerHeader.jsx` | Employer-specific |

### Pages

| Old Path | New Path | Category |
|----------|----------|----------|
| `pages/Home.jsx` | `pages/public/Home.jsx` | Public |
| `pages/Jobs.jsx` | `pages/public/Jobs.jsx` | Public |
| `pages/JobDetail.jsx` | `pages/public/JobDetail.jsx` | Public |
| `pages/Companies.jsx` | `pages/public/Companies.jsx` | Public |
| `pages/JobSeekerLogin.jsx` | `pages/auth/JobSeekerLogin.jsx` | Auth |
| `pages/JobSeekerRegister.jsx` | `pages/auth/JobSeekerRegister.jsx` | Auth |
| `pages/EmployerLogin.jsx` | `pages/auth/EmployerLogin.jsx` | Auth |
| `pages/EmployerRegister.jsx` | `pages/auth/EmployerRegister.jsx` | Auth |
| `pages/EmployerLanding.jsx` | `pages/employer/EmployerLanding.jsx` | Employer |
| `pages/EmployerDashboard.jsx` | `pages/employer/EmployerDashboard.jsx` | Employer |

---

## 🔧 How to Update Your Import Statements

### If you're working in a **public page** (e.g., Home.jsx):

**Before:**
```javascript
import SearchBar from "../components/SearchBar.jsx"
import JobCard from "../components/JobCard.jsx"
```

**After:**
```javascript
import SearchBar from "../../components/common/SearchBar.jsx"
import JobCard from "../../components/job/JobCard.jsx"
```

### If you're working in **main.jsx**:

**Before:**
```javascript
import Home from './pages/Home.jsx'
```

**After:**
```javascript
import Home from './pages/public/Home.jsx'
```

### If you're adding a **new component**:

Ask yourself:
- Is it shared across multiple features? → `components/common/`
- Is it job/company specific? → `components/job/`
- Is it employer-specific? → `components/employer/`

---

## 🚨 Common Issues & Solutions

### Issue: "Module not found" error

**Solution:** Check your import path depth. From a public page, you need `../../components/`, not `../components/`

### Issue: "Cannot find module 'CompanyCard'"

**Solution:** The file was renamed from `companyCard.jsx` to `CompanyCard.jsx` (PascalCase). Update your import.

### Issue: VSCode autocomplete showing old paths

**Solution:** Restart VSCode or run the TypeScript server restart command: `Ctrl+Shift+P` → "Restart TS Server"

---

## 🧪 Testing After Your Changes

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Check browser console** for any import errors

3. **Test the page** you modified - make sure it renders correctly

4. **Check related pages** - if you modified a shared component, test pages that use it

---

## 💡 Best Practices Going Forward

1. **New components should follow the new structure**
   - Put shared components in `components/common/`
   - Group feature-specific components appropriately

2. **Use PascalCase for component files**
   - ✅ `MyComponent.jsx`
   - ❌ `myComponent.jsx`

3. **Keep business logic unchanged**
   - Only reorganize structure and imports
   - Don't mix refactoring with feature changes

4. **Import paths should be relative**
   - Use `../../components/` not absolute paths
   - This ensures consistency across the project

---

## 🤝 Need Help?

- Check the detailed summary: `FRONTEND_REFACTORING_SUMMARY.md`
- Look at existing imports in `Home.jsx` or `main.jsx` for reference
- Ask the team if you're unsure where a new component should go

---

**Remember: Same app, same features, just better organized!** 🎉
