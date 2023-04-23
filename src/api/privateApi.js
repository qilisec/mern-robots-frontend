import axios from 'axios';

const { log } = console;
const logToggle = 0;
const debug = (message) => {
  if (logToggle) log(message);
};

export const ip =
  process.env.REACT_APP_HOST === 'local'
    ? 'localhost'
    : process.env.REACT_APP_WEB_APP_DB_PUBLIC_IP;

export const privateApi = axios.create({
  baseURL: `https://${ip}:3000/api`,
  // withCredentials: true,
  headers: {
    'X-Custom-Header': 'mern-Robots Private',
  },
});

export const logoutBackend = async (requestingUserId) => {
  const payload = { userId: requestingUserId };
  // console.table(`pAPI logout 1️⃣ `, { requestingUserId });
  const submit = await privateApi.post('/authentication/logout', payload, {
    secure: true,
    withCredentials: true,
    headers: { 'current-function': 'logoutBackend' },
  });
  // The property is .status, not .statusCode
  if (submit.status === 200) return true;
  debug(`pAPI logout 2️⃣: submit.statusCode: ${submit.status}`);
  return false;
};

export const getRefreshToken = async () => {
  const receivedToken = await privateApi.post(`/authentication/refresh`, '', {
    withCredentials: true,
    secure: true,
    headers: {
      'current-function': 'getRefreshToken',
    },
  });

  const rtkn = receivedToken ? receivedToken.data.rtkn : null;
  return rtkn;
};

// export const getNewAccessToken = async (refreshTokenData) => {
//   debug(`getNewAccessToken invoked`);
//   if (refreshTokenData) {
//     const payload = { refreshToken: refreshTokenData };
//     const check = await privateApi.put(`/authentication/refresh`, payload, {
//       withCredentials: true,
//       secure: true,
//       headers: { 'current-function': 'refreshAccessToken' },
//     });
//     const { newAccessToken } = check.data;
//     debug(`getNewAccessToken finished; accessToken`, newAccessToken);
//     return newAccessToken;
//   }
// };
export const getNewAccessToken = async () => {
  debug(`getNewAccessToken invoked`);
  try {
    // const payload = { refreshToken: refreshTokenData };
    const check = await privateApi.put(`/authentication/refresh`, '', {
      withCredentials: true,
      secure: true,
      headers: { 'current-function': 'refreshAccessToken' },
    });
    const { newAccessToken } = check.data;
    debug(
      `getNewAccessToken finished: newAccessToken: `,
      newAccessToken?.slice(-8)
    );
    return newAccessToken;
  } catch (err) {
    debug(`getNewAccessToken err`, err);
  }
};

export const getProfilePage = async (queryUserId) => {
  debug(` 🛡🛡🛡 pAPI getProfile invoked: ${queryUserId}`);
  const payload = { userId: queryUserId };
  // Do I actually need to stringify this? I don't think so.
  // const payload = JSON.stringify({ userId: queryUserId });

  try {
    const supplementalUserInfo = await privateApi.post(
      `/users/${queryUserId}`,
      payload,
      {
        secure: true,
        headers: {
          'current-function': 'getProfilePage',
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    );

    return supplementalUserInfo;
  } catch (err) {
    debug(`pAPI ❌ Get Profile Error: ${err} `);
    return err;
  }
};

export default {
  privateApi,
  getRefreshToken,
  getNewAccessToken,
  logoutBackend,
  getProfilePage,
};
