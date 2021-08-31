import {Session} from "./models/session";

const sessionKey = 'session';

export const getSession = (): Session | null => {
  const json = localStorage.getItem(sessionKey);
  return json ? JSON.parse(json) : null;
};

export const isAuthenticated = () => {
  const json = localStorage.getItem(sessionKey);
  return !!json;
};

export const discardLocalSession = () => {
  localStorage.removeItem(sessionKey);
};

export const signOut = async () => {

};



