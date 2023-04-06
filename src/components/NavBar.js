import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './auth';
import { getRefreshToken, getProfilePage } from '../api/privateApi';
import {
  reseedUsers,
  deleteSeedUsers,
  deleteSeedRobots,
} from '../api/reseedUsers';

export default function NavBar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const loginStatus =
    auth && auth.currentAuthUser ? auth.currentAuthUser : null;

  const handleLogout = async () => {
    console.log(`Navbar Logging out`);
    await auth.logout();
    navigate('/');
  };

  const handleReseedUsers = async () => {
    const result = await reseedUsers(auth.currentAuthUserId);
    if (result) return true;
    console.log(`Navbar: Reseed was not completed`);
    return false;
  };

  const handleDeleteSeedUsers = async () => {
    const result = await deleteSeedUsers(auth.currentAuthUserId);
    if (result) return true;
    console.log(`Navbar: Seed User deletion error`);
    return false;
  };

  const handleDeleteSeedRobots = async () => {
    const result = await deleteSeedRobots(auth.currentAuthUserId);
    if (result) return true;

    console.log(`Navbar: Seed robot deletion error:`, result);
    return false;
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
          <span className="mr2">
            <NavLink to="/register">Register</NavLink>
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
        <NavLink to="/" onClick={() => handleReseedUsers()}>
          Reseed Users
        </NavLink>
      </span>
      <span className="mr2">
        <NavLink to="/" onClick={() => handleDeleteSeedUsers()}>
          Delete Seeded Users
        </NavLink>
      </span>
      <span className="mr2">
        <NavLink
          to="/"
          onClick={() => {
            handleDeleteSeedRobots();
          }}
        >
          Delete Seed Robots
        </NavLink>
      </span>
    </nav>
  );
}
