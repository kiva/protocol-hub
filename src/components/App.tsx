import React, {FunctionComponent, useEffect} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import ExternalPageLayout from "./external-page-layout/ExternalPageLayout";
import './common/theme.scss'
import AuthenticationButton from "./AuthenticationButton";
import {useAuth0} from "@auth0/auth0-react";
import {store} from "../index";
import {SessionAction} from "../redux/actions/session-actions";
import {appConfig} from "../config/config";

const App: FunctionComponent = () => {
  const {user, isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup} = useAuth0();

  const getTokenVia = async (f: (conf: any) => Promise<string>, msg: string): Promise<void> => {
    console.log("Message" + msg);
    const token = await f({
      audience: `https://${appConfig.tenant}.auth0.com/api/v2/`
    });
    store.dispatch({
      type: SessionAction.SetAuthToken,
      token
    })
    console.log("Collected token!");
  };

  useEffect(() => {
    if (isAuthenticated) {
      const collectToken = async (): Promise<void> => {
        const orderOfOps = [{
          func: getAccessTokenSilently,
          msg: "Trying to get access token silently"
        }, {
          func: getAccessTokenWithPopup,
          msg: "Trying to get access token with popup"
        }];

        while (!store.getState().session.token && !!orderOfOps.length) {
          let current = orderOfOps.shift();

          try {
            await getTokenVia(current!.func, current!.msg);
          } catch {
            console.log("Failed to get token");
          }
        }
      };

      collectToken();
    }
  }, [user, isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup])

  const getContent = () => {
    return (<div className="core-layout">
      <Router>
        <Switch>
          <Route path={"/home"}
                 component={ExternalPageLayout}/>
          <Route path={"/registry"}
                 component={ExternalPageLayout}/>
          <Route render={() => <Redirect to="/home"/>}/>
        </Switch>
      </Router>
    </div>);
  }

  return (
    <div>
      <header>
        <div className="logoLine">
          <img src={appConfig.logoUrl}
               alt="Kiva logo"/>
          <div className="appHeader">Hub</div>
        </div>
        <div className="header-buttons">
          <AuthenticationButton/>
        </div>
      </header>
      {isAuthenticated && getContent()}
      <footer>
        Powered by <strong>Kiva Protocol</strong>
      </footer>
    </div>
  );
};

export default App;
