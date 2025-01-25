import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import toast from 'react-hot-toast';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await resetPassword(email, newPassword);
      toast.success('Password reset successful');
      navigate('/login');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/verify-otp" className="back-button">← Back</Link>
      <h1 className="auth-title">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="password"
            className="input-field"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('');
            }}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            className="input-field"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="auth-button">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;