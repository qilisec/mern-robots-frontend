/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-shadow */
import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import PropTypes from 'prop-types';
import { decodeToken } from 'react-jwt';
import { authenticateSignIn, authenticateSignUp } from '../api/index';

import {
  privateApi,
  getRefreshToken,
  getNewAccessToken,
  logoutBackend,
} from '../api/privateApi';

import { changePrivateApiInterceptors } from '../api/interceptors';
import { useCurrentUser, useCurrentUserDefaults } from './useCurrentUser';

const { log } = console;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  console.group(`NEW AUTH`);
  console.count('counter - auth');
  // Created custom hook
  const [currentUser, setCurrentUser] = useCurrentUser(useCurrentUserDefaults);
  const { accessToken, username, userId, isLoading, status } = currentUser;

  console.table(`NEW AUTH - Initial`, {
    accessToken: accessToken?.slice(-8),
    username,
    userId,
    isLoading,
    status,
  });

  const login = useCallback(async (usernameAttempt, passwordAttempt) => {
    const userInfo = { username: usernameAttempt, password: passwordAttempt };
    const signinAttempt = await authenticateSignIn(userInfo);
    const { data } = signinAttempt;

    if (data) {
      console.table(`Login Data:`, data);

      const { accessToken } = data;
      const decodedToken = decodeToken(accessToken);
      const { username, userId } = decodedToken;

      refreshInterceptors(privateApi, accessToken);
      setCurrentUser({
        username,
        userId,
        accessToken,
        isLoading: false,
        status: 'Log in',
      });
      return true;
    }
  }, []);

  const logout = useCallback(async () => {
    // Send userId to backend via argument, send AT via header, send RT via cookie. decode tokens and verify they match userId from argument.
    // Actually, don't check against RT. Don't have a function for that yet. KISS
    const logoutReq = await logoutBackend(userId);
    log(`Auth: logout requested: ${userId}`);
    if (logoutReq) {
      setCurrentUser({
        ...useCurrentUserDefaults,
        status: 'Log out',
      });

      return true;
    }
    log(`Logout Failed: ${logoutReq}`);
    return false;
  }, []);

  const register = useCallback(
    async (usernameAttempt, emailAttempt, passwordAttempt) => {
      const newUserInfo = {
        username: usernameAttempt,
        email: emailAttempt,
        password: passwordAttempt,
        createdBy: 'user',
        roles: ['user'],
      };
      const registerAttempt = await authenticateSignUp(newUserInfo);
      const { data } = registerAttempt;

      if (data) {
        console.table(`Register Data:`, data);
        const { accessToken } = data;
        const { username, userId } = decodeToken(accessToken);

        setCurrentUser({
          username,
          userId,
          accessToken,
          status: 'Log in',
          isLoading: false,
        });
        refreshInterceptors(privateApi, accessToken);
        return true;
      }
      log(`register failed`);
    },
    []
  );

  const refreshInterceptors = useCallback(
    async (client, newAccessToken) =>
      changePrivateApiInterceptors(client, newAccessToken),
    []
  );
  const requestRefreshToken = useCallback(async () => getRefreshToken(), []);
  const requestAccessToken = useCallback(async () => getNewAccessToken(), []);
  const refreshAccessToken = useCallback(async () => {
    const newAccessToken = await requestAccessToken();
    refreshInterceptors(privateApi, newAccessToken);
    setCurrentUser({ accessToken: newAccessToken });
  }, []);

  const decodeJwt = async (inputJwt) => {
    if (!inputJwt) return { username: null, userId: null };
    return decodeToken(inputJwt);
  };

  const reloadAuthentication = async () => {
    try {
      const refreshToken = await requestRefreshToken();
      log(`AUTH RELOAD 1️⃣: Recovered RT`);

      const accessToken = refreshToken ? await requestAccessToken() : null;
      log(`AUTH RELOAD 2️⃣: NEW AT: ${accessToken?.slice(-8)}`);

      const { username, userId } = await decodeJwt(accessToken);

      refreshInterceptors(privateApi, accessToken);
      setCurrentUser({
        accessToken,
        username,
        userId,
      });

      // return true;
    } catch (err) {
      log(`🔴 reloadAuthentication Error 🔴`, err);
      setCurrentUser({
        ...currentUser,
        accessToken: null,
        isLoading: false,
      });
    }
  };
  const memoizedAuthProps = useMemo(
    () => ({
      currentUser,
      username,
      userId,
      accessToken,
      isLoading,
      status,
    }),
    [currentUser, username, userId, accessToken, isLoading, status]
  );

  // ////////////////////////////////////////
  //              USE EFFECTS
  // ////////////////////////////////////////

  // Use Effect for auth recovery on page refresh
  useEffect(() => {
    console.group('AUTH RELOAD');
    reloadAuthentication();

    console.groupEnd();

    return setCurrentUser({ isLoading: false });
  }, [accessToken]);

  console.groupEnd();

  return (
    <AuthContext.Provider
      value={{
        ...memoizedAuthProps,
        login,
        logout,
        register,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => useContext(AuthContext);
