import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './auth';
import { getProfilePage } from '../api/privateApi';

export function Profile(props) {
  const { history } = props;
  const auth = useAuth();
  const {
    credLoadFinished,
    currentAuthUser,
    currentAuthUserId,
    currentAuthUsername,
    logout,
  } = auth;
  const { userId } = useParams();
  const navigate = useNavigate();
  const [paramUserId, setParamUserId] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileRole, setProfileRole] = useState('');

  if (userId) {
    console.log(`📨 getParamUserId: Profile was loaded from user param`);
    setParamUserId(userId);
  }

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
        const supplementalUserInfo = await getProfilePage(requestedUserId);
        if (supplementalUserInfo?.data) {
          const { username, email, roles } = supplementalUserInfo.data;

          // console.log(`retrievedProfile:
          //   ${username}
          //   ${email}
          //   ${roles}`);

          console.table('retrievedProfileData:', supplementalUserInfo.data);
          setProfileEmail(email);
          setProfileRole(roles);
        }
      } catch (err) {
        console.log(`❌: Profile component error: ${err}`);
        return err;
      }
    };

    if (!credLoadFinished) {
      return console.log(`retrieveProfileData did not fire`);
    }

    retrieveProfileData(currentAuthUserId);
  }, [userId, credLoadFinished, currentAuthUser, currentAuthUserId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  if (!credLoadFinished) {
    return <h1>Loading</h1>;
  }
  return (
    <div className="text-white font-ultralight my-2.5 text-center">
      <h1 className=" text-3xl  text-white font-medium">
        Welcome {currentAuthUsername}
      </h1>
      <br />
      Email: {profileEmail}
      <br />
      Role: {parsedRoles()}
      <br />
      <br />
      <button
        className="bg-pink-500 px-6 py-3 rounded"
        type="button"
        onClick={() => handleLogout(auth)}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
