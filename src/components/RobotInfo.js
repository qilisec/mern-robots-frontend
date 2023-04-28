import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

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
  console.log(`RobotInfo: robots:`, allRobots);
  const { id } = useParams();
  const [currentRobot, setCurrentRobot] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useIsMounted();
  console.log(`robotInfo component invoked`);
  // console.log(`robots is ${robots}`);

  useEffect(() => {
    const getRobotInfo = async () => {
      const matchingRobot = await allRobots.find(
        (robot) => Number(robot.robotId) === Number(id)
      );
      try {
        console.log(`matchingRobot is ${matchingRobot.robotId}`);
        setCurrentRobot(matchingRobot);
        setIsLoading(false);
        return matchingRobot;
      } catch (err) {
        console.log(`error in getRobotInfo: ${err}`);
        return err;
      }
    };
    getRobotInfo();
  }, [allRobots.length > 0]);
  // useEffect(() => {
  //   const getRobotInfo = async () => {
  //     const matchingRobot = await robots.find(
  //       (robot) => Number(robot.robotId) === Number(id)
  //     );
  //     try {
  //       console.log(`matchingRobot is ${matchingRobot.robotId}`);
  //       setCurrentRobot(matchingRobot);
  //       setIsLoading(false);
  //       return matchingRobot;
  //     } catch (err) {
  //       console.log(`error in getRobotInfo: ${err}`);
  //       return err;
  //     }
  //   };
  //   getRobotInfo();
  // }, [robots.length > 0]);

  const render = () => {
    if (isLoading) {
      return <h1>Loading currentRobotInfo</h1>;
    }
    console.log(
      `isLoading is ${isLoading}, currentRobot.robotId is ${currentRobot.robotID}`
    );
    if (currentRobot) {
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
        </div>
      );
      return robotInfo;
    }
  };
  return render();
}
