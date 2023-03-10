import React, { Component } from 'react';
import PropTypes from 'prop-types';

const SearchBox = ({ searchChange }) => (
  /* 004_06; searchfield comes from our declared "state", searchChange comes from our declared "props" */

  <div className="pa2">
    <input
      className="pa3 ba b--green bg-lightest-blue"
      type="search"
      placeholder="search robots"
      onChange={searchChange}
      // onChange = {() => searchChange)}
      // Normally, onChange is set to trigger a (anonymous) function. However, since we have defined "onSearchChange" as a function already in App.js, we don't need to do it here.
    />
    {/* This "onChange" property changes as input in search box changes. The point of introducing this property is currently unknown to me. */}
  </div>
);
SearchBox.propTypes = {
  searchChange: PropTypes.func,
};
export default SearchBox;
