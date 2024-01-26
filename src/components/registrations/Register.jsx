import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import  App from '../../config/firebase';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


const auth = getAuth(App);
  
const register = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('User registered successfully');
    } catch (error) {
        console.error('Error creating user:', error.message);
    }
}

const handleRegister = () => {
    if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
    }
    // Password Must be 6 characters long
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email');
        return;
    }
    // Username Validation
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        alert('Username can only contain alphanumeric characters');
        return;
    }
    // if everything is ok, register the user
    register(email, password);
}

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <form>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-purple-500 text-white font-bold py-2 rounded hover:bg-purple-700 focus:outline-none"
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-purple-500">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
