import { useAuth0 } from "@auth0/auth0-react";
import {CONSTANTS} from 'constants/constants';
import OAuth2Login from '../components/OAuth2Login';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const Auth2Login = () => {
    // store token using redux
    const onSuccess = (response:any) => console.log(response);
    // show error using redux
    const onFailure = (response:any) => console.error(response);
    return (
      <OAuth2Login
        authorizationUrl="https://iis-des.cnbs.gob.hn/Login"
        responseType="token"
        clientId="kiva-desktop-dev"
        redirectUri="http://localhost:1409/callback"
        onSuccess={onSuccess}
        onFailure={onFailure}/>
    )
  }

  if (CONSTANTS.authorizationMethod === "auth0") {
    return (
      <div>
        <button
          className="btn btn-blue btn-block"
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
      </div>
    );
  } else {
    return (
      <div>
        {Auth2Login()}
      </div>
    )
  }
}

export default LoginButton;
