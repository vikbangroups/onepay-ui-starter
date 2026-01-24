# OnePay UI Starter - AI Agent Instructions

**Project**: Enterprise Payment Gateway UI  
**Tech Stack**: React 18 + TypeScript + Vite | React Router | Zod validation | React Hook Form | i18next  
**Key Constraints**: httpOnly cookies (security-first) | Role-based access control | Dynamic mock data from JSON

---

## Architecture Overview

### Data Flow
```
User → Login Component
  ↓ (phone/password)
authService.loginMock() → validate against JSON mock data
  ↓
AuthContext stores user data in memory (NO localStorage)
  ↓
ProtectedRoute checks authentication
  ↓
Role-dispatched components (Admin/Merchant/Viewer/Accountant)
```

### Project Structure
```
src/
├── components/      # UI components (colocated CSS)
├── services/        # API + auth logic (authService.ts, mockService.ts, csrf.ts)
├── context/         # React Context (AuthContext.tsx only)
├── hooks/           # Custom hooks (useLoginForm, usePhoneFormat, useAccess)
├── types/           # TypeScript interfaces (auth.ts, transaction.ts, etc.)
├── routes/          # ProtectedRoute wrapper
├── layouts/         # AppLayout wrapper
├── mock/            # JSON mock data (mockUsers.json, transactions.json, etc.)
└── styles/          # CSS hierarchy (globals → responsive → premium)
```

---

## Critical Security Patterns

### 1. **Authentication (httpOnly Cookies Only)**

```tsx
// ✅ CORRECT: AuthContext loads user on mount—NO token storage
useEffect(() => {
  const loadUser = async () => {
    const user = await getCurrentUser(); // GET /auth/me
    setUser(user); // Backend validates httpOnly cookie automatically
  };
  loadUser();
}, []);

// ❌ WRONG: Never use localStorage
localStorage.setItem('token', token); // XSS vulnerability
```

**Why httpOnly?** Backend validates every request via cookie (invisible to JavaScript). XSS attacker cannot steal tokens.

### 2. **CSRF Protection (Auto-Injected)**

```tsx
// In main.tsx:
import { setupCsrfInterceptor } from './services/csrf';
setupCsrfInterceptor(); // Called on app startup

// Axios automatically injects X-CSRF-Token header on POST/PUT/DELETE
// Backend validates token + cookie match before processing requests
```

**Debugging CSRF**: DevTools → Network → POST request → check for `X-CSRF-Token` header.

### 3. **Role-Based Access Control**

```tsx
// ✅ Component-level gating (secondary defense)
function ApprovalButton() {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null; // Don't render button
  return <button>Approve</button>;
}

// ⚠️ CRITICAL: Backend MUST validate role too (primary defense)
// Endpoint: POST /api/transactions/approve
// Backend: if (user.role !== 'admin') return 403 Forbidden;
```

**Pattern**: Use [ProtectedRoute](src/routes/ProtectedRoute) to enforce authentication, then role-dispatch components.

---

## Feature Development Workflow

### Add New Feature: Step 1-5

#### **Step 1: Define Role Permissions**
```tsx
// src/config/accessControl.ts
export const rolePermissions = {
  admin: ['approve_transactions', 'manage_users'],
  merchant: ['view_own_transactions'],
  viewer: ['view_assigned_transactions'],
  accountant: ['generate_reports'],
};
```

#### **Step 2: Add Mock Data (JSON)**
```json
// src/mock/mockUsers.json
{
  "users": [
    { "userId": "ADM-0001", "name": "Admin", "mobile": "+91...", "password": "Admin@123", "role": "admin" }
  ]
}
```

#### **Step 3: Add Route in App.tsx**
```tsx
<Route path="/new-feature" element={<NewFeaturePremium />} />
```

#### **Step 4: Create Role-Dispatching Component**
```tsx
// src/components/NewFeature/NewFeaturePremium.tsx
function NewFeaturePremium() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'admin': return <AdminNewFeatureView />;
    case 'merchant': return <MerchantNewFeatureView />;
    default: return <div>Access Denied</div>;
  }
}
```

#### **Step 5: Mock Service + Data Filtering**
```tsx
// src/services/mockService.ts
export const mockService = {
  getFeatureData: (filters: { userId?: string; role?: string }) => {
    const allData = [{ id: 1, merchantId: 'M001', ... }];
    
    // Filter by role
    if (filters.role === 'merchant') {
      return allData.filter(d => d.merchantId === filters.userId);
    }
    return allData; // Admin see all
  },
};
```

---

## Styling & Responsive Design

### CSS Load Order (in main.tsx)
```tsx
// This order prevents conflicts:
import './styles/globals.css';                    // 1. Base
import './styles/responsive.css';                 // 2. Shared responsive
import './styles/mobile-optimization.css';        // 3. Mobile (<576px)
import './styles/tablet-optimization.css';        // 4. Tablet (577-991px)
import './styles/desktop-optimization.css';       // 5. Desktop (992px+)
import './styles/large-screen-optimization.css';  // 6. Large (1920px+)
import './styles/premium-dashboard.css';          // 7. Premium variant
import './styles/design-tokens.css';    // CSS variables (--color-*, --spacing-*)
import './styles/animations.css';       // Keyframes
import './styles/accessibility.css';    // WCAG compliance
```

