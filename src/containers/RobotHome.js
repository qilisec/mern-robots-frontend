import PropTypes from 'prop-types';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../components/auth';

export default function RobotHome({
  count,
  setCount,
  robots,
  searchfield,
  setSearchfield,
}) {
  const auth = useAuth();
  const currentUsername =
    auth && auth.currentAuthUsername ? auth.currentAuthUsername : null;

  const onSearchChange = (event) => {
    setSearchfield(event.target.value);
  };

  const filteredRobots = robots.filter((robot) => {
    const fullName = `${robot.firstName} ${robot.lastName}`;
    return fullName.toLowerCase().includes(searchfield.toLowerCase());
  });

  if (robots.length === 0) {
    console.log(
      '------------------------------------\n---------------Loading--------------\n------------------------------------'
    );
    return <h1>Loading</h1>;
  }
  return (
    <div className="tc">
      <h1>RoboFriends</h1>
      <h2>Showing {count} Robots</h2>
      {/* <h2>Credentials Found? {auth.credentialsFound.toString()}</h2> */}
      {currentUsername && (
        <div>
          <h2>Hello {auth.currentAuthUsername}. Your access token is:</h2>
          <h2 className="dib-m mh6">
            {/* <h2 className="overflow-scroll dib-m mh6"> */}
            ...{auth.currentAuthUser.slice(-10)}
          </h2>
          {/* <h2>Your refreshToken is {auth.currentRefreshToken}</h2> */}
        </div>
      )}
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
