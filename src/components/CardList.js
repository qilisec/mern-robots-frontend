import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const { log } = console;
const logToggle = 0;
const debug = (message) => {
  if (logToggle) return log(message);
};

const CardList = (props) => {
  const { robots, count, message } = props;
  if (logToggle) console.count(`Card List Component for ${message} invoked`);
  const cards = [];
  const cardQuantity = robots.length > count ? count : robots.length;

  if (robots.length > 0) {
    try {
      for (let i = 0; i < cardQuantity; i++) {
        const robot = robots[i];
        const card = (
          <Card
            key={i}
            id={robot.robotId}
            firstName={robot.firstName}
            lastName={robot.lastName}
            phone={robot.phone}
            email={robot.email}
          />
        );
        cards.push(card);
      }
    } catch (err) {
      console.log(`Card List Component Generation error:`, err);
    }
  }
  // debugger;
  return <div>{cards}</div>;
};

CardList.propTypes = {
  robots: PropTypes.array,
  count: PropTypes.number,
  message: PropTypes.string,
};
export default CardList;
