import { useState, useRef } from 'react';
import { Pill, Search, Upload, MapPin, Clock, Package, Check, X } from 'lucide-react';
import { mockPharmacies, mockMedicines } from '../data/mockData';

export default function Pharmacy() {
  const [search, setSearch] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const filteredMeds = mockMedicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) setUploaded(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white mb-2">Pharmacy</h1>
        <p className="text-white/50 text-lg">Check medicine availability and find nearby pharmacies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload & Pharmacies */}
        <div className="flex flex-col gap-6">
          {/* Prescription Upload */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary-400" /> Upload Prescription
            </h2>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                dragging ? 'border-primary-500 bg-primary-500/10' : uploaded ? 'border-green-500 bg-green-500/5' : 'border-white/20 hover:border-primary-500/50 hover:bg-white/5'
              }`}
            >
              <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf" onChange={() => setUploaded(true)} />
              {uploaded ? (
                <>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-green-400 font-medium">Prescription Uploaded!</p>
                  <p className="text-white/40 text-sm mt-1">Pharmacies will be notified</p>
                  <button onClick={(e) => { e.stopPropagation(); setUploaded(false); }} className="mt-3 text-xs text-white/30 hover:text-white/60">Remove</button>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60 font-medium">Drop prescription here</p>
                  <p className="text-white/30 text-sm mt-1">or click to browse · PDF / Image</p>
                </>
              )}
            </div>
          </div>

          {/* Nearby Pharmacies */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-400" /> Nearby Pharmacies
            </h2>
            <div className="flex flex-col gap-3">
              {mockPharmacies.map(p => (
                <div key={p.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary-500/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium text-sm">{p.name}</h3>
                      <p className="text-white/40 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {p.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`badge text-xs ${p.open ? 'badge-success' : 'badge-danger'}`}>
                        {p.open ? 'Open' : 'Closed'}
                      </span>
                      <span className="text-white/30 text-xs">{p.distance}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Package className="w-3 h-3" />
                    <span>{p.medicines.toLocaleString()} medicines in stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Medicine Search */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary-400" /> Medicine Availability
          </h2>
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              className="input-field pl-11"
              placeholder="Search by medicine name, brand, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['All', 'Pain Relief', 'Antibiotic', 'Diabetes', 'Cardio'].map(cat => (
              <button key={cat} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs hover:border-primary-500/30 hover:text-primary-400 transition-all">
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filteredMeds.length === 0 ? (
              <div className="text-center py-10 text-white/30">
                <Package className="w-12 h-12 mx-auto mb-2" />
                <p>No medicines found</p>
              </div>
            ) : (
              filteredMeds.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/20 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{m.name}</p>
                      <p className="text-white/40 text-sm">{m.brand} · <span className="text-white/30">{m.category}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold">₹{m.price}</span>
                    <span className={`badge text-xs ${m.available ? 'badge-success' : 'badge-danger'}`}>
                      {m.available ? (
                        <><Check className="w-3 h-3" /> In Stock</>
                      ) : (
                        <><X className="w-3 h-3" /> Out of Stock</>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info banner */}
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-400 text-sm font-medium">⚠️ Prescription Required</p>
            <p className="text-white/50 text-xs mt-1">Some medications require a valid doctor's prescription. Upload above to get them verified.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
