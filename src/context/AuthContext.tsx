import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout as logoutApi } from '../services/authService';
import { logger, logUserSession, logUserLogout } from '../lib/logger';

export interface AuthUser {
  id?: string | number;
  username?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  status: string;
  kycStatus?: string;
}

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 SECURITY: Load user from API /auth/me endpoint (httpOnly cookie sent automatically)
  // NOT from localStorage - token managed by backend via httpOnly cookie
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load current user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔐 SECURITY: Login calls backend API, token stored in httpOnly cookie by backend
  const login = async (phone: string, password: string) => {
    setLoading(true);
    try {
      // Call API to login - token will be in httpOnly cookie (automatic, browser handles)
      const { loginMock } = await import('../services/authService');
      const authUser = await loginMock(phone, password);

      // Update user state
      setUser(authUser);
      
      // Set current user in mockService for user-specific data filtering
      const { mockService } = await import('../services/mockService');
      mockService.setCurrentUser(String(authUser.id), authUser.role);
      
      logger.info('User logged in successfully', { userId: authUser.id, role: authUser.role });
      
      // Log user session to localStorage
      logUserSession({ 
        id: String(authUser.id), 
        name: authUser.name, 
        role: authUser.role 
      });

      // Role-based redirects
      switch (authUser.role) {
        case 'admin':
        case 'merchant':
        case 'viewer':
        case 'accountant':
        default:
          navigate('/dashboard', { replace: true });
          break;
      }
    } catch (err: any) {
      logger.error('Login failed in AuthContext', err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔐 SECURITY: Logout calls API to clear httpOnly cookie on backend
  const logout = async () => {
    try {
      logUserLogout();
      logger.info('User initiating logout', { userId: user?.id });
      await logoutApi();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  // Memoize context
  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
