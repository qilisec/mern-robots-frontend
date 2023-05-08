/* eslint-disable no-useless-escape */
import PropTypes from 'prop-types';
import useFormStore from '../../stores/robotFormStore';

const createInputTitle = (fieldId) =>
  fieldId
    .replace(/^.*\.([^.]+)$/g, '$1')
    .replace(/([A-Z])/g, ' $1')
    .replace(/(\w+)\.(\w)/g, (match, g1, g2) => `${g1} ${g2.toUpperCase()}`)
    .replace(/^(.)(.*)$/, (match, g1, g2) => g1.toUpperCase() + g2);

export const GeneratePageNInputs = (props) => {
  const page = useFormStore((state) => state.page);
  const { form: formName, formStyle: style, register, errors } = props;
  const [readFormToc, readFormCategory] = useFormStore((state) => [
    state.readFormToc,
    state.readFormCategory,
  ]);
  const formDefaultFill = useFormStore((state) => state.formDefaultFill);
  const readFormValidation = useFormStore((state) => state.readFormValidation);

  // pageName equivalent to formCategory in store
  const pageName = readFormToc(formName, page);
  const formFields = readFormCategory(formName, pageName);

  // console.group(`GeneratePageNInputs`);
  // console.table(`GeneratePageNInputs:`, {
  //   page,
  //   pageName,
  //   formName,
  //   style,
  //   formFields,
  //   errors,
  // });

  // formFieldKeys = "firstName", "last name", etc
  const formFieldKeys = Object.keys(formFields);

  const formInputs = [];

  formFieldKeys.map((fieldKey) => {
    // fieldId = "robotFormBasic.firstName"
    const id = `${pageName}.${fieldKey}`;
    const value = formDefaultFill ? formFields[fieldKey] : '';
    const validator = readFormValidation(formName, pageName, fieldKey);
    const msg = errors?.[pageName]?.[fieldKey];
    if (typeof value !== 'object') {
      return formInputs.push(
        <FormField
          key={id}
          id={id}
          value={value}
          style={style}
          register={register}
          validator={validator}
          msg={msg}
        />
      );
    }
    return Object.keys(value).map((subfieldKey) => {
      const subId = `${id}.${subfieldKey}`;
      const subValue = value[subfieldKey] ?? '';
      const submsg = errors?.[pageName]?.[fieldKey]?.[subfieldKey];
      const subvalidator = readFormValidation(
        formName,
        pageName,
        fieldKey,
        subfieldKey
      );
      return formInputs.push(
        <FormField
          key={subId}
          id={subId}
          value={subValue}
          style={style}
          register={register}
          validator={subvalidator}
          msg={submsg}
        />
      );
    });
  });

  // console.groupEnd();

  return formInputs;
};

const FormField = (props) => {
  const { id, value, style, register, validator, msg } = props;
  return (
    <>
      <label className={`${style}`}>
        {createInputTitle(`${id}:`)}
        <input
          className={style}
          {...register(id, { ...validator })}
          defaultValue={value}
        />
      </label>
      <p className="text-white text-left text-xs italic">{msg?.message}</p>
    </>
  );
};

GeneratePageNInputs.propTypes = {
  props: PropTypes.object,
  form: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
  style: PropTypes.string,
};

FormField.propTypes = {
  props: PropTypes.object,
  style: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  register: PropTypes.func,
  validator: PropTypes.object,
  message: PropTypes.string,
};
