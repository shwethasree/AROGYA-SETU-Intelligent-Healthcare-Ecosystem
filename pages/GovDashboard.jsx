import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, HeatmapLayer, InfoWindow } from '@react-google-maps/api';
import { TrendingUp, Users, Building2, Syringe, Activity, AlertTriangle, Loader2, Globe, Map as MapIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { outbreakAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useRuralMode } from '../context/RuralModeContext';
import { motion, AnimatePresence } from 'framer-motion';

const severityColors = { High: '#f43f5e', Medium: '#f59e0b', Low: '#10b981' };
const COLORS = ['#2dd4bf', '#6366f1', '#a855f7', '#f59e0b', '#f43f5e'];

const mapContainerStyle = { width: '100%', height: '100%' };
const center = { lat: 20.5937, lng: 78.9629 }; // Center of India

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a1a1aa" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#18181b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

const hospitalResourceData = [
  { state: 'Delhi', beds: 85, doctors: 72, medicines: 90 },
  { state: 'UP',    beds: 62, doctors: 45, medicines: 58 },
  { state: 'MH',    beds: 78, doctors: 68, medicines: 82 },
  { state: 'TN',    beds: 70, doctors: 65, medicines: 75 },
  { state: 'WB',    beds: 55, doctors: 50, medicines: 60 },
];

export default function GovDashboard() {
  const { t } = useTranslation();
  const { isRuralMode } = useRuralMode();
  const [outbreaks, setOutbreaks]     = useState([]);
  const [stats, setStats]             = useState({});
  const [loading, setLoading]         = useState(true);
  const [selectedOutbreak, setSelectedOutbreak] = useState(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['visualization']
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [oData, sData] = await Promise.all([outbreakAPI.getAll(), outbreakAPI.getStats()]);
        setOutbreaks(oData.outbreaks || []);
        setStats(sData);
      } catch {
        const fallback = [
          { id:1, region:'Delhi',     disease:'Dengue',        cases:4200, severity:'High',   latitude:28.6139, longitude:77.2090 },
          { id:2, region:'Pune',      disease:'COVID-19',      cases:2400, severity:'High',   latitude:18.5204, longitude:73.8567 },
          { id:3, region:'Mumbai',    disease:'Leptospirosis', cases:3100, severity:'Medium', latitude:19.0760, longitude:72.8777 },
          { id:4, region:'Kolkata',   disease:'Malaria',       cases:1800, severity:'Medium', latitude:22.5726, longitude:88.3639 },
          { id:5, region:'Chennai',   disease:'Chikungunya',   cases:900,  severity:'Low',    latitude:13.0827, longitude:80.2707 },
          { id:6, region:'Hyderabad', disease:'Dengue',        cases:1200, severity:'Medium', latitude:17.3850, longitude:78.4867 },
        ];
        setOutbreaks(fallback);
        setStats({ total_cases: 13600, total_deaths: 36, total_recovered: 11760, total_outbreaks: 6 });
      } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const heatmapData = isLoaded ? outbreaks.map(o => ({
    location: new window.google.maps.LatLng(o.latitude, o.longitude),
    weight: o.cases / 100
  })) : [];

  const kpiCards = [
    { label:'TOTAL ACTIVE CASES',    value:(stats.total_cases     || 0).toLocaleString(),  icon:Activity,     color:'text-primary' },
    { label:'MORTALITY INDEX',   value:(stats.total_deaths    || 0).toLocaleString(),  icon:AlertTriangle, color:'text-rose-500' },
    { label:'GEO OUTBREAKS',      value:(stats.total_outbreaks || 0).toString(),         icon:TrendingUp,    color:'text-amber-400' },
    { label:'INFRA CAPACITY',      value:'82%',                                       icon:Building2,     color:'text-indigo-400' },
  ];

  const diseaseBreakdown = Object.entries(
    outbreaks.reduce((acc, o) => { acc[o.disease] = (acc[o.disease] || 0) + o.cases; return acc; }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className={`max-w-7xl mx-auto px-4 py-12 ${isRuralMode ? 'space-y-12' : 'space-y-8'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`font-display font-black text-white tracking-tight ${isRuralMode ? 'text-6xl mb-6' : 'text-4xl mb-2'}`}>
            {t('outbreakMonitoring')}
          </h1>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> NATIONAL HEALTH SURVEILLANCE
             </div>
             <p className="text-white/20 text-xs font-medium tracking-tight uppercase font-black">AI PREDICTIVE MODE ACTIVE</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            SECURE SYNC
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={`grid gap-4 ${isRuralMode ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
        {kpiCards.map(({ label, value, icon: Icon, color }, idx) => (
          <motion.div 
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-8 flex items-center gap-6 border-white/5 hover:border-white/10 shadow-2xl relative overflow-hidden group`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
              <p className={`text-3xl font-display font-black tracking-tighter ${color}`}>{value}</p>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-white/[0.02] blur-2xl group-hover:bg-primary/5 transition-all`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Heatmap Section */}
        <div className="lg:col-span-3 glass-card overflow-hidden shadow-2xl relative border-white/5" style={{ height: isRuralMode ? 700 : 550 }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={5}
              options={{ styles: darkMapStyle }}
            >
              <HeatmapLayer data={heatmapData} />
              {outbreaks.map(o => (
                <Marker
                  key={o.id}
                  position={{ lat: o.latitude, lng: o.longitude }}
                  onClick={() => setSelectedOutbreak(o)}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                    fillColor: severityColors[o.severity],
                    fillOpacity: 0.9,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                    scale: 1.2,
                  }}
                />
              ))}
              {selectedOutbreak && (
                <InfoWindow
                  position={{ lat: selectedOutbreak.latitude, lng: selectedOutbreak.longitude }}
                  onCloseClick={() => setSelectedOutbreak(null)}
                >
                  <div className="p-3 text-dark-900 min-w-[180px]">
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck className="w-4 h-4 text-red-600" />
                       <h3 className="font-black text-sm uppercase tracking-tight">{selectedOutbreak.region}</h3>
                    </div>
                    <div className="border-t pt-2 mt-1 space-y-1">
                      <p className="text-[10px] font-black text-red-600 uppercase">THREAT: {selectedOutbreak.disease}</p>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500 font-bold uppercase">CASES:</span>
                        <span className="font-black">{selectedOutbreak.cases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500 font-bold uppercase">SEVERITY:</span>
                        <span className="font-black" style={{ color: severityColors[selectedOutbreak.severity] }}>{selectedOutbreak.severity}</span>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-dark-900">
               <Loader2 className="w-12 h-12 text-primary animate-spin" />
               <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mt-6">Initializing Surveillance Grid...</p>
            </div>
          )}
          
          <div className="absolute top-6 left-6 p-5 glass-card bg-dark-900/80 backdrop-blur-xl border-white/10 min-w-[180px]">
            <p className="font-black text-[10px] uppercase tracking-[0.25em] text-primary mb-4 flex items-center gap-2">
               <Sparkles className="w-3 h-3" /> Heatmap Index
            </p>
            <div className="space-y-3">
               {[
                 { label: 'Critical Path', color: 'bg-rose-500' },
                 { label: 'Growth Vector', color: 'bg-amber-500' },
                 { label: 'Stabilized', color: 'bg-green-500' }
               ].map(i => (
                 <div key={i.label} className="flex items-center gap-3">
                   <div className={`w-2.5 h-2.5 rounded-full ${i.color} shadow-lg shadow-${i.color}/40`} />
                   <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{i.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* List of Alerts */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: isRuralMode ? 700 : 550 }}>
          <div className="flex items-center justify-between px-2">
            <h2 className={`font-black text-white/40 text-[10px] uppercase tracking-widest flex items-center gap-2`}>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Strategic Alerts
            </h2>
            <span className="text-rose-500 text-[10px] font-black">HIGH RISK</span>
          </div>
          {outbreaks.map((o, idx) => (
            <motion.div 
               key={o.id} 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.05 }}
               onClick={() => setSelectedOutbreak(o)} 
               className="glass-card p-5 border-white/5 hover:border-primary/20 cursor-pointer transition-all group relative overflow-hidden"
            >
              {o.severity === 'High' && (
                 <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 blur-xl group-hover:bg-rose-500/10 transition-all" />
              )}
              <div className="flex justify-between items-start mb-3">
                <span className="text-white font-black text-sm uppercase tracking-tight">{o.region}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/10 uppercase tracking-tighter" style={{ color: severityColors[o.severity], borderColor: `${severityColors[o.severity]}30` }}>
                  {o.severity}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-primary font-bold text-xs uppercase tracking-tight">{o.disease}</p>
                <p className="text-white/20 text-[10px] font-black uppercase">{o.cases.toLocaleString()} Vector Points</p>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${Math.min(o.cases/45, 100)}%` }} 
                   className="h-full bg-gradient-to-r from-rose-500 to-amber-500" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-10 shadow-2xl border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-white font-black text-xl flex items-center gap-3 tracking-tight">
              <Building2 className="w-6 h-6 text-primary" />
              PROVINCIAL RESOURCE BENCHMARKING
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hospitalResourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="state" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
              <ReTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: 'white', fontWeight: 'bold' }} />
              <Bar dataKey="beds" fill="#2dd4bf" radius={[6, 6, 0, 0]} barSize={25} />
              <Bar dataKey="medicines" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-10 flex flex-col items-center justify-center shadow-2xl border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-indigo-500/20" />
          <h2 className="text-white font-black text-sm uppercase tracking-[0.25em] mb-10 w-full text-center">Pathogen Prevalence</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={diseaseBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={95} dataKey="value" stroke="none" paddingAngle={5}>
                {diseaseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <ReTooltip contentStyle={{ background: '#0a0a0b', border: 'none', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 w-full">
            {diseaseBreakdown.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-white/30 text-[10px] font-black uppercase tracking-tight truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
