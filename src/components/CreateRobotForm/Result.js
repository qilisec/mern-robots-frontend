import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
// import { useStateMachine } from 'little-state-machine';
// import produce from 'immer';
// import updateAction from '../../updateAction';
import useFormStore from '../../stores/robotFormStore';

const Result = (props) => {
  /*
  Little-state-machine implementation
    // const { actions, state } = useStateMachine({ updateAction });
    // const getState = useFormStore((state) => state);
    // const page = useFormStore((state) => state.page);
    // console.log(`result`, state);
    // const prevPage = (data) => {
    //   data.page = state.page - 1;
    //   actions.updateAction(data);
    // };
    // const nextPage = (data) => {
    //   data.page = state.page + 1;
    //   actions.updateAction(data);
    // };
  */

  const { handleSubmit } = useForm();
  console.group(`Result`);
  const { form, formNavigation } = props;
  const { prevPage } = formNavigation;

  const readFormCategory = useFormStore((state) => state.readFormCategory);
  const formToc = useFormStore((state) => state[`${form}Toc`]);
  console.log(`formToc: ${formToc}`);

  const output = formToc.map((property) => {
    console.group(`Result output`);
    console.log(`property:`, property);
    const categoryBlock = readFormCategory(form, property);
    console.log('categoryBlock', categoryBlock);
    console.groupEnd();
    return categoryBlock;
  });

  console.groupEnd();
  return (
    <div className="mb-2 create-robot-form">
      <h2 className="create-robot-form">Result:</h2>
      <pre className="text-primary">
        {JSON.stringify(output, null, 2)
          .slice(1, -1)
          .replace(/[{}"],?/g, '')}
      </pre>
      <div>
        <button
          type="button"
          className="text-slate-800 bg-pink-300 inline-block w-full py-2 px-5 text-base tracking-wide uppercase border-none rounded appearance-none"
          onClick={handleSubmit(prevPage)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Result;

Result.propTypes = {
  form: PropTypes.string,
  formNavigation: PropTypes.object,
  prevPage: PropTypes.func,
};
