import { useState } from 'react';

export const useCurrentUser = (initialInput) => {
  const [currentUser, setCurrentUser] = useState(initialInput);

  return [
    currentUser,
    (userCredentials) => {
      setCurrentUser((prevUserState) => ({ ...prevUserState, ...userCredentials }));
    },
  ];
};

export const useCurrentUserDefaults = {
    accessToken: null,
    username: null,
    userId: null,
    isLoading: true,
    status: null,
}

export default {useCurrentUser, useCurrentUserDefaults}