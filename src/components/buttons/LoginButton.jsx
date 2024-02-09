import React from 'react';
import { useAuth } from '../AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import db  from '../../config/firebasedb';
import { useNavigate } from 'react-router-dom';
import GoogleButton from './GoogleButton';
import LogoutIcon from '../icons/LogoutIcon';
import { getAuth } from 'firebase/auth';

const LoginButton = () => {
  const { currentUser, signInWithGoogle, signOutUser } = useAuth();
  const navigate = useNavigate();


  const registerWithGoogle = async () => {
      const auth = getAuth();
      let { displayName, email, photoURL: imageUrl } = auth.currentUser;

      if (!imageUrl) {
          imageUrl = 'https://via.placeholder.com/250';
      }
      
      try {
          await addDoc(collection(db, 'user_detail'), {
              displayName,
              email,
              picture: imageUrl,
              userName: displayName,
          });
          navigate('/');
      } catch (error) {
          console.error('Error adding user:', error.message);
      }
  }

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
      try {
          await signInWithGoogle();
          await registerWithGoogle();

      } catch (error) {
          console.error('Error signing in with Google:', error.message);
      }
  }


  return (
    <div className="flex items-center space-x-2">
      {currentUser ? (
        <button type="button" onClick={signOutUser}>
          <LogoutIcon />
          <span className="sr-only">Logout</span>
        </button>
      ) : (
        <GoogleButton onClick={handleGoogleSignIn} />
      )}
    </div>
  );
};

export default LoginButton;
