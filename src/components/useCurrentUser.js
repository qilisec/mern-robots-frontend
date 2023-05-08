import { current } from 'immer';
import { useState, useDebugValue } from 'react';

export const useCurrentUser = (initialInput) => {
  const [currentUser, setCurrentUser] = useState(initialInput);
  const { accessToken, username, userId, isLoading, status } = currentUser;
  const debugObject = [
    { accessToken },
    { username },
    { userId },
    { isLoading },
    { status },
  ];
  // console.log(`auth debug object:`, debugObject);
  useDebugValue(debugObject);

  return [
    currentUser,
    (userCredentials) => {
      setCurrentUser((prevUserState) => ({
        ...prevUserState,
        ...userCredentials,
      }));
    },
  ];
};

export const useCurrentUserDefaults = {
  accessToken: null,
  username: null,
  userId: null,
  isLoading: true,
  status: null,
};

export default { useCurrentUser, useCurrentUserDefaults };
