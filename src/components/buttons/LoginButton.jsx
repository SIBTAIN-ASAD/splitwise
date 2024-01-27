import React from 'react';
import { useAuth } from '../AuthContext';
import GoogleButton from './GoogleButton';
import LogoutIcon from '../icons/LogoutIcon';

const LoginButton = () => {
  const { currentUser, signInWithGoogle, signOutUser } = useAuth();

  return (
    <div className="flex items-center space-x-2">
      {currentUser ? (
        <button type="button" onClick={signOutUser}>
          <LogoutIcon />
          <span className="sr-only">Logout</span>
        </button>
      ) : (
        <GoogleButton onClick={signInWithGoogle} />
      )}
    </div>
  );
};

export default LoginButton;
