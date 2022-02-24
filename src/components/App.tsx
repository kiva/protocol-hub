import React, {FunctionComponent} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import ExternalPageLayout from "./external-page-layout/ExternalPageLayout";
import './common/theme.scss';
import AuthenticationButton from "./AuthenticationButton";
import {appConfig} from "../config/config";
import { useAppSelector } from "hooks";
import { connect } from 'react-redux'
import { StoreState } from "../redux/store-state";

const App: FunctionComponent = (props) => {
  const isAuthenticated = useAppSelector(state => {
    if (state.session.token) {
        return state.session.token;
    }
    return false;
  });

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

function mapStateToProps(state: StoreState, props: any) {
  return {
      account: state.session.account,
  };
}

function mapDispatchToProps(dispatch: any, props: any) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);