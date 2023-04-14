import { useEffect } from 'react';
import { useStateMachine } from 'little-state-machine';
import { useAuth } from '../auth';
import updateAction from '../../updateAction';
import First from './Step1';
import Second from './Step2';
import Result from './Result';
import StepN from './StepN';

function Form() {
  const { actions, state } = useStateMachine({ updateAction });
  const { page } = state;
  const auth = useAuth();
  console.log(`CreateRobotForm Page ${page + 1}`);

  useEffect(() => {
    if (!state.launchedForm && page !== 0) {
      console.log(`CreateRobotForm accessed from navbar`);
      actions.updateAction({ page: 0, launchedForm: true });
    }
  }, []);

  const prevPage = (data) => {
    data.page = page - 1;
    actions.updateAction(data);
  };
  const nextPage = (data) => {
    data.page = page + 1;
    actions.updateAction(data);
  };

  const onSubmit = (data) => {
    console.log(`onSubmit:`, data);
    data.page = 5;
    actions.updateAction(data);
  };

  const formNavigation = { prevPage, nextPage, onSubmit };

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return (
          <StepN
            form="robotForm"
            formStyle="create-robot-form"
            formNavigation={formNavigation}
          />
        );
      case 1:
        return (
          <StepN
            form="robotForm"
            formStyle="create-robot-form"
            formNavigation={formNavigation}
          />
        );
      case 2:
        return (
          <StepN
            form="robotForm"
            formStyle="create-robot-form"
            formNavigation={formNavigation}
          />
        );
      case 3:
        return (
          <StepN
            form="robotForm"
            formStyle="create-robot-form"
            formNavigation={formNavigation}
          />
        );
      case 4:
        return (
          <StepN
            form="robotForm"
            formStyle="create-robot-form"
            formNavigation={formNavigation}
          />
        );
      case 5:
        return <Result formNavigation={formNavigation} />;
      default:
        return <StepN />;
    }
  };

  return <>{conditionalComponent()}</>;
}
export default Form;
