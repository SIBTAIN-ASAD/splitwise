import React from 'react';
import Navbar from './navbar/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './registrations/Login';
import Register from './registrations/Register';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>      
    </BrowserRouter>
  );
}

export default App;
