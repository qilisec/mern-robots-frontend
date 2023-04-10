import React from 'react';
import { useForm } from 'react-hook-form';
// import { withRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from './CompterWithRouterProp';
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
    <form className="MultiPageForm" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="MultiPageForm">Step 2</h2>
      <label className="MultiPageForm">
        Age:
        <input
          className="MultiPageForm"
          {...register('age')}
          defaultValue={state.age}
        />
      </label>
      <label className="MultiPageForm">
        Years of experience:
        <input
          className="MultiPageForm"
          {...register('yearsOfExp')}
          defaultValue={state.yearsOfExp}
        />
      </label>
      <input className="MultiPageForm" type="submit" />
    </form>
  );
};

// export default withRouter(Step2);
export default ComponentWithRouterProp(Step2);
