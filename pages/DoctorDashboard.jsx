import { useState } from 'react';
import { Users, ClipboardList, FileText, Brain, Clock, CheckCircle, AlertCircle, X, Send } from 'lucide-react';
import { mockPatients } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const appointmentData = [
  { day: 'Mon', count: 8 }, { day: 'Tue', count: 12 }, { day: 'Wed', count: 6 },
  { day: 'Thu', count: 15 }, { day: 'Fri', count: 10 }, { day: 'Sat', count: 4 }, { day: 'Sun', count: 2 },
];

const statusColors = { Confirmed: 'badge-success', Waiting: 'badge-warning', Rescheduled: 'badge-info' };

const aiSuggestions = [
  { patient: 'Rahul Verma', suggestion: 'Consider adjusting antihypertensive medication — BP trending up over past 2 weeks', risk: 'medium' },
  { patient: 'Sunita Devi', suggestion: 'HbA1c test overdue by 2 months — schedule immediately to track diabetes control', risk: 'high' },
  { patient: 'Meera Joshi', suggestion: 'Migraine frequency increased from 1×/week to 3×/week — evaluate prophylaxis options', risk: 'low' },
];

const medicines = ['Paracetamol 500mg', 'Amoxicillin 500mg', 'Metformin 500mg', 'Amlodipine 5mg', 'Omeprazole 20mg', 'Atorvastatin 10mg'];

export default function DoctorDashboard() {
  const [selected, setSelected] = useState(null);
  const [prescModal, setPrescModal] = useState(null);
  const [prescItems, setPrescItems] = useState([{ medicine: '', dosage: '', duration: '' }]);
  const [prescSent, setPrescSent] = useState(false);
  const user = JSON.parse(localStorage.getItem('arogyaUser') || '{}');

  const addPrescItem = () => setPrescItems(p => [...p, { medicine: '', dosage: '', duration: '' }]);
  const removePrescItem = (i) => setPrescItems(p => p.filter((_, idx) => idx !== i));
  const updatePrescItem = (i, field, val) => setPrescItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const sendPrescription = async () => {
    await new Promise(r => setTimeout(r, 1000));
    setPrescSent(true);
    setTimeout(() => { setPrescModal(null); setPrescSent(false); setPrescItems([{ medicine: '', dosage: '', duration: '' }]); }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Doctor Dashboard</h1>
          <p className="text-primary-400 mt-1">Welcome back, {user.name || 'Doctor'} 👨‍⚕️</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Today's Patients", value: mockPatients.length, icon: Users, color: 'text-primary-400', bg: 'from-primary-600 to-primary-400' },
            { label: 'Pending', value: 2, icon: Clock, color: 'text-amber-400', bg: 'from-amber-600 to-amber-400' },
            { label: 'Completed', value: 1, icon: CheckCircle, color: 'text-green-400', bg: 'from-green-600 to-green-400' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass-card px-5 py-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-white/40 text-xs">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary-400" /> Today's Appointment Queue
            </h2>
            <div className="flex flex-col gap-3">
              {mockPatients.map(p => (
                <div key={p.id} className={`p-4 rounded-xl border cursor-pointer transition-all ${selected?.id === p.id ? 'bg-primary-500/10 border-primary-500/40' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                  onClick={() => setSelected(selected?.id === p.id ? null : p)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">{p.name.charAt(0)}</div>
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-white/40 text-sm">{p.condition} · Age {p.age} · Last visit: {p.lastVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-sm hidden sm:block">{p.appointment}</span>
                      <span className={`badge text-xs ${statusColors[p.status]}`}>{p.status}</span>
                    </div>
                  </div>
                  {selected?.id === p.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setPrescModal(p); }}
                        className="btn-primary text-sm flex items-center justify-center gap-1.5 py-2.5">
                        <FileText className="w-4 h-4" /> Write Prescription
                      </button>
                      <button className="btn-secondary text-sm flex items-center justify-center gap-1.5 py-2.5">
                        <Brain className="w-4 h-4" /> AI Diagnosis Support
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Weekly Appointments</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }} />
                <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" /> AI Diagnosis Suggestions
            </h2>
            <div className="flex flex-col gap-3">
              {aiSuggestions.map(({ patient, suggestion, risk }) => (
                <div key={patient} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{patient}</span>
                    <span className={`badge text-xs ${risk === 'high' ? 'badge-danger' : risk === 'medium' ? 'badge-warning' : 'badge-success'}`}>{risk}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" /> Live Alerts
            </h2>
            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">⚠️ Sunita Devi's glucose level above threshold today</div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">🚨 Emergency case admitted — ICU consultation needed</div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">📅 2 appointment reschedule requests pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {prescModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setPrescModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
              <X className="w-4 h-4 text-white/60" />
            </button>
            {prescSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Prescription Sent!</h3>
                <p className="text-white/60">Digital prescription sent to <span className="text-primary-400">{prescModal.name}</span></p>
              </div>
            ) : (
              <>
                <h3 className="text-white font-bold text-xl mb-1">Write Digital Prescription</h3>
                <p className="text-primary-400 text-sm mb-6">Patient: {prescModal.name} · {prescModal.condition}</p>
                <div className="flex flex-col gap-3 mb-4">
                  {prescItems.map((item, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-start">
                      <select className="input-field col-span-5 text-sm" value={item.medicine} onChange={e => updatePrescItem(i, 'medicine', e.target.value)}>
                        <option value="">Medicine</option>
                        {medicines.map(m => <option key={m} value={m} className="bg-dark-800">{m}</option>)}
                      </select>
                      <input className="input-field col-span-3 text-sm" placeholder="Dosage" value={item.dosage} onChange={e => updatePrescItem(i, 'dosage', e.target.value)} />
                      <input className="input-field col-span-3 text-sm" placeholder="Days" value={item.duration} onChange={e => updatePrescItem(i, 'duration', e.target.value)} />
                      <button onClick={() => removePrescItem(i)} className="w-10 h-10 mt-0.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20">
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addPrescItem} className="btn-secondary text-sm w-full mb-4 flex items-center justify-center gap-1.5">+ Add Medicine</button>
                <textarea className="input-field text-sm mb-4" rows={3} placeholder="Doctor's notes and instructions..."></textarea>
                <button onClick={sendPrescription} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Digital Prescription
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
