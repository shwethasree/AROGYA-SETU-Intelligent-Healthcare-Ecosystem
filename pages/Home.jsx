import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Stethoscope, Building2, Pill, ShieldAlert, 
  Heart, ArrowRight, MapPin, TrendingUp, Users, ChevronRight,
  Zap, Brain, Clock, Star, CheckCircle, Award, Globe, Search, Plus, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRuralMode } from '../context/RuralModeContext';

const typingSymptoms = ['Fever, Cough...', 'Chest Pain...', 'Headache, Nausea...', 'Joint Pain...', 'Fatigue...'];

const services = [
  { icon: Brain, title: 'AI Symptom Checker', desc: 'Describe symptoms and get instant AI diagnosis with risk assessment', path: '/symptoms', color: 'bg-teal-500/10 text-teal-400', grid: 'md:col-span-2' },
  { icon: Pill, title: 'Medicine Scanner', desc: 'Scan medicine strips to understand dosage and usage instantly', path: '/scanner', color: 'bg-rose-500/10 text-rose-400', grid: 'md:col-span-1' },
  { icon: Stethoscope, title: 'World Class Doctors', desc: 'Search and book appointments with verified specialists', path: '/doctors', color: 'bg-indigo-500/10 text-indigo-400', grid: 'md:col-span-1' },
  { icon: Building2, title: 'Live Hospital Map', desc: 'Real-time bed availability and ICU status near you', path: '/hospitals', color: 'bg-blue-500/10 text-blue-400', grid: 'md:col-span-1' },
  { icon: Heart, title: 'Digital Twin Health', desc: 'Track vitals and predict future risks with AI modeling', path: '/health-dashboard', color: 'bg-pink-500/10 text-pink-400', grid: 'md:col-span-1' },
];

export default function Home() {
  const { t } = useTranslation();
  const { isRuralMode } = useRuralMode();
  const [displayText, setDisplayText] = useState('');
  const [typingIdx, setTypingIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const target = typingSymptoms[typingIdx];
    if (charIdx < target.length) {
      const t = setTimeout(() => { setDisplayText(target.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 80);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setCharIdx(0); setDisplayText(''); setTypingIdx(i => (i + 1) % typingSymptoms.length); }, 2000);
      return () => clearTimeout(t);
    }
  }, [charIdx, typingIdx]);

  return (
    <div className="medical-grid glow-mesh min-h-screen">
      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section className="relative px-4 pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4" />
            Empowering 2.4B+ Indians with AI Health
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`font-display font-black text-white leading-[1.05] tracking-tight mb-8 ${isRuralMode ? 'text-7xl sm:text-8xl' : 'text-6xl sm:text-7xl md:text-8xl'}`}
          >
            Intelligent <br className="hidden sm:block" />
            <span className="text-gradient">Healthcare</span> <br className="hidden sm:block" />
            for Everyone.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Arogya-Setu connects Patients, Doctors, and Hospitals into a unified medical graph powered by world-class AI. Accessible in 12 regional languages.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link to="/symptoms" className="btn-primary group">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/emergency" className="btn-secondary group border-red-500/20 text-red-500 hover:bg-red-500/10">
              <ShieldAlert className="w-5 h-5 animate-pulse" /> Emergency SOS
            </Link>
          </motion.div>

          {/* Interactive Search Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20 w-full max-w-4xl glass-card p-2 md:p-3 relative group"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 w-full">
                <Search className="w-5 h-5 text-white/20" />
                <div className="flex-1 min-h-[28px] text-white/50 text-lg font-medium flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={displayText}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                    >
                      {displayText}
                    </motion.span>
                  </AnimatePresence>
                  <span className="w-[2px] h-6 bg-primary ml-1 animate-pulse" />
                </div>
              </div>
              <button className="btn-primary w-full md:w-auto h-full py-4 px-10">
                Analyze Symptoms
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3 px-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-dark-900 border-2 border-dark-800 flex items-center justify-center text-[10px] font-bold text-white/40">
                    D{i}
                  </div>
                ))}
              </div>
              <p className="text-white/20 text-xs font-medium">420+ Specialists Online & Ready</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BENTO SERVICES GRID ────────────────────────────── */}
      <section className="px-4 py-32 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
                Modular <br /> Healthcare.
              </h2>
              <p className="text-white/40 text-lg font-medium">Everything you need for your health journey, integrated and AI-enhanced.</p>
            </div>
            <Link to="/login" className="btn-secondary">Explore All Modules</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${item.grid} glass-card-hover p-8 relative overflow-hidden group`}
              >
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/40 font-medium mb-8 max-w-xs">{item.desc}</p>
                <Link to={item.path} className="flex items-center gap-2 text-primary font-bold text-sm tracking-tight hover:gap-4 transition-all uppercase">
                  Explore <ArrowRight className="w-4 h-4" />
                </Link>
                {/* Decorative glow */}
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity ${item.color.split(' ')[0]}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE ANALYTICS BENTO ──────────────────────────── */}
      <section className="px-4 py-32 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-10 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight">
              Predictive <br /> Analytics.
            </h2>
            <p className="text-white/40 text-lg mb-8 font-medium">
              We monitor 28 states for potential disease outbreaks. Get real-time alerts and severity reports directly on your dashboard.
            </p>
            <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-1">
                <p className="text-white/20 text-[10px] font-bold uppercase mb-1">Total Verified Doctors</p>
                <p className="text-2xl font-black text-white font-display tracking-tight">48,240+</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-1">
                <p className="text-white/20 text-[10px] font-bold uppercase mb-1">Live Bed Count</p>
                <p className="text-2xl font-black text-primary font-display tracking-tight">1.2M</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card overflow-hidden h-[400px] md:h-auto group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center grayscale opacity-20 group-hover:scale-105 group-hover:opacity-30 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
            <div className="relative h-full p-10 flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-4 w-fit">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Outbreak Status: Delhi · Dengue · High
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Digital Surveillance</h3>
              <p className="text-white/50 font-medium max-w-sm mb-6">Our algorithms detected a 14% increase in viral patterns across Tier-2 cities this week.</p>
              <Link to="/gov-dashboard" className="btn-secondary w-fit py-3 px-6 text-sm">Open Gov Portal</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="px-4 py-40">
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[120px] -z-10" />
          <h2 className="text-4xl md:text-7xl font-display font-black text-white mb-8">
            The Future of <br className="hidden md:block" />
            <span className="text-gradient">Indian Healthcare</span>.
          </h2>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto mb-12">
            Join the ecosystem connecting millions of patients to verified medical care. No cost to get started. 
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/login" className="btn-primary px-12 py-5 text-xl">Join the Mission</Link>
            <Link to="/doctors" className="btn-secondary px-12 py-5 text-xl">Find a Specialist</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
