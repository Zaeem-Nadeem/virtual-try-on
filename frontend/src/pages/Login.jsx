import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      setFormData({ email: '', password: '' });
      navigate('/dashboard');
    } catch (error) {
      setFormData({ email: '', password: '' });
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-4">Log in</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded mb-2"
            placeholder="Email address / Phone no."
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="w-full p-2 border rounded mb-2"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <Link to="/forgot-password" className="text-blue-500 text-sm">Forgot password?</Link>
          <button type="submit" className="w-full bg-black text-white py-2 rounded mt-3">Let’s go in</button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-3">
          New here? <Link to="/register" className="text-blue-500">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;