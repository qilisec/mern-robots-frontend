import { useForm } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from '../ComponentWithRouterProp';
import updateAction from '../../updateAction';

const Step1 = (props) => {
  const { register, handleSubmit } = useForm();
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
        <h2 className="create-robot-form">Step {state.page + 1} of 5</h2>
        <label className="create-robot-form">
          First Name:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.firstName')}
            defaultValue={state.robotFormBasic.firstName}
          />
        </label>
        <label className="create-robot-form">
          Last Name:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.lastName')}
            defaultValue={state.robotFormBasic.lastName}
          />
        </label>
        <label className="create-robot-form">
          Maiden Name:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.maidenName')}
            defaultValue={state.robotFormBasic.maidenName}
          />
        </label>
        <label className="create-robot-form">
          Email Address:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.email')}
            defaultValue={state.robotFormBasic.email}
          />
        </label>
        <label className="create-robot-form">
          Date of Birth:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.birthdate')}
            defaultValue={state.robotFormBasic.birthdate}
          />
        </label>
        <label className="create-robot-form">
          Age:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.age')}
            defaultValue={state.robotFormBasic.age}
          />
        </label>
        <label className="create-robot-form">
          Phone Number:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.phone')}
            defaultValue={state.robotFormBasic.phone}
          />
        </label>
        <label className="create-robot-form">
          University:
          <input
            className="create-robot-form"
            {...register('robotFormBasic.university')}
            defaultValue={state.robotFormBasic.university}
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
          {state.page < 5 && (
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
