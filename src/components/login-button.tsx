import React from "react";
import {CONSTANTS} from 'constants/constants';
import OAuth2Login from '../components/OAuth2Login';
import { store } from "../index";
import { SessionAction } from "../redux/actions/session-actions";
import I18n from '../utils/I18n';

const LoginButton = () => {
  const Auth2Login = () => {
    // store token using redux
    const onSuccess = (response:any) => {
      console.log(response);
      store.dispatch({
        type: SessionAction.SetAuthToken,
        token: response.access_token
      })
      console.log(I18n.getKey('tokenMessages.succeeded'));
    }
    // show error using redux
    const onFailure = (response:any) => {
      console.error(response);
    }
    return (
      <OAuth2Login
        authorizationUrl={`https://${CONSTANTS.OAuth2Config.domain}`}
        responseType="token"
        clientId={CONSTANTS.OAuth2Config.clientId}
        redirectUri={`${window.location.origin}/callback`}
        onSuccess={onSuccess}
        onFailure={onFailure}/>
    )
  }
  return (
    <div>
      {Auth2Login()}
    </div>
  )
}

export default LoginButton;
