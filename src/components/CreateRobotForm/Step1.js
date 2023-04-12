import { useForm } from 'react-hook-form';
// import { withRouter } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from './ComponentWithRouterProp';
import updateAction from './updateAction';

const Step1 = (props) => {
  //   console.log(`Step1: props`, props);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { actions, state } = useStateMachine({ updateAction });
  const { history } = props;
  const onSubmit = (data) => {
    actions.updateAction(data);
    // props.history.push('./step2');
    navigate('./step2');
  };

  return (
    // <div className="MultiPageForm">
    // <div className="bg-slate-850 max-w-xl text-center my-2.5 mx-auto mw- p-4">
    <div className="max-w-xl text-center my-2.5 mx-auto p-4 ">
      <h1 className="text-white text-3xl font-bold pb-3 border-b font-sans">
        Create Robot
      </h1>
      <form className="max-w-[500px] mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-white font-extralight">Step 1</h2>
        <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
          First Name:
          <input
            className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
            {...register('firstName')}
            defaultValue={state.firstName}
          />
        </label>
        <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
          Last Name:
          <input
            className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
            {...register('lastName')}
            defaultValue={state.lastName}
          />
        </label>
        <input
          className="bg-pink-500 text-white uppercase mt-10 p-5 text-base font-thin tracking-wide inline-block appearance-none border-none rounded w-full"
          type="submit"
        />
      </form>
    </div>
  );
};

export default ComponentWithRouterProp(Step1);
// export default withRouter(Step1);
