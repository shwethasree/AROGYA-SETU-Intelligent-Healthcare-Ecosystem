import { useState } from 'react';
import {
  Heart, Activity, Thermometer, Droplets, Brain,
  TrendingUp, TrendingDown, Minus, AlertCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { healthMetrics, digitalTwinRisks, weeklyHealthData } from '../data/mockData';

function MetricCard({ icon: Icon, label, value, unit, status, trend, color }) {
  const trendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const TIcon = trendIcon;
  return (
    <div className="glass-card p-5 hover:border-primary-500/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`badge text-xs ${status === 'normal' ? 'badge-success' : 'badge-danger'}`}>{status}</span>
      </div>
      <p className="text-3xl font-display font-bold text-white">{value}</p>
      <p className="text-white/40 text-sm">{label} <span className="text-white/20">({unit})</span></p>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend > 0 ? 'text-red-400' : trend < 0 ? 'text-green-400' : 'text-white/30'}`}>
          <TIcon className="w-3 h-3" />
          <span>{Math.abs(trend)} from yesterday</span>
        </div>
      )}
    </div>
  );
}

function RiskBar({ disease, probability, level, icon }) {
  const color = level === 'Low' ? 'bg-green-500' : level === 'Moderate' ? 'bg-amber-500' : 'bg-red-500';
  const textColor = level === 'Low' ? 'text-green-400' : level === 'Moderate' ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary-500/20 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-white font-medium text-sm">{disease}</span>
        </div>
        <span className={`text-xs font-bold ${textColor}`}>{probability}% Risk</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${probability}%` }} />
      </div>
      <span className={`text-xs mt-1 ${textColor}`}>{level}</span>
    </div>
  );
}

const radarData = [
  { subject: 'Heart', score: 88 }, { subject: 'Lungs', score: 92 }, { subject: 'Liver', score: 78 },
  { subject: 'Kidneys', score: 85 }, { subject: 'Brain', score: 95 }, { subject: 'Immune', score: 80 },
];

export default function HealthDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const score = healthMetrics.healthScore;
  const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Health Dashboard</h1>
          <p className="text-white/50 text-lg">Your real-time health monitoring & AI Digital Twin</p>
        </div>
        <div className="flex gap-2">
          {['overview', 'trends', 'digital-twin'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-primary-500/20 border border-primary-500/40 text-primary-400' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Health Score */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="glass-card p-6 flex flex-col items-center justify-center">
              <p className="text-white/60 text-sm mb-4 font-medium">Overall Health Score</p>
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#0d9488" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-display font-black ${scoreColor}`}>{score}</span>
                </div>
              </div>
              <p className="text-primary-400 font-semibold mt-3">Good Health</p>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard icon={Heart} label="Heart Rate" value={healthMetrics.heartRate.value} unit={healthMetrics.heartRate.unit} status={healthMetrics.heartRate.status} trend={healthMetrics.heartRate.trend} color="bg-gradient-to-br from-red-500 to-pink-500" />
              <MetricCard icon={Activity} label="SpO2" value={healthMetrics.spo2.value} unit={healthMetrics.spo2.unit} status={healthMetrics.spo2.status} trend={healthMetrics.spo2.trend} color="bg-gradient-to-br from-blue-500 to-cyan-500" />
              <MetricCard icon={Thermometer} label="Temperature" value={healthMetrics.temperature.value} unit={healthMetrics.temperature.unit} status={healthMetrics.temperature.status} trend={healthMetrics.temperature.trend} color="bg-gradient-to-br from-amber-500 to-orange-500" />
              <MetricCard icon={Droplets} label="Blood Glucose" value={healthMetrics.glucose.value} unit={healthMetrics.glucose.unit} status={healthMetrics.glucose.status} trend={healthMetrics.glucose.trend} color="bg-gradient-to-br from-purple-500 to-indigo-500" />
              <div className="glass-card p-5 flex flex-col justify-center col-span-2 md:col-span-1">
                <p className="text-white/40 text-xs mb-1">Blood Pressure</p>
                <p className="text-3xl font-display font-bold text-white">{healthMetrics.bloodPressure.value}</p>
                <p className="text-white/40 text-sm">mmHg</p>
                <span className="badge-success text-xs mt-2 w-fit">Normal</span>
              </div>
            </div>
          </div>

          {/* Organ radar */}
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Organ Health Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <Radar name="Health" dataKey="score" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === 'trends' && (
        <div className="flex flex-col gap-6">
          {['heartRate', 'spo2', 'steps'].map(key => (
            <div key={key} className="glass-card p-6">
              <h3 className="text-white font-semibold mb-4 capitalize">{key === 'spo2' ? 'SpO2 (%)' : key === 'heartRate' ? 'Heart Rate (bpm)' : 'Steps'} — Weekly Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }} />
                  <Line type="monotone" dataKey={key} stroke="#0d9488" strokeWidth={2.5} dot={{ fill: '#0d9488', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'digital-twin' && (
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl">AI Health Digital Twin</h2>
              <p className="text-white/50 text-sm">Predictive health model based on your data</p>
            </div>
          </div>
          <div className="mt-2 mb-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <p className="text-purple-300 text-sm">Last prediction update: Today · Based on 72 data points</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {digitalTwinRisks.map(r => <RiskBar key={r.disease} {...r} />)}
          </div>
          <div className="p-5 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <h3 className="text-primary-400 font-semibold mb-3">🧠 AI Recommendations</h3>
            <ul className="flex flex-col gap-2">
              {[
                'Reduce sugar intake to lower diabetes risk',
                'Daily 30-min walk to improve cardiovascular health',
                'Annual BP checkup recommended',
                'Stay hydrated — drink 3L water daily',
              ].map(r => (
                <li key={r} className="flex items-start gap-2 text-white/70 text-sm">
                  <span className="text-primary-400 mt-0.5">→</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
