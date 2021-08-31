import React, {FunctionComponent} from "react";
import { useHistory } from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import {appConfig} from "../config/config";

interface Props {
  children: any
}

const Auth0ProviderWithHistory : FunctionComponent<Props> = ({ children }) => {
  const history = useHistory();

  const onRedirectCallback = (appState : any) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return <Auth0Provider
    domain = {appConfig.tenant}
    clientId = {appConfig.client}
    redirectUri = {window.location.origin}
    onRedirectCallback = {onRedirectCallback}
    scopes="read:users"
  >
    {children}
  </Auth0Provider>
};

export default Auth0ProviderWithHistory;
