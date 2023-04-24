/* eslint-disable import/no-extraneous-dependencies */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
// import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../components/auth';
// import { useAuth } from '../components/auth.last.working';
import { createRobot, getRobotById, getAllRobots } from '../api/index.js';

export default function RobotHome(props) {
  const { robots, setRobots, count, setCount } = props;
  const queryClient = useQueryClient();
  const [searchfield, setSearchfield] = useState('');

  console.group('RobotHome');
  console.count('counter - RobotHome');
  const auth = useAuth();
  const { accessToken, username, isLoading } = auth.currentUser;
  const currentUsername = auth && username ? username : null;
  // auth && auth.currentAuthUsername ? auth.currentAuthUsername : null;

  const dbQuery = useQuery({
    queryKey: ['robots-db'],
    queryFn: getAllRobots,
    retry: 1,
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

  const fetchRobotMutation = useMutation({
    mutationFn: (preMutation) => {
      console.count(`fetchMutation invoked`);
      const mutatedRobots = preMutation.map((robot) => {
        // console.log(`premutation robot:`, robot);
        const { id } = robot;
        robot.robotId = Number(id);
        robot.userRole = 'public';
        robot.createdBy = 'seed';
        delete robot.id;
        console.table(
          `RobotHome: fetchRobotMutation:`,
          robot.robotId,
          typeof id,
          Number(id),
          Number(robot.robotId)
        );
        if (robot.robotId) addRobotToDb(robot);
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
    if (!dbIsError && dbData) {
      setRobots([...dbData.data]);
    } else if (!fetchIsError && fetchData) {
      try {
        console.group(`fetch`);
        console.log(
          `fetching: fetchIsError:`,
          fetchIsError,
          'fetchData',
          fetchData
        );
        console.groupEnd();
        fetchRobotMutation.mutate(fetchData);
        setRobots([...fetchData]);
      } catch (err) {
        console.log(err);
      }
    }
  }, [dbData, fetchData, dbIsError, fetchIsError]);

  async function getRobotsFromFetchQuery() {
    return fetch('https://dummyjson.com/users?limit=1')
      .then((response) => response.json())
      .then((data) => data.users);
  }

  async function addRobotToDb(robot) {
    console.log(`addRobotToDbInvoked: robot.robotId:`, robot.robotId);
    try {
      // Note that fetched robots don't have _ids since those are added by MongoDB
      const dbCheck = robot._id ? await getRobotById(robot._id) : null;
      if (!dbCheck) {
        createRobot(robot);
        return false;
      }
      console.log(`addRobotToDb: Already found ${robot._id?.slice(-8)}`);
      return true;
    } catch (err) {
      console.log(`addRobotsToDb: Error creating new robot: ${err}`);
    }
  }

  const onSearchChange = (event) => {
    setSearchfield(event.target.value);
  };

  const filteredRobots = robots.filter((robot) => {
    const fullName = `${robot.firstName} ${robot.lastName}`;
    return fullName.toLowerCase().includes(searchfield.toLowerCase());
  });
  console.groupEnd();
  if (robots.length === 0 || isLoading) {
    console.table('---Loading---', {
      dbData,
      fetchData,
      dbIsError,
      dbErr,
      fetchIsError,
      fetchErr,
      'robot-length': robots.length,
      accessToken,
      username,
      count,
      queryClient,
    });
    return <h1>Loading</h1>;
  }

  return (
    <div className="text-center my-2.5">
      <h1 className="text-white text-3xl font-bold pb-3 border-b">
        RoboFriends
      </h1>
      <h2 className="text-white text-white-font-extralight">
        Showing {count} Robots
      </h2>
      {currentUsername && (
        <div>
          <h2 className="text-white text-white-font-extralight mx-32">
            {/* Hello {auth.currentAuthUsername}. Your access token is: */}
            Hello {username}. Your access token is:
          </h2>
          <h2 className="text-white text-white-font-extralight mx-32">
            ...{accessToken.slice(-8)}
            {/* ...{auth.currentAuthUser.slice(-10)} */}
          </h2>
        </div>
      )}
      <button
        className="bg-pink-500 text-white uppercase mt-5 mx-2.5 p-2.5 text-base font-thin tracking-wide inline-block appearance-none border-none rounded"
        type="button"
        onClick={() => setCount((prevCount) => Number(prevCount) + 1)}
      >
        Add Robot
      </button>
      <button
        className="bg-pink-500 text-white uppercase mt-5 mx-2.5 p-2.5 text-base font-thin tracking-wide inline-block appearance-none border-none rounded"
        type="button"
        onClick={() => setCount((prevCount) => Number(prevCount) + 10)}
      >
        Add 10 Robots
      </button>
      <SearchBox searchChange={onSearchChange} />
      <Scroll>
        {/* <ErrorBoundary> */}
        <CardList robots={filteredRobots} count={count} />
        {/* </ErrorBoundary> */}
      </Scroll>
    </div>
  );
}

RobotHome.propTypes = {
  count: PropTypes.number,
  setCount: PropTypes.func,
  robots: PropTypes.array,
  setRobots: PropTypes.func,
};
