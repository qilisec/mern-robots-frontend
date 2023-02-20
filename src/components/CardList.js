import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const CardList = ({ robots, count }) => {
  const cardComponent = robots
    .filter((robot) => robot.robotId <= count)
    .map((robot, i) => (
      <Card
        key={i}
        id={robot.robotId}
        firstName={robot.firstName}
        lastName={robot.lastName}
        phone={robot.phone}
        email={robot.email}
      />
    ));
  return <div>{cardComponent}</div>;
};

CardList.propTypes = {
  robots: PropTypes.array,
  count: PropTypes.number,
};
export default CardList;
