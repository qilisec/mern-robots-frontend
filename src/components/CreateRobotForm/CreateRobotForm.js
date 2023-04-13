import { useEffect } from 'react';
import { useStateMachine } from 'little-state-machine';
import updateAction from '../../updateAction';
import First from './Step1';
import Second from './Step2';
import Result from './Result';

function Form() {
  const { actions, state } = useStateMachine({ updateAction });
  console.log(`CreateRobotForm`, state);

  useEffect(() => {
    if (!state.launchedForm && state.page !== 0) {
      console.log(`CreateRobotForm accessed from navbar`);
      actions.updateAction({ page: 0, launchedForm: true });
    }
  }, []);

  const conditionalComponent = () => {
    switch (state.page) {
      case 0:
        return <First />;
      case 1:
        return <Second />;
      case 2:
        return <Result />;
      default:
        return <First />;
    }
  };

  return <>{conditionalComponent()}</>;
}
export default Form;
