/* eslint-disable no-useless-escape */
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from '../ComponentWithRouterProp';
import updateAction from '../../updateAction';

const GeneratePageNInputs = (page, formType, formStyle) => {
  const { register } = useForm();
  const { state } = useStateMachine({ updateAction });

  const formFields = `${formType}${state[`${formType}Toc`][page]}`;
  const formFieldKeys = Object.keys(state[formFields]);

  const subFormPageInputElements = formFieldKeys.map((fieldKey) => {
    const fieldId = `${formFields}.${fieldKey}`;
    const fieldDefault = state[formFields][fieldKey];

    const fieldInputElement =
      typeof fieldDefault === 'object' ? (
        Object.keys(state[formFields][fieldKey]).map((subFieldKey) => {
          const subfieldId = `${fieldId}.${subFieldKey}`;
          const subfieldDefault = fieldDefault[subFieldKey];

          const subOutput = (
            <label
              key={`${formFields}.${fieldKey}.${subFieldKey}`}
              className={`${formStyle}`}
            >
              {createInputLabel(`${fieldKey} ${subFieldKey}:`)}
              <input
                key={`${formFields}.${fieldKey}.${subFieldKey}`}
                className={`${formStyle}`}
                {...register(subfieldId)}
                defaultValue={subfieldDefault}
              />
            </label>
          );
          return subOutput;
        })
      ) : (
        <label key={fieldId} className={`${formStyle}`}>
          {createInputLabel(`${fieldKey}:`)}
          <input
            key={fieldId}
            className={`${formStyle}`}
            {...register(fieldId)}
            defaultValue={fieldDefault}
          />
        </label>
      );
    return fieldInputElement;
  });

  return subFormPageInputElements;
};

const createInputLabel = (inputField) =>
  inputField
    .replace(/([A-Z])/g, ' $1')
    .replace(/^(.)(.*)$/, (match, g1, g2) => g1.toUpperCase() + g2);

const StepN = ({ props }) => {
  const { actions, state } = useStateMachine({ updateAction });
  const { page } = state;
  const { form, formStyle, formNavigation } = props;
  const { prevPage, nextPage, onSubmit } = formNavigation;
  const { handleSubmit } = useForm();

  console.log(`Step N=${page} invoked (Page ${page + 1})`, state);

  const CurrentFormInputs = GeneratePageNInputs(page, form, formStyle);

  return (
    <div className={`${formStyle}`}>
      <h1 className={`${formStyle}`}>Create Robot</h1>
      <form className={`${formStyle}`} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={`${formStyle}`}>Step {page + 1} of 5</h2>
        {CurrentFormInputs}
        <input className={`${formStyle}`} type="submit" />
      </form>
      <div className="text-center">
        {page > 0 && (
          <button
            type="button"
            className="fixed w-[270px] py-2 px-5 text-base tracking-wide text-slate-800 uppercase  bg-pink-300 border-none rounded appearance-none place-items-end -translate-x-[280px]"
            onClick={handleSubmit(prevPage)}
          >
            Back
          </button>
        )}
        {page < 5 && (
          <button
            type="button"
            className="fixed w-[270px] px-5 py-2 text-base tracking-wide text-slate-800 uppercase translate-x-2 bg-pink-300 border-none rounded appearance-none place-items-end"
            onClick={handleSubmit(nextPage)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ComponentWithRouterProp(StepN);

StepN.propTypes = {
  props: PropTypes.object,
  form: PropTypes.string,
  formStyle: PropTypes.string,
  formNavigation: PropTypes.func,
  prevPage: PropTypes.func,
  nextPage: PropTypes.func,
  onSubmit: PropTypes.func,
};
