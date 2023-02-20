import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return <h1>Error occurred</h1>;
    }
    return children;
  }
}

// ErrorBoundary.propTypes = {
//   children: PropTypes.object,
// };

export default ErrorBoundary;
