import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="Go to dashboard home">
          Go Business
        </Link>

        <nav aria-label="Primary" className="navbar-nav">
          <Link to="/">Home</Link>
        </nav>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
