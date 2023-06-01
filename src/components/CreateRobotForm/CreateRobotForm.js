import { useState, useEffect, useMemo } from 'react';
import StepN from './StepN';
import useFormStore from '../../stores/robotFormStore';
import Result from './Result';

function Form() {
  const [combinedIsValid, setCombinedIsValid] = useState(Array(5).fill(true));
  const [combinedErrorMessage, setCombinedErrorMessage] = useState('');

  const getState = useFormStore((state) => state);
  const page = useFormStore((state) => state.page);
  const [launchedForm, setFormStatus] = useFormStore((state) => [
    state.launchedForm,
    state.setFormStatus,
  ]);

  // Bug: +Log, -Return state... = onValid is not a function
  const prevPage = useFormStore((state) => state.prevPage);
  const nextPage = useFormStore((state) => state.nextPage);
  const onSubmit = useFormStore((state) => state.onSubmit);

  const form = 'robotForm';
  const formStyle = 'create-robot-form';
  const formToc = useFormStore((state) => state.forms[form][`${form}Toc`]);

  console.group(
    `createRobotForm Page ${page + 1}: ${Date.now().toString().slice(-5)}`,
    { state: getState }
  );

  useEffect(() => {
    if (launchedForm !== form) {
      console.log(`CreateRobotForm accessed from navbar`);
      setFormStatus(form);
      setCombinedIsValid(Array(5).fill(true));
    }
  }, [launchedForm]);

  const formNavigation = { prevPage, nextPage, onSubmit };

  const formState = useMemo(
    () => ({
      combinedErrorMessage,
      combinedIsValid,
      setCombinedErrorMessage,
      setCombinedIsValid,
    }),
    [combinedErrorMessage, combinedIsValid]
  );
  console.groupEnd();

  const robotFormPage =
    page === formToc.length ? (
      <Result form={form} formStyle={formStyle} />
    ) : (
      <StepN
        form={form}
        formStyle={formStyle}
        formNavigation={formNavigation}
        formState={formState}
      />
    );

  return robotFormPage;
}
export default Form;
