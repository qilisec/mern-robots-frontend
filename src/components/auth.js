import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import PropTypes from 'prop-types';
import {
  // isExpired,
  decodeToken,
} from 'react-jwt';
import { format } from 'prettier';
import { authenticateSignIn, authenticateSignUp } from '../api/index';

import {
  privateApi,
  getRefreshToken,
  getNewAccessToken,
  logoutBackend,
} from '../api/privateApi';

import { changePrivateApiInterceptors } from '../api/interceptors';

const { log } = console;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // create custom hook
  const [currentAuthUser, setCurrentAuthUser] = useState(null);
  const [currentAuthUsername, setCurrentAuthUsername] = useState(null);
  const [currentAuthUserId, setCurrentAuthUserId] = useState(null);

  const [credLoadFinished, setCredLoadFinished] = useState(false);
  const [activatedInterceptors, setActivatedInterceptors] = useState(false);
  const [loginStatusChanged, setloginStatusChanged] = useState(null);
  const [currentAuthUserEmail, setCurrentAuthUserEmail] = useState(null);
  const [currentAuthUserRoleName, setCurrentAuthUserRoleName] = useState(null);

  const login = useCallback(async (usernameAttempt, passwordAttempt) => {
    const userInfo = { username: usernameAttempt, password: passwordAttempt };
    const signinAttempt = await authenticateSignIn(userInfo);
    const { data } = signinAttempt;

    if (data) {
      console.table(`Login Data:`, data);

      const { accessToken } = data;
      const decodedToken = decodeToken(accessToken);

      const { username: extractedUsername, userId } = decodedToken;

      // console.table(
      //   'login 2️⃣',
      //   { username: extractedUsername },
      //   { userId },
      //   { accessToken }
      // );

      setCurrentAuthUsername(extractedUsername);
      setCurrentAuthUserId(userId);
      setCurrentAuthUser(accessToken);
      setloginStatusChanged('Log in');
      return true;
    }
  }, []);

  const logout = useCallback(async () => {
    // console.log(`Auth logout 1️⃣ :`, { currentAuthUser });
    // Send userId to backend via argument, send AT via header, send RT via cookie. decode tokens and verify they match userId from argument.
    // Actually, don't check against RT. Don't have a function for that yet. KISS
    const logoutReq = await logoutBackend(currentAuthUserId);
    console.log(`Auth: logout requested: ${currentAuthUserId}`);
    if (logoutReq) {
      setCurrentAuthUsername(null);
      setCurrentAuthUserId(null);
      setCurrentAuthUser(null);

      setloginStatusChanged('Log out');
      return true;
    }
    console.log(`Logout Failed: ${logoutReq}`);
    return false;
  }, [currentAuthUser, currentAuthUserId]);

  const register = useCallback(
    async (usernameAttempt, emailAttempt, passwordAttempt) => {
      const newUserInfo = {
        username: usernameAttempt,
        email: emailAttempt,
        password: passwordAttempt,
      };
      newUserInfo.roles = ['user'];
      const registerAttempt = await authenticateSignUp(newUserInfo);
      log(`Auth register: registerAttempt`, registerAttempt);
      const { data } = registerAttempt;

      if (data) {
        console.table(`Register Data:`, data);
        const { accessToken } = data;
        const decodedToken = decodeToken(accessToken);
        const { username: extractedUsername, userId } = decodedToken;

        setCurrentAuthUsername(extractedUsername);
        setCurrentAuthUserId(userId);
        setCurrentAuthUser(accessToken);
        setloginStatusChanged('Log in');
        return true;
      }
      console.log(`register failed`);
    },
    []
  );

  const requestRefreshToken = useCallback(async () => {
    const refreshTokenData = await getRefreshToken();

    return refreshTokenData;
  }, []);

  const refreshAccessToken = useCallback(
    async (refreshToken) => await getNewAccessToken(refreshToken),
    []
  );

  const recoverUser = useCallback(async (accessToken) => {
    if (accessToken) {
      const decodedToken = await decodeToken(accessToken);
      try {
        const { username: recoveredUsername, userId: recoveredUserId } =
          decodedToken;
        return { recoveredUsername, recoveredUserId };
      } catch (err) {
        console.log(`Error recovering user: ${err}`);
        return err;
      }
    }
    return null;
  }, []);

  const decodeJwt = async (inputJwt) => {
    const decodedToken = await decodeToken(inputJwt);
    const { username: extractedUsername, userId: extractedUserId } =
      decodedToken;

    return { extractedUsername, extractedUserId };
  };

  // ////////////////////////////////////////
  //              USE EFFECTS
  // ////////////////////////////////////////

  useEffect(() => {
    if (currentAuthUser && currentAuthUserId && activatedInterceptors)
      setCredLoadFinished(true);
    console.log(`📎📎📎 credLoad status: ${credLoadFinished}📎📎📎`);
  }, [currentAuthUser, currentAuthUserId, activatedInterceptors]);

  useEffect(() => {
    if (currentAuthUser) {
      changePrivateApiInterceptors(privateApi, currentAuthUser);
      setActivatedInterceptors(true);
    }
    // Axios client nesting: client > interceptors > req/res > handlers > [0] > fullfilled: coded function
  }, [currentAuthUser, currentAuthUserId, activatedInterceptors]);

  // Use Effect for auth recovery on page refresh
  useEffect(() => {
    const refreshAuthState = async () => {
      try {
        if (!currentAuthUser) {
          console.log(`Init 1️⃣: No AT: check for RT!`);
          const refreshToken = await requestRefreshToken();

          if (refreshToken) {
            console.log(`Init 2️⃣: Recovered RT, generating new AT!`);

            const newAccessToken = await refreshAccessToken(refreshToken);
            console.log(`Init 3️⃣: Generated new AT: ${newAccessToken}`);

            const { extractedUsername, extractedUserId } = await decodeJwt(
              newAccessToken
            );
            setCurrentAuthUser(newAccessToken);
            setCurrentAuthUsername(extractedUsername);
            setCurrentAuthUserId(extractedUserId);

            // return true;
          }
          console.log(`🔴 Refresh token was not found`);
          // I don't think I should return false here. It interferes with my expectation of credLoadFinished. If no RT exists, then credLoadFinished should be true even though there is no currentAuthUser. Instead, use try catch to determine whether credLoadFinished is true when there is no currAuthUser.
          // return false;
        }
        // console.log(`🔴 User already stored 🔴`);
        return true;
      } catch (err) {
        console.log(`🔴🔴🔴 refreshAuthState Error:
        ${err}`);
        return err;
      }
    };

    refreshAuthState();

    return console.log(
      `⚽ CLEAN UP USE EFFECT:⚽%c
      Final auth state:
      AT: ${currentAuthUser?.toString()?.slice(-10)};
      Username: ${currentAuthUsername};
      UserId: ${currentAuthUserId};
      credLoaded: ${credLoadFinished}
      ⚽ CLEAN UP USE EFFECT:⚽\n`,
      'padding-left: 0em; text-indent:-3.25em'
    );
  }, [
    currentAuthUser,
    currentAuthUsername,
    currentAuthUserId,
    credLoadFinished,
    recoverUser,
    refreshAccessToken,
    requestRefreshToken,
    // changePrivateApiInterceptors,
  ]);

  useEffect(() => {
    // console.table('⚠️', {
    //   'Login Status Changed': JSON.stringify(loginStatusChanged),
    // });

    if (loginStatusChanged === ('Log in' || 'Log out')) {
      console.table(
        `Login 3️⃣\nStatus changed: ${loginStatusChanged} complete:\nNew auth state\n`,
        { AT: `...${currentAuthUser?.slice(-10)}` },
        { Username: currentAuthUsername },
        { UserId: currentAuthUserId }
      );
    }

    // return true;
  }, [loginStatusChanged]);

  const memoizedAuthProps = useMemo(
    () => ({
      currentAuthUsername,
      currentAuthUser,
      currentAuthUserId,
      credLoadFinished,
      loginStatusChanged,
      login,
      register,
      logout,
    }),
    [
      currentAuthUser,
      currentAuthUsername,
      currentAuthUserId,
      credLoadFinished,
      loginStatusChanged,
      login,
      register,
      logout,
    ]
  );
  return (
    <AuthContext.Provider value={memoizedAuthProps}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => useContext(AuthContext);
