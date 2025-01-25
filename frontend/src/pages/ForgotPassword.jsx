import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success('OTP sent to your email');
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/login" className="back-button">← Back</Link>
      <h1 className="auth-title">Forgot your password?</h1>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem', textAlign: 'center' }}>
        don&apos;t worry, you can recover your account<br />with a simple recovery OTP
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            className="input-field"
            placeholder="Enter your Registered Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="auth-button">Get OTP</button>
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

export default ForgotPassword;