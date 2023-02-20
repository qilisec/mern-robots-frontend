import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './RobotInfo.css';
import PropTypes from 'prop-types';

function useIsMounted() {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return useCallback(() => isMounted.current, []);
}

export default function RobotInfo({ robots }) {
  const { id } = useParams();
  const [currentRobot, setCurrentRobot] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useIsMounted();

  // console.log(`robots is ${robots}`);

  useEffect(() => {
    const getRobotInfo = async () => {
      const matchingRobot = await robots.find(
        (robot) => Number(robot.robotId) === Number(id)
      );
      try {
        console.log(`matchingRobot is ${matchingRobot.robotId}`);
        setCurrentRobot(matchingRobot);
        setIsLoading(false);
        return matchingRobot;
      } catch (err) {
        console.log(`error in getRobotInfo: ${err}`);
      }
    };
    getRobotInfo();
  }, [robots.length > 0]);

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
        <div className="flex justify-center">
          <ul className="">
            <li>
              Name: {currentRobot.firstName} {currentRobot.lastName}
            </li>
            <li>Birthdate: {currentRobot.birthDate}</li>
            <li>Age: {currentRobot.age}</li>
            <li>Gender: {currentRobot.gender}</li>
            <li>Height: {currentRobot.height}</li>
            <li>Bloodtype: {currentRobot.bloodGroup}</li>
            <li>Eye Color: {currentRobot.eyeColor}</li>
            <li>
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
