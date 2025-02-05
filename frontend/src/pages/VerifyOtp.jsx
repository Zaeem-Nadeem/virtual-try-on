import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../api/auth';
import toast from 'react-hot-toast';

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      // Move to next input
      if (value && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    try {
      await verifyOtp(email, otpString);
      toast.success('OTP verified successfully');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <Link to="/forgot-password" className="text-black text-sm mb-4 inline-block">← Back</Link>
        <h1 className="text-2xl font-semibold mb-6">Verify OTP</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the OTP sent to your email
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                className="w-16 h-16 text-center text-2xl font-semibold border-b-2 border-gray-300 focus:outline-none focus:border-black"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                required
              />
            ))}
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <button type="submit" className="w-full py-3 mt-4 bg-black text-white rounded-md hover:bg-gray-800 transition">
            Verify OTP
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

export default VerifyOtp;
