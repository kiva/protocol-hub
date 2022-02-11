import {FunctionComponent, useEffect} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import ExternalPageLayout from "./external-page-layout/ExternalPageLayout";
import './common/theme.scss';
import AuthenticationButton from "./AuthenticationButton";
import {appConfig} from "../config/config";

const App: FunctionComponent = () => {
  const getContent = () => {
    return (<div className="core-layout">
      <Router>
        <Switch>
          <Route path={"/home"}
                 component={ExternalPageLayout}/>
          <Route path={"/registry"}
                 component={ExternalPageLayout}/>
          <Route path={"/transactionHistory"}
                 component={ExternalPageLayout}/>
          <Route path={"/callback"}
                 component={ExternalPageLayout}/>
          <Route render={() => <Redirect to="/home"/>}/>
        </Switch>
      </Router>
    </div>);
  }
  const isAuthenticated = false;

  return (
    <div>
      <header>
        <div className="logoLine">
          <img src={appConfig.logoUrl}
               alt="Kiva logo"/>
          <div className="appHeader">Hub</div>
        </div>
        <div className="header-buttons">
          <AuthenticationButton />
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
