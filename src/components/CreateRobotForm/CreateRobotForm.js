import { useEffect } from 'react';
// import { useStateMachine } from 'little-state-machine';
// import updateAction from '../../updateAction';
import StepN from './StepN';
import useFormStore from '../../stores/robotFormStore';
import Result from './Result';

function Form() {
  /*
  Little-State-Machine Implementation
  // const { actions, state } = useStateMachine({ updateAction });
  // const { page } = state;

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
  */

  const getState = useFormStore((state) => state);
  const page = useFormStore((state) => state.page);
  const [launchedForm, toggleFormStatus] = useFormStore((state) => [
    state.launchedForm,
    state.toggleFormStatus,
  ]);

  // Bug: +Log, -Return state... = onValid is not a function
  const prevPage = useFormStore(
    (state) =>
      // console.log(`prevPage invoked: ${state.page}:`);
      state.prevPage
  );
  const nextPage = useFormStore(
    (state) =>
      // console.log(`nextPage invoked: ${state.page}`);
      state.nextPage
  );
  const onSubmit = useFormStore((state) => state.onSubmit);

  const form = 'robotForm';
  const formStyle = 'create-robot-form';
  const formToc = useFormStore((state) => state[`${form}Toc`]);

  console.group(
    `createRobotForm Page ${page + 1}: ${Date.now().toString().slice(-5)}`,
    { state: getState }
  );

  useEffect(() => {
    if (!launchedForm && page !== 0) {
      console.log(`CreateRobotForm accessed from navbar`);
      toggleFormStatus(true);
      /*
      Little-State-Machine Implementation
      // actions.updateAction({ page: 0, launchedForm: true });
      */
    }
  }, []);

  const formNavigation = { prevPage, nextPage, onSubmit };

  // console.log(
  //   `CreateRobotForm: formToc; formToc.length`,
  //   formToc,
  //   formToc.length,
  //   page > formToc.length
  // );
  console.groupEnd();

  const robotFormPage =
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

  return robotFormPage;
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
