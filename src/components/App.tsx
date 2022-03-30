import {FunctionComponent} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch, useLocation} from "react-router-dom";
import ExternalPageLayout from "./external-page-layout/ExternalPageLayout";
import './common/theme.scss';
import AuthenticationButton from "./AuthenticationButton";
import { useAppSelector } from "hooks";
import { connect } from 'react-redux'
import { StoreState } from "../redux/store-state";
import I18n from '../utils/I18n';

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
          <Route render={() => <Redirect to="/home"/>}/>
        </Switch>
      </Router>
    </div>);
  }
  const handleOAuthCallback = () => {
    const parent = window.opener || window.parent;
    parent.postMessage({
        message: 'deliverResult',
        result: window.location.search
    }, "*");
    return (<div></div>);
  }

  const windowLocation = useLocation();
  if (windowLocation.pathname === '/callback') {
    return handleOAuthCallback();
  } else {
    return (
      <div>
        <header>
          <div className="logoLine">
            <img src="/images/kiva.png"
              alt="Kiva logo" />
            <div className="appHeader">{I18n.getKey('title')}</div>
          </div>
          <div className="header-buttons">
            <AuthenticationButton />
          </div>
        </header>
        {isAuthenticated && getContent()}
        <footer>
          {I18n.getKey('poweredBy')} <strong>{I18n.getKey('organization')}</strong>
        </footer>
      </div>
    );
  }    
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