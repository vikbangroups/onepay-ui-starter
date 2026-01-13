import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTelegramPlane, FaChevronDown, FaSignOutAlt, FaUser, FaBell, FaCreditCard, FaMoneyBillWave, FaMoneyBill } from 'react-icons/fa';
import logoImage from '../assets/OneCode_Logo.png';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import '../styles/globals.css';
import '../styles/layout.css';

// Footer section interface
interface FooterSection {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Footer sections collapsed by default on mobile (restore original behavior)
  const [expandedFooterSections, setExpandedFooterSections] = useState<string[]>([]);

  // Set mockService user role based on logged-in user
  useEffect(() => {
    if (user && user.role) {
      mockService.setUserRole(user.role);
    }
  }, [user]);

  // Footer sections data
  const footerSections: FooterSection[] = [
    {
      id: 'about',
      title: 'About OnePay',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Blog', href: '#blog' },
        { label: 'Press Kit', href: '#press' },
      ],
    },
    {
      id: 'products',
      title: 'Products',
      links: [
        { label: 'Pay-In Solutions', href: '#pay-in' },
        { label: 'Pay-Out Solutions', href: '#pay-out' },
        { label: 'Wallet Services', href: '#wallet' },
        { label: 'API Documentation', href: '#api' },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Email: support@onepay.com', href: 'mailto:support@onepay.com' },
        { label: 'Phone: +1 (800) 123-4567', href: 'tel:+18001234567' },
      ],
    },
    {
      id: 'legal',
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Security', href: '#security' },
        { label: 'Compliance', href: '#compliance' },
      ],
    },
  ];

  // Close mobile menu on route change (responsive optimization)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userDropdownOpen]);

  const toggleFooterSection = (sectionId: string) => {
    setExpandedFooterSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="app-wrapper">
      {/* PREMIUM ENTERPRISE SIDEBAR (Desktop Only) */}
      <aside className={`enterprise-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logoImage} alt="OnePay" />
            <div className="sidebar-logo-text">OnePay</div>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Dashboard"
          >
            <span className="sidebar-nav-item-icon">📊</span>
            <span className="sidebar-nav-item-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/payin"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Pay-In"
          >
            <span className="sidebar-nav-item-icon">💰</span>
            <span className="sidebar-nav-item-text">Pay-In</span>
          </NavLink>

          <NavLink
            to="/payout"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Pay-Out"
          >
            <span className="sidebar-nav-item-icon">💸</span>
            <span className="sidebar-nav-item-text">Pay-Out</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Transactions"
          >
            <span className="sidebar-nav-item-icon">📋</span>
            <span className="sidebar-nav-item-text">Transactions</span>
          </NavLink>

          <NavLink
            to="/cards"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Cards"
          >
            <span className="sidebar-nav-item-icon">💳</span>
            <span className="sidebar-nav-item-text">Cards</span>
          </NavLink>

          <NavLink
            to="/beneficiaries"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Beneficiaries"
          >
            <span className="sidebar-nav-item-icon">👥</span>
            <span className="sidebar-nav-item-text">Beneficiaries</span>
          </NavLink>

          <NavLink
            to="/receipts"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Receipts"
          >
            <span className="sidebar-nav-item-icon">📄</span>
            <span className="sidebar-nav-item-text">Receipts</span>
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Notifications"
          >
            <span className="sidebar-nav-item-icon">🔔</span>
            <span className="sidebar-nav-item-text">Notifications</span>
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Support"
          >
            <span className="sidebar-nav-item-icon">🆘</span>
            <span className="sidebar-nav-item-text">Support</span>
          </NavLink>

          {user?.role === 'admin' && (
            <>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                data-tooltip="Users"
              >
                <span className="sidebar-nav-item-icon">👨‍💼</span>
                <span className="sidebar-nav-item-text">Users Panel</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/premium"
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                data-tooltip="Premium"
              >
                <span className="sidebar-nav-item-icon">⭐</span>
                <span className="sidebar-nav-item-text">Premium Dashboard</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">{getUserInitials()}</div>
            <div className="sidebar-user-details">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role">{user?.role || 'Agent'}</div>
            </div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt /> <span className="logout-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content wrapper adjusted for sidebar */}
      <div className={`app-layout-with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'mobile-sidebar-visible' : ''}`}>
      {/* No backdrop for mobile drawer - drawer is always clickable */}

      {/* ==================== HEADER ==================== */}
      <header className="app-header">
        <div className="header-container">
          {/* Mobile Menu Toggle (Left) */}
          <div className="header-left-group">
            <button
              className="header-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>

          {/* Company Name - Center */}
          <div className="header-center-group">
            <h1 className="header-company-name">VikBan Groups</h1>
          </div>

          {/* Navigation - Icons (Desktop) + Menu Items (Mobile) */}
          <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Desktop Icons */}
            <button
              className="header-nav-icon header-payout-btn"
              onClick={() => navigate('/payout')}
              title="Pay-Out"
              aria-label="Pay-Out"
            >
              <FaMoneyBill />
            </button>
            <button
              className="header-nav-icon header-payin-btn"
              onClick={() => navigate('/payin')}
              title="Pay-In"
              aria-label="Pay-In"
            >
              <FaMoneyBillWave />
            </button>
            <button
              className="header-nav-icon header-cards-btn"
              onClick={() => navigate('/cards')}
              title="Cards"
              aria-label="Cards"
            >
              <FaCreditCard />
            </button>
            <button
              className="header-nav-icon header-notification-btn"
              onClick={() => navigate('/notifications')}
              title="Notifications"
              aria-label="Notifications"
            >
              <FaBell />
            </button>

            {/* Mobile Menu Items */}
            <div className="header-nav-menu-items">
              {/* Mobile Menu Header - Logo + OnePay */}
              <div className="mobile-menu-header">
                <div className="mobile-menu-logo">
                  <img src={logoImage} alt="OnePay" className="mobile-logo-img" />
                  <span className="mobile-logo-text">OnePay</span>
                </div>
              </div>

              {/* Menu Links */}
              <NavLink to="/dashboard" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">📊</span>
                <span className="menu-link-text">Dashboard</span>
              </NavLink>
              <NavLink to="/payin" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">💰</span>
                <span className="menu-link-text">Pay-In</span>
              </NavLink>
              <NavLink to="/payout" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">💸</span>
                <span className="menu-link-text">Pay-Out</span>
              </NavLink>
              <NavLink to="/transactions" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">📋</span>
                <span className="menu-link-text">Transactions</span>
              </NavLink>
              <NavLink to="/admin/dashboard/cards" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">💳</span>
                <span className="menu-link-text">Cards</span>
              </NavLink>
              <NavLink to="/beneficiaries" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">👥</span>
                <span className="menu-link-text">Beneficiaries</span>
              </NavLink>
              <NavLink to="/receipts" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">📄</span>
                <span className="menu-link-text">Receipts</span>
              </NavLink>
              <NavLink to="/notifications" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">🔔</span>
                <span className="menu-link-text">Notifications</span>
              </NavLink>
              <NavLink to="/support" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">💬</span>
                <span className="menu-link-text">Support</span>
              </NavLink>
              <NavLink to="/users-panel" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">👨‍💼</span>
                <span className="menu-link-text">Users Panel</span>
              </NavLink>
              <NavLink to="/admin/dashboard/premium" className={({ isActive }) => `header-nav-menu-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <span className="menu-link-icon">⭐</span>
                <span className="menu-link-text">Premium Dashboard</span>
              </NavLink>

              {/* Mobile Menu Footer - User Info + Logout */}
              <div className="mobile-menu-footer">
                <div className="mobile-menu-user">
                  <span className="mobile-menu-avatar">{user?.name?.charAt(0) || 'U'}</span>
                  <div className="mobile-menu-user-info">
                    <div className="mobile-menu-user-name">{user?.name || 'User'}</div>
                    <div className="mobile-menu-user-role">{user?.role || 'User'}</div>
                  </div>
                </div>
                <button className="mobile-menu-logout" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </nav>

          {/* Header Actions - Right Side */}
          <div className="header-actions">
            {/* User Profile on Right */}
            <div className="header-user-dropdown" ref={dropdownRef}>
              <button
                className="header-user-info"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="header-user-avatar">{getUserInitials()}</div>
                <div className="header-user-details">
                  <div className="header-user-name">{user?.name || 'User'}</div>
                  <div className="header-user-status">Active</div>
                </div>
                <FaChevronDown className="header-dropdown-icon" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="header-user-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="header-user-menu-header">
                    <div className="header-user-avatar-lg">{getUserInitials()}</div>
                    <div>
                      <p className="header-user-menu-name">{user?.name || 'User'}</p>
                      <p className="header-user-menu-email">{user?.email || 'user@onepay.com'}</p>
                    </div>
                  </div>
                  <div className="header-user-menu-divider"></div>
                  <button className="header-user-menu-item" onClick={() => navigate('/account-settings')}>
                    <FaUser /> Account Settings
                  </button>
                  <div className="header-user-menu-divider"></div>
                  <button 
                    className="header-user-menu-item header-user-menu-logout"
                    onClick={() => {
                      handleLogout();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==================== BODY ==================== */}
      <main className="app-body">
        <div className="body-content">
          <Outlet />
        </div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="app-footer">
        <div className="footer-container">
          {/* Desktop: Grid Layout | Mobile: Accordion Layout */}
          <div className="footer-content">
            {footerSections.map((section) => (
              <div
                key={section.id}
                className={`footer-section ${
                  expandedFooterSections.includes(section.id) ? 'expanded' : ''
                }`}
              >
                {/* Section Header (clickable on mobile) */}
                <button
                  className="footer-section-header"
                  onClick={() => toggleFooterSection(section.id)}
                  aria-expanded={expandedFooterSections.includes(section.id)}
                >
                  <h4 className="footer-section-title">{section.title}</h4>
                  <span className="footer-section-toggle">
                    {expandedFooterSections.includes(section.id) ? '▼' : '▶'}
                  </span>
                </button>

                {/* Section Links */}
                <ul className="footer-links">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-divider"></div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} OnePay by One Code Solutions. All rights reserved.
            </div>
            <ul className="footer-social">
              <li>
                <a href="https://facebook.com/onepay" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="facebook">
                  <FaFacebook size={16} />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/onepay" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="twitter">
                  <FaTwitter size={16} />
                </a>
              </li>
              <li>
                <a href="https://instagram.com/onepay" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="instagram">
                  <FaInstagram size={16} />
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@onepay" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="youtube">
                  <FaYoutube size={16} />
                </a>
              </li>
              <li>
                <a href="https://t.me/onepay" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="telegram">
                  <FaTelegramPlane size={16} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      </div>
      {/* End of app-layout-with-sidebar */}
    </div>
  );
};

export default AppLayout;


// import React from 'react';
// import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { AccessRules } from '../config/accessControl';
// import type { UserRole } from '../services/authService';

// /* 🔖 Define route + label mapping for all screen keys */
// const SCREEN_MAP: Record<string, { label: string; to: string }> = {
//   'dashboard': { label: 'Dashboard', to: '/dashboard' },
//   'add-money': { label: 'Pay-In', to: '/add-money' },
//   'payout': { label: 'Pay-Out', to: '/payout' },
//   'user-approvals': { label: 'User Approvals', to: '/admin/users' },
//   'reports': { label: 'Reports', to: '/reports' }
// };

// const AppLayout: React.FC = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   /** ✅ Handle logout */
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   /** ✅ Build role-based menu dynamically */
//   const allowedScreens = user ? AccessRules[user.role as UserRole] || [] : [];
//   const menu = allowedScreens.map((key) => SCREEN_MAP[key]).filter(Boolean);

//   return (
//     <div className="app-wrapper">
//       {/* 🔝 HEADER */}
//       <header className="topbar">
//         <div className="logo-container">
//           <img
//             src={import.meta.env.VITE_LOGO_URL || '/src/assets/OneCode_Logo.png'}
//             alt="Logo"
//             className="logo-image"
//           />
//           <span className="logo-text">
//             {import.meta.env.VITE_PRODUCT_NAME || 'OnePay'} —{' '}
//             {import.meta.env.VITE_BRAND_NAME || 'One Code Solutions'}
//           </span>
//         </div>

//         {/* 🧭 NAVIGATION BAR */}
//         <nav className="nav-wrapper">
//           <div className="nav-links">
//             {menu.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 className={({ isActive }) => (isActive ? 'active' : '')}
//               >
//                 {item.label}
//               </NavLink>
//             ))}
//           </div>

//           {user && (
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           )}
//         </nav>
//       </header>

//       {/* 📄 MAIN CONTENT AREA */}
//       <main className="container main-content">
//         <Outlet />
//       </main>

//       {/* 🌐 FOOTER */}
//       <footer className="footer">
//         © {new Date().getFullYear()} {import.meta.env.VITE_PRODUCT_NAME || 'OnePay'} — Powered by{' '}
//         <strong>{import.meta.env.VITE_BRAND_NAME || 'One Code Solutions'}</strong>
//       </footer>
//     </div>
//   );
// };

// export default AppLayout;
