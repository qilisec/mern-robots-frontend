import axios from 'axios';
// import { Navigate } from 'react-router-dom';

// NOTE: REACT_APP_HOST is determined by the npm run script used (start:local or start:remote)
export const ip =
  process.env.REACT_APP_HOST === 'local'
    ? 'localhost'
    : process.env.REACT_APP_WEB_APP_DB_PUBLIC_IP;

// console.log(`Host is '${process.env.REACT_APP_HOST}'; IP set to ${ip}`);

export const api = axios.create({
  baseURL: `https://${ip}:3000/api`,
  headers: { 'X-Custom-Header': 'mern-Robots Public' },
});

// API Routes - User Signin and Registration
export const getAllRobots = () =>
  api
    .get(`/getrobotlist`, { headers: { 'current-function': 'getAllRobots' } })
    .then((data) => data.data);

export const createRobot = (payload) => {
  try {
    return api.post(`/robot`, payload, {
      secure: true,
      headers: { 'current-function': 'createRobot' },
    });
  } catch (err) {
    return console.log(`createRobot API: Error: ${err}\n`);
  }
};

export const getRobotById = async (id) => {
  console.log(`getRobotById: Don't avoid, robotId is ${id}`);
  const res = await api.get(
    `/robot/${id}`,
    {},
    {
      secure: true,
      headers: { 'current-function': 'getRobotById' },
    }
  );
  const { foundRobot } = res.data ?? null;
  console.log(`getRobotById: foundRobot`, res.data);
  return foundRobot;
};

export const updateRobotById = (id, payload) =>
  api.put(`/robot/${id}`, payload, {
    secure: true,
    'current-function': 'updateRobotById',
  });

export const deleteRobotById = (id) =>
  api.delete(`/Robot/${id}`, '', {
    secure: true,
    'current-function': 'deleteRobotById',
  });

// API Routes - User Signin and Registration
// REVIEW: Was having issues here once I added console log. This is because single line arrow fn means implicit return. Downstream functions depend on a value being returned

export const authenticateSignIn = async (payload, res) => {
  const signinResult = await api.post(`/authentication/signin`, payload, {
    withCredentials: true,
    secure: true,
    headers: { 'current-function': 'authenticateSignin' },
  });
  // console.log(`authSignin`, signinResult.data);
  // NOTE: No way to tell if the RT cookie was obtained. Only way to do so is to attempt to pass it to the backend
  return signinResult;
};

export const authenticateSignUp = async (payload) => {
  console.log(`API: authSignup invoked`);
  try {
    const signupResult = await api.post(`/authentication/signup`, payload, {
      secure: true,
      headers: {
        'current-function': 'authSignup',
      },
    });
    return signupResult;
  } catch (err) {
    console.log(`authenticateSignUp: error`, err);
  }
};

export const testUser = (payload) => api.get(`/test/user`, payload);

const apis = {
  api,
  createRobot,
  getAllRobots,
  updateRobotById,
  deleteRobotById,
  getRobotById,
  authenticateSignIn,
  authenticateSignUp,
};

export default apis;
