import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import Login from './LoginButton';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 absolute w-screen">
      <div className="container mx-auto flex justify-between items-center w-screen">
        <div className="text-xl font-bold">
          <Link to="/" className="text-white">
            <img src={logo} alt="Logo" className="inline-block mr-2 w-32" />
          </Link>
        </div>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/expenses" className="hover:text-gray-300">
            Expenses
          </Link>
          <Link to="/reports" className="hover:text-gray-300">
            Reports
          </Link>
          <Link to="/settlement" className="hover:text-gray-300">
            Settlement
          </Link>
        </div>

        <Login />

      </div>
    </nav>
  );
}

export default Navbar;
