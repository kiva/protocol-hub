import ReactDOM from "react-dom";
import App from "./components/App";
import "./components/common/theme.scss";
import configureStore from "./redux/configureStore";
import {getSession} from "./services/authentication";
import {Session} from "./services/models/session";
import {BrowserRouter as Router} from "react-router-dom";
import { Provider } from "react-redux";

export const store = configureStore({
  session: getSession() || ({} as Session),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;


ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App/>
    </Provider>
  </Router>,
  document.getElementById("app")
);
