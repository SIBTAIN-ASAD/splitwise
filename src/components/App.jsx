import React from 'react';
import Navbar from './navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './registrations/Login';
import Register from './registrations/Register';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import ExpenseReport from '../pages/ExpenseReport';
import Settlements from '../pages/Settlements';

const App = () => {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<ExpenseReport />} />
        <Route path="/settlement" element={<Settlements />} />
        <Route path="/add-expense" element={<div>Add Expense</div>} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;
