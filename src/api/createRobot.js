import { privateApi } from './privateApi';

export const createRobot = (payload) => {
  try {
    return privateApi.post(`/robot`, payload, {
      secure: true,
      headers: { 'current-function': 'createRobotPrivate' },
    });
  } catch (err) {
    return console.log(`createRobot API: Error: ${err}\n`);
  }
};

export default { createRobot };
