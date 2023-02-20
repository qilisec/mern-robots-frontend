import { createContext, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  // const memoizedAccount = memo(account)

  const login = (accountSubmit) => {
    setAccount(accountSubmit);
  };

  const logout = () => {
    setAccount(null);
  };

  const memoizedAuthProps = useMemo(
    () => ({ account, login, logout }),
    [account, login, logout]
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
