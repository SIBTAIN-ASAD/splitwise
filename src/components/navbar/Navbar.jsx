import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import LoginButton from '../buttons/LoginButton';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 px-12">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="text-white">
            <img src={logo} alt="Logo" className="inline-block mr-2 w-32" />
          </Link>
        </div>
        <div className="hidden md:flex space-x-4"> {/* Hide on small screens */}
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/expenses" className="hover:text-gray-300">
            Expenses
          </Link>
          <Link to="/reports" className="hover:text-gray-300">
            Report
          </Link>
          <Link to="/settlement" className="hover:text-gray-300">
            Settlements
          </Link>
        </div>

        <LoginButton />

      </div>
    </nav>
  );
}

export default Navbar;
