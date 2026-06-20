import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-page">
      <p className="not-found-code">404</p>
      <h1>Page not found</h1>
      <p className="not-found-copy">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="back-link">
        ← Back to dashboard
      </Link>
    </div>
  );
}

export default NotFound;
