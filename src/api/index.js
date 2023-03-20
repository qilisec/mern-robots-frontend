import axios from 'axios';
// import { Navigate } from 'react-router-dom';

// REACT_APP_HOST is determined by the npm run script used
export const ip =
  process.env.REACT_APP_HOST === 'local'
    ? 'localhost'
    : process.env.REACT_APP_WEB_APP_DB_PUBLIC_IP;

console.log(`Host is '${process.env.REACT_APP_HOST}'; IP set to ${ip}`);

export const api = axios.create({
  baseURL: `https://${ip}:3000/api`,
  headers: { 'X-Custom-Header': 'mern-Robots Public' },
});

// API Routes - User Signin and Registration
export const getAllRobots = () =>
  api.get(`/getrobotlist`, { headers: { 'current-function': 'getAllRobots' } });

export const createRobot = (payload) => {
  try {
    return api.post(`/robot`, payload, {
      headers: { 'current-function': 'createRobot' },
    });
  } catch (err) {
    return console.log(`createRobot API: Error: ${err}\n`);
  }
};

export const getRobotById = (id) => {
  if (id) {
    console.log(`getRobotById: Don't avoid, robotId is ${id}`);
    return api.get(`/robot/${id}`, {
      headers: { 'current-function': 'getRobotById' },
    });
  }
  console.log(`avoid getRobotById; robotId is undefined`);
  return false;
};

export const updateRobotById = (id, payload) =>
  api.put(`/robot/${id}`, payload);

export const deleteRobotById = (id) => api.delete(`/Robot/${id}`);

// API Routes - User Signin and Registration
// Was having issues here once I added console log. This is because signle line arrow fn means implicit return. Downstream functions depend on a value being returned

export const authenticateSignIn = async (payload, res) => {
  const signinResult = await api.post(`/authentication/signin`, payload, {
    withCredentials: true,
    secure: true,
    headers: { 'current-function': 'authenticateSignin' },
  });

  // No way to tell if the RT cookie was obtained. Only way to do so is to attempt to pass it to the backend
  return signinResult;
};
// export const authenticateSignIn = async (payload, res) => {
//   const signinResult = await api.post(`/authentication/signin`, payload, {
//     withCredentials: true,
//     secure: true,
//     headers: { singleHeader: 'Hello1' },
//   });
//   console.log(
//     `authenticateSignIn Frontend 1: headers are ${res?.headers}, authentication header is ${res?.headers.authentication},`
//   );
//   return signinResult;
// };

export const authenticateSignUp = (payload) =>
  api.post(`/authentication/signup`, payload, {
    secure: true,
    headers: {
      singleHeader: 'Hello1',
      'Content-Type': 'application/json',
      'X-Custom-Header': 'mern-Robots authSignup',
    },
  });
// api.post(`/authentication/signup`, payload, {secure: true, headers: {"singleHeader": 'Hello1'}});

export const testUser = (payload) => api.get(`/test/user`, payload);

const apis = {
  createRobot,
  getAllRobots,
  updateRobotById,
  deleteRobotById,
  getRobotById,
  authenticateSignIn,
  authenticateSignUp,
  // getRefreshToken,
  // refreshAccessToken,
};

export default apis;
