import { useState, useEffect } from 'react';
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
  Search,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/archive', label: 'Archive', icon: Archive },
    { to: '/submit', label: 'Submit', icon: FileUp },
  ];

  const authLinks = isAuthenticated
    ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    : [
        { to: '/login', label: 'Login', icon: LogIn },
        { to: '/register', label: 'Register', icon: UserPlus },
      ];

  return (
    <>
      {/* Google 4-color top strip */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 google-gradient-line" />

      {/* Spacer so content doesn't hide behind fixed nav */}
      <div className="h-18" />

      <nav className="fixed top-1 left-0 right-0 z-50 flex items-center justify-center px-4 py-3 pointer-events-none">
        {/* Full-width bar behind on scroll */}
        <motion.div
          className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-border/50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />

        <div className="relative w-full max-w-7xl flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-bold text-google-blue">I</span>
              <span className="text-2xl font-bold text-google-red">R</span>
              <span className="text-2xl font-bold text-google-green">A</span>
            </div>
            <span className="hidden lg:block text-sm text-text-muted font-medium">
              International Research Archive
            </span>
          </Link>

          {/* Desktop — Bubble Nav */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-1 bg-surface-light border border-border rounded-full px-2 py-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-full text-sm font-medium transition-md ${
                      isActive
                        ? 'text-white'
                        : 'text-text-muted hover:text-text hover:bg-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="navBubble"
                          className="absolute inset-0 bg-google-blue rounded-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side — auth actions */}
          <div className="hidden md:flex items-center gap-2">
            {authLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-md ${
                    isActive
                      ? 'bg-google-blue text-white border-google-blue'
                      : 'text-text-muted border-border hover:text-text hover:border-text-muted hover:bg-surface-light'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-text-muted border border-border hover:text-google-red hover:border-google-red/40 hover:bg-google-red/[0.04] transition-md cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-full bg-surface-light border border-border hover:bg-white transition-md cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-text" />
            ) : (
              <Menu className="w-5 h-5 text-text" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Mobile bubble panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-16 left-4 right-4 z-50 bg-white rounded-2xl border border-border elevation-4 overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {[...navLinks, ...authLinks].map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-md ${
                        isActive
                          ? 'text-white bg-google-blue'
                          : 'text-text-muted hover:text-text hover:bg-surface-light'
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
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-google-red hover:bg-google-red/[0.04] transition-md cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                )}

                {isAuthenticated && user && (
                  <div className="px-4 py-3 mt-1 bg-surface-light rounded-xl">
                    <p className="text-sm font-medium text-text">{user.name || user.email}</p>
                    <p className="text-xs text-text-muted capitalize">{user.role}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
