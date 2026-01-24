# OnePay UI Starter - AI Agent Instructions

## Project Overview

OnePay Enterprise Payment Gateway UI—a role-based React application for managing payments, transactions, and financial operations. Five user roles (Admin, Merchant, Viewer, Accountant, generic user) each have distinct dashboards and feature access.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **Styling**: CSS modules + responsive cascades (mobile/tablet/desktop/premium variants)
- **HTTP Client**: Axios with CSRF interceptors
- **Auth**: React Context (httpOnly cookie-based, backend-managed)
- **Validation**: Zod for form schemas
- **i18n**: React-i18next for internationalization
- **Forms**: React Hook Form

---

## Part 1: Security Patterns (Deep Dive)

### 🔐 Authentication Flow - No localStorage

**Why Not localStorage?**
- XSS vulnerability: `document.querySelector('*')` can steal tokens
- Cross-tab leaks in shared browsers
- Production OnePay handles sensitive financial data

**Correct Pattern:**
```tsx
// ❌ WRONG - Never do this
localStorage.setItem('token', token); // XSS attack vector

// ✅ CORRECT - Backend manages token in httpOnly cookie
// Browser automatically includes cookie in all API requests
// Attacker cannot access via JavaScript

// AuthContext.tsx
useEffect(() => {
  const loadUser = async () => {
    try {
      // Backend returns user data + sets httpOnly cookie automatically
      const currentUser = await getCurrentUser(); // GET /auth/me
      setUser(currentUser);
    } catch (err) {
      setUser(null); // redirect to login
    }
  };
  loadUser();
}, []);
```

**httpOnly Cookie Lifecycle:**
1. User logs in → Backend validates credentials
2. Backend creates JWT/session → stores in **httpOnly, Secure, SameSite=Strict** cookie
3. Browser auto-includes cookie in `Authorization` header for all requests to same origin
4. Frontend never sees/stores token—React Context only holds user data
5. On logout → Backend clears cookie → Frontend clears auth state

**When Integrating Real Backend:**
- Ensure backend sets `Set-Cookie` header with: `HTTPOnly=true`, `Secure=true` (HTTPS), `SameSite=Strict`
- Do NOT return token in JSON response body
- Frontend calls `/auth/me` on app mount (via `AuthContext.tsx` `useEffect`)
- If `/auth/me` fails (401), user is unauthenticated → redirect to `/login`

---

### 🛡️ CSRF Protection (Production-Critical)

**How It Works:**
```tsx
// src/services/csrf.ts
// 1. App startup → setupCsrfInterceptor() called in main.tsx
// 2. First POST/PUT/DELETE request → getCsrfToken() fetches from /auth/csrf-token
// 3. Token cached in memory (not localStorage)
// 4. Interceptor injects X-CSRF-Token header on all state-changing requests

// Example Network Tab (after CSRF setup):
// POST /api/transactions/approve
// Headers:
//   X-CSRF-Token: abc123xyz...
//   Cookie: sessionId=...httpOnly... (auto-included, invisible to JS)

// Interceptor code:
api.interceptors.request.use(async (config) => {
  if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
    const token = await getCsrfToken(); // Memory cache, reuse
    config.headers['X-CSRF-Token'] = token; // Injected automatically
  }
  return config;
});
```

**Testing CSRF in Production:**
1. Open DevTools → Network tab
2. Perform transaction (e.g., approve payment)
3. Look for `POST /api/transactions/...`
4. Verify `X-CSRF-Token` header present
5. If missing → CSRF interceptor not configured correctly

**Common CSRF Failures:**
```
❌ Error: "CSRF token expired"
   → Token cache stale. Cause: Backend token TTL < request timeout
   → Solution: Backend should return 403 with "csrf-expired" → Frontend calls resetCsrfToken(), retry

❌ Error: "CSRF token mismatch"
   → X-CSRF-Token was sent but doesn't match backend's expected token
   → Solution: Verify backend validates token from same origin, not from header alone

✅ Correct: Silent success
   → Backend verifies token matches session, proceeds with transaction
```

---

### 🔑 Protected Routes & Access Control

**Route Protection (AuthContext ensures only authenticated users pass):**
```tsx
// src/routes/ProtectedRoute - gates all admin/merchant dashboards
function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  
  return <Outlet />; // Render nested routes (dashboards)
}

// src/App.tsx - ProtectedRoute wraps all dashboards
<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route path="/admin/dashboard" element={<AdminDashboardV2 />} />
    <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
  </Route>
</Route>
```

