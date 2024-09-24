import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import Myevents from './components/Myevents';
import Create from './components/Create'; // Import Create component
import { auth } from './utils/firebase';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If no user is authenticated, redirect to login page
        navigate('/login');
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-event" element={<Create />} />
      <Route path="/" element={<Login />} /> {/* Default route */}
      <Route path="/my-events" element={<Myevents />} />
    </Routes>
  );
};

export default App;