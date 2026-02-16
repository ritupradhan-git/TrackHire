// src/App.js (Example)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Home from './pages/Home.jsx'; // Create a Home page if you don't have one
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx'; // Create a Dashboard page
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx'; // Create a Navbar component
import Home from './pages/Home.jsx';

function App() {
  return (

      <AuthProvider>
        <Navbar /> {/* Your navigation bar */}
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} /> {/* <--- Home Page Route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* Add other protected routes here similarly */}
        </Routes>
      </AuthProvider>

  );
}

export default App;