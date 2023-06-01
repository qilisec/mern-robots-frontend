// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { useAuth } from './auth.last.working';
import { useAuth } from './auth';
import { useLoginForm } from './useLoginForm';

export function Login() {
  // const [loginInput, setLoginInput] = useLoginForm({
  //   usernameInput: '',
  //   passwordInput: '',
  // });
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, getValues } = useForm();

  const handleLogin = async () => {
    // await auth.login(loginInput.usernameInput, loginInput.passwordInput);
    const { usernameInput, passwordInput } = getValues();
    await auth.login(usernameInput, passwordInput);

    navigate('/');
  };

  return (
    <div className="max-w-[600px] text-center my-2.5 mx-auto pa-[15px] font-sans">
      <h1 className="pb-3 text-3xl font-bold text-white border-b">Login</h1>
      <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
        Username:{' '}
        <input
          className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
          key="usernameInput"
          {...register('usernameInput')}
          defaultValue=""
        />
      </label>
      <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
        Password:{' '}
        <input
          className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
          type="password"
          {...register('passwordInput')}
          defaultValue=""
        />
        <button
          className="inline-block w-full p-5 mt-10 text-base font-thin tracking-wide text-white uppercase bg-pink-500 border-none rounded appearance-none"
          type="submit"
          onClick={handleLogin}
        >
          Login
        </button>
      </label>
    </div>
  );
}

export default Login;
