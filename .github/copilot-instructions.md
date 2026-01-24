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

## Critical Architecture Patterns

### 1. Authentication & Security
- **Token Strategy**: httpOnly cookies (NOT localStorage)—backend manages token lifecycle via `/auth/me` endpoint
- **CSRF Protection**: Request interceptor in `src/services/csrf.ts` auto-injects `X-CSRF-Token` header for POST/PUT/DELETE
- **Auth Context**: `src/context/AuthContext.tsx`—single source of truth for user/role; wrapped at app root in `main.tsx`
- **Protected Routes**: `src/routes/ProtectedRoute`—gates all dashboard routes; redirects unauthenticated users to `/login`
- **Pattern**: Never store tokens in state/localStorage; always call `/auth/me` on app mount to rehydrate user

### 2. Role-Based Access Control (RBAC)
- **Roles**: `admin`, `merchant`, `viewer`, `accountant`, default (generic user)
- **Routing**: Each role has dedicated dashboard (e.g., `/admin/dashboard`, `/merchant/dashboard`)
- **Fallback**: If role unknown, generic `/dashboard` or redirect to `/admin/dashboard/premium`
- **Data Filtering**: `src/services/mockService.ts` filters data by `userId` + `userRole`—set via `mockService.setCurrentUser(userId, role)` in login flow
- **Access Config**: `src/config/accessControl.ts`—define role-specific feature permissions (framework, not enforced yet)

### 3. Component Organization
```
src/components/
  ├── Auth/               # Login, Signup
  ├── Dashboard.tsx       # Generic dashboard (role dispatcher)
  ├── AdminDashboard*     # Multiple admin variants (V2, Premium, base)
  ├── MerchantDashboard.tsx
  ├── ViewerDashboard.tsx
  ├── AccountantDashboard.tsx
  ├── AdminTransactions/  # Admin transaction management (complex feature)
  ├── PaymentGateway/     # PayInPremium, PayOutPremium
  ├── AccountSettings/    # AccountSettingsPremium
  ├── CardManagement/     # CardManagementPremium
  ├── BeneficiaryManagement/
  ├── TransactionHistory/ # TransactionHistoryPremium
  ├── InvoiceReceipt/     # ReceiptGenerationPremium
  ├── Notifications/      # NotificationsCenterPremium
  ├── Support/            # SupportChatPremium
  ├── Common/             # ErrorBoundary, shared UI
  ├── Premium/            # PremiumCard, PremiumButton, PremiumInput (design system)
```
- **Naming**: `*Premium` suffix = premium/enterprise feature variant
- **Premium Components**: Reusable styled primitives in `src/components/Premium/` (use as building blocks)

### 4. Styling Strategy
- **CSS Files**: Each component has colocated `.css`; multiple global sheets for responsive design
- **Global Sheets** (loaded in `main.tsx`):
  - `globals.css` (base)
  - `responsive.css`, `mobile-optimization.css`, `tablet-optimization.css`, `desktop-optimization.css`, `large-screen-optimization.css`
  - `premium-dashboard.css`, `premium-enterprise-menu.css`, `premium-enterprise-sidebar.css`
  - `design-tokens.css` (CSS variables)
  - `animations.css`, `accessibility.css`, `layout.css`
- **No Tailwind**: Plain CSS; use media queries for breakpoints defined in responsive sheets
- **Pattern**: Mobile-first in component `.css`, override in `mobile-optimization.css`, scale up in `tablet-*`, `desktop-*`, `premium-*`

### 5. API & Data Flow
- **Base API Instance**: `src/services/api.ts`—Axios instance with proxy to backend (see `vite.config.ts`)
- **Environment Config**: `src/config/environment.ts` + `.env.example`—API endpoint from `VITE_API_BASE_URL`
- **Mock Services**: `src/services/mockService.ts` (main), `mockOtpService.ts` (OTP)—simulate backend for dev/testing
- **Pattern**: For new features, add mock data first in `mockService.ts`, then swap to real API calls
- **CSRF Setup**: Auto-initialized in `main.tsx` via `setupCsrfInterceptor()`

### 6. Admin Transactions (Complex Feature)
- **Location**: `src/components/AdminTransactions/`
- **Guides**: See `ADMIN_TRANSACTIONS_*.md` files in repo root (Index, Guide, Implementation, QuickStart, etc.)
- **Key Types**: Transaction, Status (pending, approved, rejected, completed)
- **Pattern**: Transactions filter by role/merchant; admin sees all; merchants see own only
- **UI Pattern**: Modal confirmations, dynamic data loading, status badges

