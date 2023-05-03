/* eslint-disable no-useless-escape */
import PropTypes from 'prop-types';
import useFormStore from '../../stores/robotFormStore';

const { log } = console;
const logToggle = 1;
const debug = (message) => {
  if (logToggle) log(message);
};

const createInputTitle = (fieldId) =>
  fieldId
    .replace(/^.*\.([^.]+)$/g, '$1')
    .replace(/([A-Z])/g, ' $1')
    .replace(/(\w+)\.(\w)/g, (match, g1, g2) => `${g1} ${g2.toUpperCase()}`)
    .replace(/^(.)(.*)$/, (match, g1, g2) => g1.toUpperCase() + g2);

export const GeneratePageNInputs = (props) => {
  const page = useFormStore((state) => state.page);
  const { form: formName, formStyle: style, register } = props;
  const [readFormToc, readFormCategory] = useFormStore((state) => [
    state.readFormToc,
    state.readFormCategory,
  ]);
  const formDefaultFill = useFormStore((state) => state.formDefaultFill);

  // pageName equivalent to formCategory in store
  const pageName = readFormToc(formName, page);
  const formFields = readFormCategory(formName, pageName);

  console.group(`GeneratePageNInputs`);
  console.table(`GeneratePageNInputs:`, {
    page,
    pageName,
    formName,
    style,
    formFields,
  });

  // formFieldKeys = "firstName", "last name", etc
  const formFieldKeys = Object.keys(formFields);
  // console.log(`generate component Invoked: formDefaultFill`, formDefaultFill);

  const formInputs = [];

  formFieldKeys.map((fieldKey) => {
    // fieldId = "robotFormBasic.firstName"
    const id = `${pageName}.${fieldKey}`;
    const value = formDefaultFill ? formFields[fieldKey] : '';

    if (typeof value !== 'object') {
      return formInputs.push(
        <FormField
          key={id}
          id={id}
          value={value}
          style={style}
          register={register}
        />
      );
    }
    // console.log(`value is object: fieldKey:`, fieldKey);
    return Object.keys(value).map((subfieldKey) => {
      const subId = `${id}.${subfieldKey}`;
      const subValue = value[subfieldKey] ?? '';
      return formInputs.push(
        <FormField
          key={subId}
          id={subId}
          value={subValue}
          style={style}
          register={register}
        />
      );
    });
  });

  console.groupEnd();

  return formInputs;
};

export const FormField = (props) => {
  const { id, value, style, register } = props;

  // console.table(`StepN: generateInputs`, {
  //   fieldId: id,
  //   fieldValue: value,
  // });

  return (
    <label className={`${style}`}>
      {createInputTitle(`${id}:`)}
      <input className={style} {...register(id)} defaultValue={value} />
    </label>
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
};
