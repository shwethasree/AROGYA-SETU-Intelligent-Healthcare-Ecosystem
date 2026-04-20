import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, Menu, X, Activity, Stethoscope, Building2, 
  Pill, ShieldAlert, LayoutDashboard, LogOut, Bell, ChevronDown, Languages, WifiOff, Wifi, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRuralMode } from '../context/RuralModeContext';
import { motion, AnimatePresence } from 'framer-motion';

const roleMenus = {
  patient: [
    { label: 'Home', path: '/', icon: Activity },
    { label: 'Medicine Scanner', path: '/scanner', icon: Pill },
    { label: 'Find Doctors', path: '/doctors', icon: Stethoscope },
    { label: 'Hospitals', path: '/hospitals', icon: Building2 },
    { label: 'My Health', path: '/health-dashboard', icon: Heart },
    { label: 'Emergency', path: '/emergency', icon: ShieldAlert },
  ],
  doctor: [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'My Patients', path: '/doctor-dashboard', icon: Stethoscope },
    { label: 'Emergency', path: '/emergency', icon: ShieldAlert },
  ],
  government: [
    { label: 'Gov Dashboard', path: '/gov-dashboard', icon: LayoutDashboard },
    { label: 'Outbreak Map', path: '/hospitals', icon: Building2 },
    { label: 'Emergency', path: '/emergency', icon: ShieldAlert },
  ],
};

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isRuralMode, toggleRuralMode } = useRuralMode();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userStr = localStorage.getItem('arogyaUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'patient';
  const menu = roleMenus[role] || roleMenus.patient;

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'te', label: 'Telugu' },
    { code: 'kn', label: 'Kannada' },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('arogyaUser');
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 pt-4`}>
      <motion.div 
        animate={{ 
          backgroundColor: scrolled ? 'rgba(10, 10, 11, 0.8)' : 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(16px)',
          borderWidth: 1,
          borderColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          y: scrolled ? 4 : 0
        }}
        className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-dark-900 fill-dark-900/20" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter">
              <span className="text-white">Arogya</span>
              <span className="text-primary">Setu</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {menu.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  location.pathname === path
                    ? 'text-primary bg-primary/10'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Rural Toggle */}
            <button
              onClick={toggleRuralMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-500 ${isRuralMode ? 'bg-amber-400 text-dark-900 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'}`}
            >
              {isRuralMode ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="hidden sm:inline">{isRuralMode ? 'RURAL: ACTIVE' : 'RURAL: OFF'}</span>
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all uppercase"
              >
                <Languages className="w-4 h-4 text-primary" />
                {i18n.language}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-40 glass-card bg-dark-900 p-2 z-[100]"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${i18n.language === lang.code ? 'text-primary bg-primary/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SOS Button for Rural */}
            {isRuralMode && (
              <Link to="/emergency" className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-black animate-glow">
                <ShieldAlert className="w-5 h-5" /> SOS
              </Link>
            )}

            {/* User */}
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center p-[2px]">
                    <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center text-xs font-black text-white">
                      {user.name?.charAt(0)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 transition-all hover:text-white"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2.5 px-6 text-sm">
                Login
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-3 rounded-xl bg-white/5 text-white"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mt-2 max-w-7xl mx-auto glass-card bg-dark-900 p-4 flex flex-col gap-2"
          >
            {menu.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                  location.pathname === path
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-6 h-6" />
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
