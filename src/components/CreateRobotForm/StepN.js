/* eslint-disable no-useless-escape */
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import ComponentWithRouterProp from '../ComponentWithRouterProp';
import updateAction from '../../updateAction';
import useFormStore from '../../stores/robotFormStore';

const GeneratePageNInputs = (currentPage, formType, formStyle) => {
  const { register } = useForm();
  // const { state } = useStateMachine({ updateAction });
  const getState = useFormStore((state) => state);
  const page = useFormStore((state) => state.page);
  const [readFormToc, readFormCategory, readFormCategoryValue] = useFormStore(
    (state) => [
      state.readFormToc,
      state.readFormCategory,
      state.readFormCategoryValue,
    ]
  );
  // const readFormCategory = useFormStore((state) => state.readFormCategory);
  // const readFormValue = useFormStore((state) => state.readFormValue);

  const pageName = readFormToc(formType, page);
  const fullName = `${formType}${pageName}`;
  const formFields = readFormCategory(formType, pageName);

  // const formFields = `${formType}${state[`${formType}Toc`][page]}`;
  // const formFieldKeys = Object.keys(state[formFields]);

  console.group(`GeneratePageNInputs`);
  // console.log(
  //   `GeneratePageNInputs: Page ${page}: pageName: ${pageName}formType: ${formType}; formStyle: ${formStyle}; formFields: ${formFields} `
  // );
  console.table(`GeneratePageNInputs:`, {
    page,
    pageName,
    formType,
    formStyle,
    formFields,
    getState,
  });
  const formFieldKeys = Object.keys(formFields);
  const subFormPageInputElements = formFieldKeys.map((fieldKey) => {
    // const fieldId = `${formFields}.${fieldKey}`;
    const fieldId = `${fullName}.${fieldKey}`;
    // const fieldDefault = state[formFields][fieldKey];
    const fieldDefault = readFormCategoryValue(formFields, fieldKey);

    const fieldInputElement =
      typeof fieldDefault === 'object' ? (
        // Object.keys(state[formFields][fieldKey]).map((subFieldKey) => {
        Object.keys(fieldDefault).map((subFieldKey) => {
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
  console.groupEnd();
  return subFormPageInputElements;
};

const createInputLabel = (inputField) =>
  inputField
    .replace(/([A-Z])/g, ' $1')
    .replace(/^(.)(.*)$/, (match, g1, g2) => g1.toUpperCase() + g2);

// function StepN({ props }) {
function StepN(props) {
  // const { actions, state } = useStateMachine({ updateAction });
  // const { page } = state;
  const page = useFormStore((state) => state.page);
  const { form, formStyle, formNavigation } = props;
  const { prevPage, nextPage, onSubmit } = formNavigation;
  const { handleSubmit } = useForm();

  console.group('StepN');
  // console.log(`Step N=${page} invoked (Page ${page + 1})`, state);
  console.groupEnd();

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
}

// export default ComponentWithRouterProp(StepN);
export default StepN;

StepN.propTypes = {
  // props: PropTypes.object,
  form: PropTypes.string,
  formStyle: PropTypes.string,
  formNavigation: PropTypes.object,
  prevPage: PropTypes.func,
  nextPage: PropTypes.func,
  onSubmit: PropTypes.func,
};
