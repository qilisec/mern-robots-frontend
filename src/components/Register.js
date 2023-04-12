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
    <div className="max-w-[600px] text-center my-2.5 mx-auto pa-[15px] font-sans">
      <h1 className="text-white text-3xl font-bold pb-3 border-b ">Register</h1>
      <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
        Username:{' '}
        <input
          className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
          type="text"
          name="usernameInput"
          onChange={setRegisterInput}
        />
      </label>
      <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
        Email:{' '}
        <input
          className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
          type="text"
          name="emailInput"
          onChange={setRegisterInput}
        />
      </label>
      <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
        Password:{' '}
        <input
          className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
          type="password"
          name="passwordInput"
          onChange={setRegisterInput}
        />
        <button
          className="bg-pink-500 text-white uppercase mt-10 p-5 text-base font-thin tracking-wide inline-block appearance-none border-none rounded w-full"
          type="submit"
          onClick={handleRegistration}
        >
          Register
        </button>
      </label>
    </div>
  );
}

export default { Register };
