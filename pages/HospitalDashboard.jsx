import { useState } from 'react';
import { BedDouble, Activity, AlertTriangle, Users, Plus, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockHospitals } from '../data/mockData';

const admissionData = [
  { hour: '6AM', admissions: 3 }, { hour: '9AM', admissions: 7 }, { hour: '12PM', admissions: 11 },
  { hour: '3PM', admissions: 8 }, { hour: '6PM', admissions: 14 }, { hour: '9PM', admissions: 6 }, { hour: '12AM', admissions: 2 },
];

const emergencyCases = [
  { id: 'E001', patient: 'Male, 58', condition: 'Cardiac Arrest', status: 'Critical', time: '09:14 AM', ward: 'ICU-1' },
  { id: 'E002', patient: 'Female, 34', condition: 'Road Accident', status: 'Serious', time: '10:32 AM', ward: 'Emergency' },
  { id: 'E003', patient: 'Child, 7', condition: 'High Fever + Seizure', status: 'Stable', time: '11:05 AM', ward: 'Pediatric' },
];

export default function HospitalDashboard() {
  const hospital = mockHospitals[0];
  const [beds, setBeds] = useState({ total: hospital.beds.total, available: hospital.beds.available, icu: hospital.beds.icu, emergency: hospital.beds.emergency });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Hospital Dashboard</h1>
        <p className="text-primary-400 mt-1">AIIMS Delhi — Resource & Bed Management</p>
      </div>

      {/* Bed Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Beds', key: 'total', color: 'text-white', bg: 'from-slate-600 to-slate-500', icon: BedDouble },
          { label: 'Available', key: 'available', color: 'text-green-400', bg: 'from-green-600 to-green-400', icon: BedDouble },
          { label: 'ICU', key: 'icu', color: 'text-amber-400', bg: 'from-amber-600 to-amber-400', icon: Activity },
          { label: 'Emergency', key: 'emergency', color: 'text-red-400', bg: 'from-red-600 to-red-400', icon: AlertTriangle },
        ].map(({ label, key, color, bg, icon: Icon }) => (
          <div key={label} className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center mb-3 shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-4xl font-display font-black ${color}`}>{beds[key]}</p>
            <p className="text-white/50 text-sm mt-1">{label}</p>
            {key !== 'total' && (
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => setBeds(b => ({ ...b, [key]: Math.max(0, b[key] - 1) }))} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Minus className="w-3 h-3 text-white/70" />
                </button>
                <span className="text-white/30 text-xs">Adjust</span>
                <button onClick={() => setBeds(b => ({ ...b, [key]: Math.min(b.total, b[key] + 1) }))} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Plus className="w-3 h-3 text-white/70" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Admissions chart */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Today's Admissions by Hour</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={admissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }} />
              <Bar dataKey="admissions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Bed Utilization</h2>
          <div className="flex flex-col gap-4 mt-2">
            {[
              { label: 'General Ward', used: beds.total - beds.available, total: beds.total - beds.icu - beds.emergency, color: 'bg-primary-500' },
              { label: 'ICU', used: hospital.beds.icu - beds.icu, total: hospital.beds.icu, color: 'bg-amber-500' },
              { label: 'Emergency', used: hospital.beds.emergency - beds.emergency, total: hospital.beds.emergency, color: 'bg-red-500' },
            ].map(({ label, used, total, color }) => {
              const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/70 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{Math.max(0, used)}/{total} beds</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-white/30 text-xs">{pct}% occupied</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emergency Cases */}
      <div className="glass-card p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" /> Active Emergency Cases
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-left border-b border-white/10">
                <th className="pb-3 font-medium">Case ID</th>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Condition</th>
                <th className="pb-3 font-medium">Ward</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {emergencyCases.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-primary-400 font-mono">{c.id}</td>
                  <td className="py-3 text-white">{c.patient}</td>
                  <td className="py-3 text-white/70">{c.condition}</td>
                  <td className="py-3 text-white/60">{c.ward}</td>
                  <td className="py-3 text-white/40">{c.time}</td>
                  <td className="py-3">
                    <span className={`badge text-xs ${c.status === 'Critical' ? 'badge-danger' : c.status === 'Serious' ? 'badge-warning' : 'badge-success'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
