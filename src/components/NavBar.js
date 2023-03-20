import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './auth';
import { getRefreshToken, getProfilePage } from '../api/privateApi';

export default function NavBar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const loginStatus =
    auth && auth.currentAuthUser ? auth.currentAuthUser : null;

  const handleLogout = () => {
    console.log(`Navbar Logging out`);
    auth.logout();
    navigate('/');
  };

  return (
    <nav>
      <span className="ma2">
        <NavLink to="/">Home</NavLink>
      </span>
      {!loginStatus ? (
        <>
          <span className="mr2">
            <NavLink to="/user1signin">Signin User1</NavLink>
          </span>
          <span className="mr2">
            <NavLink to="/user2signin">Signin User2</NavLink>
          </span>
          <span className="mr2">
            <NavLink to="/login">Login</NavLink>
          </span>
        </>
      ) : (
        <>
          {/* <span className="mr2">
            <Link onClick={getUserId}>Profile</Link>
          </span> */}
          <span className="mr2">
            <NavLink to="/profile">Profile</NavLink>
          </span>
          <span className="mr2">
            <Link onClick={handleLogout}>Logout</Link>
          </span>
        </>
      )}
      <span className="mr2">
        <NavLink to="/" onClick={() => getRefreshToken()}>
          Refresh AT
        </NavLink>
      </span>
      <span className="mr2">
        <NavLink to="/" onClick={() => getRefreshToken()}>
          Refresh AT
        </NavLink>
      </span>
    </nav>
  );
}
