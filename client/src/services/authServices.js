import axios from 'axios';


const API_URL = 'http://localhost:5000/api/auth'; // Adjust if your API is on a different base URL

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Get logged in user profile
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data.data; // Assuming your backend returns user data under 'data' key
};

const authServices = {
  register,
  login,
  getMe,
};

export default authServices;