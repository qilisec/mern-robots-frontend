/* eslint-disable import/no-relative-packages, no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from 'react-query';

import { AuthProvider } from '../components/auth';
import RobotHome from './RobotHome';
import About from '../components/About.js';
import RobotInfo from '../components/RobotInfo.js';
import NavBar from '../components/NavBar';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { Profile } from '../components/Profile';
import GetRobotList from '../components/GetRobotList.js';

import { createRobot, getRobotById, getAllRobots } from '../api/index.js';
import { getRefreshToken } from '../api/privateApi';
// import User1Signin from '../components/User1Signin';
// import User2Signin from '../components/User2Signin';
import { User1Signin, User2Signin } from '../components/DirectUserLogins';
import CreateRobotForm from '../components/CreateRobotForm/CreateRobotForm';
import Result from '../components/CreateRobotForm/Result';

const { log } = console;

function App() {
  console.count('counter - App');
  const queryClient = useQueryClient();
  const [searchfield, setSearchfield] = useState('');
  const [count, setCount] = useState(2);
  const [robots, setRobots] = useState([]);
  // const [source, setSource] = useState('');

  const dbQuery = useQuery({
    queryKey: ['robots-db'],
    queryFn: getAllRobots,
  });
  const { data: dbData, isError: dbIsError, error: dbErr } = dbQuery;

  const fetchQuery = useQuery({
    queryKey: ['robots-fetch'],
    queryFn: getRobotsFromFetchQuery,
    enabled: !!dbErr,
  });
  const {
    data: fetchData,
    isError: fetchIsError,
    error: fetchErr,
  } = fetchQuery;

  /*
  // NOTE: Even if we console log "robot" before the mutation operations, due to the processing speed of the browser engine, we cannot capture the "pre-mutated" value in the console. It can be captured by cloning the object and then observing that clone.
  // console.group(`Robot mutation ${id}`);
  // const oldRobot = { ...robot };
  // console.log(`Pre mutating robot: OldRobot ${id}`, oldRobot);
  // console.log(`Pre mutating robot: robott ${id}`, robot);
  // console.groupEnd();
  */
  const fetchRobotMutation = useMutation({
    mutationFn: (preMutation) => {
      const mutatedRobots = preMutation.map((robot) => {
        robot.robotId = robot.id;
        robot.userRole = 'public';
        robot.createdBy = 'seed';
        delete robot.id;
        addRobotToDb(robot);
        return robot;
      });
      return mutatedRobots;
    },
    onSuccess: (mutatedRobots) => {
      // NOTE: It is critical to assign the mutated data to the query key so that it can be used
      queryClient.setQueryData(['robots-fetch'], mutatedRobots);
    },
  });

  useEffect(() => {
    // console.table(`fetch useEffect triggered`, {
    //   dbData,
    //   fetchData,
    //   dbIsError,
    //   dbError,
    //   fetchIsError,
    //   fetchError,
    // });

    if (!dbIsError && dbData) {
      // console.table(`react-query robot db`, {
      //   dbData,
      //   dbIsLoading,
      //   dbIsError,
      //   dbError,
      // });

      setRobots([...dbData.data]);
    } else if (!fetchIsError && fetchData) {
      try {
        console.log(`fetch found`, fetchData);
        // const fetchedRobots = fetchData;
        // const formattedRobots = fetchData.map((robot) => {
        //   console.log(`map robot`, robot);
        //   const newRobot = fetchRobotMutation.mutate(robot);
        //   console.log(`map newRobot`, robot);
        //   return newRobot;
        // });
        // console.table(`react-query robot fetch Pre mutation`, {
        //   fetchData,
        //   fetchIsLoading,
        //   fetchIsError,
        //   fetchError,
        // });
        fetchRobotMutation.mutate(fetchData);
        // console.table(`react-query robot fetch Post mutation`, {
        //   fetchData,
        //   fetchIsLoading,
        //   fetchIsError,
        //   fetchError,
        // });
        // console.log(`fetchData`, fetchData);
        // console.log(`formattedRobots`, formattedRobots);
        setRobots([...fetchData]);
      } catch (err) {
        console.log(err);
      }
    }
    // }, [fetchData, fetchError]);
  }, [dbData, fetchData, dbErr, fetchErr]);

  async function getRobotsFromFetchQuery() {
    return fetch('https://dummyjson.com/users?limit=100')
      .then((response) => response.json())
      .then((data) => data.users);
  }

  async function addRobotToDb(robot) {
    try {
      // Note that fetched robots don't have _ids since those are added by MongoDB
      const dbCheck = robot._id ? await getRobotById(robot._id) : null;
      if (!dbCheck) {
        createRobot(robot);
        return false;
      }
      console.log(`addRobotToDb: Already found ${robot._id?.slice(-10)}`);
      return true;
    } catch (err) {
      console.log(`addRobotsToDb: Error creating new robot: ${err}`);
    }
  }

  // const getRobotSourceAndFetch = async () => {
  //   try {
  //     // const dbCheck = await checkDb();
  //     // const [currSource, returnData] = dbCheck;
  //     const [currSource, returnData] = await checkDb();
  //     if (!returnData && currSource === 'fetch') {
  //       getRobotsFromFetch();
  //     } else if (returnData && currSource === 'db') {
  //       setRobots([...returnData]);
  //       return robots;
  //     }
  //   } catch (err) {
  //     log(
  //       `getRobotSourceAndFetch: getRobotsFromFetch invoked from catch;\nError: ${err}`
  //     );
  //     getRobotsFromFetch();
  //   }
  // };

  // const checkDb = async () => {
  //   try {
  //     const robotsExist = await getAllRobots();
  //     const { data } = robotsExist.data;

  //     console.log(`App.js - query data.data:`, data.data);
  //     if (data.length > 0) {
  //       setSource('db');
  //       const currSource = source;
  //       const returnData = data;
  //       return [currSource, returnData];
  //     }
  //     // We don't need to write code for the length === 0 case because getAllRobots (i.e. function that generates "data") already has a clause that deals with length === 0. getAllRobots will throw a error, which we need to catch.
  //     // if (data.length === 0) {
  //     //   setSource('fetch');
  //     //   const currSource = source;
  //     //   const returnData = null;
  //     //   return [currSource, returnData];
  //     // }
  //   } catch (error) {
  //     setSource('fetch');
  //     const currSource = source;
  //     console.log(`checkDb error: ${error}`);
  //     console.log(`Setting source to ${currSource}`);
  //     return [currSource, null];
  //   }
  // };

  // async function getRobotsFromFetch() {
  //   console.log(`getRobotsFromFetch invoked`);
  //   fetch('https://dummyjson.com/users?limit=100')
  //     .then((response) => response.json())
  //     .then((content) => {
  //       const { users } = content;
  //       // const unformattedRobots = [...users];
  //       const formattedRobots = [...users];

  //       // const formattedRobots = formatFetchedRobots(unformattedRobots);

  //       // if (formattedRobots.length !== unformattedRobots.length) {
  //       //   console.log(
  //       //     `getRobotsFromFetch: unformattedLength = ${unformattedRobots.length};\nformatted length = ${formattedRobots.length}`
  //       //   );
  //       // }
  //       // return setRobots(formattedRobots);
  //       return formattedRobots;
  //     });

  //   const formatFetchedRobots = (unformattedRobots) => {
  //     const formattedRobots = [];
  //     unformattedRobots.forEach((robot) => {
  //       // changing "id" key to "robotid" to allow for new mongodb id
  //       const { id } = robot;

  //       console.log(`formatting robotId: ${id}`);
  //       robot.robotId = id;
  //       delete robot.id;
  //       robot.userRole = 'public';
  //       robot.createdBy = 'seed';
  //       // console.log(`Added robot.user ${robot.userRole}`);
  //       formattedRobots.push(robot);
  //     });
  //     return formattedRobots;
  //   };
  // }

  // Use Effects
  // useEffect(() => {
  //   log(`UseEffect 1: robots.length: ${robots.length}, source: ${source}`);
  //   const initialGetRobots = async () => {
  //     getRobotSourceAndFetch()
  //       .then((res) => robots)
  //       .catch((err) => {
  //         console.log(`initialGetRobots error:`, err);
  //       });
  //   };
  //   initialGetRobots();
  //   return console.log(
  //     `useEffect 1 ended. robots.length: ${robots.length}, source: ${source}`
  //   );
  // }, [source === '']);

  // Upon fetching, add robots to DB
  // useEffect(() => {
  //   if (robots.length !== 0 && source === 'fetch') {
  //     const fetchedRobots = [...robots];
  //     const checkedRobots = [];

  //     fetchedRobots.map((robot) => {
  //       const isNewRobot = addRobotToDb(robot);
  //       if (!isNewRobot) checkedRobots.push(robot);
  //       return robot;
  //     });

  //     // fetchedRobots.forEach((robot) => {
  //     //   const isNewRobot = addRobotToDb(robot);
  //     //   if (!isNewRobot) checkedRobots.push(robot);
  //     // });
  //     console.log(
  //       `addRobotToDb: ${checkedRobots.length} fetched robots already in db`
  //     );
  //   }
  //   // return console.log(
  //   //   `2nd use effect ended. robots.length is ${robots.length}, source is ${source}`
  //   // );
  // }, [robots.length > 0]);

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
        {/* <Route exact path="/robot/step2" element={<Step2 />} /> */}
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
