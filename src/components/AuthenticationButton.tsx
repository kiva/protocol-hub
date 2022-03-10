import Login from "./login/login";
import LogoutButton from "./login/logout-button";
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
    </div> : <Login />;
};

export default AuthenticationButton;
