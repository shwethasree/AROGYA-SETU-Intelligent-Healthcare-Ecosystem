import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Globe } from 'lucide-react';

const links = {
  Platform: [
    { label: 'Home', path: '/' },
    { label: 'AI Symptom Checker', path: '/symptoms' },
    { label: 'Find Doctors', path: '/doctors' },
    { label: 'Hospitals Near Me', path: '/hospitals' },
    { label: 'Pharmacy', path: '/pharmacy' },
    { label: 'Emergency', path: '/emergency' },
  ],
  Dashboards: [
    { label: 'Patient Health', path: '/health-dashboard' },
    { label: 'Doctor Portal', path: '/doctor-dashboard' },
    { label: 'Hospital Portal', path: '/hospital-dashboard' },
    { label: 'Government Analytics', path: '/gov-dashboard' },
  ],
  Company: [
    { label: 'About Us', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'Contact', path: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-gradient">Arogya</span>
                <span className="text-white">-Setu</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered healthcare access, diagnosis, monitoring, and emergency support for everyone. Bridging the gap between people and quality healthcare.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-500" /> support@arogyasetu.in</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-500" /> 1800-XXX-XXXX (Toll Free)</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" /> New Delhi, India</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h3>
              <ul className="flex flex-col gap-2">
                {items.map(({ label, path }) => (
                  <li key={label}>
                    <Link to={path} className="text-white/50 hover:text-primary-400 text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="glass-card p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Doctors Registered', value: '48,000+' },
            { label: 'Hospitals Connected', value: '1,240+' },
            { label: 'Patients Served', value: '2.4M+' },
            { label: 'States Covered', value: '28 States' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-display font-bold text-gradient">{value}</p>
              <p className="text-white/50 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6">
          <p className="text-white/30 text-sm">
            © 2025 Arogya-Setu. All rights reserved. Built for National Hackathon.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-xs">Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-white/30 text-xs">for India's healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
