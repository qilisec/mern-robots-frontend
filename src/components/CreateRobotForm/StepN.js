/* eslint-disable no-useless-escape */
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFormState } from 'react-hook-form';
import useFormStore from '../../stores/robotFormStore';
import { createRobot } from '../../api/privateApi';
import { useAuth } from '../auth';
import { GeneratePageNInputs } from './GeneratePageNInputs';

const { log } = console;
const logToggle = 1;
const debug = (message) => {
  if (logToggle) log(message);
};

function StepN(props) {
  const { form, formStyle, formNavigation, formState } = props;
  const { prevPage, nextPage, onSubmit } = formNavigation;
  const {
    combinedErrorMessage,
    combinedIsValid,
    setCombinedErrorMessage,
    setCombinedIsValid,
  } = formState;
  const auth = useAuth();
  const { username } = auth.currentUser;

  const { register, getValues, handleSubmit, reset, control } = useForm({
    mode: 'onChange',
  });
  const { errors, isValid } = useFormState({ control });

  const page = useFormStore((state) => state.page);
  const jumpPages = useFormStore((state) => state.jumpPages);
  const formDefaultFill = useFormStore((state) => state.formDefaultFill);
  const toggleFormDefaultFill = useFormStore(
    (state) => state.toggleFormDefaultFill
  );

  // NOTE: You can't use handleSubmit for obtaining input values to refresh the state with (e.g. onClick=handleSubmit(nextPage)) because handle submit is only intended to be used with the submit input. Instead, use getValues().
  console.log(
    `StepN Page ${page}: current isValid? ${isValid}; combinedIsValid:`,
    combinedIsValid
  );
  const updateErrors = useCallback(() => {
    const departingPageErrors = isValid;
    const prevRecord = combinedIsValid[page];
    console.log(
      `updateErrors: page: ${page}; departingPageErrors: ${departingPageErrors}, prevRecord: ${prevRecord}`
    );
    if (departingPageErrors !== prevRecord) {
      const updatedIsValid = combinedIsValid.slice(0);
      updatedIsValid[page] = isValid;
      setCombinedIsValid(updatedIsValid);
    }
  }, [page, isValid]);

  const handlePrevPage = () => {
    const data = getValues();
    updateErrors();
    prevPage(form, data);
  };

  const handleNextPage = () => {
    const data = getValues();
    updateErrors();
    nextPage(form, data);
  };

  const handleToggleFormFill = () => {
    console.log(`handleToggleForm: form`, form);
    toggleFormDefaultFill(form);
    reset();
  };

  const submitCreateRobot = async (data) => {
    try {
      if (combinedIsValid.every((value) => value === true)) {
        const formInfo = onSubmit(data, form);
        const newRobot = await createRobot(formInfo, username);
        setCombinedErrorMessage('');
        debug(`submitCreateRobot: newRobot:`, newRobot);
        return newRobot;
      }
      console.log(`Form is not valid: ${combinedIsValid}`);
      const firstError = combinedIsValid.findIndex((value) => value === false);
      jumpPages(form, data, firstError);
      setCombinedErrorMessage('Some fields were not filled properly');
    } catch (err) {
      debug(`submitCreateRobot error: data`, data, err);
    }
  };

  // NOTE: Below: Don't invoke GeneratePageNInputs as a function. Instead, make it a component and pass the register method in order to link up iteratively generated inputs with this parent Form wrapper
  // const CurrentFormInputs = GeneratePageNInputs(page, form, formStyle);

  return (
    <div className={`${formStyle}`}>
      <h1 className={`${formStyle}`}>Create Robot</h1>
      <h2 className={`${formStyle} italic`}>{combinedErrorMessage}</h2>
      <form
        className={`${formStyle}`}
        onSubmit={handleSubmit(submitCreateRobot)}
      >
        <h2 className={`${formStyle}`}>Step {page + 1} of 5</h2>{' '}
        <GeneratePageNInputs {...props} register={register} errors={errors} />
        <input className={`${formStyle}`} type="submit" />
        <div className="flex flex-row justify-between justify-items-stretch">
          <button
            type="button"
            // eslint-disable-next-line prettier/prettier, prefer-template
            className={'flex-grow flex-shrink px-4 py-2 w-2/5  bg-pink-300 text-base tracking-wide uppercase border-none rounded appearance-none ' + (page > 0 ? 'text-slate-800' : 'text-white opacity-30')}
            onClick={page > 0 ? handlePrevPage : () => ({})}
          >
            Back
          </button>

          <button
            className={`flex-grow flex-shrink px-2 mx-2 text-slate-800 text-base tracking-wide uppercase border-none rounded appearance-none ${
              formDefaultFill ? 'bg-pink-600' : 'bg-pink-300'
            }`}
            type="button"
            onClick={handleToggleFormFill}
          >
            Auto-Fill?
          </button>

          <button
            type="button"
            className={`flex-grow flex-shrink w-2/5 px-4 py-2 bg-pink-300 text-base tracking-wide uppercase border-none rounded appearance-none ${
              page < 5 ? 'text-slate-800' : 'text-white'
            }`}
            onClick={page < 5 ? handleNextPage : () => ({})}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default StepN;

StepN.propTypes = {
  props: PropTypes.object,
  form: PropTypes.string,
  formStyle: PropTypes.string,
  formNavigation: PropTypes.object,
  prevPage: PropTypes.func,
  nextPage: PropTypes.func,
  onSubmit: PropTypes.func,
  formState: PropTypes.object,
  combinedErrorMessage: PropTypes.string,
  combinedIsValid: PropTypes.array,
  setCombinedErrorMessage: PropTypes.func,
  setCombinedIsValid: PropTypes.func,
};
