# Copilot Instructions for OnePay UI Starter

## Project Overview
**OnePay Enterprise Payment Gateway App** — A multi-role React 18 + TypeScript payment dashboard with role-based access (admin, merchant, viewer, accountant).

## Key Architecture Patterns

### 1. Authentication & Security
- **HttpOnly Cookies** (backend-managed): No client localStorage for tokens. Sessions validated via `GET /auth/me`
- **CSRF Protection**: Interceptor setup in `main.tsx` via `setupCsrfInterceptor()`
- **Context Pattern**: `AuthContext` (src/context/AuthContext.tsx) holds user state; useAuth hook required for auth access
- **Protected Routes**: `ProtectedRoute` wrapper enforces login; check [src/routes/ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx)

### 2. API Layer
- **Axios Instance** ([src/services/api.ts](src/services/api.ts)): 
  - baseURL from `ENV.API_BASE_URL`, withCredentials: true for cookie handling
  - Response interceptor: 401 status redirects to `/login`
  - Always use `handleApiError()` utility for consistent error handling
- **Mock Service**: [src/services/mockService.ts](src/services/mockService.ts) provides fake data during development; filters by `mockService.setCurrentUser(userId, role)`

### 3. Component Structure
- **Dashboards**: Role-specific (AdminDashboardV2, MerchantDashboard, ViewerDashboard, AccountantDashboard)
- **Premium Components**: Suffixed with "Premium" (e.g., PayInPremium, CardManagementPremium)
- **Layouts**: AppLayout wraps protected routes; manages navigation and structure

### 4. State & Context
- Only `AuthContext` is global; other state kept local or within feature components
- Use `useAuth()` hook to access user info: `user.id`, `user.role`, `user.name`

### 5. Error Handling
- Use `handleApiError()` from [src/lib/errorHandler.ts](src/lib/errorHandler.ts) for API responses
- `ErrorBoundary` component wraps app in main.tsx
- Always log errors via `logger.error()` before user-facing messages

## Development Workflows

### Build & Dev Commands
```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Production bundle
npm run lint       # ESLint check
npm run preview    # Preview built app
```

### Code Quality
- **Prettier**: Semi: false, singleQuote: true, printWidth: 100, tabWidth: 2
- **ESLint**: Extends prettier, react-hooks, TS strict mode
- **Path Alias**: Use `@/*` for src imports (e.g., `@/components/Auth/Login`)

## Project-Specific Conventions

### Naming
- Component files: PascalCase (Login.tsx, Dashboard.tsx)
- Services: camelCase (authService.ts, mockService.ts)
- Hooks: camelCase with "use" prefix (useAuth, useLoginForm)
- Styles: feature-dashboard.css pattern; CSS Modules for scoped (Dashboard.module.css)

### Type Definitions
- Central types in [src/types/](src/types/): auth.ts, transaction.ts, user.ts, card.ts, beneficiary.ts, wallet.ts
- Always export from src/types/index.ts for consistency

### Imports Order
1. React/libs (React, react-router-dom)
2. Context & Hooks (@/context, @/hooks)
3. Services (@/services)
4. Components (@/components)
5. Utils & types (@/lib, @/types)
6. Styles

## Testing & Debugging

### Mock Data
- Use mockService for development; replace API calls during prototyping
- OTP mocking in [src/services/mockOtpService.ts](src/services/mockOtpService.ts)
- localStorage logging: `logUserSession()` and `logUserLogout()` in logger.ts

### Common Debug Points
- Auth flow: Check AuthContext.login() logic and role-based redirects
- API errors: Verify ENV.API_BASE_URL and withCredentials=true
- Session expiry: 401 responses auto-redirect to /login

## Cross-Component Communication
- **Props drilling** for feature components; avoid deep nesting
- **Context** reserved for auth state only
- **Local state** for form inputs, modals, loading states

## Environment Configuration
- [src/config/environment.ts](src/config/environment.ts): API_BASE_URL, API_TIMEOUT, feature flags
- .env.example provided; copy to .env for local setup
- Access control rules in [src/config/accessControl.ts](src/config/accessControl.ts)

## Key Files Reference
| File | Purpose |
|------|---------|
| [src/App.tsx](src/App.tsx) | Route definitions, role-based paths |
| [src/main.tsx](src/main.tsx) | App entry, providers, CSRF setup |
| [src/context/AuthContext.tsx](src/context/AuthContext.tsx) | Auth state & login logic |
| [src/services/api.ts](src/services/api.ts) | Axios config, interceptors |
| [src/lib/errorHandler.ts](src/lib/errorHandler.ts) | Centralized error parsing |
| [src/lib/logger.ts](src/lib/logger.ts) | Logging utilities |
| [src/config/environment.ts](src/config/environment.ts) | Env variables |

## Common Patterns to Follow

1. **Form Validation**: Use Zod schemas with react-hook-form; see [useLoginForm.ts](src/hooks/useLoginForm.ts)
2. **Loading States**: Manage in component state; show spinners during API calls
3. **Role Guards**: Check `user.role` in components; ProtectedRoute handles auth only
4. **Error Messages**: Sanitize user input via `sanitize()` before display
5. **Responsive Design**: Mobile-first CSS; Tablet/Desktop optimization files in styles/

## Security Reminders
- Never store auth tokens in localStorage; rely on httpOnly cookies
- Always validate user input via Zod before API calls
- Use `sanitize()` for user-generated content
- Rate limit forms via [src/lib/rateLimiter.ts](src/lib/rateLimiter.ts)
- Log sensitive actions (login/logout) via logger
