import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      await login(formData);
          formData.email=""
          formData.password=""
      navigate('/dashboard');
    } catch (error) {
          formData.email=""
    formData.password=""
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Log in</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="Email address / Phone no."
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <Link to="/forgot-password" className="auth-link">forgot password?</Link>
        <button type="submit" className="auth-button">let&apos;s go in</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>new here? </span>
        <Link to="/register" className="auth-link" style={{ display: 'inline' }}>
          create an account
        </Link>
      </div>
    </div>
  );
}

export default Login;