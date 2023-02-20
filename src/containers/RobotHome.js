import PropTypes from 'prop-types';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RobotHome({
  count,
  setCount,
  robots,
  searchfield,
  setSearchfield,
}) {
  const onSearchChange = (event) => {
    setSearchfield(event.target.value);
  };

  const filteredRobots = robots.filter((robot) => {
    const fullName = `${robot.firstName} ${robot.lastName}`;
    return fullName.toLowerCase().includes(searchfield.toLowerCase());
  });

  if (robots.length === 0) {
    console.log('Loading');
    return <h1>Loading</h1>;
  }
  return (
    <div className="tc">
      <h1>RoboFriends</h1>
      <h2>Showing {count} Robots</h2>
      <button
        type="button"
        onClick={() => setCount((prevCount) => Number(prevCount) + 1)}
      >
        Add Robot
      </button>
      <SearchBox searchChange={onSearchChange} />
      <Scroll>
        <ErrorBoundary>
          <CardList robots={filteredRobots} count={count} />
        </ErrorBoundary>
      </Scroll>
    </div>
  );
}

RobotHome.propTypes = {
  count: PropTypes.number,
  setCount: PropTypes.func,
  robots: PropTypes.array,
  searchfield: PropTypes.string,
  setSearchfield: PropTypes.func,
};
