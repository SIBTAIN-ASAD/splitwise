import { Link } from 'react-router-dom';
import React from 'react';

const LoginButton = () => {
  return (
    <div className="flex items-center space-x-2">
      <Link to="/login" className="hover:text-gray-300">
        <button type="button" className="bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded"> Login </button>
      </Link>
      <Link to="/register" className="hover:text-gray-300">
        <button type="button" className="bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded"> Register </button>
      </Link>
    </div>
  );
}

export default LoginButton;