**Role-Based Feature Gating (within components):**
```tsx
// ✅ Correct: Check role before rendering sensitive features
function TransactionApprovalButton({ transaction }) {
  const { user } = useAuth();
  
  // Only admin can approve
  if (user?.role !== 'admin') {
    return null; // Don't render button
  }
  
  return <button onClick={() => approveTransaction(transaction.id)}>Approve</button>;
}

// ❌ WRONG: Hiding button but endpoint not protected
// User could still POST /api/transactions/approve if they find the endpoint
// Backend MUST also validate user.role === 'admin' before processing
```

**Access Config Pattern (when building new features):**
```tsx
// src/config/accessControl.ts - define role permissions
export const rolePermissions = {
  admin: ['approve_transactions', 'view_all_users', 'manage_fees'],
  merchant: ['view_own_transactions', 'request_payout'],
  viewer: ['view_own_transactions'],
  accountant: ['view_all_transactions', 'generate_reports'],
};

// Gating logic:
function hasPermission(userRole: string, permission: string): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

// Usage:
if (hasPermission(user.role, 'approve_transactions')) {
  return <ApprovalPanel />;
}
```

---

## Part 2: Role-Based Workflow (Adding New Features)

### Step 1: Define Feature Scope by Role

**Example: "Monthly Settlement Report"**

| Role | Access | Permissions |
|------|--------|-------------|
| Admin | Full access, all merchants | View, export, drill-down |
| Merchant | Own settlement only | View own, export as CSV |
| Viewer | View only, assigned merchants | Read-only |
| Accountant | All settlements | View, export, reconcile |
| User | None | Hidden feature |

### Step 2: Create Role-Specific Components

```tsx
// Structure:
src/components/SettlementReport/
├── SettlementReportPremium.tsx       // Main entry (router points here)
├── AdminSettlementView.tsx            // Admin variant (all data)
├── MerchantSettlementView.tsx         // Merchant variant (filtered)
├── ViewerSettlementView.tsx           // Viewer variant (read-only)
├── AccountantSettlementView.tsx       // Accountant variant (reconcile)
└── SettlementReportPremium.css

// SettlementReportPremium.tsx - dispatcher
function SettlementReportPremium() {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'admin':
      return <AdminSettlementView />;
    case 'merchant':
      return <MerchantSettlementView />;
    case 'viewer':
      return <ViewerSettlementView />;
    case 'accountant':
      return <AccountantSettlementView />;
    default:
      return <div>Access Denied</div>;
  }
}
```

### Step 3: Add Route (App.tsx)

```tsx
// Add under ProtectedRoute → AppLayout
<Route path="/settlements" element={<SettlementReportPremium />} />
<Route path="/settlement-report" element={<SettlementReportPremium />} />
```

### Step 4: Mock Data + Data Filtering

```tsx
// src/services/mockService.ts - add new data method
export const mockService = {
  // ... existing methods ...
  
  getSettlements: (filters: { userId?: string; role?: string }) => {
    const allSettlements = [
      { id: 1, merchantId: 'M001', amount: 50000, period: '2026-01', status: 'completed' },
      { id: 2, merchantId: 'M002', amount: 75000, period: '2026-01', status: 'pending' },
    ];
    
    // Filter by role
    if (filters.role === 'merchant') {
      return allSettlements.filter(s => s.merchantId === filters.userId);
    }
    if (filters.role === 'viewer') {
      return allSettlements.filter(s => s.merchantId === assignedMerchantsFor(filters.userId));
    }
    return allSettlements; // Admin/accountant see all
  },
};

// MerchantSettlementView.tsx - use filtered data
function MerchantSettlementView() {
  const { user } = useAuth();
  const [settlements, setSettlements] = useState([]);
  
  useEffect(() => {
    // Only fetch own settlements
    const data = mockService.getSettlements({
      userId: user?.id,
      role: user?.role,
    });
    setSettlements(data);
  }, [user]);
  
  return (<table>{/* render settlements */}</table>);
}
```

### Step 5: Real API Integration

