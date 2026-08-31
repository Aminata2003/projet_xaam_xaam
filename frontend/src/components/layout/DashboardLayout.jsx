import { LogOut, MessageSquarePlus, Search } from 'lucide-react';
import Brand from '../Brand';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Sidebar réservée à l'espace Élève : c'est le seul écran avec une sidebar dans la maquette.
// Parent et Superadmin utilisent SimpleLayout (voir SimpleLayout.jsx).
export default function DashboardLayout({ children, onNewConversation, search, onSearchChange, historySlot }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="side-brand"><Brand /></div>

        <button className="side-new-btn" onClick={onNewConversation}>
          <MessageSquarePlus size={16} /> Nouvelle conversation
        </button>

        <label className="side-search">
          <Search size={14} />
          <input
            placeholder="Rechercher une conversation…"
            value={search || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </label>

        <div className="sidebar-flex-spacer" style={{ overflowY: 'auto' }}>
          {historySlot}
        </div>

        <div className="side-user">
          <div className="avatar">{(user?.nom || user?.name || 'U').slice(0, 2).toUpperCase()}</div>
          <div className="user-info">
            <strong>{user?.nom || user?.name || 'Utilisateur'}</strong>
            <small>Élève{user?.niveau ? ` · ${user.niveau}` : ''}</small>
          </div>
          <button className="icon-btn" onClick={() => { logout(); navigate('/connexion'); }} title="Se déconnecter">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <main className="main-area">{children}</main>
    </div>
  );
}
