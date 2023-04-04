/* eslint-disable import/no-relative-packages, no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// Do not remove tachyons. Even though it is never explicitly read, I think it is still needed.
import tachyons from 'tachyons';
// import { array } from 'prop-types';
import RobotHome from './RobotHome';
import About from '../components/About.js';
import RobotInfo from '../components/RobotInfo.js';
import { AuthProvider } from '../components/auth';
import NavBar from '../components/NavBar';
import { Login } from '../components/Login';
import { Profile } from '../components/Profile';
import GetRobotList from '../components/GetRobotList.js';

import { createRobot, getRobotById, getAllRobots } from '../api/index.js';
import { getRefreshToken } from '../api/privateApi';
import User1Signin from '../components/User1Signin';
import User2Signin from '../components/User2Signin';

const { log } = console;
function App() {
  const [searchfield, setSearchfield] = useState('');
  const [count, setCount] = useState(5);
  const [robots, setRobots] = useState([]);
  const [source, setSource] = useState('');
  // console.log(`Render`);
  useEffect(() => {
    log(`UseEffect 1: robots.length: ${robots.length}, source: ${source}`);
    const initialGetRobots = async () => {
      try {
        const dbCheck = await checkDb();
        const [currSource, returnData] = dbCheck;

        if (!returnData && currSource === 'fetch') {
          log(`🖥🖥🖥 No robots found in database. Fetching:`);
          // console.log(`initialGetRobots: getRobotsFromFetch invoked from try`);
          getRobotsFromFetch();
        } else if (returnData && currSource === 'db') {
          log(`🖥🖥🖥 Robots read from database`);
          const dbRobotData = [...returnData];
          setRobots(dbRobotData);
          return robots;
        }
      } catch (err) {
        log(
          `initialGetRobots: getRobotsFromFetch invoked from catch;\nError: ${err}`
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

    initialGetRobots();
    return console.log(
      `useEffect 1 ended. robots.length: ${robots.length}, source: ${source}`
    );
  }, [source === '']);
  // }, [source === '', robots.length === 0]);
  // }, [source !== '', robots.length === 0]);

  // Upon fetching, add robots to DB
  useEffect(() => {
    // console.log(
    //   `2nd use effect started. robots.length is ${robots.length}, source is ${source}`
    // );

    const addRobotToDb = async (inputRobot) => {
      try {
        // console.log(`addRobotToDb: robotDbCheck: ${robotDbCheck}`);
        // Note that fetched robots don't have _ids since those are added by MongoDB
        const robotDbCheck = inputRobot._id
          ? await getRobotById(inputRobot._id)
          : null;
        // console.log(`robotDbCheck is ${robotDbCheck}`);
        if (robotDbCheck) {
          // console.log(`Robot found in DB: ${robotDbCheck}`);
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

    if (robots.length !== 0 && source === 'fetch') {
      const fetchedRobots = [...robots];
      const checkedRobots = [];
      fetchedRobots.forEach((robot) => {
        const isNewRobot = addRobotToDb(robot);
        if (!isNewRobot) checkedRobots.push(robot);
      });
      console.log(
        `addRobotToDb: ${checkedRobots.length} fetched robots already in db`
      );
    }
    // return console.log(
    //   `2nd use effect ended. robots.length is ${robots.length}, source is ${source}`
    // );
  }, [robots.length > 0]);

  //   if (robots.length !== 0 && source === 'fetch') {
  //     const fetchedRobots = [...robots];
  //     fetchedRobots.forEach((robot) => {
  //       const newRobot = addRobotsToDb(robot);
  //     });
  //   }
  // }, [robots, source]);

  // useEffect(() => {
  //   const getUser = auth && auth.user ? auth.user : null;
  //   if (authRef && authRef.current !== null && loginStatus === '') {
  //     console.log(
  //       `authRef value is ${authRef.current}; loginStatus value: ${loginStatus}`
  //       //   `authRef value is ${Object.keys(
  //       //     authRef
  //       //   )}; loginStatus value: ${loginStatus}`
  //     );
  //     setLoginStatus(true);
  //     console.log(`Set login status to ${loginStatus}`);
  //     console.log(
  //       `auth user is: ${authRef.current}, loginStatus is ${loginStatus}`
  //     );
  //   } else {
  //     setLoginStatus(false);
  //     console.log(`loginStatus value: ${loginStatus}`);
  //   }
  // }, [auth && auth.user, loginStatus]);

  return (
    <AuthProvider>
      <div className="App">
        <div>
          <NavBar />
        </div>
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
          <Route path="/robot/:id" element={<RobotInfo robots={robots} />} />
          <Route path="/login" element={<Login />} />
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
      </div>
    </AuthProvider>
  );
}

export default App;
