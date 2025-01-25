import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phoneNo: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="fullName"
            className="input-field"
            placeholder="Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            name="username"
            className="input-field"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="Email"
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
        <button type="submit" className="auth-button">create my account</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>already a part of us? </span>
        <Link to="/login" className="auth-link" style={{ display: 'inline' }}>
          login
        </Link>
      </div>
    </div>
  );
}

export default Register;