### Design Pattern

```css
/* Component: PaymentCard.css */

/* 1. Base (mobile-first) */
.payment-card {
  padding: var(--spacing-md);
  background: white;
  border-radius: 8px;
}

/* 2. Mobile-specific */
@media (max-width: 576px) {
  .payment-card {
    padding: var(--spacing-sm);
  }
}

/* 3. Tablet+ */
@media (min-width: 577px) {
  .payment-card {
    padding: var(--spacing-lg);
    margin: 0 var(--spacing-md);
  }
}

/* 4. Premium variant (desktop only) */
@media (min-width: 992px) {
  .payment-card.premium {
    background: linear-gradient(135deg, #667eea, #764ba2);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
}

/* 5. Accessibility (always applies) */
.payment-card:focus-within {
  outline: 2px solid var(--color-focus);
}
```

### Mobile Breakpoints
- **Mobile**: max-width 576px
- **Tablet**: 577px - 991px
- **Desktop**: 992px - 1919px
- **Large**: 1920px+

---

## Mock Data Architecture

### Decoupled JSON Files (NOT Hardcoded)
```
src/mock/
├── mockUsers.json         ← All login credentials
├── transactions.json      ← Transaction history
├── wallet.json           ← Wallet balances per user
├── cards.json            ← Payment cards
├── beneficiaries.json    ← Bank accounts
└── data/
    ├── users.ts          ← Dynamic loader (reads JSON at runtime)
    └── transactions.ts   ← Dynamic loader
```

### Usage
```tsx
// src/services/authService.ts
async function loginMock(phone: string, password: string) {
  const users = await loadUsersFromJSON(); // Reads from JSON
  const user = users.find(u => u.mobile === phone);
  if (!user || user.password !== password) throw new Error('Invalid');
  return user;
}

// Real API Integration: Just replace fetch with api.post()
// const response = await api.post('/auth/login', { phone, password });
```

---

## Common Workflows

### Add a Form with Validation
1. Create Zod schema in component or `types/`
2. Use `useForm()` from React Hook Form
3. Example: [useLoginForm](src/hooks/useLoginForm.ts)

### Add Internationalization (i18n)
1. Use `useTranslation()` from react-i18next
2. Example: Check [i18next config](src/config/)
3. Store translations in locale JSON files

### Create Admin Feature (Transactions Approval)
1. Check [AdminDashboardV2](src/components/AdminDashboardV2) for pattern
2. Filter data by role (only admin sees approvals)
3. Mock backend delay: `await new Promise(resolve => setTimeout(resolve, 300))`

### Handle API Errors
```tsx
try {
  const response = await api.get('/endpoint');
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired → logout
  } else if (error.response?.status === 403) {
    // Access denied → show error toast
  }
}
```

---

## Build & Dev Commands

```bash
npm run dev      # Start dev server (port 5173, proxies /api to localhost:3000)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## Testing Credentials (From mockUsers.json)

| Role | Email | Phone | Password |
|------|-------|-------|----------|
| Admin | rajesh@fintech.com | +919876543210 | Admin@123 |
| Merchant | arjun@business.com | +919876543211 | Merchant@123 |
| Accountant | priya@accounts.com | +919876543212 | Account@123 |
| Viewer | vikram@view.com | +919876543213 | Viewer@123 |
| Support | shreya@support.com | +919876543214 | Support@123 |

---

## Real Backend Integration Checklist

- [ ] Replace `mockService` calls with `api.post('/endpoint')`
- [ ] Backend returns httpOnly cookie with JWT (no token in JSON body)
- [ ] Backend validates role in `/api/*` endpoints (not just frontend UI)
- [ ] CSRF token flow working (X-CSRF-Token header auto-injected)
- [ ] `/auth/me` endpoint returns current user (AuthContext calls on mount)
- [ ] `/auth/logout` clears httpOnly cookie
- [ ] All POST/PUT/DELETE requests validated on backend

---

## Key Files Reference

| File | Purpose |
|------|---------|
| [src/context/AuthContext.tsx](src/context/AuthContext.tsx) | User authentication state |
| [src/services/authService.ts](src/services/authService.ts) | Login/logout logic |
| [src/services/csrf.ts](src/services/csrf.ts) | CSRF interceptor setup |
| [src/routes/ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx) | Route authentication guard |
| [src/App.tsx](src/App.tsx) | Route definitions |
| [src/main.tsx](src/main.tsx) | App initialization (CSS load order!) |
| [src/types/auth.ts](src/types/auth.ts) | Auth TypeScript interfaces |
| [DYNAMIC_DATA_ARCHITECTURE.md](DYNAMIC_DATA_ARCHITECTURE.md) | Mock data strategy |

---

**Last Updated**: January 24, 2026  
**Next Priority**: Real backend integration (replace mock services with API calls)
