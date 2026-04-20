import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, X, Plus, AlertTriangle, CheckCircle, Stethoscope, ShieldAlert } from 'lucide-react';
import { symptomsAPI } from '../services/api';

const allSymptoms = ['fever','cough','chest pain','headache','fatigue','nausea','shortness of breath','joint pain','rash','dizziness','sore throat','abdominal pain'];

const riskConfig = {
  Critical: { color: 'red',   bg: 'bg-red-500/10',   border: 'border-red-500/30',   text: 'text-red-400',   icon: ShieldAlert },
  High:     { color: 'red',   bg: 'bg-red-500/10',   border: 'border-red-500/30',   text: 'text-red-400',   icon: AlertTriangle },
  Medium:   { color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle },
  Low:      { color: 'green', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: CheckCircle },
};

export default function SymptomChecker() {
  const [input, setInput]     = useState('');
  const [selected, setSelected] = useState([]);
  const [results, setResults]   = useState(null);
  const [apiReco, setApiReco]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);

  const suggestions = allSymptoms.filter(s =>
    s.toLowerCase().includes(input.toLowerCase()) && !selected.includes(s) && input.length > 0
  );

  const addSymptom    = (s) => { setSelected(prev => [...new Set([...prev, s])]); setInput(''); };
  const removeSymptom = (s) => setSelected(prev => prev.filter(x => x !== s));

  const analyze = async () => {
    if (selected.length === 0) return;
    setLoading(true); setResults(null); setProgress(0);

    // Animate progress bar
    const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 150);

    try {
      const user = JSON.parse(localStorage.getItem('arogyaUser') || '{}');
      const data = await symptomsAPI.analyze(selected, user?.patientId || null);
      setProgress(100);
      setResults(data.results || []);
      setApiReco(data.recommendation || '');
    } catch {
      // Fallback if API is down
      setResults([{ disease: 'API Unavailable', confidence: 0, risk: 'Low' }]);
      setApiReco('Backend not reachable — check server at localhost:5000');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const topRisk = results?.[0]?.risk || 'Low';
  const topConfig = riskConfig[topRisk] || riskConfig.Low;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center shadow-lg">
          <Brain className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">AI Symptom Checker</h1>
        <p className="text-white/50 text-lg">Enter your symptoms and our AI will analyze possible conditions</p>
      </div>

      <div className="glass-card p-8 mb-6">
        <label className="text-white/70 text-sm font-medium mb-3 block">Add Your Symptoms</label>

        {/* Tags */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map(s => (
              <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 text-primary-300 rounded-full text-sm">
                {s}
                <button onClick={() => removeSymptom(s)} className="hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            className="input-field pr-12"
            placeholder="Type symptom (e.g. fever, cough, chest pain...)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && suggestions.length > 0) addSymptom(suggestions[0]); }}
          />
          {input && (
            <button onClick={() => { addSymptom(input.toLowerCase()); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => addSymptom(s)} className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-white/70 text-sm hover:bg-primary-500/20 hover:border-primary-500/30 hover:text-primary-300 transition-all">
                + {s}
              </button>
            ))}
          </div>
        )}

        {/* Quick picks */}
        <div className="mt-4">
          <p className="text-white/40 text-xs mb-2">Common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {['fever', 'cough', 'headache', 'fatigue', 'nausea', 'chest pain', 'rash'].map(s => (
              !selected.includes(s) && (
                <button key={s} onClick={() => addSymptom(s)} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm hover:text-primary-400 transition-colors">
                  {s}
                </button>
              )
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={analyze}
          disabled={selected.length === 0 || loading}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Brain className="w-5 h-5" /> Analyze {selected.length} Symptom{selected.length !== 1 ? 's' : ''}</>
          )}
        </button>

        {/* Progress bar */}
        {loading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>AI Analysis in progress...</span><span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-4">
          {/* Risk Banner */}
          <div className={`p-4 rounded-xl border ${topConfig.bg} ${topConfig.border} flex items-center gap-3`}>
            <topConfig.icon className={`w-6 h-6 ${topConfig.text} flex-shrink-0`} />
            <div>
              <p className={`font-bold ${topConfig.text}`}>Overall Risk: {topRisk}</p>
              <p className="text-white/60 text-sm">{apiReco || results[0]?.recommendation}</p>
            </div>
          </div>

          <h3 className="text-white font-semibold text-lg">Possible Conditions ({results.length})</h3>

          {results.map(({ disease, confidence, risk, recommendation }) => {
            const cfg = riskConfig[risk] || riskConfig.Low;
            return (
              <div key={disease} className="glass-card p-5 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold text-lg">{disease}</h4>
                  <span className={`badge ${cfg.bg} ${cfg.border} ${cfg.text} capitalize`}>{risk}</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500" style={{ width: `${confidence}%` }} />
                  </div>
                  <span className="text-primary-400 font-semibold text-sm">{confidence}%</span>
                </div>
                <p className="text-white/50 text-sm">{recommendation}</p>
              </div>
            );
          })}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link to="/doctors" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Stethoscope className="w-5 h-5" /> Book a Doctor
            </Link>
            <Link to="/emergency" className="btn-emergency flex-1 flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Emergency Help
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
