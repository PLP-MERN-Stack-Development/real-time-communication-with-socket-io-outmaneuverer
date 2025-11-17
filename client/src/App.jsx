import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from "react-hot-toast";
import { AuthContext } from '../context/AuthContext';

function App() {
  const { authUser } = useContext(AuthContext); // ✅ lowercase 'authUser'

  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1514678740932-c28a2a8d57da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dW5zcGxhc2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600')] bg-contain">
      <Toaster />
      <Routes>
        <Route path="/" element={ authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
