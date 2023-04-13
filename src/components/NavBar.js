import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import { useAuth } from './auth';
import { getRefreshToken, getNewAccessToken } from '../api/privateApi';
import {
  reseedUsers,
  deleteSeedUsers,
  deleteSeedRobots,
} from '../api/reseedUsers';
import updateAction from './CreateRobotForm/updateAction';

export default function NavBar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { actions, state } = useStateMachine({ updateAction });
  const loginStatus =
    auth && auth.currentAuthUser ? auth.currentAuthUser : null;

  const handleGoHome = () => {
    console.log(`invoked HandleGoHome; wiping history`);
    actions.updateAction({ launchedForm: false });
    // navigate('/');
  };

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
      <span className="NavBar-Head">
        <NavLink onClick={() => handleGoHome()} to="/">
          Home
        </NavLink>
      </span>
      {!loginStatus ? (
        <>
          <span className="NavBar-Link">
            <NavLink to="/user1signin">Signin User1</NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink to="/user2signin">Signin User2</NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink to="/login">Login</NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink to="/register">Register</NavLink>
          </span>
        </>
      ) : (
        <>
          <span className="NavBar-Link">
            <NavLink to="/profile">Profile</NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink onClick={() => handleLogout()}>Logout</NavLink>
          </span>
        </>
      )}
      <span className="NavBar-Link">
        <NavLink to="/" onClick={() => getNewAccessToken()}>
          Refresh AT
        </NavLink>
      </span>
      {auth.currentAuthUsername === 'admin' && (
        <>
          <span className="NavBar-Link">
            <NavLink to="/" onClick={() => handleReseedUsers()}>
              Reseed Users
            </NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink to="/" onClick={() => handleDeleteSeedUsers()}>
              Delete Seeded Users
            </NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink
              to="/"
              onClick={() => {
                handleDeleteSeedRobots();
              }}
            >
              Delete Seed Robots
            </NavLink>
          </span>
        </>
      )}
      <span className="NavBar-Link">
        <NavLink to="/robot">Create Robot</NavLink>
      </span>
    </nav>
  );
}
