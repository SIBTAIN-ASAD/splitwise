import React from 'react';
import { useAuth } from '../AuthContext';

const LoginButton = () => {
  const { currentUser, signInWithGoogle, signOutUser } = useAuth();

  return (
    <div className="flex items-center space-x-2">
      {currentUser ? (
        <button type="button" className="bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded" onClick={signOutUser}>
          Logout
        </button>
      ) : (
        <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={signInWithGoogle}>
          Sign In with Google
        </button>
      )}
    </div>
  );
};

export default LoginButton;
