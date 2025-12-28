# Frontend Folder Structure - Visual Overview

## 🎯 New Structure at a Glance

```
src/FE-client/src/
│
├── 📁 assets/                    # Static files (images, logos)
│   ├── banner/
│   ├── employer/
│   ├── logo/
│   ├── logoAdvertise/
│   ├── logoBank/
│   └── logocompanies/
│
├── 🧩 components/               # All React components
│   │
│   ├── 🔷 common/              # Shared across entire app
│   │   ├── Card.jsx            # Generic card component
│   │   ├── Filters.jsx         # Filter controls
│   │   ├── SearchBar.jsx       # Main search input
│   │   └── SectionTitle.jsx    # Section headers
│   │
│   ├── 💼 job/                 # Job & Company features
│   │   ├── JobCard.jsx         # Job listing card
│   │   ├── SimpleJobCard.jsx   # Compact job card
│   │   └── CompanyCard.jsx     # Company profile card
│   │
│   └── 🏢 employer/            # Employer-only components
│       ├── EmployerCard.jsx    # Employer feature card
│       └── EmployerHeader.jsx  # Employer navigation
│
├── 📐 layouts/                  # Page layout wrappers
│   ├── MainLayout.jsx          # Public pages wrapper
│   └── EmployerLayout.jsx      # Employer pages wrapper
│
├── 📄 pages/                    # All page components
│   │
│   ├── 🌍 public/              # No authentication required
│   │   ├── Home.jsx            # Landing page
│   │   ├── Jobs.jsx            # Job listings
│   │   ├── JobDetail.jsx       # Single job page
│   │   └── Companies.jsx       # Company directory
│   │
│   ├── 🔐 auth/                # Login & Registration
│   │   ├── JobSeekerLogin.jsx
│   │   ├── JobSeekerRegister.jsx
│   │   ├── EmployerLogin.jsx
│   │   └── EmployerRegister.jsx
│   │
│   └── 👔 employer/            # Employer dashboard
│       ├── EmployerLanding.jsx  # Employer home
│       └── EmployerDashboard.jsx # Job posting management
│
├── App.jsx                      # Root component with Header/Footer
├── App.css
├── main.jsx                     # Entry point + routing
└── index.css

```

---

## 🗂️ Organization Logic

### Components are grouped by:

#### 1️⃣ **Common** (`components/common/`)
Used across **multiple features** and **all user types**

Examples:
- Search bars
- Generic cards
- Filters
- Section titles

#### 2️⃣ **Job** (`components/job/`)
Specific to **job listings** and **company profiles**

Examples:
- Job cards
- Company cards
- Job-specific filters

#### 3️⃣ **Employer** (`components/employer/`)
Only used in the **employer dashboard** area

Examples:
- Employer navigation
- Employer-specific UI elements

---

### Pages are grouped by:

#### 🌍 **Public** (`pages/public/`)
**No login required** - accessible to everyone

Routes:
- `/` → Home.jsx
- `/jobs` → Jobs.jsx
- `/jobs/:id` → JobDetail.jsx
- `/companies` → Companies.jsx

#### 🔐 **Auth** (`pages/auth/`)
**Login & registration** pages for both user types

Routes:
- `/login` → JobSeekerLogin.jsx
- `/register` → JobSeekerRegister.jsx
- `/employer/login` → EmployerLogin.jsx
- `/employer/register` → EmployerRegister.jsx

#### 👔 **Employer** (`pages/employer/`)
**Employer-only** dashboard and features

Routes:
- `/employer` → EmployerLanding.jsx
- `/employer/dashboard` → EmployerDashboard.jsx

---

## 📊 Import Path Cheat Sheet

### From a **Public Page** (e.g., `pages/public/Home.jsx`):

```javascript
// Common components
import SearchBar from "../../components/common/SearchBar.jsx"
import Card from "../../components/common/Card.jsx"

// Job components
import JobCard from "../../components/job/JobCard.jsx"
import CompanyCard from "../../components/job/CompanyCard.jsx"

// Employer components
import EmployerCard from "../../components/employer/EmployerCard.jsx"

// Assets
import logo from "../../assets/logo/vingroup.png"
```

### From an **Auth Page** (e.g., `pages/auth/JobSeekerLogin.jsx`):

```javascript
// No component imports typically needed
// Auth pages are self-contained with inline forms
```

### From an **Employer Page** (e.g., `pages/employer/EmployerDashboard.jsx`):

```javascript
// Common components
import SearchBar from "../../components/common/SearchBar.jsx"

// Employer components
import EmployerHeader from "../../components/employer/EmployerHeader.jsx"
```

### From **main.jsx** (routing):

```javascript
// Pages
import Home from './pages/public/Home.jsx'
import JobSeekerLogin from './pages/auth/JobSeekerLogin.jsx'
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx'

// Layouts
import EmployerLayout from './layouts/EmployerLayout.jsx'
```

---

## 🎨 Component Hierarchy

```
App.jsx (Root)
├── Header (inline in App.jsx)
├── <Outlet> (React Router)
│   │
│   ├── Public Pages (use Header + Footer from App.jsx)
│   │   ├── Home
│   │   │   ├── SearchBar (common)
│   │   │   ├── Card (common)
│   │   │   ├── SimpleJobCard (job)
│   │   │   └── EmployerCard (employer)
│   │   │
│   │   ├── Jobs
│   │   │   ├── Filters (common)
│   │   │   └── JobCard (job)
│   │   │
│   │   └── Companies
│   │       └── CompanyCard (job)
│   │
│   └── Employer Pages (use EmployerLayout)
│       └── EmployerLayout
│           ├── EmployerHeader (employer)
│           ├── <Outlet>
│           │   ├── EmployerLanding
│           │   └── EmployerDashboard
│           └── EmployerFooter (inline)
│
└── Footer (inline in App.jsx)
```

---

## 🔄 Data Flow (Unchanged)

```
User Interaction
      ↓
   Component
      ↓
  State Update
      ↓
    Re-render
```

**Note:** All state management, props, and data flow remain **exactly the same** as before. Only file locations changed!

---

## ✅ Quick Checklist for Adding New Features

When adding a **new component**:
- [ ] Is it shared? → `components/common/`
- [ ] Is it job-related? → `components/job/`
- [ ] Is it employer-only? → `components/employer/`
- [ ] Use PascalCase filename
- [ ] Export as default

When adding a **new page**:
- [ ] Is it public? → `pages/public/`
- [ ] Is it auth-related? → `pages/auth/`
- [ ] Is it employer-only? → `pages/employer/`
- [ ] Update route in `main.jsx`
- [ ] Add to appropriate layout

---

## 🚀 Benefits Summary

| Before | After |
|--------|-------|
| 🗂️ Flat structure | 📁 Feature-based folders |
| 🔍 Hard to find files | 📍 Clear categories |
| 🤷 Unclear ownership | 👥 Clear responsibility |
| 📈 Doesn't scale well | 🎯 Scales with features |

---

**Understanding the structure is key to maintaining it! Keep this guide handy.** 📚
