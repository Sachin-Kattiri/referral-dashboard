import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { loginRequest } from '../utils/api.js';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const existingToken = Cookies.get('jwt_token');
  if (existingToken) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const result = await loginRequest(email, password);

    if (result.success) {
      Cookies.set('jwt_token', result.token);
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand">Go Business</h1>
        <p className="login-tagline">Sign in to open your referral dashboard.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-button login-submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