## Developer Workflows

### Running the App
```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build locally
```

### Environment Setup
1. Copy `.env.example` to `.env` (or `.env.local`)
2. Set `VITE_API_BASE_URL` to your backend (dev default: `http://localhost:3000`)
3. CSRF token auto-fetched from `/auth/csrf-token` endpoint

### Debugging
- **User Session Logs**: `src/lib/logger.ts`—logs login/logout events to console
- **Current User State**: Check `useAuth()` context hook in any component
- **Mock Data**: Controlled via `mockService.setCurrentUser(userId, role)` after login
- **CSRF Token**: Check `getCachedCsrfToken()` from `src/services/csrf.ts` for cached token

## Key Files to Read When Starting

1. **Entry Point**: [src/main.tsx](src/main.tsx#L1) - App initialization, CSRF setup, auth provider wrap
2. **Routing**: [src/App.tsx](src/App.tsx#L1) - All routes, role-based dashboards
3. **Auth Flow**: [src/context/AuthContext.tsx](src/context/AuthContext.tsx#L1) - User, login, logout logic
4. **API Setup**: [src/services/api.ts](src/services/api.ts#L1) - Axios instance
5. **Protected Routes**: [src/routes/ProtectedRoute](src/routes/ProtectedRoute) - Route guarding
6. **CSRF Security**: [src/services/csrf.ts](src/services/csrf.ts#L1) - Token injection
7. **Mock Data**: [src/services/mockService.ts](src/services/mockService.ts#L1) - Development data simulation

## Code Patterns & Conventions

### Component Pattern (Functional, React 18)
```tsx
import { useAuth } from '../context/AuthContext';
import { PremiumCard, PremiumButton } from '../components/Premium';

function MyDashboard() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return (
    <PremiumCard>
      <h1>Welcome, {user.name}</h1>
      {/* Content */}
    </PremiumCard>
  );
}
```

### Custom Hook Pattern
```tsx
function useTransactionData(roleFilter?: string) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch or filter mock data based on user role
    const filtered = mockService.getTransactions({
      userId: user?.id,
      role: user?.role,
      filter: roleFilter
    });
    setData(filtered);
  }, [user]);
  
  return data;
}
```

### Form + Zod Pattern
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
});

function PaymentForm() {
  const { register, handleSubmit, errors } = useForm({
    resolver: zodResolver(schema),
  });
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Styling Convention
- Component CSS colocated: `MyComponent.tsx` + `MyComponent.css`
- Use CSS variables from `design-tokens.css`: `var(--color-primary)`, `var(--spacing-lg)`
- Mobile-first CSS, override in responsive sheets
- Premium variant styles in `premium-*.css` globals

## Avoid Common Pitfalls

1. **Don't use localStorage for tokens** — use httpOnly cookies + `/auth/me` endpoint
2. **Don't skip role/access checks** — always validate user role before showing features
3. **Don't mix mock and real APIs** — consistently use either mockService or real API in a feature
4. **Don't forget CSRF token** — it's auto-injected but verify X-CSRF-Token header in network tab
5. **Don't hardcode API endpoints** — use environment config (`VITE_API_BASE_URL`)
6. **Styling conflicts** — multiple global CSS files; test across mobile/tablet/desktop before committing
7. **React Router nesting** — ProtectedRoute wraps AppLayout which wraps role-specific routes; don't duplicate

## Testing & QA Checklist

- [ ] Logout clears auth state and redirects to `/login`
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-based dashboards load correct components
- [ ] CSRF token present in POST/PUT/DELETE requests (check Network tab)
- [ ] Responsive design: test mobile (375px), tablet (768px), desktop (1920px+)
- [ ] Mock data matches real API response shape (to avoid integration bugs)
- [ ] All role variants tested (admin, merchant, viewer, accountant)

## References

- [ADMIN_TRANSACTIONS_QUICKSTART.md](ADMIN_TRANSACTIONS_QUICKSTART.md) - Admin transaction feature deep dive
- [DYNAMIC_DATA_ARCHITECTURE.md](DYNAMIC_DATA_ARCHITECTURE.md) - Data flow & filtering by role
- [PERFORMANCE_ARCHITECTURE.md](PERFORMANCE_ARCHITECTURE.md) - Optimization guidelines
- [MOBILE_DESKTOP_FORMAT_GUIDE.md](MOBILE_DESKTOP_FORMAT_GUIDE.md) - Responsive design patterns
