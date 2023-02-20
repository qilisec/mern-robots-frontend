/* eslint-disable import/no-relative-packages */
import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
// Do not remove tachyons. Even though it is never explicitly read
import tachyons from 'tachyons';
import { array } from 'prop-types';
import RobotHome from './RobotHome';
import About from '../components/About.js';
import RobotInfo from '../components/RobotInfo.js';
import { AuthProvider } from '../components/auth';
import { Login } from '../components/Login';
import GetRobotList from '../components/GetRobotList.js';

import { createRobot, getRobotById, getAllRobots } from '../api/index.js';

function App() {
  const auth = useContext(AuthProvider);
  const [searchfield, setSearchfield] = useState('');
  const [count, setCount] = useState(5);
  const [robots, setRobots] = useState([]);
  const [source, setSource] = useState('');

  useEffect(() => {
    const initialGetRobots = async () => {
      try {
        const dbCheck = await checkDb();
        const [currSource, data] = dbCheck;
        if (currSource && currSource === 'fetch') {
          console.log(`No robots found in database. Fetching:`);
          getRobotsFromFetch();
        } else if (currSource && currSource === 'db') {
          console.log(`Robots read from database`);
          const dbRobotData = [...data];
          setRobots(dbRobotData);
          return robots;
        }
      } catch (error) {
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
          return [currSource, data];
        }
        if (data.length === 0) {
          const currSource = source;
          setSource('fetch');
          return [currSource, null];
        }
      } catch (error) {
        setSource('fetch');
        const currSource = source;
        console.log(
          `checkEmptyDb error: ${error}. Setting source to ${currSource}`
        );
        return [currSource, null];
      }
    };

    const getRobotsFromFetch = () => {
      fetch('https://dummyjson.com/users?limit=100')
        .then((response) => response.json())
        .then((content) => {
          const { users } = content;
          const unformattedRobots = [...users];
          const formattedRobots = [];
          unformattedRobots.forEach((robot) => {
            const { id } = robot;
            robot.robotId = id;
            delete robot.id;
            formattedRobots.push(robot);
          });
          if (formattedRobots.length === unformattedRobots.length)
            return setRobots(formattedRobots);
        });
    };

    initialGetRobots();
  }, [source !== '']);

  useEffect(() => {
    const addRobotsToDb = async (inputRobot) => {
      try {
        const robotDbCheck = await getRobotById(inputRobot._id);
        try {
          console.log(`Robot found in DB: ${robotDbCheck}`);
          return robotDbCheck;
        } catch (err) {
          console.log(
            `robotDbCheck Error: ${err}, input.robotId: ${inputRobot.robotId}, _id: ${inputRobot.id}`
          );
        }
      } catch (err) {
        console.log(`
        addRobotsToDb error: ${err}
        Robot with id: ${inputRobot.robotId} not found in db.`);
        const newRobot = createRobot(inputRobot);
        return newRobot;
      }
    };

    if (robots.length !== 0 && source === 'fetch') {
      const fetchedRobots = [...robots];
      fetchedRobots.forEach((robot) => {
        const newRobot = addRobotsToDb(robot);
      });
    }
  }, [robots, source]);

  return (
    <AuthProvider>
      <div className="App">
        <div>
          <nav>
            <span className="ma2">
              <NavLink to="/">Home</NavLink>
            </span>
            <span className="mr2">
              {!auth?.account && <NavLink to="/login">Login</NavLink>}
            </span>
          </nav>
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
          <Route path="/getrobotlist" element={<GetRobotList />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
