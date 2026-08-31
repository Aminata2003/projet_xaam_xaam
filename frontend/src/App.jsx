import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EtablissementDashboard from './pages/EtablissementDashboard';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/connexion" replace />} />
    <Route path="/connexion" element={<Login />} />
    <Route path="/inscription" element={<Register />} />
    <Route path="/eleve" element={<ProtectedRoute role="eleve"><StudentDashboard /></ProtectedRoute>} />
    <Route path="/parent" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
    <Route path="/superadmin" element={<ProtectedRoute role="superadmin"><AdminDashboard /></ProtectedRoute>} />
    <Route path="/etablissement" element={<ProtectedRoute role="etablissement"><EtablissementDashboard /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/connexion" replace />} />
  </Routes>;
}
