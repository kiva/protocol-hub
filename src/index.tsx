import ReactDOM from "react-dom";
import App from "./components/App";
import Auth0App from "./components/Auth0App";
import "./components/common/theme.scss";
import configureStore from "./redux/configureStore";
import {getSession} from "./services/authentication";
import {Session} from "./services/models/session";
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory";
import {BrowserRouter as Router} from "react-router-dom";
import {CONSTANTS} from 'constants/constants';

export const store = configureStore({
  session: getSession() || ({} as Session),
});

switch(CONSTANTS.authorizationMethod) {
  case "auth0":
    ReactDOM.render(
      <Router>
        <Auth0ProviderWithHistory>
          <Auth0App/>
        </Auth0ProviderWithHistory>
      </Router>,
      document.getElementById("app")
    );
    break;

  default:
    ReactDOM.render(
      <App/>,
      document.getElementById('app')
    );
    break;
}