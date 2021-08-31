import {SessionAction} from "../../actions/session-actions";
import { Session } from '../../../services/models/session';

export default function sessionReducer(state: Session = {} as Session, action: any): Session {
  switch (action.type) {
    case SessionAction.StartSignIn:
      return { ...state};
    case SessionAction.CompleteSignIn:
      return { ...action.session, account: {...state.account}  };
    case SessionAction.CancelSignIn:
      return { ...state};
    case SessionAction.SignOut:
      return {} as any;
    case SessionAction.SetAuthToken:
      return { ...state, token: action.token }
    default:
      return state;
  }
}
