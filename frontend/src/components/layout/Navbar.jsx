import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Archive,
  FileUp,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/archive', label: 'Archive', icon: Archive },
    { to: '/submit', label: 'Submit Paper', icon: FileUp },
  ];

  const authLinks = isAuthenticated
    ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    : [
        { to: '/login', label: 'Login', icon: LogIn },
        { to: '/register', label: 'Register', icon: UserPlus },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      {/* Google 4-color bar */}
      <div className="google-dots" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold gradient-text tracking-tight">
              IRA
            </span>
            <span className="hidden sm:block text-xs text-text-muted font-medium mt-1">
              International Research Archive
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-medium transition-md ${
                    isActive
                      ? 'text-primary bg-primary/[0.08]'
                      : 'text-text-muted hover:text-text hover:bg-black/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <div className="w-px h-6 bg-border mx-2" />

            {authLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-medium transition-md ${
                    isActive
                      ? 'text-primary bg-primary/[0.08]'
                      : 'text-text-muted hover:text-text hover:bg-black/[0.04]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-text-muted hover:text-error hover:bg-error/[0.04] transition-md cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-black/[0.04] transition-md cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-text" />
            ) : (
              <Menu className="w-6 h-6 text-text" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-surface border-t border-border overflow-hidden elevation-4"
          >
            <div className="px-4 py-3 space-y-1">
              {[...navLinks, ...authLinks].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-md ${
                      isActive
                        ? 'text-primary bg-primary/[0.08]'
                        : 'text-text-muted hover:text-text hover:bg-black/[0.04]'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated && (
                <>
                  <div className="border-t border-border my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-full text-sm font-medium text-error hover:bg-error/[0.04] transition-md cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}

              {isAuthenticated && user && (
                <div className="px-4 py-3 mt-2 bg-primary/[0.04] rounded-xl">
                  <p className="text-sm font-medium text-text">{user.name || user.email}</p>
                  <p className="text-xs text-text-muted capitalize">{user.role}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