```tsx
// When ready to connect real backend, replace mockService with API call:

// Before (mock):
const data = mockService.getSettlements({ userId, role });

// After (real API):
const response = await api.get('/api/settlements', {
  params: { period: selectedMonth }
  // Backend validates user.role via httpOnly cookie
  // Returns only settlements user is allowed to see
});
const data = response.data;

// Backend validation (pseudo):
// GET /api/settlements
// if (user.role === 'merchant') {
//   return settlements.filter(s => s.merchantId === user.merchantId);
// }
// if (user.role === 'viewer') {
//   return settlements.filter(s => assignedMerchantsInclude(user.viewerId, s.merchantId));
// }
// return settlements; // admin/accountant
```

---

## Part 3: Styling Strategy & Conflict Resolution

### CSS Structure Recap
```
src/styles/
├── globals.css                    # Base styles (colors, fonts)
├── design-tokens.css              # CSS variables (--color-*, --spacing-*)
├── responsive.css                 # Shared responsive rules
├── mobile-optimization.css        # Mobile overrides (max 576px)
├── tablet-optimization.css        # Tablet scales (577px - 991px)
├── desktop-optimization.css       # Desktop (992px - 1919px)
├── large-screen-optimization.css  # Large screens (1920px+)
├── premium-dashboard.css          # Premium feature styles
├── premium-enterprise-menu.css    # Premium menu/sidebar
├── premium-enterprise-sidebar.css
├── animations.css                 # Keyframes
├── accessibility.css              # WCAG compliance
└── layout.css                     # Grid/flex layouts

Component-level:
src/components/Dashboard/
├── Dashboard.tsx
└── Dashboard.css                  # Component-specific styles (colocated)
```

### Mobile-First + Override Pattern

**Problem:** CSS conflicts when multiple global sheets overlap

**Solution: Specificity Ladder**
```css
/* globals.css - base (mobile-first) */
.button {
  padding: 8px 12px;
  font-size: 14px;
}

/* mobile-optimization.css - reinforce mobile */
@media (max-width: 576px) {
  .button {
    font-size: 12px;
    width: 100%; /* Full width on mobile */
  }
}

/* tablet-optimization.css - scale up */
@media (min-width: 577px) and (max-width: 991px) {
  .button {
    font-size: 14px;
    width: auto;
  }
}

/* desktop-optimization.css - standard layout */
@media (min-width: 992px) {
  .button {
    font-size: 16px;
    padding: 10px 16px;
  }
}

/* premium-dashboard.css - premium variant */
@media (min-width: 992px) {
  .button.premium {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); /* Override */
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
}

/* Component-level (Dashboard.css) - highest priority */
.button.dashboard-action {
  margin-top: 12px; /* Component-specific spacing */
}
```

**Load Order Matters (in main.tsx):**
```tsx
import './styles/globals.css';           // 1. Base
import './styles/responsive.css';        // 2. Shared responsive
import './styles/mobile-optimization.css';       // 3. Mobile
import './styles/tablet-optimization.css';       // 4. Tablet
import './styles/desktop-optimization.css';      // 5. Desktop
import './styles/large-screen-optimization.css'; // 6. Large
import './styles/premium-dashboard.css';         // 7. Premium
import './styles/design-tokens.css';    // 8. Variables (can override above)
import './styles/animations.css';       // 9. Keyframes
import './styles/accessibility.css';    // 10. WCAG
```

### Debugging CSS Conflicts

**Problem: Button looks wrong on mobile**

```css
/* Step 1: Identify conflict source */
/* In DevTools, inspect element → computed styles */
/* Look for green (applied) vs gray (overridden) rules */

/* Step 2: Common causes */
✗ Selector specificity too low (`.button` < `.dashboard .button`)
✗ Media query wrong breakpoint (max-width: 600px when layout breaks at 576px)
✗ Component CSS loaded before global responsive CSS
✗ !important in wrong place (hard to override later)

/* Step 3: Resolution checklist */
☑ Verify media query breakpoints align:
  Mobile:  max-width: 576px
  Tablet:  577px - 991px
  Desktop: 992px+
  Large:   1920px+

☑ Check selector specificity (target with same specificity or higher)
☑ Ensure responsive CSS file loaded after base CSS
☑ Use !important only as last resort (mark in comment why)

/* Correct override: */
/* mobile-optimization.css */
@media (max-width: 576px) {
  .dashboard .button.primary {  /* Match dashboard context */
    width: 100%;
    font-size: 12px !important;  /* /* MOBILE: Must override premium gradient */
  }
}
```

### Adding New Premium Component Without Breaking Production

