import React from "react";

import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

import { useAuth0 } from "@auth0/auth0-react";

const AuthenticationButton = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ?
    <div className="appNavBar">
      <button
        className="btn btn-blue btn-block">
        Start New
      </button>
      <LogoutButton />
    </div> : <LoginButton />;
};

export default AuthenticationButton;
