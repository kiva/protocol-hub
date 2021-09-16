import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./ExternalPageLayout.scss";
import HomePage from "./pages/HomePage";
import FrameworkHost from "./pages/frameworks/FrameworkHost";

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
          <Route exact path={`/registry`} component={FrameworkHost} />
        </Switch>
      </div>
    );
  }
}
