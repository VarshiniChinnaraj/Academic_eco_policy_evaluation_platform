import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-login-page">
      <div className="gc-login-card">
        <div className="gc-login-logo">🌿</div>
        <h1 className="gc-login-title">Academic Eco Policy<br />Evaluation Platform</h1>
        <p className="gc-login-sub">Sign in to your admin account</p>

        {error && (
          <Alert variant="danger" className="py-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
            ⚠️ {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="gc-form-label">Email Address</label>
            <input
              type="email"
              className="gc-input form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="gc-form-label">Password</label>
            <input
              type="password"
              className="gc-input form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-gc-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <><Spinner size="sm" className="me-2" />Signing in...</>
            ) : (
              '🔐 Sign In'
            )}
          </button>
        </form>
         {/* Sign Up Link */}
        <div className="text-center mt-3">
          <small>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
