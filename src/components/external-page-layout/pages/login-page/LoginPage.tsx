import React, {FunctionComponent, useState} from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {StoreState} from "../../../../redux/store-state";
import "./LoginPage.scss";

interface Props {

}

const LoginPage: FunctionComponent<Props> = ({}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="login-page">
      <div className="login-form">
        <input type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}/>
        <input type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}/>
        <Button>Sign In</Button>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
