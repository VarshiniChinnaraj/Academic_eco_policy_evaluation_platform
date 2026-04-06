import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert, Spinner } from 'react-bootstrap';

export default function Register() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-login-page">
      <div className="gc-login-card">

        <div className="gc-login-logo">🌿</div>

        <h1 className="gc-login-title">
          Academic Eco Policy<br/>Evaluation Platform
        </h1>

        <p className="gc-login-sub">Create your account</p>

        {error && (
          <Alert variant="danger" className="py-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
            ⚠️ {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="gc-form-label">Full Name</label>
            <input
              type="text"
              className="gc-input form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="gc-form-label">Email Address</label>
            <input
              type="email"
              className="gc-input form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="gc-form-label">Password</label>
            <input
              type="password"
              className="gc-input form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-gc-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <><Spinner size="sm" className="me-2"/>Creating Account...</>
            ) : (
              '📝 Sign Up'
            )}
          </button>

        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account? <Link to="/login">Sign In</Link>
          </small>
        </div>

      </div>
    </div>
  );
}