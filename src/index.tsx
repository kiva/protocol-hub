import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./components/common/theme.scss";
import configureStore from "./redux/configureStore";
import {getSession} from "./services/authentication";
import {Session} from "./services/models/session";
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory";
import {BrowserRouter as Router} from "react-router-dom";
import firebase from 'firebase';

export const store = configureStore({
  session: getSession() || ({} as Session),
});

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
export const Kernel = firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <App/>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById("app")
);
