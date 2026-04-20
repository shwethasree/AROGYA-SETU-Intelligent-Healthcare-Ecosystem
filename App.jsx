import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SymptomChecker from './pages/SymptomChecker';
import FindDoctors from './pages/FindDoctors';
import HospitalsNearMe from './pages/HospitalsNearMe';
import Pharmacy from './pages/Pharmacy';
import HealthDashboard from './pages/HealthDashboard';
import Emergency from './pages/Emergency';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import GovDashboard from './pages/GovDashboard';

import PrescriptionScanner from './pages/PrescriptionScanner';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('arogyaUser');
  return user ? children : <Navigate to="/login" replace />;
}

import ArogyaMitra from './components/ArogyaMitra';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <ArogyaMitra />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/symptoms" element={<AppLayout><SymptomChecker /></AppLayout>} />
        <Route path="/scanner" element={<AppLayout><PrescriptionScanner /></AppLayout>} />
        <Route path="/doctors" element={<AppLayout><FindDoctors /></AppLayout>} />
        <Route path="/hospitals" element={<AppLayout><HospitalsNearMe /></AppLayout>} />
        <Route path="/pharmacy" element={<AppLayout><Pharmacy /></AppLayout>} />
        <Route path="/emergency" element={<AppLayout><Emergency /></AppLayout>} />
        <Route path="/health-dashboard" element={<ProtectedRoute><AppLayout><HealthDashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/doctor-dashboard" element={<ProtectedRoute><AppLayout><DoctorDashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/hospital-dashboard" element={<ProtectedRoute><AppLayout><HospitalDashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/gov-dashboard" element={<ProtectedRoute><AppLayout><GovDashboard /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
