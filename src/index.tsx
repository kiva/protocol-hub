import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./components/common/theme.scss";
import configureStore from "./redux/configureStore";
import {getSession} from "./services/authentication";
import {Session} from "./services/models/session";
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory";
import {BrowserRouter as Router} from "react-router-dom";

export const store = configureStore({
  session: getSession() || ({} as Session),
});

ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <App/>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById("app")
);
