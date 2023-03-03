import axios from 'axios';

const ip =
  process.env.HOST === 'local'
    ? 'localhost'
    : process.env.REACT_APP_WEB_APP_DB_PUBLIC_IP;

console.log(`Host is '${process.env.REACT_APP_HOST}', IP set to ${ip}`);

const api = axios.create({
  // baseURL: `http://${ip}:3000/api`,
  baseURL: `https://${ip}:3000/api`,
  headers: { 'X-Custom-Header': 'mern-Robots' },
});

export const createRobot = (payload) => api.post(`/robot`, payload);
export const getAllRobots = () => api.get(`/getrobotlist`);
export const updateRobotById = (id, payload) =>
  api.put(`/robot/${id}`, payload);
export const deleteRobotById = (id) => api.delete(`/Robot/${id}`);
export const getRobotById = (id) => api.get(`/robot/${id}`);

const apis = {
  createRobot,
  getAllRobots,
  updateRobotById,
  deleteRobotById,
  getRobotById,
};

export default apis;
