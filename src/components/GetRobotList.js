import { useNavigate, Navigate } from 'react-router-dom';

const GetRobotList = () => {
  const navigate = useNavigate();
  return <Navigate to="/" />;
};

export default GetRobotList;
