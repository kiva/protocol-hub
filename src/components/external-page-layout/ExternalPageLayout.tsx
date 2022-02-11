import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./ExternalPageLayout.scss";
import HomePage from "./pages/HomePage";
import RegistryPage from "./pages/registry-page/RegistryPage";
import TransactionHistory from "./pages/transaction-history-page/TransactionHistoryPage";

export default class ExternalPageLayout extends Component {
  componentDidMount() {

  }

  componentWillUnmount() {
    document.body.style.backgroundColor = "";
  }

  render() {
    return (
      <div className="external-page-layout">
        <Switch>
          <Route exact path={`/home`} component={HomePage} />
          <Route exact path={`/registry`} component={RegistryPage} />
          <Route exact path={`/transactionHistory`} component={TransactionHistory} />
          <Route exact path={`/callback`} component={HomePage} />
        </Switch>
      </div>
    );
  }
}
