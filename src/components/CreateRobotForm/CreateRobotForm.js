import { useState } from 'react';
import { Box, Button, Title } from '@mantine/core';
import First from './Step1';
import Second from './Step2';
import Result from './Result';

function Form() {
  const [page, setPage] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employment_status: null,
  });

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return <First formData={formData} setFormData={setFormData} />;
      case 1:
        return <Second formData={formData} setFormData={setFormData} />;
      case 2:
        return <Result formData={formData} setFormData={setFormData} />;
      default:
        return <First formData={formData} setFormData={setFormData} />;
    }
  };

  const handleSubmit = () => {
    setPage(page + 1);
  };

  return (
    <Box>
      {conditionalComponent()}
      {page > 0 && (
        <Button className="MultiPageFormBtn" onClick={() => setPage(page - 1)}>
          Back
        </Button>
      )}
      <Button className="MultiPageFormBtn Test1" onClick={handleSubmit}>
        {page === 0 || page === 1 ? 'Next' : 'Submit'}
      </Button>
    </Box>
  );

  //   return (
  //     <Box sx={boxStyle}>
  //       <Title
  //         sx={{
  //           textAlign: 'center',
  //         }}
  //         order={2}
  //       >
  //         Hey there!
  //       </Title>
  //       {/* Steps */}
  //       <Button>Submit</Button>
  //     </Box>
  //   );
}
export default Form;
