import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';

const { log } = console;
const logToggle = 0;
const debug = (message) => {
  if (logToggle) return log(message);
};

const Card = ({ id, firstName, lastName, email, phone }) => {
  if (logToggle)
    console.table(`Card Component invoked: firstName`, firstName, lastName, id);
  return (
    <ErrorBoundary>
      <Link to={`/robot/${id}`}>
        <div className="text-center bg-teal-200 inline-block rounded-lg p-5 m-2.5 hover:scale-105 transition-all duration-500 cursor-pointer border-2 shadow-md">
          <img alt="robots" src={`https://robohash.org/${id}?200`} />
          <div className="">
            {firstName} {lastName}
            <p className="mb-1">{email}</p>
            <p className="mb-1">{phone}</p>
          </div>
        </div>
      </Link>
    </ErrorBoundary>
  );
};

Card.propTypes = {
  firstName: PropTypes.string,
  email: PropTypes.string,
  lastName: PropTypes.string,
  id: PropTypes.number,
  phone: PropTypes.string,
};

export default Card;
