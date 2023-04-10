// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import { useRegisterForm } from './useLoginForm';

export function Register() {
  // const [user, setUser] = useState('');
  // const [password, setPassword] = useState('');
  const [registerInput, setRegisterInput] = useRegisterForm({
    usernameInput: '',
    passwordInput: '',
    emailInput: '',
  });
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRegistration = async () => {
    const registeredUser = await auth.register(
      registerInput.usernameInput,
      registerInput.emailInput,
      registerInput.passwordInput
    );
    console.log(`handleRegistration`, registeredUser);
    navigate('/');
  };

  return (
    <div className="Register">
      <h1 className="MultiPageForm">Register</h1>
      <label className="MultiPageForm">
        Username:{' '}
        <input
          className="MultiPageForm"
          type="text"
          name="usernameInput"
          onChange={setRegisterInput}
        />
      </label>
      <label className="MultiPageForm">
        Email:{' '}
        <input
          className="MultiPageForm"
          type="text"
          name="emailInput"
          onChange={setRegisterInput}
        />
      </label>
      <label className="MultiPageForm">
        Password:{' '}
        <input
          className="MultiPageForm"
          type="text"
          name="passwordInput"
          onChange={setRegisterInput}
        />
        <button
          className="MultiPageForm"
          type="button"
          onClick={handleRegistration}
        >
          Register
        </button>
      </label>
    </div>
  );
}

export default { Register };
