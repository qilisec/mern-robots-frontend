/* eslint-disable no-useless-escape */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
// import { useStateMachine } from 'little-state-machine';
// import ComponentWithRouterProp from '../ComponentWithRouterProp';
// import updateAction from '../../updateAction';
import useFormStore from '../../stores/robotFormStore';

// NOTE: I used custom classes defined in input.css to style the elements. This is actually a Tailwind CSS antipattern. Tailwind CSS is intended to be applied "in-line". I used variable names in order to allow for some abstraction in case I will use this component for more than one form. That way, I can give each form its own style. I'm not sure whether the trade-off is "worth it" (i.e. if this abstraction is actually useful)

const GeneratePageNInputs = (props) => {
  // NOTE: Below: Don't use register from this component's scope because the form "read" functions (e.g getValue, handleSubmit) that are employed in the parent StepN component scope will not be able to access the registered values. Instead, declare register in StepN scope and pass it to this component as a prop.
  // const { register } = useForm();

  // REVIEW: I'm not sure whether it is better to have the page value be received as a prop or from the store.
  const page = useFormStore((state) => state.page);
  const { form: formType, formStyle, register } = props;
  // const { form: formType, formStyle, page, register } = props;

  // Destructuring like this may cause excess re-renders The question is whether or not these. There doesn't seem to be any difference in my specific case:
  // Home -> Page 1 -> Page 2 => Page 3 = 2, 3, 20 invocations in both cases
  const [readFormToc, readFormCategory, readFormCategoryValue] = useFormStore(
    (state) => [
      state.readFormToc,
      state.readFormCategory,
      state.readFormCategoryValue,
    ]
  );
  // const readFormToc = useFormStore((state) => state.readFormToc);
  // const readFormCategory = useFormStore((state) => state.readFormCategory);
  // const readFormCategoryValue = useFormStore(
  //   (state) => state.readFormCategoryValue
  // );
  const pageName = readFormToc(formType, page);
  const fullName = `${formType}${pageName}`;
  const formFields = readFormCategory(formType, pageName);

  /*
    Little State Machine Implementation
      // const { state } = useStateMachine({ updateAction });
  // const page = useFormStore((state) => state.page);
    // const formFields = `${formType}${state[`${formType}Toc`][page]}`;
  // const formFieldKeys = Object.keys(state[formFields]);

    */

  console.group(`GeneratePageNInputs`);
  console.table(`GeneratePageNInputs:`, {
    page,
    pageName,
    formType,
    formStyle,
    formFields,
  });

  const formFieldKeys = Object.keys(formFields);

  const subFormPageInputElements = formFieldKeys.map((fieldKey) => {
    const fieldId = `${fullName}.${fieldKey}`;
    const storeDefault = readFormCategoryValue(formFields, fieldKey);
    /*
    Little-State Machine Implementation
    // const fieldId = `${formFields}.${fieldKey}`;
    // const fieldDefault = state[formFields][fieldKey];
    */

    const fieldInputElement =
      typeof storeDefault === 'object' ? (
        Object.keys(storeDefault).map((subFieldKey) => {
          const subfieldId = `${fieldId}.${subFieldKey}`;
          const subfieldDefault = storeDefault[subFieldKey];

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
            defaultValue={storeDefault}
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

function StepN(props) {
  /*
  Little-State Machine Implementatino
  // const { actions, state } = useStateMachine({ updateAction });
  // const { page } = state;
  */

  const { register, getValues, handleSubmit } = useForm();
  const page = useFormStore((state) => state.page);
  const { form, formStyle, formNavigation } = props;
  const { prevPage, nextPage, onSubmit } = formNavigation;
  const [formFill, setFormFill] = useState(form);
  const toggleFormInputFill = useFormStore(
    (state) => state.toggleFormInputFill
  );
  // const testData = () => console.log(`testData`, getValues());
  console.log(`StepN formFill State:`, formFill);
  // NOTE: You can't use handleSubmit for obtaining input values to refresh the state with (e.g. onClick=handleSubmit(nextPage)) because handle submit is only intended to be used with the submit input. Instead, use getValues().
  const handlePrevPage = () => {
    const data = getValues();
    console.log(`handlePrevPage`, data);
    prevPage(data);
  };

  const handleNextPage = () => {
    const data = getValues();
    console.log(`handleNextPage`, data);
    nextPage(data);
  };

  const handleToggleFormInputFill = () => {
    const newToggleState = formFill ? null : form;
    setFormFill(newToggleState);
    return toggleFormInputFill(newToggleState);
  };
  // NOTE: Below: Don't invoke GeneratePageNInputs as a function. Instead, make it a component and pass the register method in order to link up iteratively generated inputs with this parent Form wrapper
  // const CurrentFormInputs = GeneratePageNInputs(page, form, formStyle);

  return (
    <div className={`${formStyle}`}>
      <h1 className={`${formStyle}`}>Create Robot</h1>
      <form className={`${formStyle}`} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={`${formStyle}`}>Step {page + 1} of 5</h2>{' '}
        {/* {CurrentFormInputs} */}
        <GeneratePageNInputs {...props} register={register} />
        {/* <GeneratePageNInputs {...props} page={page} register={register} /> */}
        <input className={`${formStyle}`} type="submit" />
        <div className="text-center">
          {page > 0 && (
            <button
              type="button"
              className="fixed w-[250px] py-2 px-5 text-base tracking-wide text-slate-800 uppercase  bg-pink-300 border-none rounded appearance-none place-items-end -translate-x-[280px]"
              onClick={handlePrevPage}
            >
              Back
            </button>
          )}
          <button
            onClick={handleToggleFormInputFill}
            className="text-white bg-pink-500 w-5"
          >
            Test
          </button>
          {page < 5 && (
            <button
              type="button"
              className="fixed w-[265px] px-5 py-2 text-base tracking-wide text-slate-800 uppercase translate-x-2 bg-pink-300 border-none rounded appearance-none place-items-end"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// export default ComponentWithRouterProp(StepN);
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
