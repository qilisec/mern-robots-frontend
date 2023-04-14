import React from 'react';
import PropTypes from 'prop-types';

const Scroll = ({ children }) => (
  <div
    style={{
      overflowY: 'auto',
      border: '1px solid black',
      maxHeight: '1000px',
    }}
  >
    {children}
  </div>
);

Scroll.propTypes = {
  children: PropTypes.object,
};
/* 006_03* - In order to create our "Scroll" functionality, we will use a new React feature called "children". "children" is a prop that is generated in all components. This prop is an object that lists all components that can be found "within" the current component. Thus, to add "scroll" functionality to our components (e.g. "CardList"), we wrap our components with "Scroll", which makes "CardList" a child of "Scroll". 

Note that we ultimately actually still use CSS in order to achieve our desired functionality. However, given the amount of CSS that we needed, we can see how creating this component can be more efficient if we have to apply this property to multiple components.
*/
export default Scroll;
