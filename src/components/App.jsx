import React from 'react';
import Navbar from './navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './registrations/Login';
import Register from './registrations/Register';
import './App.css';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';

const App = () => {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expenses" element={<Expenses />} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;
