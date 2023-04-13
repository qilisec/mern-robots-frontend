import React from 'react';
import { useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from './ComponentWithRouterProp';
import updateAction from './updateAction';

const Step2 = (props) => {
  const { register, handleSubmit } = useForm();

  const { actions, state } = useStateMachine({ updateAction });

  console.log(`Step2`, state);

  const onSubmit = (data) => {
    console.log(`onSubmit:`, data);
    data.page = state.page + 1;
    actions.updateAction(data);
  };
  const prevPage = (data) => {
    data.page = state.page - 1;
    actions.updateAction(data);
  };
  const nextPage = (data) => {
    data.page = 2;
    actions.updateAction(data);
  };
  return (
    <div className="create-robot-form">
      <h1 className="create-robot-form">Create Robot</h1>
      <form className="create-robot-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="create-robot-form">Step 2</h2>
        <label className="create-robot-form">
          Age:
          <input
            className="create-robot-form"
            {...register('age')}
            defaultValue={state.age}
          />
        </label>
        <label className="create-robot-form">
          Years of experience:
          <input
            className="create-robot-form"
            {...register('yearsOfExp')}
            defaultValue={state.yearsOfExp}
          />
        </label>
        <input className="create-robot-form" type="submit" />
        <div className="text-center">
          {state.page > 0 && (
            <button
              type="button"
              className="fixed w-[270px] py-2 px-5 text-base tracking-wide text-slate-800 uppercase  bg-pink-300 border-none rounded appearance-none place-items-end -translate-x-[280px]"
              // onClick={() => setPage(page - 1)}
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
      </form>
    </div>
  );
};

// export default withRouter(Step2);
export default ComponentWithRouterProp(Step2);
