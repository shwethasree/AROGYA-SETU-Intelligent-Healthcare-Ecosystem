import { useState, useEffect } from 'react';
import { Phone, MapPin, Navigation, AlertTriangle, Heart, AlertOctagon } from 'lucide-react';

const emergencyNumbers = [
  { label: 'Ambulance', number: '108', icon: '🚑', color: 'from-red-600 to-red-500' },
  { label: 'Police', number: '100', icon: '👮', color: 'from-blue-700 to-blue-500' },
  { label: 'Fire', number: '101', icon: '🚒', color: 'from-orange-600 to-orange-400' },
  { label: 'Disaster Mgmt', number: '1078', icon: '🆘', color: 'from-purple-600 to-purple-400' },
];

const nearbyEmergencyHospitals = [
  { name: 'AIIMS Delhi — Emergency', distance: '2.3 km', eta: '8 min', beds: 45, phone: '011-26588500' },
  { name: 'Safdarjung Hospital', distance: '3.5 km', eta: '12 min', beds: 22, phone: '011-26730000' },
  { name: 'Apollo Hospital', distance: '4.1 km', eta: '14 min', beds: 10, phone: '1860-500-1066' },
];

export default function Emergency() {
  const [sos, setSos] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (sos && !activated) {
      if (countdown > 0) {
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setActivated(true);
      }
    }
  }, [sos, countdown, activated]);

  const handleSOS = () => { setSos(true); setCountdown(5); setActivated(false); };
  const cancelSOS = () => { setSos(false); setCountdown(5); setActivated(false); };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center shadow-lg glow-red">
          <AlertOctagon className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Emergency Help</h1>
        <p className="text-white/50 text-lg">One-tap emergency assistance — available 24/7</p>
      </div>

      {/* Big SOS Button */}
      <div className="flex flex-col items-center mb-12">
        {!sos ? (
          <div className="relative flex items-center justify-center">
            {/* Rings */}
            <div className="absolute w-56 h-56 rounded-full border-2 border-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute w-44 h-44 rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '2.5s' }} />
            <button
              onClick={handleSOS}
              className="relative w-36 h-36 rounded-full bg-gradient-to-br from-red-600 to-red-500 shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              <Heart className="w-12 h-12 text-white mb-1" />
              <span className="text-white font-black text-xl tracking-widest">SOS</span>
            </button>
          </div>
        ) : !activated ? (
          <div className="text-center">
            <div className="w-36 h-36 rounded-full bg-red-600/30 border-4 border-red-500 flex flex-col items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white text-5xl font-black">{countdown}</span>
              <span className="text-red-300 text-sm">seconds</span>
            </div>
            <p className="text-white font-semibold mb-4">Sending emergency signal in {countdown}s...</p>
            <button onClick={cancelSOS} className="btn-secondary flex items-center gap-2 mx-auto">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Cancel SOS
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-36 h-36 rounded-full bg-green-500/20 border-4 border-green-400 flex flex-col items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚑</span>
              <span className="text-green-400 font-bold text-sm mt-1">DISPATCHED</span>
            </div>
            <p className="text-white font-bold text-xl mb-2">Ambulance Dispatched!</p>
            <p className="text-white/60 mb-4">Help is on the way. Stay calm and stay on the line.</p>
            <div className="glass-card p-4 text-sm text-white/70 max-w-sm mx-auto mb-4">
              📍 Your location has been shared with nearby hospitals and emergency services.
            </div>
            <button onClick={cancelSOS} className="btn-secondary text-sm mx-auto flex items-center gap-2">
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Emergency Numbers */}
      <div className="mb-10">
        <h2 className="text-white font-semibold text-xl mb-4">Quick Emergency Calls</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emergencyNumbers.map(({ label, number, icon, color }) => (
            <a
              key={label}
              href={`tel:${number}`}
              className={`glass-card p-5 text-center hover:scale-105 transition-transform duration-200 group`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg`}>
                {icon}
              </div>
              <p className="text-white font-bold text-2xl">{number}</p>
              <p className="text-white/50 text-sm">{label}</p>
              <div className="mt-2 flex items-center justify-center gap-1 text-primary-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <Phone className="w-3 h-3" /> Tap to call
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Nearest Hospitals */}
      <div>
        <h2 className="text-white font-semibold text-xl mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-400" /> Nearest Emergency Hospitals
        </h2>
        <div className="flex flex-col gap-4">
          {nearbyEmergencyHospitals.map(h => (
            <div key={h.name} className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold">{h.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {h.distance}</span>
                  <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5 text-primary-400" /> ETA: {h.eta}</span>
                  <span className="badge-success text-xs">{h.beds} beds available</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${h.phone}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-all">
                  <Navigation className="w-4 h-4" /> Navigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
