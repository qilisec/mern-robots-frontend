import PropTypes from 'prop-types';

const { log } = console;
const logToggle = 0;
const debug = (message) => {
  if (logToggle) return log(message);
};

const SearchBox = ({ searchChange }) => {
  if (logToggle) console.count(`SearchBox invoked`);
  return (
    <div className="p-4">
      <input
        className="p-2 border-solid border-green bg-blue-200"
        type="search"
        placeholder="search robots"
        onChange={searchChange}
      />
    </div>
  );
};
SearchBox.propTypes = {
  searchChange: PropTypes.func,
};
export default SearchBox;
