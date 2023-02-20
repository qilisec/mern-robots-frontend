import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';

export default function Profile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };
  return (
    <div>
      Welcome {auth.user}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
