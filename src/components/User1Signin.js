import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';

export default function User1Signin() {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    const userSignin = async () => {
      if (auth.currentUser && auth.currentUserName) {
        console.log(`Already logged into an account: logging out first...`);
        auth.logout();
      }
      const testUser = 'user1';
      const testPassword = '1';
      await auth.login(testUser, testPassword);
      navigate('/');
    };
    userSignin();
  }, [auth, navigate]);
}
