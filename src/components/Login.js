import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';

export function Login() {
  const [account, setAccount] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    auth.login(account);
    navigate('/');
  };
  return (
    <div>
      <label>
        Username:{' '}
        <input type="text" onChange={(e) => setAccount(e.target.value)} />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </label>
    </div>
  );
}
