import { NavLink } from 'react-router-dom';
import { useAuth } from './auth';

import {
  reseedUsers,
  deleteSeedUsers,
  deleteSeedRobots,
  initialSeedUsers,
} from '../api/reseedUsers';
import useFormStore from '../stores/robotFormStore';

export default function NavBar() {
  const auth = useAuth();
  const { accessToken, username, userId } = auth.currentUser;
  const currentForm = useFormStore((state) => state.launchedForm);
  const setFormStatus = useFormStore((state) => state.setFormStatus);
  const resetFormProgress = useFormStore((state) => state.resetFormProgress);
  // Below: Wrong, use set to change state
  // const resetForm = useFormStore((state) => (state.page = 1));

  const loginStatus = auth && accessToken ? accessToken : null;

  const handleGoHome = () => {
    console.log(
      `invoked HandleGoHome; wiping history: currentForm:`,
      currentForm
    );
    resetFormProgress(currentForm);
    setFormStatus(false);
  };

  const handleGoCreateRobotForm = () => {
    // setFormStatus(true);
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
            <NavLink onClick={() => auth.logout()} to="/">
              Logout
            </NavLink>
          </span>
        </>
      )}
      <span className="NavBar-Link">
        {/* <NavLink to="/" onClick={() => getNewAccessToken()}> */}
        <NavLink to="/" onClick={auth.refreshAccessToken}>
          Refresh AT
        </NavLink>
      </span>
      {/* {auth.currentAuthUsername === 'admin' && ( */}
      {username === 'admin' && (
        <>
          <span className="NavBar-Link">
            {/* <NavLink to="/" onClick={() => reseedUsers(auth.currentAuthUserId)}> */}
            <NavLink to="/" onClick={() => reseedUsers(userId)}>
              Reseed Users
            </NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink
              to="/"
              // onClick={() => deleteSeedUsers(auth.currentAuthUserId)}
              onClick={() => deleteSeedUsers(userId)}
            >
              Delete Seeded Users
            </NavLink>
          </span>
          <span className="NavBar-Link">
            <NavLink
              to="/"
              onClick={() => {
                // deleteSeedRobots(auth.currentAuthUserId);
                deleteSeedRobots(userId);
              }}
            >
              Delete Seed Robots
            </NavLink>
          </span>
        </>
      )}
      <span className="NavBar-Link">
        <NavLink to="/robot" onClick={handleGoCreateRobotForm}>
          Create Robot
        </NavLink>
      </span>
      {/* <span className="NavBar-Link">
        <NavLink onClick={() => resetRobotFormState()} to="/">
          Reset RobotForm Store
        </NavLink>
      </span> */}
      <span className="NavBar-Link">
        {/* <NavLink onClick={() => initialSeedUsers(auth.currentAuthUser)} to="/"> */}
        <NavLink onClick={() => initialSeedUsers(accessToken)} to="/">
          Initialize User DB
        </NavLink>
      </span>
    </nav>
  );
}
