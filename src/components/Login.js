// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import { useLoginForm } from './useLoginForm';

export function Login() {
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
    <div className="max-w-[600px] text-center my-2.5 mx-auto pa-[15px] font-sans">
      <h1 className="text-white text-3xl font-bold pb-3 border-b">Login</h1>
      <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
        Username:{' '}
        <input
          className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
          type="text"
          name="usernameInput"
          onChange={setLoginInput}
        />
        {/* <input type="text" onChange={(e) => useLoginForm(e.target.value)} /> */}
      </label>
      <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
        Password:{' '}
        <input
          className='"text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg'
          type="password"
          name="passwordInput"
          onChange={setLoginInput}
        />
        {/* <input type="text" onChange={(e) => setPassword(e.target.value)} /> */}
        <button
          className="bg-pink-500 text-white uppercase mt-10 p-5 text-base font-thin tracking-wide inline-block appearance-none border-none rounded w-full"
          type="submit"
          onClick={handleLogin}
        >
          Login
        </button>
      </label>
    </div>
  );
}
