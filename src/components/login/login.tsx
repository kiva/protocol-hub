import React, { FunctionComponent, useState } from "react";
import {CONSTANTS} from 'constants/constants';
import AuthPopup from "./authPopup";
import SilentAuthIframe from "./silentAuthIframe";
import { SessionAction } from "../../redux/actions/session-actions";
import I18n from '../../utils/I18n';
import { store } from "../../index";
import { toQuery } from './utils';

interface LoginProps {

}

const responseTypeLocationKeys = {
  code: 'search',
  token: 'hash',
};

let tokenCheckCompleted = false;
const Login: FunctionComponent<LoginProps> = (props) => {
  const [loginContent, setLoginContent] = useState(<div></div>);

  const checkForToken = () => {
    // if access token is stored in browser, silently check if it's valid
    if (window.localStorage.getItem('access_token') && !tokenCheckCompleted) {
      const authConfig = getAuthConfig();
      silentlyAuthenticate(authConfig);
    }
  }

  const silentlyAuthenticate = (authConfig: any) => {
    // iframe logic here
    tokenCheckCompleted = true;
    setLoginContent(<SilentAuthIframe
      id={authConfig.clientId}
      url={`${authConfig.authorizationUrl}?${authConfig.search}`}
      locationKey={authConfig.locationKey}
      onSuccess={onSuccess}
      onFailure={onFailure}
      isCrossOrigin={true}
    ></SilentAuthIframe>);
  }

  const onSuccess = (response:any) => {
    store.dispatch({
      type: SessionAction.SetAuthToken,
      token: response.access_token
    })
    window.localStorage.setItem('access_token', response.access_token);
    console.log(I18n.getKey('tokenMessages.succeeded'));
  }
  // show error using redux
  const onFailure = (response:any) => {
    console.error(response);
  }

  const authenticateWithPopup = (authConfig: any) => {
    // popup logic here
    setLoginContent(<AuthPopup
      id={authConfig.clientId}
      url={`${authConfig.authorizationUrl}?${authConfig.search}`}
      locationKey={authConfig.locationKey}
      onSuccess={onSuccess}
      onFailure={onFailure}
      isCrossOrigin={true}
    />);
  }

  const getAuthConfig = () => {
    const response_type = 'token';
    const client_id = CONSTANTS.OAuth2Config.clientId;
    const redirect_uri = `${window.location.origin}/callback`;
    const payload = {
      client_id,
      scope: '',
      redirect_uri,
      response_type
    };
    return {
      authorizationUrl: `https://${CONSTANTS.OAuth2Config.domain}`,
      responseType: response_type,
      clientId: client_id,
      redirectUri: redirect_uri,
      locationKey: responseTypeLocationKeys[response_type],
      search: toQuery(payload)
    }
  }

  const onBtnClick = () => {
    const authConfig = getAuthConfig();
    authenticateWithPopup(authConfig);
  }

  const render = () => {
    checkForToken();
    return (
      <div className="oauth-login">
        <button type="button" className='btn btn-blue btn-block' onClick={onBtnClick}>{I18n.getKey('login')}</button>
        {loginContent}
      </div>

    );
  }

  return render();

}

export default Login; 