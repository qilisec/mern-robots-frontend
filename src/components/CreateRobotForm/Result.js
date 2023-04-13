import { useForm } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import updateAction from './updateAction';

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
      <div className="text-center">
        {state.page > 0 && (
          <button
            type="button"
            className="fixed w-[270px] py-2 px-5 text-base tracking-wide text-slate-800 uppercase  bg-pink-300 border-none rounded appearance-none place-items-end -translate-x-[280px]"
            onClick={handleSubmit(prevPage)}
          >
            Back
          </button>
        )}
        {state.page < 2 && (
          <button
            type="button"
            className="fixed w-[270px] px-5 py-2 text-base tracking-wide text-slate-800 uppercase translate-x-2 bg-pink-300 border-none rounded appearance-none place-items-end"
            onClick={handleSubmit(nextPage)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Result;
