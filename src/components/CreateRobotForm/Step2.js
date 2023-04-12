import React from 'react';
import { useForm } from 'react-hook-form';
// import { withRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from './ComponentWithRouterProp';
import updateAction from './updateAction';

const Step2 = (props) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { actions, state } = useStateMachine({ updateAction });
  const { history } = props;
  const onSubmit = (data) => {
    actions.updateAction(data);
    // props.history.push('./result');
    navigate('/robot/result');
  };

  return (
    <div className="max-w-xl text-center my-2.5 mx-auto p-4">
      <h1 className="text-white text-3xl font-bold pb-3 border-b">
        Create Robot
      </h1>
      <form className="max-w-[500px] mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-white font-extralight">Step 2</h2>
        <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
          Age:
          <input
            className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
            {...register('age')}
            defaultValue={state.age}
          />
        </label>
        <label className="leading-loose text-left block mb-3.5 mt-5 text-white text-sm font-extralight">
          Years of experience:
          <input
            className="text-black inline-block box-border w-full border rounded border-white px-3.5 py-2.5 mb-2.5 text-lg"
            {...register('yearsOfExp')}
            defaultValue={state.yearsOfExp}
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

// export default withRouter(Step2);
export default ComponentWithRouterProp(Step2);
