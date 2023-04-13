/* eslint-disable import/no-relative-packages, no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// import { array } from 'prop-types';
import { useStateMachine } from 'little-state-machine';
import RobotHome from './RobotHome';
import About from '../components/About.js';
import RobotInfo from '../components/RobotInfo.js';
import { AuthProvider } from '../components/auth';
import NavBar from '../components/NavBar';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { Profile } from '../components/Profile';
import GetRobotList from '../components/GetRobotList.js';

import { createRobot, getRobotById, getAllRobots } from '../api/index.js';
import { getRefreshToken } from '../api/privateApi';
import User1Signin from '../components/User1Signin';
import User2Signin from '../components/User2Signin';
import CreateRobotForm from '../components/CreateRobotForm/CreateRobotForm';

import Step1 from '../components/CreateRobotForm/Step1';
import Step2 from '../components/CreateRobotForm/Step2';
import Result from '../components/CreateRobotForm/Result';

import updateAction from '../components/CreateRobotForm/updateAction';

const { log } = console;
function App() {
  const { actions, state } = useStateMachine({ updateAction });
  const [searchfield, setSearchfield] = useState('');
  const [count, setCount] = useState(5);
  const [robots, setRobots] = useState([]);
  const [source, setSource] = useState('');
  // console.log(`Render`);

  const getRobotSourceAndFetch = async () => {
    try {
      const dbCheck = await checkDb();
      const [currSource, returnData] = dbCheck;

      if (!returnData && currSource === 'fetch') {
        log(`🖥🖥🖥 No robots found in database. Fetching:`);
        // console.log(`getRobotSourceAndFetch: getRobotsFromFetch invoked from try`);
        getRobotsFromFetch();
      } else if (returnData && currSource === 'db') {
        log(`🖥🖥🖥 Robots read from database 🖥🖥🖥 `);
        const dbRobotData = [...returnData];
        setRobots(dbRobotData);
        return robots;
      }
    } catch (err) {
      log(
        `getRobotSourceAndFetch: getRobotsFromFetch invoked from catch;\nError: ${err}`
      );
      getRobotsFromFetch();
    }
  };

  const checkDb = async () => {
    try {
      const robotsExist = await getAllRobots();
      const { data } = robotsExist.data;

      if (data.length > 0) {
        setSource('db');
        const currSource = source;
        const returnData = data;
        return [currSource, returnData];
      }
      // We don't need to write code for the length === 0 case because getAllRobots (i.e. function that generates "data") already has a clause that deals with length === 0. getAllRobots will throw a error, which we need to catch.
      // if (data.length === 0) {
      //   setSource('fetch');
      //   const currSource = source;
      //   const returnData = null;
      //   return [currSource, returnData];
      // }
    } catch (error) {
      setSource('fetch');
      const currSource = source;
      console.log(`checkDb error: ${error}`);
      console.log(`Setting source to ${currSource}`);
      return [currSource, null];
    }
  };

  const getRobotsFromFetch = async () => {
    fetch('https://dummyjson.com/users?limit=100')
      .then((response) => response.json())
      .then((content) => {
        const { users } = content;
        const unformattedRobots = [...users];

        const formattedRobots = formatFetchedRobots(unformattedRobots);

        if (formattedRobots.length === unformattedRobots.length) {
          console.log(
            `getRobotsFromFetch: unformattedLength = ${unformattedRobots.length};\nformatted length = ${formattedRobots.length}`
          );
          return setRobots(formattedRobots);
        }
      });

    const formatFetchedRobots = (unformattedRobots) => {
      const formattedRobots = [];
      unformattedRobots.forEach((robot) => {
        // changing "id" key to "robotid" to allow for new mongodb id
        const { id } = robot;

        console.log(`fetching robotId: ${id}`);
        robot.robotId = id;
        delete robot.id;
        robot.userRole = 'public';
        robot.createdBy = 'seed';
        // console.log(`Added robot.user ${robot.userRole}`);
        formattedRobots.push(robot);
      });
      return formattedRobots;
    };
  };

  const addRobotToDb = async (inputRobot) => {
    try {
      // Note that fetched robots don't have _ids since those are added by MongoDB
      const robotDbCheck = inputRobot._id
        ? await getRobotById(inputRobot._id)
        : null;
      if (robotDbCheck) {
        return true;
      }
      const newRobot = createRobot(inputRobot);
      return false;
    } catch (err) {
      console.log(
        `addRobotsToDb: Couldn't get robot from db or create new robot. Error: ${err}`
      );
    }
  };

  // Use Effects
  useEffect(() => {
    log(`UseEffect 1: robots.length: ${robots.length}, source: ${source}`);
    const initialGetRobots = async () => {
      getRobotSourceAndFetch()
        .then((res) => robots)
        .catch((err) => {
          console.log(`initialGetRobots error:`, err);
        });
    };
    initialGetRobots();
    return console.log(
      `useEffect 1 ended. robots.length: ${robots.length}, source: ${source}`
    );
  }, [source === '']);

  // Upon fetching, add robots to DB
  useEffect(() => {
    if (robots.length !== 0 && source === 'fetch') {
      const fetchedRobots = [...robots];
      const checkedRobots = [];

      fetchedRobots.map((robot) => {
        const isNewRobot = addRobotToDb(robot);
        if (!isNewRobot) checkedRobots.push(robot);
        return robot;
      });

      // fetchedRobots.forEach((robot) => {
      //   const isNewRobot = addRobotToDb(robot);
      //   if (!isNewRobot) checkedRobots.push(robot);
      // });
      console.log(
        `addRobotToDb: ${checkedRobots.length} fetched robots already in db`
      );
    }
    // return console.log(
    //   `2nd use effect ended. robots.length is ${robots.length}, source is ${source}`
    // );
  }, [robots.length > 0]);

  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <RobotHome
              count={count}
              setCount={setCount}
              robots={robots}
              searchfield={searchfield}
              setSearchfield={setSearchfield}
            />
          }
        />
        <Route path="/about" exact element={<About />} />
        <Route exact path="/robot" element={<CreateRobotForm />} />
        <Route exact path="/robot/step2" element={<Step2 />} />
        <Route path="/robot/result" element={<Result />} />
        <Route path="/robot/:id" element={<RobotInfo robots={robots} />} />
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
    </AuthProvider>
  );
}

export default App;
