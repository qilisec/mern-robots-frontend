// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import { useLoginForm } from './useLoginForm';

export function Login() {
  // const [user, setUser] = useState('');
  // const [password, setPassword] = useState('');
  const [loginInput, setLoginInput] = useLoginForm({
    usernameInput: '',
    passwordInput: '',
  });
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await auth.login(loginInput.usernameInput, loginInput.passwordInput);
    navigate('/');
  };

  return (
    <div>
      <label>
        Username:{' '}
        <input type="text" name="usernameInput" onChange={setLoginInput} />
        {/* <input type="text" onChange={(e) => useLoginForm(e.target.value)} /> */}
      </label>
      <label>
        Password:{' '}
        <input type="text" name="passwordInput" onChange={setLoginInput} />
        {/* <input type="text" onChange={(e) => setPassword(e.target.value)} /> */}
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </label>
    </div>
  );
}
