import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, User, Stethoscope, Building2, Pill, ShieldCheck,
  Eye, EyeOff, ArrowRight, UserPlus, LogIn, Check, Loader2
} from 'lucide-react';

// ── Role config ───────────────────────────────────────────────────────────────
const roles = [
  { id: 'patient',    label: 'Patient',    icon: User,        color: 'from-teal-500 to-emerald-500',  redirect: '/health-dashboard' },
  { id: 'doctor',     label: 'Doctor',     icon: Stethoscope, color: 'from-blue-500 to-cyan-500',     redirect: '/doctor-dashboard' },
  { id: 'hospital',   label: 'Hospital',   icon: Building2,   color: 'from-purple-500 to-pink-500',   redirect: '/hospital-dashboard' },
  { id: 'pharmacy',   label: 'Pharmacy',   icon: Pill,        color: 'from-green-500 to-lime-500',    redirect: '/pharmacy' },
  { id: 'government', label: 'Government', icon: ShieldCheck, color: 'from-amber-500 to-orange-500',  redirect: '/gov-dashboard' },
];

const demoCredentials = {
  patient:    { email: 'patient@arogya.in',  password: 'demo123' },
  doctor:     { email: 'doctor@arogya.in',   password: 'demo123' },
  hospital:   { email: 'hospital@arogya.in', password: 'demo123' },
  pharmacy:   { email: 'pharmacy@arogya.in', password: 'demo123' },
  government: { email: 'gov@arogya.in',      password: 'demo123' },
};

const API = 'http://localhost:5000/api';

