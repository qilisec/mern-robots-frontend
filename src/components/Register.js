// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from './auth';
import { useRegisterForm } from './useLoginForm';

export function Register() {
  // const [user, setUser] = useState('');
  // const [password, setPassword] = useState('');
  // const [registerInput, setRegisterInput] = useRegisterForm({
  //   usernameInput: '',
  //   passwordInput: '',
  //   emailInput: '',
  // });
  const { register, handleSubmit } = useForm();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRegistration = async (data) => {
    // const registeredUser = await auth.register(
    //   registerInput.usernameInput,
    //   registerInput.emailInput,
    //   registerInput.passwordInput
    // );
    // const data = getValues();
    const { usernameInput, emailInput, passwordInput } = data;
    const registeredUser = await auth.register(
      usernameInput,
      emailInput,
      passwordInput
    );
    console.log(`handleRegistration`, registeredUser);
    navigate('/');
  };

  return (
    <div className="max-w-[600px] text-center my-2.5 mx-auto pa-[15px] font-sans">
      <h1 className="pb-3 text-3xl font-bold text-white border-b ">Register</h1>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
          Username:{' '}
          <input
            className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
            type="text"
            {...register('usernameInput')}
            defaultValue=""
            // onChange={setRegisterInput}
          />
        </label>
        <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
          Email:{' '}
          <input
            className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
            type="text"
            {...register('emailInput')}
            defaultValue=""
            // onChange={setRegisterInput}
          />
        </label>
        <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
          Password:{' '}
          <input
            className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
            type="password"
            {...register('passwordInput')}
            defaultValue=""
            // onChange={setRegisterInput}
          />
          <button
            className="inline-block w-full p-5 mt-10 text-base font-thin tracking-wide text-white uppercase bg-pink-500 border-none rounded appearance-none"
            type="submit"
            onClick={handleRegistration}
          >
            Register
          </button>
        </label>
      </form>
    </div>
  );
}

export default { Register };
