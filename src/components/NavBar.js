import { NavLink, useNavigate, Link } from 'react-router-dom';
// import { useStateMachine } from 'little-state-machine';
// import { useAuth } from './auth.last.working';
import { useAuth } from './auth';
// import { getRefreshToken, getNewAccessToken } from '../api/privateApi';
import {
  reseedUsers,
  deleteSeedUsers,
  deleteSeedRobots,
  initialSeedUsers,
} from '../api/reseedUsers';
// import updateAction from '../updateAction';
import { robotFormDefault } from '..';
import useFormStore from '../stores/robotFormStore';

export default function NavBar() {
  const auth = useAuth();
  const { accessToken, username, userId } = auth.currentUser;
  // const navigate = useNavigate();
  // const { actions, state } = useStateMachine({ updateAction });

  const toggleFormStatus = useFormStore((state) => state.toggleFormStatus);
  const resetForm = useFormStore((state) => state.resetForm);
  // Below: Wrong, use set to change state
  // const resetForm = useFormStore((state) => (state.page = 1));

  const loginStatus = auth && accessToken ? accessToken : null;
  // auth && auth.currentAuthUser ? auth.currentAuthUser : null;

  const handleGoHome = () => {
    console.log(`invoked HandleGoHome; wiping history`);
    resetForm();
    toggleFormStatus(false);
    // actions.updateAction({ launchedForm: false });
    // navigate('/');
  };

  // const resetRobotFormState = () => {
  //   actions.updateAction({ ...robotFormDefault });
  //   console.log(`resetRobotFormStore`, state);
  // };

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
        <NavLink to="/robot">Create Robot</NavLink>
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
