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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <Link to="/login" className="text-black text-sm mb-4 inline-block">← Back</Link>
        <h1 className="text-2xl font-semibold mb-6">Forgot your password?</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Don&apos;t worry, you can recover your account<br />with a simple recovery OTP
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Enter your Registered Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <button type="submit" className="w-full py-3 mt-4 bg-black text-white rounded-md hover:bg-gray-800 transition">
            Get OTP
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">Already a part of us? </span>
          <Link to="/login" className="text-black text-sm">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
