import { useState, useEffect } from 'react';
import { Stethoscope, MapPin, Star, Clock, Calendar, Search, Filter, X, Check, Loader2 } from 'lucide-react';
import { doctorsAPI } from '../services/api';

const specialties = ['All', 'Cardiologist', 'General Physician', 'Neurologist', 'Orthopedic', 'Dermatologist', 'Pediatrician'];
const locations    = ['All', 'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Kolkata'];
const avatarColors = ['from-purple-500 to-blue-500','from-teal-500 to-emerald-500','from-orange-500 to-rose-500','from-blue-500 to-cyan-500','from-pink-500 to-rose-500','from-amber-500 to-orange-500'];
const timeSlots    = ['09:00 AM','10:30 AM','11:00 AM','12:30 PM','02:00 PM','03:30 PM','05:00 PM','06:00 PM'];

export default function FindDoctors() {
  const [doctors, setDoctors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [location, setLocation]   = useState('All');
  const [searchText, setSearchText] = useState('');
  const [availOnly, setAvailOnly]   = useState(false);
  const [bookingDr, setBookingDr]   = useState(null);
  const [booked, setBooked]         = useState(false);
  const [slot, setSlot]             = useState('');
  const [bookLoading, setBookLoading] = useState(false);

  // ── Fetch doctors from real API ──────────────────────────────────────────
  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (specialty !== 'All') params.specialty = specialty;
        if (location  !== 'All') params.city      = location;
        if (availOnly)           params.available  = 'true';
        const data = await doctorsAPI.getAll(params);
        setDoctors(data.doctors || []);
      } catch (err) {
        setError('Could not load doctors. Using local fallback...');
        // Fallback to a few demo entries so the page still works offline
        setDoctors([
          { id:1, name:'Dr. Priya Sharma', specialty:'Cardiologist',      city:'Mumbai', experienceYrs:12, consultationFee:1500, rating:'4.9', isAvailable:true, totalReviews:340 },
          { id:2, name:'Dr. Arjun Mehta',  specialty:'General Physician', city:'Delhi',  experienceYrs:8,  consultationFee:500,  rating:'4.7', isAvailable:true, totalReviews:210 },
          { id:3, name:'Dr. Sneha Patel',  specialty:'Neurologist',       city:'Pune',   experienceYrs:10, consultationFee:1200, rating:'4.8', isAvailable:false, totalReviews:180 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [specialty, location, availOnly]);

  // ── Client-side text search ──────────────────────────────────────────────
  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBook = async () => {
    if (!slot) return;
    setBookLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setBooked(true);
    setBookLoading(false);
    setTimeout(() => { setBookingDr(null); setBooked(false); setSlot(''); }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white mb-2">Find Doctors</h1>
        <p className="text-white/50 text-lg flex items-center gap-2">
          Search and book appointments with verified specialists
          <span className="px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Live from PostgreSQL
          </span>
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input type="text" className="input-field pl-11" placeholder="Search doctor name or specialty..."
              value={searchText} onChange={e => setSearchText(e.target.value)} />
          </div>
          <select className="input-field lg:w-48" value={specialty} onChange={e => setSpecialty(e.target.value)}>
            {specialties.map(s => <option key={s} value={s} className="bg-dark-800">{s}</option>)}
          </select>
          <select className="input-field lg:w-48" value={location} onChange={e => setLocation(e.target.value)}>
            {locations.map(l => <option key={l} value={l} className="bg-dark-800">{l}</option>)}
          </select>
          <button onClick={() => setAvailOnly(!availOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${availOnly ? 'bg-primary-500/20 border-primary-500/40 text-primary-400' : 'bg-white/5 border-white/20 text-white/60'}`}>
            {availOnly ? <Check className="w-4 h-4" /> : <Filter className="w-4 h-4" />} Available Only
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          <span className="text-white/50 ml-3">Loading doctors from database...</span>
        </div>
      ) : (
        <>
          {error && <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">{error}</div>}
          <p className="text-white/50 text-sm mb-4">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((dr, i) => (
              <div key={dr.id} className="glass-card-hover p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg`}>
                    {dr.name?.split(' ')[1]?.charAt(0) || 'D'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold truncate">{dr.name}</h3>
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ml-2 ${dr.isAvailable ? 'bg-green-400' : 'bg-white/20'}`} title={dr.isAvailable ? 'Available' : 'Unavailable'} />
                    </div>
                    <p className="text-primary-400 text-sm font-medium">{dr.specialty}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-white/30" />
                      <span className="text-white/40 text-xs">{dr.city || 'India'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-white font-bold text-sm">{parseFloat(dr.rating || 4.5).toFixed(1)}</span>
                    </div>
                    <p className="text-white/40 text-xs">Rating</p>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <span className="text-white font-bold text-sm">{dr.experienceYrs || dr.experience || '—'}y</span>
                    <p className="text-white/40 text-xs">Exp.</p>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <span className="text-white font-bold text-sm">₹{dr.consultationFee || dr.fee || '—'}</span>
                    <p className="text-white/40 text-xs">Fee</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{(dr.totalReviews || 0).toLocaleString()} reviews</span>
                </div>

                <button onClick={() => { if (dr.isAvailable) { setBookingDr(dr); setBooked(false); setSlot(''); } }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${dr.isAvailable ? 'btn-primary' : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'}`}>
                  <Calendar className="w-4 h-4" />
                  {dr.isAvailable ? 'Book Appointment' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Booking Modal */}
      {bookingDr && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 w-full max-w-md relative">
            <button onClick={() => setBookingDr(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
              <X className="w-4 h-4 text-white/60" />
            </button>
            {booked ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Appointment Booked!</h3>
                <p className="text-white/60">Your appointment with <span className="text-primary-400">{bookingDr.name}</span> at <span className="text-white">{slot}</span> is confirmed.</p>
              </div>
            ) : (
              <>
                <h3 className="text-white font-bold text-xl mb-1">Book Appointment</h3>
                <p className="text-primary-400 mb-6">{bookingDr.name} · {bookingDr.specialty}</p>
                <div className="mb-4">
                  <label className="text-white/60 text-sm mb-2 block">Select Date</label>
                  <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="mb-6">
                  <label className="text-white/60 text-sm mb-2 block">Select Time Slot</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(t => (
                      <button key={t} onClick={() => setSlot(t)}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all ${slot === t ? 'bg-primary-500/20 border-primary-500/50 text-primary-300' : 'bg-white/5 border-white/10 text-white/50 hover:border-primary-500/30'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleBook} disabled={!slot || bookLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {bookLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                  Confirm Booking at {slot || '—'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
