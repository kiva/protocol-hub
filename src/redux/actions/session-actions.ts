import * as auth from '../../services/authentication';
import { asyncAction, Dispatch } from '../types';
import {Session} from "../../services/models/session";

export enum SessionAction {
  StartSignIn = 'SessionActionStartSignIn',
  CompleteSignIn = 'SessionActionCompleteSignIn',
  CancelSignIn = 'SessionActionCancelSignIn',
  SignOut = 'SessionActionSignOut',
  SetAuthToken = 'SessionActionSetToken',
  GetSession = "SessionActionGetSession"
}

export const requestSignIn = (email: string, password: string) =>
  asyncAction(async (dispatch: Dispatch) => {
    // dispatch(startSignIn());
    // const session = null;//await auth.signIn(email, password);
    // dispatch(completeSignIn(session));
  }, cancelSignIn);

export const startSignIn = () => ({
  type: SessionAction.StartSignIn,
});

export const completeSignIn = (session: Session) => ({
  type: SessionAction.CompleteSignIn,
  session,
});

export const cancelSignIn = () => ({
  type: SessionAction.CancelSignIn,
});

export const signOut = () =>
  asyncAction(async (dispatch: Dispatch) => {
    await auth.signOut();
    dispatch(completeSignOut());
  });

export const completeSignOut = () => ({
  type: SessionAction.SignOut,
});
