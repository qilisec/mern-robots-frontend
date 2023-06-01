import { useRef } from 'react';
import PropTypes from 'prop-types';

function NullOutHiddenComponents({ visible, children }) {
  const rendered = useRef(visible);

  if (visible && !rendered.current) {
    rendered.current = true;
  }

  if (!rendered.current) return null;

  return <div style={{ display: visible ? 'block' : 'none' }}>{children}</div>;
}

export default NullOutHiddenComponents;

NullOutHiddenComponents.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.node,
};
