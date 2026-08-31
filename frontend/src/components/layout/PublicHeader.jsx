import { Link } from 'react-router-dom';
import Brand from '../Brand';

export default function PublicHeader() {
  return (
    <header className="public-header">
      <Link to="/connexion" className="brand-link"><Brand /></Link>
    </header>
  );
}
