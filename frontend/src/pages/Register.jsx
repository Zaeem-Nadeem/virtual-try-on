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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6">Sign up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="fullName"
              className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <button type="submit" className="w-full py-3 mt-4 bg-black text-white rounded-md hover:bg-gray-800 transition">
            Create my account
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

export default Register;
