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
    <div className="Login">
      <h1 className="MultiPageForm">Login</h1>
      <label className="MultiPageForm">
        Username:{' '}
        <input
          className="MultiPageForm"
          type="text"
          name="usernameInput"
          onChange={setLoginInput}
        />
        {/* <input type="text" onChange={(e) => useLoginForm(e.target.value)} /> */}
      </label>
      <label className="MultiPageForm">
        Password:{' '}
        <input
          className="MultiPageForm"
          type="text"
          name="passwordInput"
          onChange={setLoginInput}
        />
        {/* <input type="text" onChange={(e) => setPassword(e.target.value)} /> */}
        <button className="MultiPageForm" type="button" onClick={handleLogin}>
          Login
        </button>
      </label>
    </div>
  );
}
