import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { setupCsrfInterceptor } from './services/csrf';
import './styles/globals.css';
import './styles/responsive.css';
import './styles/mobile-optimization.css';
import './styles/layout.css';
import './styles/main.css';
import './styles/design-tokens.css';
import './styles/premium-dashboard.css';
import './styles/animations.css';
import './styles/accessibility.css';
import './styles/premium-enterprise-menu.css';
import './styles/premium-enterprise-sidebar.css';
import './styles/tablet-optimization.css';
import './styles/desktop-optimization.css';
import './styles/large-screen-optimization.css';

// 🔐 SECURITY: Setup CSRF protection on app startup
setupCsrfInterceptor();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
