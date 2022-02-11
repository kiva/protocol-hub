import {FunctionComponent, useEffect} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import ExternalPageLayout from "./external-page-layout/ExternalPageLayout";
import './common/theme.scss';
import AuthenticationButton from "./AuthenticationButton";
import {useAuth0} from "@auth0/auth0-react";
import {store} from "../index";
import {SessionAction} from "../redux/actions/session-actions";
import {appConfig} from "../config/config";

const Auth0App: FunctionComponent = () => {
  const {user, isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup} = useAuth0();
  const getTokenVia = async (f: (conf: any) => Promise<string>, msg: string): Promise<void> => {
    console.log("Message" + msg);
    // const token = await f({
    //   audience: `https://${appConfig.tenant}.auth0.com/api/v2/`
    // });
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfGF1dGgwfDVkMWE3ZjVlMTUzNDUzMGRiYzJjYWFlYyIsImF1ZCI6WyJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYzMzAzNTA0NiwiZXhwIjoxNjMzMTIxNDQ2LCJhenAiOiI3TkhwVHl5SDZ5UlBQdTZ2T0NFZE5SU213T1BGS2tsRCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.oW8cKbzZjp7VdhSnWSKerORgdNHjpFqcvEC75Kfg72QG9aAdm5-jRGEeYnijcibSRYLpS7X3Y47pCD-GoQf23myrIZfZO6vDKeFzQGhoRhKYRFm2k4ZwCsP4M0ZiIZggiDIFAinVKXUjYIHA7FfmVtjF5KbsWx54F0MalDgxzGCRDobe2IKyuLQMR85_iyDL2ONJbmbzqnHOop3ddPjFTNhvLVmN17zjploTOH30RfgBb-gM7NNeT1c63IoKGFehkk-0mez32H801cZ591TVOR577Oy7EeTxKjTxC11NCQt1Us3J5YS2LrWVnD0gkVPtIjRlpdSJOMLJQs6sfbo2IA";
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
          <Route path={"/transactionHistory"}
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

export default Auth0App;