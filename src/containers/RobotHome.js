/* eslint-disable prefer-template */
/* eslint-disable import/no-extraneous-dependencies */
import React, {
  useState,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useRef,
  useTransition,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQueryClient, useQuery, useMutation } from 'react-query';
// import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
// import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../components/auth';
// import { useAuth } from '../components/auth.last.working';
import { createRobot, getRobotById, getAllRobots } from '../api/index.js';
import NullOutHiddenComponents from '../components/NullOutHiddenComponents';

const LazyCardList = lazy(() => import('../components/CardList'));
const LazySearchBox = lazy(() => import('../components/SearchBox'));

const { log } = console;
const logToggle = 0;
const debug = (message) => {
  if (logToggle) return log(message);
};

export default function RobotHome(props) {
  const {
    allRobots,
    setAllRobots,
    count,
    setCount,
    ownedRobots,
    setOwnedRobots,
    ownCount,
    setOwnCount,
  } = props;

  const queryClient = useQueryClient();
  const [searchfield, setSearchfield] = useState('');
  const [activeTab, setActiveTab] = useState('');

  if (logToggle) {
    console.group('RobotHome');
    console.count('counter - RobotHome');
  }

  const auth = useAuth();
  const { accessToken, username, isLoading } = auth.currentUser;
  const currentUsername = auth && username ? username : null;

  // debug(
  //   `RobotHome: useEffect:`,
  //   ownedRobots,
  //   robots.length,
  //   currentUsername,
  //   accessToken?.slice(-8)
  // );

  // const initialRobotLoad = async () => {
  //   const fetchedRobots = await getAllRobots();
  //   const partitionedRobots = fetchedRobots.data.reduce(
  //     (partition, robot) => {
  //       robot.createdBy === username
  //         ? partition?.myRobots?.push(robot)
  //         : partition?.allRobots?.push(robot);
  //       return partition;
  //     },
  //     { myRobots: [], allRobots: [] }
  //   );
  //   return { data: partitionedRobots };
  // };

  const partitionRobots = useCallback(
    (robotList) => {
      if (robotList && robotList.length > 0) {
        const myRobots = robotList.filter((robot) => {
          return robot.createdBy === username;
        });
        return myRobots;
      }
    },
    [username]
  );

  const dbQuery = useQuery({
    queryKey: ['robots-db'],
    queryFn: getAllRobots,
    retry: 1,
    retryDelay: 100,
    refetchOnWindowFocus: false,
  });
  const { data: dbData, isError: dbIsError, error: dbErr } = dbQuery;

  const fetchQuery = useQuery({
    queryKey: ['robots-fetch'],
    queryFn: getRobotsFromFetchQuery,
    enabled: !!dbErr,
    refetchOnWindowFocus: false,
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
        const { id } = robot;
        robot.robotId = Number(id);
        robot.userRole = 'public';
        robot.createdBy = 'seed';
        delete robot.id;

        if (!dbIsError && robot.robotId) addRobotToDb(robot);
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
    if (!isLoading) {
      if (!dbIsError && dbData) {
        const { data } = dbData;
        const myRobots = partitionRobots(data);

        if (myRobots?.length > 0) {
          setActiveTab('tab-my-robots');
          setOwnedRobots([...myRobots]);
        } else {
          setActiveTab('tab-all-robots');
        }
        setAllRobots([...data]);
      } else if (!fetchIsError && fetchData) {
        try {
          console.group(`fetch`);
          debug(
            `fetching: fetchIsError:`,
            fetchIsError,
            'fetchData',
            fetchData
          );
          console.groupEnd();
          fetchRobotMutation.mutate(fetchData);
          setAllRobots([...fetchData]);
          setActiveTab('tab-all-robots');
        } catch (err) {
          debug(err);
        }
      }
    }
  }, [
    dbData,
    fetchData,
    dbIsError,
    fetchIsError,
    setOwnedRobots,
    setAllRobots,
    partitionRobots,
    isLoading,
  ]);

  async function getRobotsFromFetchQuery() {
    return fetch('https://dummyjson.com/users?limit=100')
      .then((response) => response.json())
      .then((data) => data.users);
  }

  async function addRobotToDb(robot) {
    debug(`addRobotToDbInvoked: robot.robotId:`, robot.robotId);
    try {
      // Note that fetched robots don't have _ids since those are added by MongoDB
      const dbCheck = robot._id ? await getRobotById(robot._id) : null;
      if (!dbCheck) {
        createRobot(robot);
        return false;
      }
      debug(`addRobotToDb: Already found ${robot._id?.slice(-8)}`);
      return true;
    } catch (err) {
      debug(`addRobotsToDb: Error creating new robot: ${err}`);
    }
  }

  const onSearchChange = (event) => {
    setSearchfield(event.target.value);
  };

  const filteredRobots = allRobots.filter((robot) => {
    const fullName = `${robot.firstName} ${robot.lastName}`;
    return fullName.toLowerCase().includes(searchfield.toLowerCase());
  });
  const filteredOwnedRobots = ownedRobots.filter((robot) => {
    const fullName = `${robot.firstName} ${robot.lastName}`;
    return fullName.toLowerCase().includes(searchfield.toLowerCase());
  });

  const handleTabChange = (tabId) => {
    return setActiveTab(tabId);
  };

  const handleAddOneIncrement = () => {
    return activeTab === 'tab-all-robots'
      ? setCount((prevCount) => prevCount + 1)
      : setOwnCount((prevCount) => prevCount + 1);
  };

  const handleAddTenIncrement = () => {
    return activeTab === 'tab-all-robots'
      ? setCount((prevCount) => prevCount + 10)
      : setOwnCount((prevCount) => prevCount + 10);
  };

  const currentCount = activeTab === 'tab-all-robots' ? count : ownCount;
  console.groupEnd();

  if (allRobots.length === 0) {
    // if (allRobots.length === 0 || isLoading) {
    if (logToggle) {
      console.table('---Loading---', {
        dbData,
        fetchData,
        dbIsError,
        dbErr,
        fetchIsError,
        fetchErr,
        'robot-length': allRobots.length,
        accessToken,
        username,
        count,
        queryClient,
      });
    }
    return <h1>Loading</h1>;
  }

  const combinedTabs = (
    <div className="flex flex-wrap" id="tabs-id">
      <div className="w-full text-center">
        <h1 className="text-white text-3xl font-bold pb-3 border-b">
          RoboFriends
        </h1>
        <h2 className="text-white text-white-font-extralight">
          Showing {currentCount} Robots
        </h2>
        {currentUsername && (
          <div>
            <h2 className="text-white text-white-font-extralight mx-32">
              Hello {username}. Your access token is:
            </h2>
            <h2 className="text-white text-white-font-extralight mx-32">
              ...{accessToken.slice(-8)}
            </h2>
          </div>
        )}
        <button
          className="bg-pink-500 text-white uppercase mt-5 mx-2.5 p-2.5 text-base font-thin tracking-wide inline-block appearance-none border-none rounded"
          type="button"
          onClick={handleAddOneIncrement}
        >
          Add Robot
        </button>
        <button
          className="bg-pink-500 text-white uppercase mt-5 mx-2.5 p-2.5 text-base font-thin tracking-wide inline-block appearance-none border-none rounded"
          type="button"
          onClick={handleAddTenIncrement}
        >
          Add 10 Robots
        </button>

        <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <Link
              // eslint-disable-next-line prettier/prettier
              className={(activeTab === 'tab-my-robots'
                  ? 'text-white bg-pink-600'
                  : 'text-pink-600 bg-white') +
                ' text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal cursor-pointer'
              }
              onClick={() => handleTabChange('tab-my-robots')}
              onKeyDown={() => handleTabChange('tab-my-robots')}
            >
              <i className="fas fa-space-shuttle text-base mr-1" /> My Robots
            </Link>
          </li>
          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <Link
              className={
                (activeTab === 'tab-all-robots'
                  ? 'text-white bg-pink-600'
                  : 'text-pink-600 bg-white') +
                ' text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal cursor-pointer'
              }
              onClick={() => handleTabChange('tab-all-robots')}
              onKeyDown={() => handleTabChange('tab-all-robots')}
            >
              <i className="fas fa-cog text-base mr-1" /> All Robots
            </Link>
          </li>
          <li className="-mb-px mr-2 last:mr-0 flex-auto flex-grow text-center">
            <Link
              className={
                (activeTab === 'tab-create-robots'
                  ? 'text-white bg-pink-600'
                  : 'text-pink-600 bg-white') +
                ' text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal cursor-pointer'
              }
              onClick={() => handleTabChange('tab-create-robots')}
              onKeyDown={() => handleTabChange('tab-create-robots')}
              to="./robot"
            >
              <i className="fas fa-cog text-base mr-1" /> Create New Robot
            </Link>
          </li>
        </ul>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
          <div className="px-4 py-5 flex-auto">
            <div className="tab-content tab-space">
              <div
                className={`${
                  activeTab === 'tab-my-robots' ? 'block' : 'hidden'
                }`}
                id="tab-my-robots"
              >
                <NullOutHiddenComponents
                  visible={activeTab === 'tab-my-robots'}
                >
                  <Suspense fallback={<h3>Own Robots Loading</h3>}>
                    <LazySearchBox searchChange={onSearchChange} />
                    <Scroll>
                      <LazyCardList
                        robots={filteredOwnedRobots}
                        count={ownCount}
                        message="my robots"
                      />
                    </Scroll>
                  </Suspense>
                </NullOutHiddenComponents>
              </div>

              <div
                className={`${
                  activeTab === 'tab-all-robots' ? 'block' : 'hidden'
                }`}
                id="tab-all-robots"
              >
                <NullOutHiddenComponents
                  visible={activeTab === 'tab-all-robots'}
                >
                  <Suspense fallback={<h1>Loading</h1>}>
                    <LazySearchBox searchChange={onSearchChange} />
                    <Scroll>
                      <LazyCardList
                        robots={filteredRobots}
                        count={count}
                        message="all robots"
                      />
                    </Scroll>
                  </Suspense>
                </NullOutHiddenComponents>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return combinedTabs;
}

RobotHome.propTypes = {
  count: PropTypes.number,
  ownCount: PropTypes.number,
  setCount: PropTypes.func,
  setOwnCount: PropTypes.func,
  allRobots: PropTypes.array,
  setAllRobots: PropTypes.func,
  ownedRobots: PropTypes.array,
  setOwnedRobots: PropTypes.func,
};
