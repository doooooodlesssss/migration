import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Migration Insight Tool</div>
      <ul className="navbar-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/patterns">Pattern Search</Link></li>
        <li><Link to="/reports">Report Generator</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;