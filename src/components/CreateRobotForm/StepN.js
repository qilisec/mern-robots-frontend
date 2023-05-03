/* eslint-disable no-useless-escape */

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
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
  const auth = useAuth();
  const { username } = auth.currentUser;
  const { register, getValues, handleSubmit, reset } = useForm();
  const page = useFormStore((state) => state.page);
  const { form, formStyle, formNavigation } = props;
  const { prevPage, nextPage, onSubmit } = formNavigation;

  const formDefaultFill = useFormStore((state) => state.formDefaultFill);
  const toggleFormDefaultFill = useFormStore(
    (state) => state.toggleFormDefaultFill
  );
  // NOTE: You can't use handleSubmit for obtaining input values to refresh the state with (e.g. onClick=handleSubmit(nextPage)) because handle submit is only intended to be used with the submit input. Instead, use getValues().

  const handlePrevPage = () => {
    const data = getValues();
    debug(`handlePrevPage`, data);
    prevPage(form, data);
  };

  const handleNextPage = () => {
    const data = getValues();
    debug(`handleNextPage`, data);
    nextPage(form, data);
  };

  const handleToggleFormFill = () => {
    console.log(`handleToggleForm: form`, form);
    toggleFormDefaultFill(form);
    reset();
  };

  const submitCreateRobot = async (data) => {
    try {
      // debug(`submitCreateRobot: data`, data);
      const formInfo = onSubmit(data, form);
      const newRobot = await createRobot(formInfo, username);
      debug(`submitCreateRobot: newRobot:`, newRobot);
      return newRobot;
    } catch (err) {
      debug(`submitCreateRobot error: data`, data, err);
    }
  };

  // NOTE: Below: Don't invoke GeneratePageNInputs as a function. Instead, make it a component and pass the register method in order to link up iteratively generated inputs with this parent Form wrapper
  // const CurrentFormInputs = GeneratePageNInputs(page, form, formStyle);

  return (
    <div className={`${formStyle}`}>
      <h1 className={`${formStyle}`}>Create Robot</h1>
      <form
        className={`${formStyle}`}
        onSubmit={handleSubmit(submitCreateRobot)}
      >
        <h2 className={`${formStyle}`}>Step {page + 1} of 5</h2>{' '}
        <GeneratePageNInputs {...props} register={register} />
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
};
