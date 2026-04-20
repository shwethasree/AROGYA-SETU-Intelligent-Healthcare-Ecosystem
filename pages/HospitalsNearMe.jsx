import { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import { Building2, BedDouble, Activity, Navigation, Phone, Loader2, RefreshCw, Star, Info, ShieldCheck, MapPin } from 'lucide-react';
import { hospitalsAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useRuralMode } from '../context/RuralModeContext';
import { motion, AnimatePresence } from 'framer-motion';

const containerStyle = { width: '100%', height: '100%' };
const center = { lat: 28.5665, lng: 77.21 }; // AIIMS Delhi as default center

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#0a0a0b' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0b' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#18181b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#27272a' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#18181b' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#52525b' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  ],
};

function BedBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-white/30 text-[10px] w-14 flex-shrink-0 font-bold uppercase">{label}</span>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          className={`h-full rounded-full ${color}`} 
        />
      </div>
      <span className="text-white/60 text-[10px] font-black w-8 text-right">{value}</span>
    </div>
  );
}

export default function HospitalsNearMe() {
  const { t } = useTranslation();
  const { isRuralMode } = useRuralMode();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedID, setSelectedID] = useState(null);
  const [updating, setUpdating]   = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' });

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await hospitalsAPI.getAll();
      setHospitals(data.hospitals || []);
      if (data.hospitals?.length) setSelectedID(data.hospitals[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  const selectedHosp = hospitals.find(h => h.id === selectedID);

  const updateBeds = async (id, field, delta) => {
    setUpdating(id);
    const h = hospitals.find(h => h.id === id);
    if (!h) return;
    const newVal = Math.max(0, (h[field] || 0) + delta);
    const update = { [field]: newVal };
    try {
      await hospitalsAPI.updateBeds(id, update);
      setHospitals(prev => prev.map(hosp => hosp.id === id ? { ...hosp, ...update } : hosp));
    } catch { /* ignore */ }
    finally { setUpdating(null); }
  };

  const onMapLoad = useCallback((map) => { setMap(map); }, []);

  return (
    <div className={`max-w-7xl mx-auto px-4 py-12 ${isRuralMode ? 'space-y-12' : 'space-y-8'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`font-display font-black text-white tracking-tight ${isRuralMode ? 'text-6xl mb-6' : 'text-4xl mb-2'}`}>
            {t('nearbyHospitals')}
          </h1>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live Infrastructure Network
             </div>
             <p className="text-white/20 text-xs font-medium">Synced with State Medical Board</p>
          </div>
        </div>
        <button 
          onClick={fetchHospitals} 
          className={`btn-secondary ${isRuralMode ? 'px-10 py-5 text-xl' : 'px-6 py-3 text-sm'}`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
          {isRuralMode ? 'REFRESH LIST' : 'Refresh System'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-3 glass-card overflow-hidden relative shadow-2xl group" style={{ height: isRuralMode ? 700 : 600 }}>
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onLoad={onMapLoad}
              options={mapOptions}
            >
              <MarkerClusterer>
                {(clusterer) =>
                  hospitals.map((h) => (
                    <Marker
                      key={h.id}
                      position={{ lat: parseFloat(h.latitude), lng: parseFloat(h.longitude) }}
                      clusterer={clusterer}
                      onClick={() => setSelectedID(h.id)}
                      icon={{
                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                        fillColor: selectedID === h.id ? "#2dd4bf" : "#6366f1",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                        scale: 1.8,
                      }}
                    />
                  ))
                }
              </MarkerClusterer>
              {selectedHosp && (
                <InfoWindow
                  position={{ lat: parseFloat(selectedHosp.latitude), lng: parseFloat(selectedHosp.longitude) }}
                  onCloseClick={() => setSelectedID(null)}
                >
                  <div className="p-3 text-dark-900 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck className="w-4 h-4 text-primary" />
                       <h3 className="font-black text-sm uppercase tracking-tight">{selectedHosp.name}</h3>
                    </div>
                    <div className="space-y-1 border-t pt-2 mt-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500 font-bold">TYPE:</span>
                        <span className="font-black text-blue-600 uppercase">{selectedHosp.type}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500 font-bold">BEDS:</span>
                        <span className="font-black text-green-600">{selectedHosp.availableBeds} AVAILABLE</span>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-dark-900">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
              </div>
              <p className="text-white/40 text-sm font-bold mt-6 tracking-widest uppercase">Initializing Visual Infrastructure...</p>
            </div>
          )}
        </div>

        {/* Sidebar Hospital List */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: isRuralMode ? 700 : 600 }}>
          <div className="flex items-center justify-between px-2">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Regional Centers
            </h3>
            <span className="text-primary text-[10px] font-black">{hospitals.length} FOUND</span>
          </div>
          {loading && hospitals.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-40 glass-card bg-white/[0.02] border-white/5 animate-pulse" />)}
            </div>
          ) : (
            hospitals.map((h, idx) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedID(h.id)}
                className={`glass-card p-5 cursor-pointer relative overflow-hidden group border ${
                  selectedID === h.id 
                    ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 translate-x-[-4px]' 
                    : 'border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                {selectedID === h.id && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                )}
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-white font-black leading-tight truncate ${isRuralMode ? 'text-2xl' : 'text-sm'}`}>{h.name}</h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-white text-[10px] font-black">{parseFloat(h.rating || 4.2).toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <BedBar label="Regular" value={h.availableBeds || 0} total={h.totalBeds || 1} color="bg-primary" />
                  <BedBar label="Critical" value={h.icuBeds       || 0} total={h.totalBeds || 1} color="bg-indigo-500" />
                </div>
                <div className="flex gap-2">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`} target="_blank" rel="noreferrer"
                    className="flex-1 btn-primary py-2.5 text-[10px] rounded-xl hover:shadow-none">
                    <Navigation className="w-3.5 h-3.5" /> NAVIGATE
                  </a>
                  <a href={`tel:${h.phone}`}
                    className="flex-1 btn-secondary py-2.5 text-[10px] rounded-xl border-white/5">
                    <Phone className="w-3.5 h-3.5" /> CONTACT
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Bed Management Context Window */}
      <AnimatePresence>
        {selectedHosp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="glass-card p-8 border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -z-10 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-10 flex-wrap gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-xl animate-glow">
                  <Building2 className="w-8 h-8 text-dark-900" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                     <h2 className="text-white font-black text-3xl tracking-tight uppercase">{selectedHosp.name}</h2>
                     <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-tighter">CENTRAL_ID: {selectedHosp.id}</span>
                  </div>
                  <p className="text-primary font-bold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> SECURE INFRASTRUCTURE MANAGEMENT PORT
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">System Status</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-white/60 text-sm font-bold uppercase tracking-tight">Active Online</span>
                </div>
              </div>
            </div>

            <div className={`grid gap-6 ${isRuralMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
              {[
                { label: 'Network Capacity', value: selectedHosp.totalBeds,    color: 'text-white',    icon: Building2, field: null },
                { label: 'Active Vacancy',   value: selectedHosp.availableBeds, color: 'text-primary', icon: BedDouble, field: 'availableBeds' },
                { label: 'Critical Care',    value: selectedHosp.icuBeds,       color: 'text-indigo-400', icon: Activity,  field: 'icuBeds' },
                { label: 'ER Response',      value: selectedHosp.emergencyBeds, color: 'text-rose-500',   icon: Activity,  field: 'emergencyBeds' },
              ].map(({ label, value, color, icon: Icon, field }) => (
                <div key={label} className={`relative group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/10`}>
                  <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-all group-hover:scale-110">
                    <Icon className="w-40 h-40" />
                  </div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
                    {label}
                  </p>
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-4xl font-black tracking-tighter font-display ${color}`}>{value}</span>
                    {field && (
                      <div className="flex gap-3">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          disabled={updating === selectedHosp.id} onClick={() => updateBeds(selectedHosp.id, field, -1)}
                          className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/40 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all text-xl font-black`}>-</motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          disabled={updating === selectedHosp.id} onClick={() => updateBeds(selectedHosp.id, field, 1)}
                          className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/40 flex items-center justify-center hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all text-xl font-black`}>+</motion.button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <AnimatePresence>
              {isRuralMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 p-8 bg-amber-500/10 border-2 border-amber-500/20 rounded-[3rem] flex flex-col md:flex-row items-center gap-8"
                >
                  <div className="w-24 h-24 rounded-[2rem] bg-amber-400 flex items-center justify-center shadow-2xl text-5xl">ℹ️</div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-amber-100 text-3xl font-black mb-2">Need Help Booking?</p>
                    <p className="text-amber-100/60 text-xl font-bold">If you cannot read the text, press the <span className="text-white bg-red-600 px-3 py-1 rounded-lg">CONTACT</span> button above to talk to this hospital directly.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
