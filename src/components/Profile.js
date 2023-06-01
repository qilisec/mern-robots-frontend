import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from './auth.last.working';
import { useAuth } from './auth';
import { getProfilePage } from '../api/privateApi';

export function Profile(props) {
  const { history } = props;
  const auth = useAuth();
  const { accessToken, username, isLoading, userId } = auth.currentUser;
  // const { userId } = useParams();
  const navigate = useNavigate();
  const [paramUserId, setParamUserId] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileRole, setProfileRole] = useState('');

  // if (userId) {
  //   console.log(`📨 getParamUserId: Profile was loaded from user param`);
  //   setParamUserId(userId);
  // }

  const parsedRoles = () => {
    let profileRoleString = ``;
    if (profileRole != []) {
      profileRoleString = profileRole.reduce(
        (outputString, role) => `${outputString}, ${role}`
      );
      return profileRoleString;
    }
  };

  useEffect(() => {
    const retrieveProfileData = async (requestedUserId) => {
      try {
        console.log(`retrieveProfileData: requestedUserId:`, requestedUserId);
        const supplementalUserInfo = await getProfilePage(requestedUserId);
        if (supplementalUserInfo?.data) {
          const { username, email, roles } = supplementalUserInfo.data;
          console.table('retrievedProfileData:', supplementalUserInfo.data);
          setProfileEmail(email);
          setProfileRole(roles);
        }
      } catch (err) {
        console.log(`❌: Profile component error: ${err}`);
        return err;
      }
    };

    if (isLoading) {
      return console.log(`retrieveProfileData did not fire`);
    }

    retrieveProfileData(userId);
  }, [isLoading, userId]);

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  const profile = isLoading ? (
    <h1>Loading</h1>
  ) : (
    <div className="text-white font-ultralight my-2.5 text-center">
      <h1 className=" text-3xl  text-white font-medium">Welcome {username}</h1>
      <br />
      Email: {profileEmail}
      <br />
      Role: {parsedRoles()}
      <br />
      <br />
      <button
        className="bg-pink-500 px-6 py-3 rounded"
        type="button"
        onClick={() => handleLogout()}
      >
        Logout
      </button>
    </div>
  );

  return profile;
}

export default Profile;