// ── Role Selector ─────────────────────────────────────────────────────────────
function RoleSelector({ selected, onSelect }) {
  return (
    <div>
      <p className="text-white/50 text-sm mb-3">Select your role</p>
      <div className="grid grid-cols-5 gap-2">
        {roles.map(role => {
          const Icon = role.icon;
          const active = selected?.id === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                active
                  ? 'border-primary-500 bg-primary-500/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-xs font-medium leading-tight text-center">{role.label}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Password field ────────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder = 'Enter your password' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="input-field pr-12"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ── Password strength bar ─────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels   = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors   = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-white/10'}`} />
        ))}
      </div>
      <p className={`text-xs ${strength >= 3 ? 'text-green-400' : strength >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
        {labels[strength] || ''}
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Login() {
  const [tab, setTab]               = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState('');
  const navigate = useNavigate();

  // Sign-in form
  const [signIn, setSignIn] = useState({ email: '', password: '' });

  // Sign-up form
  const [signUp, setSignUp] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '', gender: 'Male', age: '',
  });

  // Auto-fill demo credentials when role selected on sign-in tab
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    if (tab === 'signin') {
      const creds = demoCredentials[role.id];
      setSignIn({ email: creds.email, password: creds.password });
    }
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setSuccess('');
    setSelectedRole(null);
    setSignIn({ email: '', password: '' });
  };

  // ── SIGN IN ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!selectedRole) { setError('Please select your role first.'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signIn.email, password: signIn.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('arogyaToken', data.token);
      localStorage.setItem('arogyaUser', JSON.stringify({ ...data.user, role: data.user.role || selectedRole.id }));
      navigate(selectedRole.redirect);
    } catch (err) {
      setError(err.message || 'Login failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // ── SIGN UP ────────────────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!selectedRole)                              { setError('Please select your role first.');              return; }
    if (signUp.password !== signUp.confirmPassword) { setError('Passwords do not match.');                    return; }
    if (signUp.password.length < 6)                { setError('Password must be at least 6 characters.');    return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     signUp.name,
          email:    signUp.email,
          password: signUp.password,
          role:     selectedRole.id,
          phone:    signUp.phone,
          city:     signUp.city,
          age:      signUp.age ? Number(signUp.age) : undefined,
          gender:   signUp.gender,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      // Auto-login after registration
      localStorage.setItem('arogyaToken', data.token);
      localStorage.setItem('arogyaUser', JSON.stringify({ ...data.user, role: selectedRole.id }));
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate(selectedRole.redirect), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12">
      {/* Animated blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg animate-glow">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold">
            <span className="text-gradient">Arogya</span><span className="text-white">-Setu</span>
          </h1>
          <p className="text-white/40 mt-1 text-sm">Intelligent Healthcare Ecosystem</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Tab switcher */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-7 gap-1">
            <button
              type="button"
              onClick={() => switchTab('signin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === 'signin'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab('signup')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === 'signup'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>

          {/* Role selector (shared) */}
          <div className="mb-6">
            <RoleSelector selected={selectedRole} onSelect={handleRoleSelect} />
          </div>

          {/* ── SIGN IN FORM ─────────────────────────────────────────────── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              {selectedRole && (
                <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-sm text-white/60 flex items-center gap-2">
                  <span className="text-primary-400 font-medium">Demo credentials:</span>
                  {demoCredentials[selectedRole.id].email}
                  <span className="text-white/30">/</span>
                  demo123
                </div>
              )}

              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Email Address</label>
                <input
                  type="email" className="input-field"
                  placeholder="Enter your email"
                  value={signIn.email}
                  onChange={e => setSignIn({ ...signIn, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Password</label>
                <PasswordInput
                  value={signIn.password}
                  onChange={e => setSignIn({ ...signIn, password: e.target.value })}
                />
              </div>

              {error  && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-1">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In as {selectedRole?.label || '...'}</>}
              </button>

              <p className="text-center text-white/30 text-xs">
                No account?{' '}
                <button type="button" onClick={() => switchTab('signup')} className="text-primary-400 hover:text-primary-300 transition-colors">
                  Create one free →
                </button>
              </p>
            </form>
          )}

          {/* ── SIGN UP FORM ─────────────────────────────────────────────── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Full Name *</label>
                  <input
                    type="text" className="input-field"
                    placeholder="e.g. Rahul Verma"
                    value={signUp.name}
                    onChange={e => setSignUp({ ...signUp, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Phone Number</label>
                  <input
                    type="tel" className="input-field"
                    placeholder="10-digit mobile"
                    value={signUp.phone}
                    onChange={e => setSignUp({ ...signUp, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Email Address *</label>
                <input
                  type="email" className="input-field"
                  placeholder="yourname@example.com"
                  value={signUp.email}
                  onChange={e => setSignUp({ ...signUp, email: e.target.value })}
                  required
                />
              </div>

              {/* City + Age + Gender */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">City</label>
                  <input
                    type="text" className="input-field"
                    placeholder="Delhi"
                    value={signUp.city}
                    onChange={e => setSignUp({ ...signUp, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Age</label>
                  <input
                    type="number" className="input-field"
                    placeholder="25" min="1" max="120"
                    value={signUp.age}
                    onChange={e => setSignUp({ ...signUp, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Gender</label>
                  <select className="input-field" value={signUp.gender} onChange={e => setSignUp({ ...signUp, gender: e.target.value })}>
                    <option className="bg-dark-800">Male</option>
                    <option className="bg-dark-800">Female</option>
                    <option className="bg-dark-800">Other</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Password *</label>
                <PasswordInput
                  value={signUp.password}
                  onChange={e => setSignUp({ ...signUp, password: e.target.value })}
                  placeholder="Min 6 characters"
                />
                <PasswordStrength password={signUp.password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Confirm Password *</label>
                <div className="relative">
                  <PasswordInput
                    value={signUp.confirmPassword}
                    onChange={e => setSignUp({ ...signUp, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                  />
                  {signUp.confirmPassword && signUp.password === signUp.confirmPassword && (
                    <Check className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 pointer-events-none" />
                  )}
                </div>
              </div>

              {error   && <div className="p-3 rounded-xl bg-red-500/10   border border-red-500/30   text-red-400   text-sm">{error}</div>}
              {success && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"><Check className="w-4 h-4" />{success}</div>}

              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-1">
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <><UserPlus className="w-4 h-4" /> Create {selectedRole?.label || '...'} Account</>
                }
              </button>

              <p className="text-center text-white/30 text-xs">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('signin')} className="text-primary-400 hover:text-primary-300 transition-colors">
                  Sign in →
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-5">
          Arogya-Setu · Hackathon Demo · All passwords stored securely with bcrypt
        </p>
      </div>
    </div>
  );
}
