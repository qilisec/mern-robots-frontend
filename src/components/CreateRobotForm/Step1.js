import { useForm } from 'react-hook-form';
// import { withRouter } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from './CompterWithRouterProp';
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
    <div className="MultiPageForm">
      <h1 className="MultiPageForm">Create Robot</h1>
      <form className="MultiPageForm" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="MultiPageForm">Step 1</h2>
        <label className="MultiPageForm">
          First Name:
          <input
            className="MultiPageForm"
            {...register('firstName')}
            defaultValue={state.firstName}
          />
        </label>
        <label className="MultiPageForm">
          Last Name:
          <input
            className="MultiPageForm"
            {...register('lastName')}
            defaultValue={state.lastName}
          />
        </label>
        <input className="MultiPageForm" type="submit" />
      </form>
    </div>
  );
};

export default ComponentWithRouterProp(Step1);
// export default withRouter(Step1);
