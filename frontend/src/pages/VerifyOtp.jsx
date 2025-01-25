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
    <div className="auth-container">
      <Link to="/forgot-password" className="back-button">← Back</Link>
      <h1 className="auth-title">Verify OTP</h1>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem', textAlign: 'center' }}>
        Enter the OTP sent to your email
      </p>
      <form onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              className="otp-input"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              required
            />
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="auth-button">Verify OTP</button>
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

export default VerifyOtp;