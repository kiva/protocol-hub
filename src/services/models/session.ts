import { Account } from './account';

export interface Session {
  token: string;
  account: Account;
}
