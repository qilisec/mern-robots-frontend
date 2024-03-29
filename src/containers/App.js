/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-relative-packages, no-unused-vars */
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RobotHome from './RobotHome';
import About from '../components/About.js';
import RobotInfo from '../components/RobotInfo.js';
import NavBar from '../components/NavBar';
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile';
import GetRobotList from '../components/GetRobotList.js';
import CreateRobotForm from '../components/CreateRobotForm/CreateRobotForm';
import Result from '../components/CreateRobotForm/Result';
import { AuthProvider } from '../components/auth';
// import { AuthProvider } from '../components/auth.last.working';
import { getRefreshToken } from '../api/privateApi';
import { User1Signin, User2Signin } from '../components/DirectUserLogins';
import ErrorBoundary from '../components/ErrorBoundary';

const { log } = console;
const logToggle = 0;
const debug = (message) => {
  if (logToggle) return log(message);
};

function App() {
  if (logToggle) console.count('App Component Rendered');
  const [count, setCount] = useState(2);
  const [ownCount, setOwnCount] = useState(2);
  const [allRobots, setAllRobots] = useState([]);
  const [ownedRobots, setOwnedRobots] = useState([]);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <NavBar />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <RobotHome
                count={count}
                setCount={setCount}
                allRobots={allRobots}
                setAllRobots={setAllRobots}
                ownedRobots={ownedRobots}
                setOwnedRobots={setOwnedRobots}
                ownCount={ownCount}
                setOwnCount={setOwnCount}
              />
            }
          />

          <Route path="/about" exact element={<About />} />
          <Route exact path="/robot" element={<CreateRobotForm />} />
          {/* <Route exact path="/robot/step2" element={<Step2 />} /> */}
          <Route path="/robot/result" element={<Result />} />
          <Route
            path="/robot/:id"
            element={<RobotInfo allRobots={allRobots} />}
          />
          {/* <Route path="/robot/:id" element={<RobotInfo />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile history="profile" />} />
          <Route path="/users/:userId" element={<Profile history="users" />} />
          <Route path="/getrobotlist" element={<GetRobotList />} />
          <Route path="/user1signin" element={<User1Signin />} />
          <Route path="/user2signin" element={<User2Signin />} />
          <Route
            path="/authentication/refresh"
            element={() => getRefreshToken()}
          />
        </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
