import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useFormStore from '../../stores/robotFormStore';

const Result = (props) => {
  // const { handleSubmit } = useForm();
  const navigate = useNavigate();
  console.groupCollapsed(`Result`);
  const { form: formName } = props;

  const readFormCategory = useFormStore((state) => state.readFormCategory);
  const resetFormProgress = useFormStore((state) => state.resetFormProgress);

  const formToc = useFormStore(
    (state) => state.forms[formName][`${formName}Toc`]
  );

  const output = formToc.map((category) => {
    const categoryBlock = readFormCategory(formName, category);
    console.table('Result: output:', category, categoryBlock);
    return categoryBlock;
  });

  const returnHome = () => {
    resetFormProgress(formName);
    navigate('/');
  };
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
          className="text-slate-800 bg-pink-300 w-full py-2 px-5 text-base tracking-wide uppercase border-none rounded appearance-none"
          onClick={returnHome}
        >
          Return Home
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
