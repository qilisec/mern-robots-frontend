import { useEffect } from 'react';
import { useStateMachine } from 'little-state-machine';
import { useAuth } from '../auth';
import updateAction from '../../updateAction';
// import First from './Step1';
// import Second from './Step2';
// import Result from './Result';
import StepN from './StepN';
import useFormStore from '../../stores/robotFormStore';
import Result from './Result';

function Form() {
  // const { actions, state } = useStateMachine({ updateAction });
  // const { page } = state;
  const getState = useFormStore((state) => state);
  const page = useFormStore((state) => state.page);
  const [launchedForm, toggleFormStatus] = useFormStore((state) => [
    state.launchedForm,
    state.toggleFormStatus,
  ]);
  const prevPage = useFormStore((state) => {
    console.log(`prevPage invoked: ${state.page}:`);
    return state.prevPage;
  });
  const nextPage = useFormStore((state) => {
    console.log(`nextPage invoked: ${state.page}`);
    return state.nextPage;
  });
  const onSubmit = useFormStore((state) => state.onSubmit);
  const formNavigation = { prevPage, nextPage, onSubmit };
  const form = 'robotForm';
  const formStyle = 'create-robot-form';
  const formToc = useFormStore((state) => state[`${form}Toc`]);
  // const auth = useAuth();
  console.group(
    `createRobotForm: ${Date.now().toString().slice(-5)}`,
    getState
  );
  console.log(`CreateRobotForm Page ${page + 1}`);

  useEffect(() => {
    if (!launchedForm && page !== 0) {
      console.log(`CreateRobotForm accessed from navbar`);
      toggleFormStatus(true);
      // actions.updateAction({ page: 0, launchedForm: true });
    }
  }, []);

  // const prevPage = (data) => {
  //   data.page = page - 1;
  //   actions.updateAction(data);
  // };
  // const nextPage = (data) => {
  //   data.page = page + 1;
  //   actions.updateAction(data);
  // };

  // const onSubmit = (data) => {
  //   console.log(`onSubmit:`, data);
  //   data.page = 5;
  //   actions.updateAction(data);
  // };

  // console.log(
  //   `CreateRobotForm: formToc; formToc.length`,
  //   formToc,
  //   formToc.length,
  //   page > formToc.length
  // );
  console.groupEnd();

  const output =
    page === formToc.length ? (
      <Result
        form={form}
        formStyle={formStyle}
        formNavigation={formNavigation}
      />
    ) : (
      <StepN
        form={form}
        formStyle={formStyle}
        formNavigation={formNavigation}
      />
    );

  // return (
  //   <StepN form={form} formStyle={formStyle} formNavigation={formNavigation} />
  // );
  return output;
  // const conditionalComponent = () => {
  //   switch (page) {
  //     case 0:
  //       return (
  //         <StepN
  //           form="robotForm"
  //           formStyle="create-robot-form"
  //           formNavigation={formNavigation}
  //         />
  //       );
  //     case 1:
  //       return (
  //         <StepN
  //           form="robotForm"
  //           formStyle="create-robot-form"
  //           formNavigation={formNavigation}
  //         />
  //       );
  //     case 2:
  //       return (
  //         <StepN
  //           form="robotForm"
  //           formStyle="create-robot-form"
  //           formNavigation={formNavigation}
  //         />
  //       );
  //     case 3:
  //       return (
  //         <StepN
  //           form="robotForm"
  //           formStyle="create-robot-form"
  //           formNavigation={formNavigation}
  //         />
  //       );
  //     case 4:
  //       return (
  //         <StepN
  //           form="robotForm"
  //           formStyle="create-robot-form"
  //           formNavigation={formNavigation}
  //         />
  //       );
  //     case 5:
  //       return <Result formNavigation={formNavigation} />;
  //     default:
  //       return <StepN />;
  //   }
  // };

  // return <>{conditionalComponent()}</>;
}
export default Form;
