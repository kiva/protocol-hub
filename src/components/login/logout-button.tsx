import { SessionAction } from "../../redux/actions/session-actions";
import { store } from "../../index";
import I18n from "utils/I18n";

const LogoutButton = () => {
  const logout = (payload: { returnTo: string; }) => {
    store.dispatch({
        type: SessionAction.SetAuthToken,
        token: ""
    })
    window.location.href = payload.returnTo;
  }
  return (
    <button
      className="btn btn-gray btn-block"
      onClick={() => {
        window.localStorage.removeItem('access_token');
        logout({
          returnTo: window.location.origin,
        })
      }}
    >
      {I18n.getKey('logout')}
    </button>
  );
};

export default LogoutButton;
