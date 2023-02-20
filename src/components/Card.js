import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';

const Card = ({ id, firstName, lastName, email, phone }) => (
  <div className="tc bg-light-green dib br3 pa3 ma2 grow bw2 shadow-5">
    <img alt="robots" src={`https://robohash.org/${id}?200`} />
    <div className="">
      <ErrorBoundary>
        <Link to={`/robot/${id}`}>
          {firstName} {lastName}
        </Link>
      </ErrorBoundary>
      <p className="mv1">{email}</p>
      <p className="mv1">{phone}</p>
    </div>
  </div>
);

Card.propTypes = {
  firstName: PropTypes.string,
  email: PropTypes.string,
  lastName: PropTypes.string,
  id: PropTypes.number,
};

export default Card;
