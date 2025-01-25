import axios from 'axios';



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Required for cookies/session
  headers: {
    'Content-Type': 'application/json',
  },
});


export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User does not exist');
    } else if (error.response?.status === 401) {
      console.log(error.response.data)
      throw new Error('Invalid email or password');
    }
    
    throw new Error('Login failed');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Email not registered');
    }
    console.log(error.message)
    throw new Error('Failed to send OTP');
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Invalid or expired OTP');
    }
    throw new Error('OTP verification failed');
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { email, newPassword });
    return response.data;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.log(error.message)
    throw new Error('Password reset failed');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error('Logout failed');
  }
};