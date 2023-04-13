import { useForm } from 'react-hook-form';
// import { withRouter } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from './ComponentWithRouterProp';
import updateAction from './updateAction';

const Step1 = (props) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { actions, state } = useStateMachine({ updateAction });

  console.log(`Step1`, state);

  const prevPage = (data) => {
    data.page = state.page - 1;
    actions.updateAction(data);
  };
  const nextPage = (data) => {
    data.page = state.page + 1;
    actions.updateAction(data);
  };

  const onSubmit = (data) => {
    console.log(`onSubmit:`, data);
    data.page = 2;
    actions.updateAction(data);
  };

  return (
    <div className="create-robot-form">
      <h1 className="create-robot-form">Create Robot</h1>
      <form className="create-robot-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="create-robot-form">Step 1</h2>
        <label className="create-robot-form">
          First Name:
          <input
            className="create-robot-form"
            {...register('firstName')}
            defaultValue={state.firstName}
          />
        </label>
        <label className="create-robot-form">
          Last Name:
          <input
            className="create-robot-form"
            {...register('lastName')}
            defaultValue={state.lastName}
          />
        </label>
        <input className="create-robot-form" type="submit" />
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
      </form>
    </div>
  );
};

export default ComponentWithRouterProp(Step1);
