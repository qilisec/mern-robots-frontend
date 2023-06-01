import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from './auth.last.working';
import { useAuth } from './auth';

export const User1Signin = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { accessToken, username } = auth.currentUser;
  useEffect(() => {
    const userSignin = async () => {
      //   if (auth.currentUser && auth.currentUserName) {
      if (accessToken && username) {
        console.log(`Already logged into an account: logging out first...`);
        auth.logout();
      }
      const testUser = 'user1';
      const testPassword = '1';
      await auth.login(testUser, testPassword);
      navigate('/');
    };
    userSignin();
  }, [auth.logout, auth.login, navigate]);
};

export const User2Signin = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { accessToken, username } = auth.currentUser;
  useEffect(() => {
    const userSignin = async () => {
      if (accessToken && username) {
        console.log(`Already logged into an account: logging out first...`);
        auth.logout();
      }
      const testUser = 'user2';
      const testPassword = '2';
      await auth.login(testUser, testPassword);
      navigate('/');
    };
    userSignin();
  }, [auth, navigate]);
};

const directLogins = { User1Signin, User2Signin };
export default directLogins;
