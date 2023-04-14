import { useForm } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import updateAction from '../../updateAction';

const Result = (props) => {
  const { actions, state } = useStateMachine({ updateAction });
  const { handleSubmit } = useForm();
  console.log(`result`, state);

  const prevPage = (data) => {
    data.page = state.page - 1;
    actions.updateAction(data);
  };
  const nextPage = (data) => {
    data.page = state.page + 1;
    actions.updateAction(data);
  };

  return (
    <div className="mb-2 create-robot-form">
      <h2 className="create-robot-form">Result:</h2>
      <pre className="text-primary">
        {JSON.stringify(state, null, 2)
          .slice(1, -1)
          .replace(/[{}"],?/g, '')}
      </pre>
      <div>
        <button
          type="button"
          className="text-slate-800 bg-pink-300 inline-block w-full py-2 px-5 text-base tracking-wide uppercase border-none rounded appearance-none"
          onClick={handleSubmit(prevPage)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Result;
