// ─── Arogya-Setu API Service Layer ───────────────────────────────────────────
// All API calls go through here — easy to swap mock ↔ real backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Helper ────────────────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = localStorage.getItem('arogyaToken');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data;
}

const get  = (path)         => request(path);
const post = (path, body)   => request(path, { method: 'POST',  body: JSON.stringify(body) });
const put  = (path, body)   => request(path, { method: 'PUT',   body: JSON.stringify(body) });
const del  = (path)         => request(path, { method: 'DELETE' });

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (email, password)  => post('/auth/login',    { email, password }),
  register: (data)             => post('/auth/register', data),
  me:       ()                 => get('/auth/me'),
};

// ── Doctors ───────────────────────────────────────────────────────────────────
export const doctorsAPI = {
  getAll:   (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/doctors${q ? '?' + q : ''}`);
  },
  getById:  (id)          => get(`/doctors/${id}`),
};

// ── Hospitals ─────────────────────────────────────────────────────────────────
export const hospitalsAPI = {
  getAll:    (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/hospitals${q ? '?' + q : ''}`);
  },
  getById:   (id)          => get(`/hospitals/${id}`),
  updateBeds:(id, beds)    => put(`/hospitals/${id}/beds`, beds),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentsAPI = {
  getAll:       (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/appointments${q ? '?' + q : ''}`);
  },
  book:         (data)        => post('/appointments', data),
  updateStatus: (id, status)  => put(`/appointments/${id}/status`, { status }),
};

// ── Symptoms ──────────────────────────────────────────────────────────────────
export const symptomsAPI = {
  analyze: (symptoms, patientId = null) =>
    post('/symptoms/analyze', { symptoms, patientId }),
  getLogs: (patientId) => get(`/symptoms/logs/${patientId}`),
};

// ── Health ────────────────────────────────────────────────────────────────────
export const healthAPI = {
  getRecords:   (patientId, limit = 30) => get(`/health/records/${patientId}?limit=${limit}`),
  addRecord:    (data)                  => post('/health/records', data),
  digitalTwin:  (patientId)             => get(`/health/digital-twin/${patientId}`),
};

// ── Emergency ─────────────────────────────────────────────────────────────────
export const emergencyAPI = {
  sos:      (data)        => post('/emergency/sos', data),
  getCases: (hospitalId)  => get(`/emergency/cases${hospitalId ? '?hospitalId=' + hospitalId : ''}`),
};

// ── Outbreak ──────────────────────────────────────────────────────────────────
export const outbreakAPI = {
  getAll:   (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/outbreak${q ? '?' + q : ''}`);
  },
  getStats: ()            => get('/outbreak/stats'),
  report:   (data)        => post('/outbreak', data),
};

// ── Pharmacy ──────────────────────────────────────────────────────────────────
export const pharmacyAPI = {
  getAll:      (city)  => get(`/pharmacy${city ? '?city=' + city : ''}`),
  getMedicines:(q, category) => {
    const params = new URLSearchParams();
    if (q)        params.set('q', q);
    if (category) params.set('category', category);
    return get(`/pharmacy/medicines?${params.toString()}`);
  },
};

export default { authAPI, doctorsAPI, hospitalsAPI, appointmentsAPI, symptomsAPI, healthAPI, emergencyAPI, outbreakAPI, pharmacyAPI };
