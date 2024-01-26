import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="text-white">
            Splitwise
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
        <div className="flex items-center space-x-2">
          {/* Add user profile information and logout button */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
