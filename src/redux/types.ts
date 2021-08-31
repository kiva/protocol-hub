export interface Action {
  type: string;
}
export type Dispatch = (action: Action) => void | Promise<void>;

export const asyncAction = (
  action: (dispatch: Dispatch) => Promise<void>,
  errorActionCreator?: () => Action
) => {
  return async (dispatch: Dispatch) => {
    try {
      await action(dispatch);
    } catch (error) {
      console.error(error);
      if (errorActionCreator) {
        dispatch(errorActionCreator());
      }
    }
  };
};
