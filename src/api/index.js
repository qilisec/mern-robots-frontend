import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://localhost:3000/api',
  baseURL: 'http://localhost:3000/api',
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
