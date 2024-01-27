// Dashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if there is no current user
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div>
      {currentUser && (
        <>
          <h1>Welcome, {currentUser.username}!</h1>
          {/* Display additional content for the dashboard */}
        </>
      )}
    </div>
  );
};

export default Dashboard;
