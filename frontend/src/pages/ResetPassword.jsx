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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <Link to="/verify-otp" className="text-black text-sm mb-4 inline-block">← Back</Link>
        <h1 className="text-2xl font-semibold mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <button type="submit" className="w-full py-3 mt-4 bg-black text-white rounded-md hover:bg-gray-800 transition">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
