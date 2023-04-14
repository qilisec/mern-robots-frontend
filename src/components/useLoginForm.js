import { useState } from 'react';

export const useLoginForm = (initialInput) => {
  const [loginInput, setLoginInput] = useState({ initialInput });

  return [
    loginInput,
    (e) => {
      setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
    },
  ];
};

export const useRegisterForm = (initialInput) => {
  const [registerInput, setRegisterInput] = useState({ initialInput });

  return [
    registerInput,
    (e) => {
      setRegisterInput({ ...registerInput, [e.target.name]: e.target.value });
    },
  ];
};

export default { useLoginForm, useRegisterForm };
