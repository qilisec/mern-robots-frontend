import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getRobotById } from '../api';
import { deleteRobot } from '../api/privateApi';

function useIsMounted(props) {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return useCallback(() => isMounted.current, []);
}

export default function RobotInfo(props) {
  const { allRobots } = props;
  const navigate = useNavigate();
  // console.log(`RobotInfo: robots:`, allRobots);
  const { id } = useParams();
  const [currentRobot, setCurrentRobot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleInfoFetch = () => {
    console.log(`Robot info query invoked`);
    return getRobotById(id);
  };

  const infoQuery = useQuery({
    queryKey: ['robot-info'],
    // ISSUE: Receiving errors: TypeError: _this2.options.queryFn is not a function
    // I though it was because of nullish coalescing on getRobotById fn output. I hoped that removing "?? null" would fix the issue. It did not.
    // I then thought the issue was because of the format of the conditional in the "enabled" property. I changed it to !allRobots.length. It was not due to that
    // SOLUTION: I wrapped the underlying API call in another function call, which worked. The only reason I can think of that explains this is that it prevents fetch attempts before the id prop has been retrieved from useParams.
    queryFn: handleInfoFetch,
    // queryFn: getRobotById(id),
    retries: 0,
    enabled: allRobots.length === 0,
    refetchOnWindowFocus: false,
  });

  const { data } = infoQuery;

  const sendRobotDelete = async () => {
    console.log(`sendRobotDelete: id:`, id);
    await deleteRobot(id);
    navigate('/');
  };

  useEffect(() => {
    const getRobotInfo = async () => {
      console.log(`RobotInfo useEffect invoked:`, allRobots);
      const matchingRobot =
        data ||
        (await allRobots.find((robot) => Number(robot.robotId) === Number(id)));
      try {
        console.log(`matchingRobot is ${matchingRobot.robotId}`);
        setCurrentRobot(matchingRobot);
        setIsLoading(false);
      } catch (err) {
        console.log(`error in getRobotInfo: ${err}`);
        return err;
      }
    };
    if (isLoading) getRobotInfo();

    // NOTE: Attempting to use cleanup function to set "isLoading" to false crashes the app. I don't know why.
    // return setIsLoading(false);
  }, [data, allRobots, id, isLoading]);

  const render = () => {
    if (isLoading) {
      return (
        <h1 className="text-center text-white">Loading currentRobotInfo</h1>
      );
    }
    console.log(
      `isLoading is ${isLoading}, currentRobot.robotId is ${currentRobot.robotID}`
    );
    if (!isLoading && currentRobot) {
      const { address, city, postalCode, state } = currentRobot.address;
      console.log(`currentRobot is ${currentRobot.robotID}`);
      const robotInfo = (
        <div className="my-8 text-center ">
          <h1 className="text-white text-3xl font-bold pb-3 ">Profile</h1>
          <ul className="inline-block text-center">
            <li className="text-white">
              Name: {currentRobot.firstName} {currentRobot.lastName}
            </li>
            <li className="text-white my-1 ">
              Birthdate: {currentRobot.birthDate}
            </li>
            <li className="text-white my-1">Age: {currentRobot.age}</li>
            <li className="text-white my-1">Gender: {currentRobot.gender}</li>
            <li className="text-white my-1">Height: {currentRobot.height}</li>
            <li className="text-white my-1">
              Bloodtype: {currentRobot.bloodGroup}
            </li>
            <li className="text-white my-1">
              Eye Color: {currentRobot.eyeColor}
            </li>
            <li className="text-white my-1">
              Address: {address} <br />
              {city}, {postalCode} {state}
            </li>
          </ul>
          <div className="mt-4">
            <button
              type="button"
              className="text-white bg bg-pink-300 px-4 py-2"
              onClick={sendRobotDelete}
            >
              Delete Robot
            </button>
          </div>
        </div>
      );
      return robotInfo;
    }
  };
  return render();
}
