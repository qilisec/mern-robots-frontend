import axios from 'axios';
// import { getRefreshToken } from './privateApi';

export const addReqIntercept = (client, userAccessToken) => {
  console.log(
    `🚀 ATTACHED Request Interceptor: 🚀`,
    userAccessToken?.slice(-8)
  );
  const reqInterceptor = client.interceptors.request;

  reqInterceptor.clear();
  reqInterceptor.use((config) => {
    config.headers.Authorization = `bearerFront ${userAccessToken}`;
    config.headers['current-function'] = `req interceptor`;
    // config.headers['Access-Control-Expose-Headers'] = 'Authorization';
    // config.headers.testing = `This is a req interceptor test`;
    console.log(
      `😸 pApi ReqIntercept : Added Header: 😸\n${userAccessToken.slice(-8)}`
    );

    return config;
  });
};

export const addResIntercept = async (client) => {
  // I feel like I'm re-adding the res interceptor too frequentyle. I should really only add it once per rtkn cookie. The uses should be as follows:
  // If just logged in, add res interceptor
  // if refresh token just expired and was reissued, add res interceptor
  console.log(`🔱 ATTACHED RES INTERCEPTOR 1️⃣:🔱`);
  const resInterceptor = client.interceptors.response;
  // resInterceptor.clear();
  resInterceptor.use(async (interceptedRes) => {
    try {
      // console.log(`⚔️addResIntercept invoked: Success⚔️`);
      // console.log('\nIntercepted Response:');
      // console.dir({ interceptedRes });
      // console.table(`⚔️ Response intercepted Success ⚔️`, { interceptedRes });
      return interceptedRes;
    } catch (err) {
      // console.log(`⚔️addResIntercept invoked: Error⚔️: ${err}`);
      // console.log('interceptedRes:');
      // console.dir({ interceptedRes });
      // console.table(`⚔️ Response intercepted Error ⚔️`, { err });
      const resErrorCode = err.interceptedRes.status;
      if (resErrorCode === (401 || 403)) {
        console.log(
          ` ⚔️ pApi ResIntercept caught ${resErrorCode} code; Attempting solution: Refreshing access token ⚔️`
        );

        // TODO: How do we add these pieces of data into our context state?
        // If I'm willing to forgo the different header, I can just use getRefreshToken from privateAPI.
        // That is, this request is just getRefreshToken but with a different "current-function" header
        const retrievedRefreshToken = await client.post(
          `/authentication/refresh`,
          ``,
          {
            withCredentials: true,
            secure: true,
            headers: {
              'current-function': 'addResIntercept retrievedRefreshToken',
            },
          }
        );
        // Note that the key in the payload corresponding to the RT string must match the key in jwtRefreshController.js on the backend (currently 'refreshToken')
        // If I'm willing to forgo the different header, I can just use getNewAccessToken from privateAPI.

        // ATTN: To use getNewAccessToken, I would have to pass in 'retrievedRefreshToken' instead of payload as for the case of getNewAccessToken, the RT string is converted into an object within the function.
        const payload = { refreshToken: retrievedRefreshToken };

        // Need to update currentAuthUser with the below variable
        const newAccessToken = await client.put(
          `/authentication/refresh`,
          payload,
          {
            secure: true,
            headers: { 'current-function': 'addResIntercept authentication' },
          }
        );
        err.config.headers.Authorization = `bearerFront ${newAccessToken}`;

        console.log(
          `⚔️ resIntercept added new access token: ${newAccessToken} ⚔️`
        );

        return axios(err.config);
      }

      console.log(` ⚔️ resInterceptor failed`);
      return Promise.reject(err);
    }
  });
  console.log(`🔱 END: Added res interceptor 1️⃣:🔱`);
  return true;
};

export const changePrivateApiInterceptors = async (client, accessToken) => {
  if (accessToken !== null) {
    const reqInterceptor = addReqIntercept(client, accessToken);
    const resInterceptor = await addResIntercept(client);

    const interceptors = { reqInterceptor, resInterceptor };
    // const interceptors = { reqInterceptor };
    return interceptors;
  }
  // We clear the interceptors for the following cases:
  // If the refresh token expired and user was just reissued a RT
  // If the page refreshed and AT was reissued (Is this really needed? Upon page refresh, aren't the interceptors already wiped out?)
  // client.interceptors.request.clear();
  // client.interceptors.response.clear();
  return null;
};

export default {
  addReqIntercept,
  addResIntercept,
  changePrivateApiInterceptors,
};