**Pattern:**
```css
/* Component: PremiumSettlementCard.css */

/* 1. Base (shared across all screens) */
.premium-settlement-card {
  border-radius: 8px;
  padding: var(--spacing-lg);
  background: white;
}

/* 2. Mobile-specific */
@media (max-width: 576px) {
  .premium-settlement-card {
    padding: var(--spacing-md);
    margin: 0 var(--spacing-sm);
  }
}

/* 3. Premium variant (desktop only) */
@media (min-width: 992px) {
  .premium-settlement-card.premium {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
}

/* 4. Accessibility (no media query—always applies) */
.premium-settlement-card:focus-within {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

**Production Safety Checklist:**
- [ ] Component CSS uses only existing CSS variables
- [ ] No new color globals (use existing `--color-*`)
- [ ] Mobile breakpoint tested (375px, 576px)
- [ ] Tablet tested (768px, 991px)
- [ ] Desktop tested (1920px, 2560px)
- [ ] Premium variant only applies at stated breakpoint
- [ ] Accessibility `:focus-within`, `:hover` states tested

---

## Part 4: Admin Transactions - Pseudocode & Filtering

### Transaction Data Model
```tsx
interface Transaction {
  id: string;
  merchantId: string;        // Who initiated it
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;         // ISO timestamp
  approvedAt?: string;
  approvedBy?: string;       // Admin ID who approved
  notes?: string;
}

interface AdminUser {
  id: string;
  role: 'admin';
}

interface MerchantUser {
  id: string;
  merchantId: string;
  role: 'merchant';
}
```

### Filtering Logic by Role

```tsx
// src/services/mockService.ts

function getTransactionsForUser(userId: string, userRole: string) {
  const allTransactions = [
    { id: 'T1', merchantId: 'M001', amount: 50000, status: 'pending', createdAt: '2026-01-20' },
    { id: 'T2', merchantId: 'M002', amount: 75000, status: 'approved', createdAt: '2026-01-19' },
    { id: 'T3', merchantId: 'M001', amount: 20000, status: 'completed', createdAt: '2026-01-18' },
  ];
  
  // Role: ADMIN → See all transactions
  if (userRole === 'admin') {
    return allTransactions;
    // Can filter by: status, dateRange, merchantId (dropdown)
  }
  
  // Role: MERCHANT → See only own transactions
  if (userRole === 'merchant') {
    return allTransactions.filter(t => t.merchantId === userId);
    // Cannot see status 'rejected' (backend hides)
    // Cannot approve (button not shown in component)
  }
  
  // Role: VIEWER → See read-only, assigned merchants only
  if (userRole === 'viewer') {
    const assignedMerchants = ['M001', 'M002']; // From user profile
    return allTransactions.filter(t => assignedMerchants.includes(t.merchantId));
    // Actions (approve/reject) hidden
  }
  
  // Role: ACCOUNTANT → See all, export/reconcile
  if (userRole === 'accountant') {
    return allTransactions;
    // Can export CSV, reconcile batches
    // Cannot approve individual transactions
  }
  
  // Default: empty
  return [];
}

// Usage in component:
function AdminTransactionsPanel() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const filtered = getTransactionsForUser(user.id, user.role);
    setTransactions(filtered);
  }, [user]);
  
  return (
    <table>
      {transactions.map(tx => (
        <tr key={tx.id}>
          <td>{tx.id}</td>
          <td>${tx.amount}</td>
          <td>{tx.status}</td>
          {user.role === 'admin' && (
            <td>
              <button onClick={() => approveTransaction(tx.id)}>Approve</button>
              <button onClick={() => rejectTransaction(tx.id)}>Reject</button>
            </td>
          )}
        </tr>
      ))}
    </table>
  );
}
```

### Backend Validation (MUST Implement)

**Critical:** Frontend filtering is UX only. Backend MUST also validate.

```typescript
// Backend pseudocode (Node.js/Express)

