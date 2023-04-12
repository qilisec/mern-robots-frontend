import { useStateMachine } from 'little-state-machine';
import updateAction from './updateAction';

const Result = (props) => {
  const { state } = useStateMachine(updateAction);

  return (
    <div className="max-w-xl text-center my-2.5 mx-auto p-4">
      <h2 className="text-white font-extralight">Result:</h2>
      <pre>
        {
          JSON.stringify(state, null, 2)
            .slice(1, -1)
            .replace(/[{}"],?/g, '')
            .split(/\n +\n/)[1]
        }
      </pre>
    </div>
  );
};

export default Result;
