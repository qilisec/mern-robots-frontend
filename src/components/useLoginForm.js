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
