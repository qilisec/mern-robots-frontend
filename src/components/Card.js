import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';

const Card = ({ id, firstName, lastName, email, phone }) => (
  // <div className="tc bg-light-green dib br3 pa3 ma2 grow bw2 shadow-5">
  <div className="text-center bg-teal-200 inline-block rounded-lg p-5 m-2.5 hover:scale-105 transition-all duration-500 cursor-pointer border-2 shadow-md">
    <img alt="robots" src={`https://robohash.org/${id}?200`} />
    <div className="">
      <ErrorBoundary>
        {/* <Link style={{ color: 'black' }} to={`/robot/${id}`}> */}
        <Link to={`/robot/${id}`}>
          {firstName} {lastName}
        </Link>
      </ErrorBoundary>
      <p className="mb-1">{email}</p>
      <p className="mb-1">{phone}</p>
    </div>
  </div>
);

Card.propTypes = {
  firstName: PropTypes.string,
  email: PropTypes.string,
  lastName: PropTypes.string,
  id: PropTypes.number,
  phone: PropTypes.string,
};

export default Card;
