import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import { useAppSelector } from "hooks";

const AuthenticationButton = () => {
  const isAuthenticated = useAppSelector(state => {
    if (state.session.token) {
        return state.session.token;
    }
    return false;
})

  return isAuthenticated ?
    <div className="appNavBar">
      <button
        className="btn btn-blue btn-block">
        Start New
      </button>
      <LogoutButton />
    </div> : <LoginButton />;
};

export default AuthenticationButton;
