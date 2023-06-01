import { api } from '.';
import { privateApi } from './privateApi';

export const reseedUsers = async (queryUserId) => {
  console.log(`API: reseedUsers invoked`);
  const payload = { userId: queryUserId };
  try {
    const result = await privateApi.post('/users', payload, {
      secure: true,
      headers: { 'current-function': 'reseedUsers' },
    });
    console.log(`reseedUsers finished: result.data:`, result.data);
    return result;
  } catch (err) {
    console.log(`API: reseedUsers failed: ${err}`);
    return err;
  }
};

export const initialSeedUsers = async (queryUserId) => {
  console.log(`API: initialSeedUsers invoked`);
  const payload = { userId: queryUserId };
  try {
    const result = await api.post('/initial', payload, {
      secure: true,
      headers: { 'current-function': 'initialSeedUsers' },
    });
    console.log(`initialSeedUsers finished: result.data:`, result.data);
    return result;
  } catch (err) {
    console.log(`API: initialSeedUsers failed: ${err}`);
    return err;
  }
};

export const deleteSeedUsers = async (queryUserId) => {
  console.log(`privateAPI: DeleteSeedUsers invoked`);
  const deletePayload = { data: { userId: queryUserId } };
  const requestDelete = privateApi
    .delete(`/users`, deletePayload, {
      secure: true,
      headers: { 'current-function': 'deleteSeedUsers' },
    })
    .then((res) => {
      console.log(`deleteSeedUsers finished: result.data`, res.data);
      return res;
    })
    .catch((err) => {
      console.log(`API: deleteSeedUsers error: ${err}`);
      return err;
    });
  return requestDelete;
};

export const deleteSeedRobots = async (queryUserId) => {
  console.log(
    `privateAPI: deleteSeedRobots invoked; queryUserId:`,
    queryUserId?.slice(-8)
  );
  // payload for delete methods must use "data" as the key
  const deletePayload = { data: { userId: queryUserId } };
  const requestDelete = await privateApi.delete('/robot', deletePayload, {
    secure: true,
    // withCredentials: true,
    headers: {
      'current-function': 'deleteSeedRobots',
    },
  });
  return requestDelete;
};

export default {
  reseedUsers,
  deleteSeedUsers,
  deleteSeedRobots,
  initialSeedUsers,
};