app.get('/api/transactions', async (req, res) => {
  const user = req.user; // From httpOnly cookie
  let query: any = {};
  
  // Frontend can't bypass—backend re-validates
  if (user.role === 'merchant') {
    query.merchantId = user.merchantId; // Force filter
    // Never return 'rejected' status
    query.status = { $ne: 'rejected' };
  } else if (user.role === 'viewer') {
    query.merchantId = { $in: user.assignedMerchants };
    query.status = { $ne: 'rejected' };
  } else if (user.role === 'admin') {
    // No filter—see all
  } else {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const transactions = await Transaction.find(query);
  res.json(transactions);
});
```

---

## Part 5: Real API Integration (Swap Mock → Real)

### Migration Checklist

**Phase 1: Parallel Running (Test)**
```tsx
// Keep mock service, add real API calls in new feature branch
// Test real API against mock in separate environment

// src/services/transactionService.ts (NEW)
export async function getTransactions(filters: any) {
  try {
    const response = await api.get('/api/transactions', { params: filters });
    return response.data; // Use real data
  } catch (err) {
    console.error('Real API failed, falling back to mock');
    return mockService.getTransactions(filters); // Fallback
  }
}
```

**Phase 2: Feature Flag (Gradually Rollout)**
```tsx
// environment.ts - toggle real API per environment
export const env = {
  useRealApi: process.env.VITE_USE_REAL_API === 'true', // false in dev, true in prod
};

// Usage:
if (env.useRealApi) {
  data = await getTransactionsFromAPI();
} else {
  data = mockService.getTransactions();
}
```

**Phase 3: Deprecate Mock (After Validation)**
```tsx
// Only after 2+ weeks in production with real API
// Delete mockService.ts, mockOtpService.ts
// Update all imports to real API services
```

### Response Shape Validation

**Ensure real API matches mock response:**
```tsx
// Mock response shape:
{
  id: 'T1',
  merchantId: 'M001',
  amount: 50000,
  status: 'pending',
  createdAt: '2026-01-20T10:30:00Z',
}

// Real API must return same shape
// If backend returns different field names:
// - Map in service layer (don't change component)
// - e.g., `txn_id` → `id`, `amt` → `amount`

export function mapBackendTransaction(raw: any) {
  return {
    id: raw.txn_id,
    merchantId: raw.merchant_id,
    amount: raw.amt,
    status: raw.status,
    createdAt: raw.created_at,
  };
}
```

### Error Handling During Integration

```tsx
// Handle real API errors gracefully
async function loadTransactions() {
  try {
    setLoading(true);
    const data = await getTransactionsFromAPI();
    setTransactions(data);
    setError(null);
  } catch (err: any) {
    if (err.response?.status === 401) {
      // Token expired → logout user
      logout();
    } else if (err.response?.status === 403) {
      // Role not allowed
      setError('You do not have permission to view transactions');
    } else if (err.response?.status === 500) {
      // Server error
      setError('Backend service temporarily unavailable. Please try again.');
    } else {
      // Network error
      setError('Network error. Please check your connection.');
    }
  } finally {
    setLoading(false);
  }
}
```

---

## Part 6: Testing & Production Checklist

### Security Tests
- [ ] Token NOT in localStorage or sessionStorage (DevTools → Application)
- [ ] CSRF token present in POST/PUT/DELETE (DevTools → Network → Headers)
- [ ] httpOnly cookie set (DevTools → Application → Cookies → `Secure` ✓ `HttpOnly` ✓)
- [ ] Logout clears cookie (check cookie removed after logout)
- [ ] Protected routes redirect unauthenticated users to /login
- [ ] Role-specific buttons hidden for non-permission users
- [ ] Backend rejects unauthorized role access (even if UI sends request)

### Role-Based Tests
- [ ] Admin: Can see all transactions, approve/reject
- [ ] Merchant: Can see only own transactions, cannot approve
- [ ] Viewer: Can see assigned merchants, read-only
- [ ] Accountant: Can see all, export, reconcile (not approve)
- [ ] Generic User: Dashboard accessible but limited features
- [ ] Role change: Re-login with different user → correct dashboard appears

### Responsive Tests
- [ ] Mobile (375px): All text readable, buttons tappable (min 44px)
- [ ] Tablet (768px): 2-column layout, navigation fits
- [ ] Desktop (1920px): Full layout, premium styles applied
- [ ] Large (2560px): No overflow, centered content
- [ ] Premium toggles: Only on desktop+, does not break mobile

### API Integration Tests
- [ ] Real API response maps to component correctly
- [ ] Error states handled (401, 403, 500)
- [ ] Network timeout shows loading spinner
- [ ] Retry logic works after transient 500 error
- [ ] CSRF token refreshed on token expiry
- [ ] Pagination works (if applicable)

### Production Deployment
- [ ] Environment variables set (VITE_API_BASE_URL points to prod backend)
- [ ] HTTPS enabled (CSRF token requires Secure flag on cookies)
- [ ] Build runs without errors: `npm run build`
- [ ] Production build previewed: `npm run preview`
- [ ] CSP headers configured (if applicable)
- [ ] Monitoring/logging enabled
- [ ] Rollback plan in place

---

## Part 7: Key Files (Quick Reference)

| File | Purpose | Modify When |
|------|---------|------------|
| [src/main.tsx](src/main.tsx) | App root, CSRF setup, auth wrap | Adding global providers |
| [src/App.tsx](src/App.tsx) | All routes, role-based dashboards | Adding new routes/dashboards |
| [src/context/AuthContext.tsx](src/context/AuthContext.tsx) | User state, login/logout | Changing auth flow |
| [src/routes/ProtectedRoute](src/routes/ProtectedRoute) | Route guarding | Changing auth logic |
| [src/services/api.ts](src/services/api.ts) | Axios instance | Proxy config, interceptors |
| [src/services/csrf.ts](src/services/csrf.ts) | CSRF token injection | Token strategy changes |
| [src/services/mockService.ts](src/services/mockService.ts) | Mock API data | When testing new features |
| [src/config/accessControl.ts](src/config/accessControl.ts) | Role permissions | Adding new role privileges |
| [src/config/environment.ts](src/config/environment.ts) | Environment config | Backend URL, feature flags |
| [src/components/Premium/](src/components/Premium/) | Design system | Adding new premium UI blocks |
| [src/styles/](src/styles/) | Global CSS + responsive | Layout, colors, breakpoints |

---

## Part 8: Common Mistakes & Prevention

| Mistake | Consequence | Prevention |
|---------|------------|-----------|
| **Store token in `localStorage`** | XSS vulnerability—attacker steals token | Use httpOnly cookies only; review `AuthContext` pattern |
| **Skip CSRF token in POST/PUT/DELETE** | CSRF attack possible | Verify `X-CSRF-Token` header in Network tab before deploy |
| **Trust frontend role check alone** | Unauthorized user accesses endpoint | Always validate user.role on backend before returning data |
| **Mix mock & real API in same component** | Unpredictable behavior in prod | Use feature flags or separate components for mock vs real |
| **Hardcode API endpoint URLs** | Can't change backend URL without code change | Use `VITE_API_BASE_URL` from environment |
| **New CSS conflicts with responsive sheets** | Mobile/desktop layout breaks | Test all breakpoints; verify load order in `main.tsx` |
| **Don't set current user in mockService** | Wrong data filtered (sees all users' data) | Call `mockService.setCurrentUser(id, role)` after login |
| **Forget role dispatch in new component** | Feature appears for all users | Add role-based rendering (switch/if) in component |

---

## Part 9: Performance Tips

### Component Memoization
```tsx
// Prevent unnecessary re-renders of expensive components
const TransactionTable = React.memo(({ transactions }: Props) => {
  return (<table>{/* render */}</table>);
}, (prev, next) => {
  // Custom comparison: only re-render if transaction count changes
  return prev.transactions.length === next.transactions.length;
});
```

### Lazy Load Large Features
```tsx
// Long feature lists—load on demand
const AdminTransactions = React.lazy(() => import('./AdminTransactions'));

<Suspense fallback={<Spinner />}>
  <AdminTransactions />
</Suspense>
```

### CSRF Token Caching
```tsx
// getCsrfToken() already caches in memory—do NOT re-fetch per request
// CSRF interceptor reuses cached token until refresh

const token = await getCsrfToken(); // Returns cached (instant)
```

---

## Part 10: References & Guides

- **[ADMIN_TRANSACTIONS_QUICKSTART.md](ADMIN_TRANSACTIONS_QUICKSTART.md)** — Admin transaction deep-dive
- **[DYNAMIC_DATA_ARCHITECTURE.md](DYNAMIC_DATA_ARCHITECTURE.md)** — Data flow by role
- **[PERFORMANCE_ARCHITECTURE.md](PERFORMANCE_ARCHITECTURE.md)** — Optimization guide
- **[MOBILE_DESKTOP_FORMAT_GUIDE.md](MOBILE_DESKTOP_FORMAT_GUIDE.md)** — Responsive patterns
- **[LOADING_SHOWCASE.md](LOADING_SHOWCASE.md)** — Loading state UX
- **[ENHANCED_MODAL_DESIGN.md](ENHANCED_MODAL_DESIGN.md)** — Modal patterns

---

## Support

For unclear sections or production issues, reference the existing guides or review patterns in [src/components/AdminDashboardV2.tsx](src/components/AdminDashboardV2.tsx) (main role dispatcher).
