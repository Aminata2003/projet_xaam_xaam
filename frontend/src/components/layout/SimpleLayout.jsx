import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../Brand';
import { useAuth } from '../../context/AuthContext';

// Parent et Superadmin n'ont pas de sidebar dans la maquette : juste une barre du
// haut avec le logo et l'utilisateur connecté, puis le contenu en pleine largeur.
export default function SimpleLayout({ children, roleLabel, homePath = '/parent' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="simple-shell">
      <header className="simple-topbar">
        <Link to={homePath} className="brand-link"><Brand /></Link>
        <div className="side-user">
          <div className="avatar">{(user?.nom || user?.name || 'U').slice(0, 2).toUpperCase()}</div>
          <div className="user-info">
            <strong>{user?.nom || user?.name || 'Utilisateur'}</strong>
            <small>{roleLabel}</small>
          </div>
          <button className="icon-btn" onClick={() => { logout(); navigate('/connexion'); }} title="Se déconnecter">
            <LogOut size={16} />
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
